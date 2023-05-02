import UserModel from "../models/userModels.js";


const testingRoute = (req, res) => {
  res.send('testing route....')
}

const getUsers = async(req, res) => {
  try { 
    const users = await UserModel.find().populate("sketchs");
    res.status(200).json({msg: "Success!", users});
  } catch (e) {
      res.status(500).json({error: "Something went wrong..."});
    console.log(e);
  }
}

const getUser = async(req, res) => {

  const params = req.params;
  console.log(params); // should show {id: bla bla bla}
  const id = req.params.id // will show just "bla bla bla"
  console.log('id :>> ', id);
  
    try {
        const user = await UserModel.findById(id).populate("sketchs");
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({error:"Something went wrong..."})
        console.log(error);
    }
 }

const createUser = async (req, res) => {
  console.log(req.body);
  const newUser = new UserModel({
    // email: req.body.email,
    // username: req.body.username,
    // password: req.body.password   SE PUEDEN AGREGAR CADA UNO; O SPREDOPERATOR COMO ESTA ABAJO

    ...req.body
  })
  try {
    const registeredUser = await newUser.save();
    res.status(200).json ({message: "Succeswfully Registered", newUser: registeredUser})
  } catch (error) {
    console.log(error);
    res.status(500).jason("Something went wrong...")
  }
}

 const updateUser = async(req, res) => {
         try {
            const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
           res.status(200).json(updatedUser);
           message("Update Suxccessfully!!!!")
    	}catch(e) {
            console.log(e);
            res.status(500).send(e.message);
    }

    }


export {testingRoute, getUsers, getUser, createUser, updateUser}