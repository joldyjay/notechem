var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var flash = require('connect-flash');
var verify = require('./verify');

function checkLogin(req, res, next) {
	if (!req.session.user) {
		//req.session.error = '未登入';
		req.flash('error', '请先登录')
		return res.redirect('/login');
	}
	next();
}
function checkNotLogin(req, res, next) {
	if (req.session.user) {
		//req.session.error = '已登入'
		req.flash('error', '已登入');
		return res.redirect('/');
	}
	next();
}
function CheckMail(mail) {
	var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if (filter.test(mail)) return true;
	else {
		req.session.error = '您的电子邮件格式不正确';
		return false;}
}
/* GET index page. */
router.get('/', function(req, res,next) {
  res.render('index', { title: 'NoteChem' });    // 到达此路径则渲染index文件，并传出title值供 index.html使用
});
router.get('/verify', verify.verify).post(function(){

});
/* GET login page. */

router.route("/login").get(function(req,res){    // 到达此路径则渲染login文件，并传出title值供 login.html使用
	checkNotLogin;
	res.render("login",{title:'用户登录'});
}).post(function(req,res){ 					   // 从此路径检测到post方式则进行post数据的处理操作
	//get User info
	var User = global.dbHandel;
	var uname = req.body.uname;
	var code = req.body.code;
	//获取post上来的 data数据中 uname的值
	var md5 = crypto.createHash('md5');
	var upwd = md5.update(req.body.upwd).digest('base64');
	console.log('-------------------------');
	if(global.code != code){
		req.flash('error', '验证码错误');
		var code={
			code: global.code
		};
		res.send(code);
		//res.sendStatus(404);
	}else{
		/*
		conn.query(User.select, [uname], function(err, doc, fields) {
			//console.log(doc[0])
			if(err){ 										//错误就返回给原post处（login.html) 状态码为500的错误
				res.sendStatus(500);
				console.log(err);
			}else if(!doc[0]){ 								//查询不到用户名匹配信息，则用户名不存在
				//req.session.error = '用户名不存在';
				req.flash('error', '用户名不存在')
				res.sendStatus(404);							//	状态码返回404
				//	res.redirect("/login");
			}else{
				if(upwd != doc[0].password){ 	//查询到匹配用户名的信息，但相应的password属性不匹配
					//req.session.error = "密码错误";
					req.flash('error', '密码错误');
					res.sendStatus(404);
					//	res.redirect("/login");
				}else{							//信息匹配成功，则将此对象（匹配到的user) 赋给session.user  并返回成功
					req.session.user = doc[0];
					res.sendStatus(200);
					//	res.redirect("/home");
				}
			}
			// 释放连接
			//connection.end();
		});
		*/
		User.get(uname, function(err, user){
			if(!user){
				req.flash('error', '用户不存在');
				return res.redirect('/login');
			}
			console.log(upwd)
			if(upwd != user.password){ 	//查询到匹配用户名的信息，但相应的password属性不匹配
				//req.session.error = "密码错误";
				req.flash('error', '密码错误');
				res.sendStatus(404);
				//	res.redirect("/login");
			}else{							//信息匹配成功，则将此对象（匹配到的user) 赋给session.user  并返回成功
				req.session.user = user;
				//res.cookie('user', user);
				res.sendStatus(200);
				//	res.redirect("/home");
			}
		});
	}
});

/* GET register page. */
router.get('/register', checkNotLogin);
router.post('/register', checkNotLogin);
router.route("/register").get(function(req,res){    // 到达此路径则渲染register文件，并传出title值供 register.html使用
	if(req.session.user){ 					//到达/home路径首先判断是否已经登录
		req.session.error = "您已经登录"
		res.redirect("/home");				//未登录则重定向到 /login 路径
	}
	res.render("register",{title:'用户注册'});
}).post(function(req,res,next){
	 //这里的User就是从model中获取user对象，通过global.dbHandel全局方法（这个方法在app.js中已经实现)
	var User = global.dbHandel;
	var conn = global.connection;
	var uname = req.body.uname;
	var regcode = req.body.regcode;
	var email = req.body.email;
	//--md5加密
	var md5 = crypto.createHash('md5');
	var upwd = req.body.upwd;
	var upwdMd5 = md5.update(upwd).digest('base64');
	var addparams = [uname, upwdMd5, email];
	console.log('==========================')
	console.log(regcode);
	var newUser = new User({
		name: uname,
		password: upwdMd5,
	});
	if(global.code != regcode){
		//req.session.error = "验证码错误";
		req.flash('error', '验证码错误')
		res.sendStatus(404);
	}else{
		User.get(newUser.name, function(err, user){
			console.log(user);
			if(user){
				req.flash('error', '用户已存在')
			}
			if(err){
				req.flash('error', err);
				return res.redirect('/register');
			}
			newUser.save(newUser.name, function(err){
				if(err){
					req.flash('error',err);
					return res.redirect('/register');
				}
				req.session.user = newUser;
				req.flash('success','注册成功');
				res.sendStatus(200);
				res.redirect('/');
			});
		});
		/*
		conn.query(User.select,[uname],function(err,doc){   // 同理 /login 路径的处理方式
			console.log(doc)
			if(err){
				//req.session.error =  '网络异常错误！';
				req.flash('error', '网络异常错误');
				res.sendStatus(500);
				console.log(err);
			}else if(doc[0]){
				console.log(222222222222);
				//req.session.error = '用户名已存在！';
				req.flash('error', '用户名已存在');
				res.sendStatus(500);
			}else if(upwd.length <6){
				//req.session.error = '密码长度最少6位';
				req.flash('error', '密码长度最少6位')
				res.sendStatus(500);
			}else if(!CheckMail(email)){
				req.flash('error', '邮件地址错误')
			}else{

				console.log(33333333333333);
				//req.session.success = '账户创建成功！';
				req.flash('success', '账户创建成功')
				res.sendStatus(200);
				conn.query(User.insert, addparams, function(err, rows, field){
					//conn.end();
					//next();
				});
				//next();
			}
			//next();
		});*/
	}
});

/* GET home page. */
router.get("/home",checkLogin).post(function(req, res, next){
	var User = global.dbHandel;
	var conn = global.connection;
});

/* GET logout page. */
router.get("/logout",function(req,res){    // 到达 /logout 路径则登出， session中user,error对象置空，并重定向到根路径
	req.session.user = null;
	req.session.error = null;
	req.flash('error', null);
	res.redirect("/");
});

module.exports = router;
