
var validator = require('validator');
var jwt = require('jsonwebtoken');
const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");
const httpStatus = require("../service/httpStatus");
const User = require('../models/user');

const isAuth = handleErrorAsync(async (req, res, next)=>{
    console.log('isAuth');
    // 確認 token 是否存在
     const authorization = req.headers.authorization;
    let token;
    if (authorization && authorization.startsWith("Bearer")) {
        token = authorization.split(" ")[1];
    }
    if (!token) {
        return next(appError(httpStatus.UNAUTHORIZED, "你尚未登入！", next));
    }

    console.log(token);
    var decoded = await new Promise((resolve, reject)=>{
        jwt.verify(token, process.env.JWT_SECRET, (err, payload)=>{
            console.log(err);
            if (err) {
                if ("JsonWebTokenError" === err.name) {
                  return next(appError(httpStatus.UNAUTHORIZED, "登入錯誤！", next));
                }else if ("TokenExpiredError" == err.name){
                    const payload = jwt.verify(token, process.env.JWT_SECRET, {ignoreExpiration: true} );
                    console.log(payload);
                    return next(appError(httpStatus.UNAUTHORIZED, "登入錯誤，token過期！", next));
                }
                //reject(err); //  "message": "系統錯誤，請恰系統管理員"
                return next(appError(httpStatus.UNAUTHORIZED, "登入錯誤！", next));
              } else {
                resolve(payload);
              }
        });
    });
    
    const currentUser = await User.findById(decoded.id);
    
    req.user = currentUser;
    next();
});

const isValidator = handleErrorAsync(async (req, res, next)=>{
    console.log('isValidator');
    const { password, email, confirmPassword, name } = req.body;

    if(!email || !password || !confirmPassword || !name){
        return next(appError(httpStatus.BAD_REQUEST, "欄位不可為空值", next))
    }

    if(password != confirmPassword){
        return next(appError(httpStatus.BAD_REQUEST, "密碼不一致", next))
    }

    if(!validator.isLength(password, { min: 8 })){
        return next(appError(httpStatus.BAD_REQUEST, "密碼長度需大於8", next));
    }
    
    if(!validator.isEmail(email)){
        return next(appError(httpStatus.BAD_REQUEST, "欄位 email 不可為空值", next));
    }
    
    next();
});

module.exports = {
    isAuth,
    isValidator
};