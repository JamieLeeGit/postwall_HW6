const createError = require("http-errors");
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

// router
var postsRouter = require('./routes/posts');
var userRouter = require('./routes/user');

var app = express();

//DB連線（使用預設檔案 index）
require('./connections');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/posts', postsRouter);
app.use('/user', userRouter);

app.use(function(req,res,next){
  res.status(404).json({
      status:"false",
      message:"您的路由不存在"
  })
})

// 自定義 error
const resErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      message: err.message,
    });
  } else {
    console.error("出現未預期的錯誤", err);
    res.status(500).json({
      status: "error",
      message: "系統錯誤，請恰系統管理員",
    });
  }
};
// 開發環境錯誤
const resErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

app.use(function (err, req, res, next) {
  // dev 
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === "dev") {
    return resErrorDev(err, res);
  }

  // production
  if (err.name === 'ValidationError'){
    err.message = "資料欄位未填寫正確，請重新輸入！"
    err.isOperational = true;
    return resErrorProd(err, res)
  }
  resErrorProd(err, res)
});

app.use(function(err,req,res,next){
  console.log(err.name);
  res.status(500).json({
      "err": err.name
  })
})

process.on('uncaughtException', err => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
	console.error('Uncaughted Exception！')
	console.error(err);
	process.exit(1);
});

/**
 * 非同步程式/未捕捉到的 catch
 */
process.on('unhandledRejection', (reason, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', reason);
  // 記錄於 log 上
});

module.exports = app;
