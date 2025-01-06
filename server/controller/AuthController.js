const UserModel = require('../model/user');
const tokenModel = require('../model/token');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const axios = require("axios");

const signup = async (req, res, next) => {
  try {
    const { name, username, password } = req.body;

    // Check if the user already exists
    const user = await UserModel.findOne({ username });
    console.log('user :', user);

    if (user) {
      // If user exists, return a conflict error
      res.status(409).json({ message: "User already exists, you can login", success: false });
      return; // Stop further execution
    }

    // Create a new user
    const userModel = new UserModel({ name, username, password });
    userModel.password = await bcrypt.hash(password, 10);
    const savedData = await userModel.save();
    console.log('saved Data :', savedData);

    // Send a success response
    return res.status(201).json({ message: "Signup successfully", success: true });
  } catch (err) {
    console.log("Error :", err);

    // Handle internal server error
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};



const login = async (req, res, next) => {
  try {
    const { username, password, captchaToken } = req.body;
    // console.log()

    // Validate reCAPTCHA token
    if (!captchaToken) {
      return res.status(400).json({ message: "reCAPTCHA verification failed.", success: false });
    }

    const cap_Secret_Key = process.env.CAPTCHA_SECRET_KEY;
    const recaptchaVerifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${cap_Secret_Key}&response=${captchaToken}`;

    const recaptchaResponse = await axios.post(recaptchaVerifyURL);
    if (!recaptchaResponse.data.success) {
      return res.status(400).json({ message: "reCAPTCHA verification failed.", success: false });
    }

    // Check if JWT secret key is defined
    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("JWT_SECRET_KEY is not defined in environment variables.");
    }

    const user = await UserModel.findOne({ username, password });
    console.log("User lookup:", { username, user }, "password :", password);

    const errorMsg = "Auth failed, username or password is wrong";
    if (!user) {
      return res.status(403).json({ message: errorMsg, success: false });
    }

  

    let projectDetails = user.projects || "";
    console.log('projectsDetails :....', projectDetails)
    const jwt = require('jsonwebtoken');

    // Data to include in the token
    const payload = {
      username: user.username,
      _id: user._id,
      projectDetails: projectDetails, // Array included in the payload
    };

    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });

    console.log(jwtToken);


    // Set the expiration time to 1 hour from now
    const now = new Date();
    const expirationTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    // const expirationTime = new Date(now.getTime() +  6 * 60 * 1000);

    const saveToken = new tokenModel({
      token: jwtToken,
      createdAt: now,
      expiresAt: expirationTime,
    })

    const savedToken = await saveToken.save();

    if (!savedToken) {
      return res.status(403).json({ message: "Token not saved, please login again!", success: false });
    }

    // Successful login response
    return res.status(200).json({
      message: "Login successfully",
      success: true,
      jwtToken,
      username,
      name: user.name,
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};


module.exports = {
  signup,
  login
}