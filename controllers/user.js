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

    const hashPassword = await getHashPassword(password);
    const newUser = await User.create({
      email,
      password:hashPassword ,
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
      console.log("欄位不可為空值");
      return appError(httpStatus.BAD_REQUEST, "欄位不可為空值", next);
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      console.log("找不到 user 資料");

      //訊息不明寫，減少一點被試帳號密碼風險
      return appError(httpStatus.BAD_REQUEST, "帳號或密碼錯誤", next);
    }

    const isValidated = await bcrypt.compare(password, user.password);

    if (!isValidated) {
      console.log("密碼不一致");
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
    const user = await User.findOne({_id: req.params.id});

    if(user){
      const result = {
        "success": true,
        "user": user
      };
  
      handleSuccess(res, httpStatus.OK, result);
    }else{
      return appError(httpStatus.BAD_REQUEST, "找不到 user 資料", next);
    }    
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

    const user = await User.findByIdAndUpdate(req.params.id, { name, image, gender });

    if(user){
      generateJWT(user, httpStatus.OK, res);
    }else{
      return appError(httpStatus.BAD_REQUEST, "找不到 user 資料", next);
    }
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

    if(user){
      generateJWT(user, httpStatus.OK, res);
    }else{
      return appError(httpStatus.BAD_REQUEST, "找不到 user 資料", next);
    }
  },
  /**
   * 讀取所有user資料(測試用)
   * @param {resquest} req 連線請求
   * @param {respones} res 回應結果
   */
  async readUserAll(req, res, next) {
    console.log("readUserAll");

    const users = await User.find();
    const result = {
      "success": true,
      "users": users
    };

    handleSuccess(res, httpStatus.OK, result);
  },
};

module.exports = user;
