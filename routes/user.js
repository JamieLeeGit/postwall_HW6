const express = require("express");
const router = express.Router();
const UserControllers = require("../controllers/user");
const { isAuth, isValidator } = require("../middleware/auth");
const handleErrorAsync = require("../service/handleErrorAsync");

// 驗證用
router.route("/")
  .get(UserControllers.readUserAll);

router.route("/sign_up")
  .post(
    isValidator,
    handleErrorAsync(async (req, res, next) => UserControllers.signUp(req, res, next))
  );

router.route("/sign_in")
  .post(handleErrorAsync(async (req, res, next) => UserControllers.signIn(req, res, next)));

router.route("/updatePassword")
  .post(
    isAuth,
    handleErrorAsync(async (req, res, next) => UserControllers.updatePassword(req, res, next))
  );

router.route("/profile")
  .post(
    isAuth,
    handleErrorAsync(async (req, res, next) => UserControllers.readProfileOne(req, res, next))
  )
  .patch(
    isAuth,
    handleErrorAsync(async (req, res, next) => UserControllers.updateProfileOne(req, res, next))
  );

module.exports = router;
