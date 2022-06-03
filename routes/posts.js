const express = require('express');
const router = express.Router();
const PostsControllers = require('../controllers/posts');
const { isAuth } = require('../middleware/auth');
const handleErrorAsync = require("../service/handleErrorAsync");


router
    .get('/readAll',handleErrorAsync(PostsControllers.readPostAll));

router
    .post('/createOne',isAuth, handleErrorAsync(PostsControllers.createPostsOne)
);

module.exports = router;
