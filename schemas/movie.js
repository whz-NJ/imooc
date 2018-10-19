var mongoose = require('mongoose');

var movieSchema = new mongoose.Schema({
    title: String,
    doctor: String,
    language: String,
    country: String,
    summary: String,
    flash: String,
    poster: String,
    year: Number,
    // meta 更新或录入数据的时间记录
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        },
    }
});

// movieSchema.pre 表示每次存储数据之前都先调用这个方法
movieSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next(); //继续执行存储流程
});

// movieSchema 模式的静态方法，不会直接与数据库交互，
// 只有经过mongoose.model编译，并且实例化以后，才会具有这个方法
movieSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb) //执行后续回调方法
    },
    findById: function (id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb) //执行后续回调方法
    }
}

// 导出movieSchema模式
module.exports = movieSchema;