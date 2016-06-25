var models = require('./models');
//--start: connect mysql database--
var mysql  = require('mysql');
var crypto = require('crypto');
var db_config = {
    host : '127.0.0.1',
    user : 'root',
    password : '1',
    port: '3306',
    database: 'notechem',
};
var conn;
function handleDisconnect() {
    global.connection = conn = mysql.createConnection(db_config);
    connection.connect(function(err) {
        if(err) {
            console.log('进行断线重连：' + new Date());
            setTimeout(handleDisconnect, 2000);   //2秒重连一次
            return;
        }
        console.log('连接成功');
    });
    connection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        }else {
            throw err;
        }
    });
}
handleDisconnect();
var person = {
    select: 'select * from personal where accountname = ?',
    insert:'insert into personal(accountname, password, email) values(?, ?, ?)',
    update:'update personal set id=?, password=? where id=?',
    delete: 'delete from personal where id=?',
    queryById: 'select * from personal where id=?',
    queryAll: 'select * from personal'
};
function User(user){
    this.accountname = user[0].accountname;
    this.password = user[0].password;
}
module.exports = User;
User.prototype.save = function save(username,callback){
    var addparams = [this.accountname, this.email, this.password];
    conn.query(person.select,[username],function(err,doc){   // 同理 /login 路径的处理方式
        //console.log(doc)
        if(err){
            return callback(err);
        }else{
            conn.query(person.insert, addparams, function(err, rows, field){
                //conn.end();
                //next();
            });
        }
        //next();
    });

}
User.get = function get(username, callback){
    conn.query(person.select, [username], function(err, doc, fields) {
        //console.log(doc[0])
        if(err){ 										//错误就返回给原post处（login.html) 状态码为500的错误
            return callback(err);
        }
        if(doc){
            var user = new User(doc);
            callback(err, user);
        }else{
            callback(err, null);
        }
    });
    conn.end;
}
//--end: connect mysql database--