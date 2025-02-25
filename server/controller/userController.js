let User = require('../model/user');

const create = async (req, res) => {
    try {
        const { name, email, username, password, projects, number, userType, gender, gst, pan, tan, street, city, state, pin, registration, document, expirationTime, currentDateTime } = req.body;
        console.log('email', email, 'name', name);

        // Validate required fields
        const requiredFields = [ 'username', 'email', 'number', 'gender', 'userType'];
        const missingFields = requiredFields.filter(field => !req.body[field]?.trim());

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(', ')}`,
                success: false
            });
        }

        // const regex = /^[a-zA-Z0-9_]+$/;
        // // we commented this code bcs of patient id content other latters and it blocks
        // if (!regex.test(username)) {
        //     console.log("Username can only contain letters, numbers, and underscores.")
        //     return res.status(400).json({
        //         message: "Username can only contain letters, numbers, and underscores.",
        //         success: false,
        //     });
        // }


        if (username.length < 3 || username.length > 15) {
            return res.status(400).json({
                message: "Username must be between 3 and 15 characters.",
                success: false,
            });
        }

        const userExist = await User.findOne({ email });
        if (userExist) {
            console.log('User already exists.');
            return res.status(409).json({ message: "User already exists.", data: userExist, success: false });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            console.log('Username already exists.');
            return res.status(409).json({ message: "User already exists.", data: existingUsername, success: false });
        }

        const ssoLoginSave = new User({
            name: name,
            username: username,
            password: password,
            number: number,
            email: email,
            projects,
            status: "active",
            userType: userType,
            registrationNumber: registration,
            pinCode: pin,
            panNumber: pan,
            gstNumber: gst,
            tanNumber: tan,
            street,
            city,
            state,
            uploadDocument: document,
            gender,
            createdAt: currentDateTime,
            expiresAt: expirationTime ?? null

        })

        const savedData = await ssoLoginSave.save();
        if (!savedData) {
            return res.status(401).json({ message: "User not created.", success: false });
        }

        return res.status(200).json({ message: "User created successfully.", savedData, success: true });

    } catch (error) {
        console.log('error :', error);
        res.status(500).json({ message: "Something went wrong. Please try again.", success: false });
    }
}

const editUser = async (req, res, next) => {
    try {
        const { name, username, email, number, gender, userType, status } = req.body;

        // Validate required fields
        const requiredFields = ['name', 'username', 'email', 'number', 'gender', 'userType', 'status', 'hospitalId'];
        const missingFields = requiredFields.filter(field => !req.body[field]?.trim());

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(', ')}`,
                success: false
            });
        }

        if (userType === 'admin') return res.status(400).json({ message: "You can't change a user or anyone else into an admin." });


        // Validate email format to make it more readable
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Invalid email format',
                success: false
            });
        }

        // Prevent privilege escalation
        if (userType === 'admin') {
            return res.status(403).json({
                message: "Admin role modification not permitted",
                success: false
            });
        }

        // Check for email conflicts
        const existingUser = await User.findOne({
            email: email.trim().toLowerCase(),
            username,
            username: { $ne: username }
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'Email already exists for another user',
                success: false
            });
        }

        // Update user document with validation
        const updatedUser = await User.findOneAndUpdate(
            { username },  // Ensure hospitalId matches
            {
                $set: {
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                    number: number.replace(/\D/g, ''), // Remove non-digit characters
                    gender,
                    userType,
                    status
                }
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        // Omit sensitive fields from response
        const { password, __v, ...safeUser } = updatedUser.toObject();

        return res.status(200).json({
            data: safeUser,
            message: 'User updated successfully',
            success: true
        });

    } catch (error) {
        console.log('error', error)
        return (500).json({ message: "Something went wrong to update User. Please try again later", success: false })
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
module.exports = { create, getUser, editUser, };