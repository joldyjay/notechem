var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var user = require('../models/user').adminUser;

/*admin page*/
router.get('/', function(req, res, next) {
  	res.render('admin/login');
});

router.get('/logout', function(req, res, next) {
  	res.render('admin/index');
});

router.get('/manage', function(req, res, next) {
  	res.render('admin/index');
});

router.post('/manage', function(req, res, next){
	var query_doc = {userid: req.body.userid, password: req.body.password};
	var user = {
        username: 'admin',
        password: '1'
    }
	if(query_doc.userid == user.username && query_doc.password == user.password){
        res.send({success:1});
    }
	/*(function(){
		user.count(query_doc, function(err, doc){
			console.log(doc)
			if(doc == 1) {
			 	console.log(query_doc.userid + ": login success in " + new Date());
                res.render('admin/index', {title: 'joldy'});
			}else {
				console.log(query_doc.userid + ": login failed in " + new Date());
                res.redirect('/admin');
			}
		});
	})(query_doc);*/
	
});

module.exports = router;