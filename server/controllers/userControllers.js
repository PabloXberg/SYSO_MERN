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

export {testingRoute, getUsers, getUser}