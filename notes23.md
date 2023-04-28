# Spike 19 notes

## Project 4 Kick Off

[Kick Off Presentation](https://lms.codeacademyberlin.com/content/web/Module-2/Project-1/Sprint-1)

## MERN Stack

### MongoDB - Express - React - Node

- **Node.js** is an environment that can run JavaScript outside a browser. This means the developer can continue to write in JavaScript, even for back-end programming. [This](https://kinsta.com/knowledgebase/what-is-node-js/) page gives a good summary.

- **Express.js** is a framework designed to build APIs. On it's own, Node.js does not know how to perform serving files, handling requests, and handling HTTP methods, so this is where Express.js comes in. Express is to Node, as React is to JavaScript! [This](https://kinsta.com/knowledgebase/what-is-express-js/) page gives a good summary.

- **MongoDB** is a document database, it stores data in JSON-like documents. We will use it to hold the data we previously saved in Firebase. 

## Project Structure

- We're still going to use React for our front-end. In a folder that will hold your _whole_ project, create a react app and call it 'client', or 'front-end'. In the same root project folder, create another folder called 'server', or 'back-end'. These will eventually need to be deployed seperately, but we want them all together for development. 

- The create-react-app package (https://create-react-app.dev/docs/adding-typescript/) automatically initalizes a local git repository for you. Our first step will be to delete it! This is because we actually want one git repository for our _whole_ project. **cd** into your `client` and run:

```
rm -rf .git
```

- This should remove the `.git` file from your React folder. In Windows, you can also manually delete the hidden `.git` file in Windows Explorer. Once you've removed it, **cd** back into your root folder and initialize a new repository. Now Git is tracking the project from the root level. Create a `.gitignore` and add the line `node_modules/`. This will ignore all sub-folders of node_modules, since we will have them in both our `client` and `server`. 

## MongoDB Setup

- Create a MongoDB account. We'll then be following the steps from MongoDB's documentation on [getting started](https://www.mongodb.com/docs/atlas/getting-started/).

- Build a database - make sure you select **M0 FREE**. If you have a preferred provider, you can select them. I select **Frankfurt (eu-central-1)** for my region, since this is the closest to our location. You can also rename your **cluster**. Read more about clusters [here](https://www.mongodb.com/basics/clusters).

- Enter a username and password to gain access to your database. In the left-hand menu under Network Access (under Security), click on the button to **+ADD IP ADDRESS**, then click to 'allow access from anywhere'. If you now click on **Browse Collections**, this is where your data will be stored. Click on **Add My Own Data** to create a **Database**, and a **Collection**. Later, we're going to be using **Mongoose** which uses specific naming rules to find data, so make sure you give your collections **lower-case, plural** names.

## Node.js Server Setup

- To start, we want to initalize the project and create a `package.json` file. We do this by opening a terminal, make sure you're in your 'server' folder, and run:

```
npm init
```

- You'll then be prompted to establish some information about your project. If you later want to change any of these details, you can edit the `package.json`. 

- Next we're going to install [**Express**](https://expressjs.com/en/starter/installing.html), after which you'll notice you now have a `node_modules` folder, a `package-lock.json`, and your `package.json` will have 'express' listed under 'dependencies'.

- Not essental, but very useful is [**Nodemon**](https://www.npmjs.com/package/nodemon). Nodemon will automatically restart your server after you save. Without this package, every time you make a change to your server, you'll need to exit and manually restart it for those changes to apply.

- Also not essential, but it will make things look more familiar - on your `package.json`, add to the main object:

```js
"type": "module"
```

- All this does is remove the need to 'require' packages, instead you can just use 'import' the same way we've been using in React. A package.json "type" value of "module" tells Node.js to interpret `.js` files within that package as using [ES module syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).

- While we're on the `package.json`, we can add a script to start our server. Under the 'scripts' property, add a 'start' sub-property and give it the value 'nodemon index.js':

```js
 "scripts": {
    "start": "nodemon index.js"
  }
```

- If we now create an `index.js` in your `server`, we can paste the code from the LMS:

```js
import express from "express";
const app = express();
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server is running on port" + port);
});
```

- To test if we've followed all the steps, run `npm start` from `server` directory in your terminal. Anything logged to the console from the server side will be visible in your server terminal!

- We'll also want to add some **Middlewares** to help us out: **express.json** and **express.urlencoded** are already installed from the Express package, we need them for when we start using POST requests. We'll need to install the [**CORS**](https://expressjs.com/en/resources/middleware/cors.html) npm package, which will enable CORS in our app. Then, we can configure our app to use them from our index.js file. Make sure the app knows to **use** them _before_ it starts **listening**:

```js
import cors from "cors";

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());
```

- Another non-essential (but _very_ convenient) package you can install is [**concurrently**](https://www.npmjs.com/package/concurrently). This will let us launch both our back-end server and our React server with just one command. Otherwise, you'll need to have two terminals open - one for each. You can adapt the following script to whatever you find most convenient:

```js
"scripts": {
  "start": "concurrently \"nodemon index.js\" \"cd ../client && npm start\""
    }
```

**note** if you write your own custom script, you'll have to use `npm run scriptName` from the terminal.