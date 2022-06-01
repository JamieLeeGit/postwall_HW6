const express = require('express');
const router = express.Router();
const PostsControllers = require('../controllers/posts');
const { isAuth } = require('../middleware/auth');
const handleErrorAsync = require("../service/handleErrorAsync");


router.post(
    '/read', 
    handleErrorAsync(async (req, res, next) =>PostsControllers.readPost(req, res, next)));

router.post(
    '/create',
    isAuth,
    handleErrorAsync(async (req, res, next) =>PostsControllers.createPostsOne(req, res, next)));

module.exports = router;
