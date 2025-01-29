let User = require('../model/user');

const create = async (req, res) => {
    try {
        const { name, email, username, password, projectName, projectUrl, number, userType } = req.body;
        console.log('email', email, 'name', name);

        const regex = /^[a-zA-Z0-9_]+$/;
        if (!regex.test(username)) {
            return res.status(400).json({
                message: "Username can only contain letters, numbers, and underscores.",
                success: false,
            });
        }

        if (username.length < 3 || username.length > 15) {
            return res.status(400).json({
                message: "Username must be between 3 and 15 characters.",
                success: false,
            });
        }

        const userExist = await User.findOne({ email });
        if (userExist) {
            console.log('User already exists.');
            return res.status(401).json({ message: "User already exists.", success: false });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            console.log('Username already exists.');
            return res.status(401).json({ message: "Username already exists.", success: false });
        }

        const ssoLoginSave = new User({
            name: name,
            username: username,
            password: password,
            number: number,
            email: email,
            projects: [
                {
                    name: projectName,
                    serverUrl: projectUrl,
                },
            ],
            status: "active",
            userType: userType,
        })

        const savedData = await ssoLoginSave.save();
        if (!savedData) {
            return res.status(401).json({ message: "User not created.", success: false });
        }

        return res.status(200).json({ message: "User created successfully.", success: true });

    } catch (error) {
        console.log('error :', error);
        res.status(500).json({ errorMessage: error.message });
    }
}


const getUser = async (req, res) => {
    try {
        const getData = await User.find();
        res.status(200).json(getData);
    } catch (error) {
        console.log("Error found in db :", error);
    }
}
module.exports = { create, getUser };