const axios = require('axios');
const model = require('../model/user')
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const algorithm = 'aes-256-cbc'; // AES encryption algorithm with a 256-bit key in CBC mode

// Function to decrypt an encrypted password
function decrypt(encryptedText, key, iv) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Example usage
const encryptedText = '439014907537efca7437da766d73c72c2ecd61b5c51394d98016e9d034d776d0'; // Replace 'your_encrypted_text' with the actual encrypted text
const key = Buffer.from('66dd201b4142abd5d25da3a9c96605fb488b4669fc04a81aa9b06c4aa27bbc82', 'hex'); // Replace 'your_derived_key' with the actual derived key
const iv = Buffer.from('2ade71587c99f81813df1ba38c0c498d', 'hex'); // Replace 'your_initialization_vector' with the actual IV

// Simulate OTP generation (replace this with actual OTP generation logic)
const generatedOtp = Math.floor(100000 + Math.random() * 900000);

const sendotp = async (req, res, next) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ message: "username not found", success: false });
        }

        const data = await model.findOne({ username });

        if (!data) {
            return res.status(403).json({ message: "User not registered!", success: false });
        }

        let number = data.number;
        let user = data.name;
        let email = data.email;

        const url = 'https://sms.whistle.mobi/generateOtp.jsp';
        const response = await axios.get(url, {
            params: {
                userid: 'Logiquec',
                key: 'c952f269bdXX',
                mobileno: encodeURIComponent(number),
                timetoalive: 600,
                sms: `Hi ${user}, Your OTP to login at LogiqueCode DPMS portal is {otp}. Valid for 10 minutes. Please do not share the OTP.\n\nRegards\nLogiqueCode LLP Team`
            }
        });

        if (response.status == 200 && response.data.result == 'success') {
            console.log('response:', response.status, response.data.result, response.data, number, generatedOtp);
            res.status(200).json({ messgage: "Otp send successfull to mobile and username", success: true, generatedOtp})
        } else {
            console.log('response:', response.status, response.data.result, response.data, data.number);
            res.status(400).json({ message: "otp failed due api error and other!", success: false, generatedOtp });
        }

        // username code  // Decrypt the data using AES

        const decryptedText = decrypt(encryptedText, key, iv);
        console.log('Decrypted Text:', decryptedText);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'developers@logiquecode.com',
                pass: decryptedText,
            },
            port: 465,
            host: 'smtp.gmail.com',
        });

        const mailOptions = {
            from: 'developers@logiquecode.com',
            to: email,
            subject: `DPMS otp for login : ${generatedOtp}`,
            html: `
            <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Template</title>
      
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
            integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA=="
            crossorigin="anonymous" referrerpolicy="no-referrer" />
            
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
            
      
          <style>
              * {
                  box-sizing: border-box;
              }
      
              body {
                  margin: 0;
                  padding: 0;
                  font-family: Arial, sans-serif;
              }
      
              .header {
                  background-color: rgb(48, 63, 82);
                  text-align: center;
                  color: white;
                  padding: 25px 0 1px 0;
              }
      
              .logo {
                  width: 90px;
                  height: 80px;
                  margin: 5px auto 5px auto;
                  background-color:white;
              }
      
              .logo img {
                  width: 80px;
                  height: 70px;
                  margin-top:6px;
              }
      
              .content {
                  text-align: center;
                  padding: 1rem;
              }
      
              .content h1 {
                  margin-top: 5rem;
                  font-size: 3rem;
              }
      
              .content p {
                  font-size: 1.5rem;
              }
      
              .button {
                  display: inline-block;
                  padding: 15px 30px;
                  background-color: rgb(48, 63, 82);
                  color: white;
                  text-decoration: none;
                  border-radius: 40px;
                  margin-top: 20px;
                  font-size: 1.2rem;
              }
      
              .credentials {
                  background-color: rgb(0, 0, 0);
                  color:white;
                  text-align: center;
                  border-radius: 5px;
                  margin: 20px auto;
                  padding: 10px;
                  width: 80%;
              }
      
              .credentials p{
                color:rgb(255, 238, 0);
              }
              .footer {
                  text-align: center;
                  margin: 20px 0;
                  padding: 0 20px;
                  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
              }
      
              .footer a {
                  color: black;
                  font-size: 2rem;
                  font-family: sans-serif;
                  text-decoration: none;
                  margin:auto;
              }
      
      
              @media screen and (max-width: 768px) {
                  .logo {
                    width: 90px;
                    height: 80px;
                  }
      
                  .content h1 {
                      font-size: 2rem;
                      margin-bottom:5rem;
                  }
      
                  .content p {
                      font-size: .9rem;
                  }
      
                  .button {
                      padding: 12px 24px;
                      font-size: .9rem;
                      color: white;
                  }
      
                  .credentials {
                      width: 90%;
                  }
      
                  .credentials h1 {
                    font-size:1rem;
                }
      
                  .footer a {
                      font-size: 1.5rem;
                  }
      
                  .footer .contact-icons i {
                      font-size: 1.5rem;
                  }
              }
          </style>
      </head>
      
      <body>
          <div style="background-color: rgb(227, 224, 224); padding-bottom: 1rem;">
              <div class="header">
                  <div class="logo">
                    <img src="https://th.bing.com/th/id/OIP.6HHei9qJ1ZRSQHWiFZsWWgHaFW?rs=1&pid=ImgDetMain" alt="logiquecode logo">
                  </div>
                  <h1>LogiqueCodeLLP</h1>
              </div>
      
              <div class="content">
              <img src="https://logiquecode.com/assets/img/home/dpms.png" style="max-width: 100%;"
              alt="emailImage">
                  <h1>Welcome to the Doctor Patient Management System</h1>
                  <p>Simple, Lightweight, Easy to use Software for record keeping patients health records, Pathalogy reports,
                      Doctors Prescriptions Bill records at one place, so that every single minute information of your health
                      is not missed and Doctors can have a previous health history for better medicine recommendation.</p>
                  <a href="https://demo.logiquecode.com:5000/" style="color:white"; class="button" target="_blank">https://demo.logiquecode.com:5000</a>
              </div>
      
              <div class="credentials">
                  <h1>DPMS LOGIN OTP : ${generatedOtp}</h1>
                  <p>do not share this otp with anyone!</p>
              </div>
          </div>
      
          <div class="footer">
              <a href="www.logiquecode.com">www.logiquecode.com</a>
          </div>
      </body>
            `,
        };


        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:');
            } else {
                console.log('Email sent:', info.response, '\notp no:', generatedOtp);
            }
        });
    } catch (err) {
        console.log('error: ', err);
        return res.status(500).json({ message: "Internal server error", success: false });
    }

}


const verifyotp = async (req, res, next) => {
    try {
        const { username, otp } = req.body;
        

        if (!username) {
            return res.status(400).json({ message: "username not found", success: false });
        }

        const data = await model.findOne({ username });

        if (!data) {
            return res.status(403).json({ message: "OTP verification failed : User not registered", success: false });
        }

        let number = data.number;

        const response = await axios.get('https://sms.whistle.mobi/validateOtpApi.jsp', {
            params: {
                mobileno: encodeURIComponent(number),
                otp: encodeURIComponent(otp)
            }
        });

        if (response.data.result == 'success') {
            console.log(response.data.result)
            return res.status(200).json({ message: "Otp Verified!", success: true });
        } else {
            return res.status(400).json({ message: 'Otp verification failed!', success: false });
        }

    } catch (err) {
        console.log('error :', err)
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

module.exports = {
    sendotp,
    verifyotp
}