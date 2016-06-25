var mongoose = require("mongoose");  //  顶会议用户组件
var Schema = mongoose.Schema;    //  创建模型
var userScheMa = new Schema({
    userid: String,
    password: String
}); //  定义了一个新的模型，但是此模式还未和users集合有关联
var adminUserScheMa = new Schema({
    userid: String,
    password: String
}); //  定义了一个新的模型，但是此模式还未和users集合有关联
var conn_index = mongoose.createConnection("mongodb://localhost/joldyblog");
var conn_admin = mongoose.createConnection("mongodb://localhost/joldyblog");
var model_index = conn_index.model('users',userScheMa);
var model_admin = conn_admin.model('users',adminUserScheMa);
exports.user = model_index; //  与users集合关联
exports.adminUser = model_admin; //  与users集合关联