const express = require("express");
const router = express.Router();
const UserControllers = require("../controllers/user");
const { isAuth, isValidator } = require("../middleware/auth");
const handleErrorAsync = require("../service/handleErrorAsync");

// 驗證用
router.route("/")
  .get(UserControllers.readUserAll);

router.route("/sign_up")
  .post(isValidator, handleErrorAsync(UserControllers.signUp));

router.route("/sign_in")
  .post(handleErrorAsync(UserControllers.signIn));

router.route("/updatePassword")
  .post(isAuth, handleErrorAsync(UserControllers.updatePassword));

router.route("/profile/:id")
  .get(handleErrorAsync(UserControllers.readProfileOne))
  .patch(isAuth, handleErrorAsync(UserControllers.updateProfileOne));

module.exports = router;
