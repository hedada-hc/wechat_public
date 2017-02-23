'use strict'
/*
 *微信公众号开发
 * 2017年2月23日22:39:06
 */
var sha1 = require("sha1")
var GetRawBody = require('raw-body')
var Wechat = require('./wechat')
var util = require('./util')

module.exports = function(opts){
	//var wechat = new Wechat(opts)
	return function *(next){
			var that = this
			var token = opts.token
			var signature = this.query.signature
			var nonce = this.query.nonce
			var timestamp = this.query.timestamp
			var echostr = this.query.echostr
			var str = [token,timestamp,nonce].sort().join('')
			var sha = sha1(str)

			if(this.method === 'GET'){
				//判断是否是从微信过来的
				if(sha === signature){
					this.body = echostr + ''
				}else{
					this.body = 'wrong'
				}
				//如果是post 就是用户事件 点击过来的
			}else if(this.method === 'POST'){
				//判断是否是从微信过来的
				if(sha !== signature){
					this.body = 'wrong'
					return false
				}

				var data = yield GetRawBody(this.req,{
					length:this.length,
					limit:'1mb',
					encoding:this.charset
				})

				var content = yield util.parseXMLAsync(data)

				//console.log(content)

				var message = util.formatMessage(content.xml)
				console.log(message)
				if(message.MsgType === 'event'){
					if(message.Event === 'subscribe'){
						var now = new Date().getTime()
						that.status = 200
						that.type = 'application/xml'
						var reply = `<xml>
									<ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
									<FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
									<CreateTime>${now}</CreateTime>
									<MsgType><![CDATA[text]]></MsgType>
									<Content><![CDATA[淘客助手激活码： NT1Y-98KJ-LK5L-S5LH]]></Content>
									</xml>`
						that.body = reply
						return			
					}
				}

				if(message.MsgType === 'text'){
					if(message.Content === '激活码'){
						var now = new Date().getTime()
						that.status = 200
						that.type = 'application/xml'
						var reply = `<xml>
									<ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
									<FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
									<CreateTime>${now}</CreateTime>
									<MsgType><![CDATA[text]]></MsgType>
									<Content><![CDATA[淘客助手激活码： NT1Y-98KJ-LK5L-S5LH]]></Content>
									</xml>`
						that.body = reply
						return			
					}
				}
			}
		}
}
