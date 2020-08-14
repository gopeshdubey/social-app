const express = require('express')
var router = express.Router()
var multer = require('multer')
const gallery = require('../upload_file/upload_image')
var controller = require('../controller/register')

// Initiating multer to store data in disk
//********************************************************************************************//
var upload = multer({ storage: gallery });
//********************************************************************************************//

router.post('/register', controller.register)
router.post('/login', controller.login)
router.post('/uploadprofile/:id', upload.single('image'), controller.uploadProfile)
router.post('/uploadHeaderImage/:id', upload.single('image'), controller.uploadHeaderProfile)
router.post('/update_account', controller.update_account)
router.get('/getUserDetails/:id', controller.getUserDeatils)
router.put('/updateSocket', controller.updateSocketId)
router.post('/addFriend',controller.addFriend)
router.post('/showFriends',controller.showFriends)
router.post('/searchFriends',controller.searchFriends)
router.post('/friendRequest',controller.friendRequest)
router.post('/showFriendRequests',controller.showFriendRequests)
router.post('/generateprivateKey',controller.generateprivateKey)
router.post('/givePoints',controller.givePoints)
router.post('/friendSuggetion',controller.friendSuggetion)
router.post('/addHobbies', controller.addHobbyAndInterest)
router.post('/addEducationHIstory',controller.addEducationHIstory)
router.post('/addEmploymentHIstory',controller.addEmploymentHIstory)
router.get('/getAllStatus', controller.getAllStatus)
router.post('/like', controller.addLikes)

module.exports = router;