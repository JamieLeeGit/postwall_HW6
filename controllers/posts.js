const appError = require("../service/appError");
const handleSuccess = require('../service/handleSuccess');
const Post = require('../models/post');
const User = require('../models/user');
const httpStatus = require("../service/httpStatus");

const posts = {
    /**
     * 讀取所有貼文
     * @param {resquest} req 連線請求
     * @param {respones} res 回應結果
     */
    async readPostAll(req, res, next){   
            console.log('readPostAll');
            const allPost = await Post.find();
            const result = {
                "success": true,
                "posts": allPost
            };

            handleSuccess(res, httpStatus.OK, result);             
    },
    /**
     * 新增單筆貼文
     * @param {*} param0 
     */
    async createPostsOne(req, res, next){
            console.log('createPostsOne');

            const { content, image } = req.body;
            // 檢查所有必填欄位
            if(req.user.id && content){
                // 取得userId    
                const userProfile = await User.findOne({ _id: req.user.id});

                if(userProfile){
                    const newPost = await Post.create
                    (
                        {
                            userId: userProfile._id,
                            content: content,
                            image: image
                        }
                    );
    
                    const result = {
                        "success": true,
                        "post": newPost
                    };
                    
                    handleSuccess(res, httpStatus.OK, result);
                }else{
                    return next(appError(404,"找不到 user 資料，沒有發文權限",next));
                }         
            }else{                
                return next(appError(400,"缺少 userId 或 content",next));
            }
    }
}

module.exports = posts;