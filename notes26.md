# Spike 21 Notes

## SQL and Non SQL databases

- **SQL** (**Structured Query Language**) refers to databases that use relationships between entries to reduce storage. Instead of duplicating data in multiple places, a link is established to the base location of some data. Relational databases were much more popular back when digital storage was more expensive. Now that developer wages far outweigh the price of storage, the priority is to make _using_ the databases simpler and faster, even if documents are much larger. 

- MongoDB is a [**NoSQL**](https://www.mongodb.com/nosql-explained) database, which means there isn't a direct relationship between documents. But we can create something similar by using document IDs and Mongoose's [populate](https://mongoosejs.com/docs/populate.html) methods. The upside for this is that you aren't having to update the same data in multiple locations every time you make a change. The downside is that requesting the data can take longer because you need to make a seperate request for each 'linked' document.

## Populate

- To follow the example given in the LMS, each user can have pets - they could have no pets, one pet, or multiple pets. This is known as a **one to many** relationship. The pets will be held in a seperate collection, each pet is it's own document. Each pet can have only one owner, and a pet cannot exist without an owner. This is known as a **many to one** relationship. 

- We will need to create a Schema and Model for our pets, along with a routes and controller document to hold the routes and functions. I'll also need to update my userSchema to include a property for pets. Where the documents reference each other, we'll put type: `mongoose.Schema.Types.ObjectId` (this could be condensed into a variable for more readable code), and a **ref** property, that will reference the **singular**, **lower-case** name of the collection. eg:

```js
const objectId = mongoose.Schema.Types.ObjectId;

const petSchema = new mongoose.Schema({
  animal: { type: String, required: true },
  name: { type: String, required: true },
  owner: { type: objectId, ref: 'user', required: true }
});
```

- If I don't populate the data, I will get just the ObjectId. So, once I've also manually updated my MongoDB documents to reflect my new Schemas, I'll need to write a function to get a user and populate the 'pets' property with the relevant data:

```js
const getUserById = async(req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("pets");
    res.status(200).json(user);
  } catch(e) {
    console.log(e);
  }
}
```

- Say, though, that we have private data on our 'user' document. The above method fills the space with the whole document, but we can be more specific. We might only want to pass the user's username and avatar, for example. We want to keep private data, like their email and password, private! So we can specify which properties are to be included (Mongoose docs leave out this object format, but I think it gives clarity):

```js
const getAllWithOwner = async(req, res) => {
  try {
    const pets = await Pet.find().populate({ path: 'owner', select: ['firstName', 'lastName'] });
    // const pets = await Pet.find().populate('owner', ['firstName', 'lastName']); // without object format
    res.status(200).json(pets);
  } catch (e) {
    console.log(e);
  }
}
```

## Transactions?

## Adding data with POST requests

- So far we've been adding all our data manually, then using **get** requests to **read** that data. Let's look at a different type of request: **post**. A 'post' request sends data to the server, it's able to do this because it has a **body**. 

- Let's **create** a new user. First, we'll write the back-end functions and test them with Postman. Once it works in Postman, we can use the sample code Postman provides to help us write a fetch function from our React front-end. Start by establishing a new endpoint, and a new function. This time, though, the method for our route will be 'post':

```js
router.post("/new", newUser);
```

- In the newUser function, log 'req.body' to the console. We can also have a look at the whole 'req' object, though it is very big and complicated! The body property refers to data given into the function when the request is made. On Postman, there is a **body** subheading, this is where we add that data. The options we can choose from (for this project), will be **form-data**, **x-www-form-urlencoded**, or **raw**. I'm going to start with 'raw' - make sure to select **JSON** format from the dropdown. 

- I can now add some data to send with my request. This can be as much or as little as I want, so I'll start with just a message to say 'this is the body'. Because it is JSON formatted, it must follow these rules: the body must be a JavaScript object, property name must be enclosed by quotation marks, value can be a JavaScript value (string, number, array, object, etc.)

- Create an object that you would send through as a new user - make sure it follows the Schema defined for the collection. Build a new object in your function using those properties and save it as a new Model. Now you can use Mongoose's `.save()` method to save it to the collection linked to that Model. The save method returns the document:

```js
const createUser = async(req, res) => {
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    pets: req.body.pets
  }) 
  try {
    const result = await newUser.save();
    console.log(result);
    res.status(200).json(result);
  } catch(e) {
    console.log(e);
    res.status(500).send('Server error');
  }
}
```

- Once this is working we can create a form in React. A trick to keeping all your object changes to a single handleChange function, is to use [] around a property name to define it from a variable (in this case, the event.target.name), and the value from the event.target.value:

```js
  const handleChange = (e) => {
    setFormObject({
      ...formObject,
      [e.target.name]: e.target.value
    })
  }
```

- Now that we've got an object to submit, let's look at Postman's sample code. On the very right-hand side, click on the **</>** button in the sidebar. We can copy and paste this code section by section and adapt it to our own project. Put some signal after the fetch to communicate to your user if the registration was successful, then test it. We can then check our database to see if our new user is there. 

- The same logic can be applied to update a user. I could set a route that recieves an ID as params, then write a function that uses Mongoose's `findByIdAndUpdate()`:

```js
const updateUser = async(req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedUser);
  } catch(e) {
    console.log(e);
    res.status(500).send(e.message);
  }
}
```

- Let's look at a different way to append the data from the body to the request. In the previous example, we stringified a JavaScript object to create **raw** data. This time let's use **x-www-form-urlencoded**. In Postman, select 'x-www-form-urlencoded' to replace 'raw'. Put the property you want to update as the 'key', and the new value as 'value'. Send the request! If it works without error, check the sample code and compare the way the fetch has been written. Submitting request body data in this way is why we needed to add the express middlewares to our setup.