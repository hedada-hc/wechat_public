'use strict'
var fs = require('fs')
var Promise = require('bluebird')

exports.readFileAsync = function(path,encodnig){
	return new Promise(function(resolve,reject){
		fs.readFile(path,encodnig,function(error,content){
			if(error) reject(error)
				else resolve(content)
		})
	})
}

exports.writeFileAsync = function(path,content){
	return new Promise(function(resolve,reject){
		fs.writeFile(path,content,function(err){
			if(err) reject(err)
				else resolve()
		})
	})
}