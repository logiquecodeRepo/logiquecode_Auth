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
            res.status(200).json({ messgage: "Otp send successfull to mobile and username", success: true, generatedOtp })
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
            subject: `LogiqueCode SSO Login Validation OTP`,
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
                    margin: 0;
                    padding: 0;
                }

                body {
                    background-color: #f4f4f4;
                    font-family: Arial, sans-serif;
                    padding: 20px;
                }

                .email-container {
                    max-width: 600px;
                    margin: auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

                .header {
                    background-color: #303f52;
                    text-align: center;
                    color: #ffffff;
                    padding: 20px;
                }

                .logo img {
                    width: 80px;
                    height: auto;
                    margin: 10px 0;
                }

                .content {
                    padding: 10px;
                }
                

                .content h1 {
                    font-size: 24px;
                    color: #333333;
                    margin: 2rem 0rem .5rem 0rem;
                }

                .content p {
                    font-size: 16px;
                    color: #555555;
                    line-height: 1.6;
                    margin: 1rem 0;
                }

                .img {
                    text-align: center;
                }

                .button {
                    display: inline-block;
                    padding: 12px 25px;
                    background-color: #303f52;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 25px;
                    margin: 15px 0;
                    font-size: 16px;
                }
                .button a{
                    color: white;
                    text-decoration: none;
                }
                
                .otherText{
                    margin:4rem 0rem;
                    padding: 10px;
                    text-align: left;
                }

                .footer {
                    text-align: center;
                    background-color: #e3e0e0;
                    padding: 15px;
                }

                .footer a {
                    color: #000000;
                    text-decoration: none;
                    font-size: 14px;
                }

                @media screen and (max-width: 600px) {
                    .content h1 {
                        font-size: 20px;
                    }

                    .content p {
                        font-size: 14px;
                    }

                    .button {
                        padding: 10px 20px;
                        font-size: 14px;
                    }
                }
            </style>
                </head>
                
                <body>
                <div class="email-container">
                    <div class="header">
                        <div class="logo">
                            <img src="https://th.bing.com/th/id/OIP.6HHei9qJ1ZRSQHWiFZsWWgHaFW?rs=1&pid=ImgDetMain" alt="LogiqueCode Logo">
                        </div>
                        <h1>LogiqueCode LLP</h1>
                    </div>

                    <div class="img">
                        <img src="https://app.logiquecode.com/public/javascripts/login_img_first.png" style="max-width: 100%; height: auto;" alt="Email Image">
                    </div>

                    <div class="content">
                        <h1>Dear ${username}</h1>
                        <p>To complete your login, please enter the following one-time password (OTP): <strong>${generatedOtp}</strong></p>
                        <p>This code will expire in 10 minutes. If you did not request this login, please ignore this email.</p>
                    </div>

                    <div class="otherText">
                        <p>Sincerely,</p>
                        <p>LogiqueCode LLP</p>
                    </div>

                    <div class="footer">
                        <a href="https://www.logiquecode.com">www.logiquecode.com</a>
                    </div>
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
        return res.status(500).json({ message: "Something went wrong. Please try again later", success: false });
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
        return res.status(500).json({ message: "Something went wrong!", success: false });
    }
}

module.exports = {
    sendotp,
    verifyotp
}