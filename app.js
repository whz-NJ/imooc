var express = require('express')
var path = require('path')
var mongoose =require('mongoose')
var _ = require('underscore') //_.extend 用新对象里的字段替换老的字段
var port = process.env.PORT || 3000
var app = express()
var Movie = require('./models/movie')// 载入mongoose编译后的模型Movie

// mongoose.connect('mongodb://localhost/imooc')// 老版本链接本地数据库方式
mongoose.connection.openUri('mongodb://localhost/imooc')//连接mongodb本地数据库imovie
/*  mongoose 简要知识点补充
* mongoose模块构建在mongodb之上，提供了Schema[模式]、Model[模型]和Document[文档]对象，用起来更为方便。
* Schema对象定义文档的结构（类似表结构），可以定义字段和类型、唯一性、索引和验证。
* Model对象表示集合中的所有文档。
* Document对象作为集合中的单个文档的表示。
* mongoose还有Query和Aggregate对象，Query实现查询，Aggregate实现聚合。
* */

app.set('views', './views/pages'); // 设置视图默认的文件路径
app.set('view engine', 'jade')// 设置视图引擎：jade
var bodyParser = require('body-parser');// 因后台录入页有提交表单的步骤，故加载此模块方法（bodyParser模块来做文件解析），将表单里的数据进行格式化
// app.use(express.bodyParser())
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname,'bower_components'))) //设置静态资源路径
app.use(express.static(path.join(__dirname,'public'))) //设置静态资源路径
app.locals.moment = require('moment')// 载入moment模块，格式化日期
app.listen(port)
console.log('imooc started on port ' + port)

// index page
app.get('/', function(req, res) {
    Movie.fetch(function(err, movies) {
        if(err) {
            console.log(err)
        }
        res.render('index', {
            title: 'imooc 首页',
            movies: movies
        })
    })
})

// detail page
app.get('/movie/:id', function (req, res) {
    var id = req.params.id

    Movie.findById(id, function (err, movie) {
        res.render('detail', {
            title: 'imooc ' + movie.title,
            movie: movie
        })
    })
})
// admin page
app.get('/admin/movie', function(req, res) {
    res.render('admin', {
        title: 'imooc 后台录入页',
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    })
})
// admin update movie
app.get('/admin/update/:id', function(req, res) {
    var id = req.params.id
    if(id) {
        Movie.findById(id, function(err, movie) {
            res.render('admin', {
                title: 'imooc 后台更新页',
                movie: movie
            })
        })
    }
})
// admin post movie
app.post('/admin/movie/new', function(req, res) {
    console.log(req.body.movie)

    var id = req.body.movie._id
    var movieObj = req.body.movie
    var _movie

    if(id !== 'undefined') {
        Movie.findById(id, function(err, movie) {
            if(err) {
                console.log(err)
            }
            _movie = _.extend(movie, movieObj)
            _movie.save(function(err, movie) {
                if(err) {
                    console.log(err)
                }
                res.redirect('/movie/' + movie._id)
            })
        })
    }
    else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        })
        _movie.save(function(err, movie) {
            if(err) {
                console.log(err)
            }
            res.redirect('/movie/' + movie._id)
        })
    }
})
// list page
app.get('/admin/list', function(req, res) {
    Movie.fetch(function(err, movies) {
        if(err) {
            console.log(err)
        }
        res.render('list', {
            title: 'imooc 列表页',
            movies: movies
        })
    })
})

// list delete movie data 列表页删除电影
app.delete('/admin/list', function(req, res) {
    var id = req.query.id

    if (id) {
        Movie.remove({ _id: id }, function(err, movie) {
            if (err) {
                console.log(err)
            } else {
                res.json({ success: 1 })
            }
        })
    }
})
