const userModel = require('../model/user');

const getProjectsDetails = async (req, res, next) => {
    try {
        const { username } = req.user;
        console.log("username :", username);
        if (!username) {
            return res.status(400).json({ message: "Username Not Found.., Please login again" });
        }

        const data = await userModel.findOne({username});

        if(!data){ 
            return res.status(403).json({message: "No data available", success: false});
        }

        console.log('userProjects Details: ', data);
        return res.status(200).json({data, success: true});
    } catch (err) {
        console.log('error found to fetch userProjects Details :', err);
        return res.status(500).json({ message: "Internal server error", success: false });
    }

}

module.exports = {
    getProjectsDetails,
}