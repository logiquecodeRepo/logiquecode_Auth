const router = require('express').Router();
const { getProjectsDetails } = require('../controller/ProjectsController');
const ensureAuthentication = require('../Middlewares/Auth');

router.get('/getProjectsDetails', ensureAuthentication, getProjectsDetails);

module.exports = router