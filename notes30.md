# Spike 24 Notes

## Authorization with Passport Strategy

- Now that our user has been authenticated and a token has been issued, we're going to use [**Passport**](https://www.passportjs.org/), which is an authentication middleware for Node.js. This middleware is going to run in the same place as our Multer function - between the endpoint and the controller function, so when someone tries to access an endpoint, our front-end will also need to send a token along with the request. We will have used Passport to create an authorization strategy, which examines the token and determines whether the user is authorized to recieve a response. If we have a look at strategies offered by Passport, there are packages available for many authentication options. For some options, such as signing in through Google or GitHub, there is no token. We'll be using the **JWT Strategy**. 

- Install on the server the packages for 'passport' and 'passport-jwt' via npm.

- First we need to [initialize Passport](https://github.com/jaredhanson/passport) as a middleware in our app. 

- Following along with the documentation, we'll need to configure our Passport strategy in our app. Create a new `.js` file in `config` for 'passportConfig'. We'll wrap this in a function to export the same way we did for Cloudinary configuration. This is just to keep our `index.js` as organised as possible. There is an example configuration in the [strategy documentation](https://www.passportjs.org/packages/passport-jwt/) that we can use as a guide: import `ExtractJWT`, `JwtStrategy`, and `passport`  and let's look at the function step by step. 

- The first thing they're doing is setting some options. We're going to need to set the 'jwtFromRequest' property, which establishes how we'll be passing the token back to the server. In our case, as a **Bearer Token** in the Header, so we'll use `ExtractJwt.fromAuthHeaderAsBearerToken()`. We'll also need to set our `JWT_SECRET` from our `.env` file as the value for 'secretOrKey' property.

- The next section does quite a few things:
    - They start by telling Passport to use the chosen strategy (which we create using the `new JwtStrategy()` constructor) 
    - This constructor recieves as arguments the options we already defined above, along with a callback function
    - The callback function takes the **JWT payload**, and _another_ callback function which they've called `done` 
    - The `done` will determine what happens when the token is either accepted or rejected (think back to the `cb` from our Multer function)  


- Create the export function, call it something like 'configurePassport', then paste the example code inside. Unfortunately for us, the newest version of Mongoose no longer allows callbacks in their functions, but it seems Passport haven't updated their documentation. This means we're going to have to change a few things:
    - Make sure 'User' is your **User Model** (you'll need to import it), and that your payload has a user Id as the 'sub'. 
    - Mongoose [documentation](https://mongoosejs.com/docs/api/model.html#Model.findById()) recommends when finding by Id, to use `findById()` instead of `findOne()`, so I'm going to fix that. 
    - Instead of a callback, we're going to have to use **async/await** or **.then()/.catch()** blocks
    - We could seperate the `new JwtStrategy()` into a seperate variable to make everything a little bit more readable:

```js
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models/users.js'
import * as dotenv from "dotenv";
dotenv.config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

const strategy = new JwtStrategy(options, async(jwt_payload, done) => {
  try {
    const existingUser = await User.findById(jwt_payload.sub);
    existingUser ? done(null, existingUser) : done(null, false)
  } catch(error) {
    done(error, false)
  }
//   User.findById(jwt_payload.sub)         //alternative
//     .then((user) => user ? done(null, user) : done(null, false))
//     .catch((error) => done(error, false));
})

export const passportConfig = () => {
  passport.use(strategy);
}
```

- Import this function into the server `index.js` and call it after the Passport initalization. We've now initalized and configured Passport in our app!

- In order to use Passport to authenticate the requests, we'll have to use `passport.authenticate()`. We specify the strategy with the string `"jwt"`, and we're not using a session, so we can set this to false. To keep functionality consistent, we can make a new `.js` file in our `middlewares` for jwt to hold this snippet as a variable:

```js
import passport from "passport";

const jwtAuth = passport.authenticate("jwt", { session: false });

export default jwtAuth
```

- If I set this to any of my routes and try to send a request without adding a header, let's see what happens. Create a route to get a user's profile, for now the controller function will just return a string to indicate success:

```js
import jwtAuth from '../middlewares/jwt.js';

router.get("/me", jwtAuth, getProfile);
```

- Now let's see what happens when I _do_ set the header. First, we'll need a valid token, so I'll use Postman to log in and copy the token in the response. Then, in a `get` request sent to "http://localhost:5000/api/users/me", I will set the **Authorization** type as `Bearer Token` (this is what we defined when we set `jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()` in the options on our Passport strategy) and paste in my token. 


- If all goes according to plan, I will be granted access to the endpoint! Passport will also have added an additional property onto my `req` object: a **user** property. This will be the user returned by the `findById()` function called in the Passport strategy configuration. For this particular endpoint, since all we actually want to send back is the user object itself, this is all we need to return. Remember to construct a new object that doesn't include the password!

- Now you can add this **jwtAuth** Middleware function to any endpoint that only authenticated users can access. You can also use the `req.user` object in your controller functions, so any requests that need comparision with the current user already have access to those properties.

- One important use for it will be to get the current logged in user object from your `AuthContext`. Let's create a function to check whether there is a user. We'll first check whether there is already a token in the local storage. We can create a simple utility function that will return the token. If a token is returned, then we will make a fetch to the `users/me` endpoint to get the user linked to the token. 