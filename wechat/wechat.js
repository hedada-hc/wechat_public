'use strict'
var Promise = require('bluebird')
var request = Promise.promisify(require('request'))

var prefix = 'https://api.weixin.qq.com/cgi-bin/'
var api = {
	accessToken:prefix + 'token?grant_type=client_credential'
}
//获取access_token
function Wechat(opts){
	var that = this
	this.appID = opts.appID
	this.appSecret = opts.appSecret
	this.getAccessToken = opts.getAccessToken
	this.saveAccessToken = opts.saveAccessToken

	this.getAccessToken().then(function(data){
		try{
			data = JSON.parse(data)
		}catch(e){
			return that.updateAccessToken(data)
		}
		//判断票据是否合法
		if(that.isValidAccessToken(data)){
			//合法就通过Promise传下去
			Promise.resolve(data)
		}else{
			return that.updateAccessToken(data)
		}
	}).then(function(data){
		that.access_token = data.access_token
		that.expires_in = data.expires_in
		//拿到票据后保存起来
		that.saveAccessToken(data)
	})
}

//检查票据过期没有
Wechat.prototype.isValidAccessToken = function(data){
	if(!data || !data.access_token || !data.expires_in){
		return false
	}

	var access_token = data.access_token
	var expires_in = data.expires_in
	var now = (new Date().getTime())

	//当前时间小于过期时间
	if(now < expires_in){
		return true
	}else{
		return false
	}
}

Wechat.prototype.updateAccessToken = function(){
	var appID = this.appID
	var appSecret = this.appSecret
	var url = api.accessToken + `&appid=${appID}&secret=${appSecret}`
	return new Promise(function(resolve,reject){

		request({url:url,json:true}).then(function(response){
			var data = response.body
			var now = (new Date().getTime())
			var expires_in = now + (data.expires_in - 20) * 1000

			data.expires_in = expires_in
			resolve(data)
		})

	})
	
}

module.exports = Wechat