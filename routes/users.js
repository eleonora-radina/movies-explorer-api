const router = require('express').Router();
const { editUseInfoValidation } = require('../validation/validationUser');
const { getUserInfo, editUseInfo } = require('../controllers/users');

router.get('/me', getUserInfo);
router.patch('/me', editUseInfoValidation, editUseInfo);

module.exports = router;
