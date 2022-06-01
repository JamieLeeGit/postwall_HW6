const appError = require("../service/appError");
const handleSuccess = require("../service/handleSuccess");
const User = require("../models/user");
const httpStatus = require("../service/httpStatus");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const generateJWT = (user, statusCode, res) => {
  console.log("generateJWT");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });

  user.password = undefined;
  handleSuccess(
    res,
    httpStatus.OK, 
    {
      token,
      user
    });
};

const getHashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const user = {
  /**
   * 註冊
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async signUp(req, res, next) {
    console.log("signUp");
    let { email, password, name } = req.body;

    const newUser = await User.create({
      email,
      password: getHashPassword(password),
      name,
    });

    generateJWT(newUser, httpStatus.CREATED, res);
  },
  /**
   * 登入
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async signIn(req, res, next) {
    console.log("signIn");

    let { email, password } = req.body;

    if (!email || !password) {
      console.log("欄位不可為值");
      return appError(httpStatus.BAD_REQUEST, "欄位不可為值", next);
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      console.log("user 帳號或密碼錯誤");
      return appError(httpStatus.BAD_REQUEST, "帳號或密碼錯誤", next);
    }

    // 密碼比較是否一致
    const isValidated = await bcrypt.compare(password, user.password);

    if (!isValidated) {
      console.log("isValidated 帳號或密碼錯誤");
      return appError(httpStatus.BAD_REQUEST, "帳號或密碼錯誤", next);
    }

    generateJWT(user, httpStatus.OK, res);
  },
  /**
   * 讀取個人檔案
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
   async readProfileOne(req, res, next) {
    console.log("readProfileOne");
    const user = await User.findOne({_id: req.user.id});

    handleSuccess(res, httpStatus.OK, user);
  },
  /**
   * 修改個人檔案
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async updateProfileOne(req, res, next) {
    let { name, image, gender } = req.body;

    console.log("updateProfileOne");

    const user = await User.findByIdAndUpdate(req.user.id, { name, image, gender });

    generateJWT(user, httpStatus.OK, res);
  },
  /**
   * 忘記密碼
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async updatePassword(req, res, next) {
    let { password, comfirmPassword } = req.body;

    console.log("updatePassword");

    if (password !== comfirmPassword) {
      return appError(httpStatus.BAD_REQUEST, "密碼不一致", next);
    }

    const newPassword = await getHashPassword(password);
    const user = await User.findByIdAndUpdate( req.user.id, { password:newPassword });

    generateJWT(user, httpStatus.OK, res);
  },
  /**
   * 讀取所有user資料(測試用)
   * @param {resquest} req 連線請求
   * @param {respones} res 回應結果
   */
  async readUserAll(req, res, next) {
    console.log("readUserAll");

    const data = await User.find();
    handleSuccess(res, httpStatus.OK, data);
  },
};

module.exports = user;
