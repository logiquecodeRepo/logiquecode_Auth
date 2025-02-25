const lcAuthUsers = async (req, res) => {
    try {
        const { name, email, username, password, projects, number, userType, gender, gst, pan, tan, street, city, state, pin, registration, document, expirationTime, currentDateTime } = req.body;
        console.log('email', email, 'name', name);

        // Validate required fields
        const requiredFields = ['username', 'email', 'number', 'gender', 'userType', 'projects', 'gst', 'pan', 'tan', 'pin'];
        const missingFields = requiredFields.filter(field => !req.body[field]?.toString().trim());

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(', ')}`,
                success: false
            });
        }

        // Step 1: Create User in LCAuth
        const lcAuthApi = await fetch('http://localhost:3030/users/CreateUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        const result = await lcAuthApi.json();
        const { success, message } = result;

        if (!success) {
            console.log("User not created in LCAuth");
            return res.status(401).json({ message, success: false });
        }

        console.log("User created successfully in LCAuth");

        // Step 2: Store user in project databases
        if (!Array.isArray(projects) || projects.length === 0) {
            return res.status(400).json({ message: "No projects provided", success: false });
        }

        // send flag
        const bodyData = {
            ...req.body,
            flag:'lcAuth'
        } 
        const projectPromises = projects.map(async (project) => {
            try {
                const projectResponse = await fetch(`${project.projectUrl}userCreation/createUser`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', },
                    body: JSON.stringify(bodyData)
                });

                const projectResult = await projectResponse.json();
                return { project: project.projectUrl, success: projectResult.success, message: projectResult.message };
            } catch (error) {
                console.error(`Error storing user in project ${project.projectUrl}:`, error);
                return { project: project.projectUrl, success: false, message: "Failed to store user in project database" };
            }
        });

        const projectResults = await Promise.all(projectPromises);
        console.log("Project Responses:", projectResults);

        return res.status(200).json({
            message: "User created in LCAuth and project databases",
            success: true,
            projectResults
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Something went wrong. Please try again.', success: false });
    }
};

module.exports = { lcAuthUsers }