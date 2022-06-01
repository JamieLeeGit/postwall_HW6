const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, '暱稱未填寫']
        },
        email: {
            type: String,
            required: [true, 'Email未填寫']
        },
        password: {
            type: String,
            required: [true, '密碼未填寫'],
            select: false
        },
        image: {
            type: String,
            default: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
        },
        gender: {
            type: String,
            enum: ['man', 'woman'],
            default:'woman'
        }
    },
    {
        versionKey: false
    });

const User = mongoose.model(
        'User',
        userSchema
      );
    
module.exports = User;