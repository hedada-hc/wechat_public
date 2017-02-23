'use strict'
/*
 *微信公众号开发
 * 2017年2月23日22:39:06
 */
var Koa = require("koa")
var path = require('path')
var wechat = require('./wechat/g')
var util = require('./libs/util')
var wechat_file = path.join(__dirname,'./config/wechat.txt')
var config = {
	wechat:{
		appID:"wx67717b2f09a848c0",
		appSecret:"c32c117b1632e92e15ca36825406e611",
		token:"hezone",
		getAccessToken:function(){
			return util.readFileAsync(wechat_file)
		},
		saveAccessToken:function(){
			return util.writeFileAsync(wechat_file)
		}
	}
}

/*
 *启动服务器
 */
var app = new Koa()

app.use(wechat(config.wechat)) 

app.listen(3000,()=>{
	console.log("服务已经启动 端口3000")
})