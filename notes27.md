# Spike 22 Notes

## Image Upload

- We're not going to be saving any actual images on MongoDB. Instead we will be saving them on the cloud-based image and video management service, [**Cloudinary**](https://cloudinary.com/documentation/how_to_integrate_cloudinary), then just saving a URL reference in MongoDB. To make the upload process easier and safer, we'll also use a middleware called [**Multer**](https://www.npmjs.com/package/multer). Install both packages via npm.

- Start by creating a free account on Cloudinary. Under Media Library, you can create folders and manually add or delete files. Start by creating a folder for your user images: 'profile_pics' or 'user_avatars', whatever you like. Upload a sample image. 

- On your Dashboard, you'll be able to see the Cloud Name, your API Key, and your API Secret. We'll save these variables in our `.env` file. Then create a folder in your server for **config**, to hold configuration files. This is just to save space on our `index.js`. In a `.js` file for **cloudinaryConfig**, copy and paste the config code snippet from the 'getting started' page in Cloudinary docs, just make sure to replace each of the variables for your `process.env` variables. Export this as a function, which we will call on the `index.js` together with the middlewares. 

- We'll also need to update our user Schema to include an image. This will just be a string URL for the image that we will already have uploaded to Cloudinary. This is a good opportunity to demonstrate the 'default' property, which I'll set to the URL of the sample image I already uploaded. If this property isn't included on the user object, or the value is set to **undefined**, then the default will be applied. Any other value (including **null** or an empty string) will still be stored in the database!

- We're going to create a function using [Multer](https://github.com/expressjs/multer#readme) to act as middleware on any routes that will recieve a file to be uploaded. This won't be our only middleware, so create a folder for 'middlewares', and then create a `.js` file for all multer functions (you might decide to write more, later). Here, we'll write and export this function:

```js
import multer from "multer";
import path from "path";

export const multerUploads = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let extension = path.extname(file.originalname);
    if (extension !== ".jpg" && extension !== ".jpeg" && extension !== ".png") {
      cb(new Error("File extension not supported"), false);
      return;
    }
    cb(null, true);
  },
});
```

- The **multer** import is a function provided by Multer. This will accept an object as an argument, which will hold specific properties. We are going to set the **storage** property - this indicates the temporary storage location for files being selected in HTML. We're specifying to use `multer.diskStorage()`, but we're leaving all the properties empty. This lets the computer set the temporary storage to the default location that is automatically cleaned. We could manually set a **destination**, but then we would also have to manually write a function to clean that folder when we're finished with it. 

- The **path** import is a [module](https://nodejs.org/api/path.html) directly from Node.js. This allows us to inspect the full pathname of a file, but it also lets us isolate the file extension. We're going to add another property, **fileFilter**, to our multer object, and we're going to specify that we're only allowing files with the extensions `.jpg`, `.jpeg`, or `.png` to be uploaded.

- The 'fileFilter' property accepts a function with 3 arguments: the request, the file, and another callback function. The callback function dictates what should happen after the fileFilter logic has been applied. In our case, if the file extension isn't accepted, it will throw an error, and `false` indicates that the file should _not_ be uploaded. If the file extension is accepted, then it won't send an error, and `true` gives permission for the file upload to continue. 

- We call this Multer function on our Route _before_ the controller function. This ensures the file has been checked before it ever reaches your controller function. Now, if we log `req.file` to the console, we should see the file from our request! The rest of the text is still held in the `req.body`. When we call the function, however, we have to specify that we're uploading a **single** file, and we have to specify which **field** that file will be held in:

```js
import { multerUploads } from '../utils/multer.js';

router.post("/new", multerUploads.single("avatar"), createUser);
```

- Now we need to write a function to upload that file to Cloudinary! In another file in my `utils`, I'm going to create a `.js` file for **image management**. The first function will be my upload:

```js
import { v2 as cloudinary } from "cloudinary";

export const imageUpload = async(file, folder) => {
  if (file !== undefined) {
    try {
      const result = await cloudinary.uploader.upload(file.path, { folder: folder });
      console.log(result);
      return result.secure_url;
    } catch(e) {
      console.log(e);
      return undefined
    }
  } else {
    return undefined
  }
}
```

- The reason I've done check a for undefined, is so that if there isn't a file, I don't waste resources trying to upload nothing. I then return `undefined` for anything other than a successful file upload, so my default setting will apply if the field was empty, or there was an error. If you decide to make uploading a profile image a compulsory feature, then you can leave off this additional check. You could also choose to abort the user creation function and return an error.

- Basically, I've just copied this cloudinary uploader function directly from the cloudinary documentation. I'm passing a file and a folder into the function, and cloudinary does the rest to put that file into that folder. It will return quite a large object with many properties, let's upload a file and log the result to the console to look at it. In Postman, for any POST request that includes files, we need to use **Form Data**.

- The most useful of those properties for us will be **secure_url**, which is just a link to the online source of the image. If you want to be able to delete anything from Cloudinary, you will also need to save the **public_id**. Deleting from Cloudinary is optional! I'm going to have my imageUpload function return just the secure URL or `undefined` so I can set the return directly as my avatar property on my newUser object. Our whole createUser function should now look something like this:

```js
const createUser = async(req, res) => {
  if (!req.body.email || !req.body.password || !req.body.username) {
    return res.status(406).json({ error: "Please fill out all fields" })
  }
  const encryptedPassword = await encryptPassword(req.body.password);
  const uploadedImage = await imageUpload(req.file, "user_avatars");
  const newUser = new User({ 
    email: req.body.email,
    password: encryptedPassword,
    username: req.body.username,
    avatar: uploadedImage
   });
  try {
    const result = await newUser.save();
    res.status(200).json(result)
  } catch(e) {
    console.log(e)
    e.code === 11000 ? res.status(406).json({ error: "That email is already registered" }) 
    : res.status(500).json({ error: "Unknown error occured", ...e })
  }
}
```

- Phew. Now that it's all working through Postman, we have to write a fetch to call it from our React front-end! Let's look at the code in Postman's sidebar to guide us - we can see they're appending their body as Form Data. This is necessary so our Multer middleware can check the field we're using to hold our file. It's important to note here that 

- We'll need to add an `<input type='file' />` so our user can select their file for upload. You can [access](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#getting_information_on_selected_files) this file using `event.target.files`, which will be an array of all selected files. Since we're only selecting one, it will always be the item at the zero index.

**Warning:** When using FormData to submit POST requests using _XMLHttpRequest_ or the *Fetch_API* with the _multipart/form-data_ Content-Type (e.g. when uploading Files and Blobs to the server), **do not explicitly set the Content-Type header on the request**. Doing so will prevent the browser from being able to set the Content-Type header with the boundary expression it will use to delimit form fields in the request body. [Read more](https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects).