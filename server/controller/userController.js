let User = require('../model/student');

const create = async (req, res) =>{
    try{
        const newUser = new User(req.body);
        const { name, email, address } = newUser;
        console.log('email', email, 'name', name, 'address', address);

        const userExist = await User.findOne({ email });
        if(userExist){
            return res.status(400).json({message : "User already exists."});
        }
        const savedData = await newUser.save();
        res.status(200).json(savedData);
    }catch(error){
        console.log('error :', error);
        res.status(500).json({errorMessage : error.message});
    }
}


const getUser = async (req, res) =>{
    try{
        const getData = await User.find();
        res.status(200).json(getData);
    }catch(error){
        console.log("Error found in db :", error);
    }
}
module.exports = {create, getUser};