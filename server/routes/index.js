var express = require('express');
var router = express.Router()
let ensureAuthentication  = require('../Middlewares/Auth');

router.get('/', ensureAuthentication, async (req, res) =>{
  res.status(200).json([
    {
    name: "Aas Mohd",
    email: "aasmohd7506@gmail.com"
  },
  {
    name: "Mohd Zaid",
    email: "assmohd3188@gmail.com"
  }
])
}); 

module.exports = router;
