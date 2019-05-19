const User = require('../models/users')
const JWT = require('jsonwebtoken');
const CONFIG = require('../config');

const register = (req, res) => {
	if (req.body && req.body.username && req.body.password && req.body.email) {
		var newUser = new User({
			username: req.body.username,
			password: req.body.password,
			email: req.body.email
		})

		newUser.save((err, result) => {
			if (err) {
				console.log(err);
				res.status(409).json({ message: "User already exists or the email already has an account attached to itftoken" });
			} else {
				res.status(200).json({ message: "Registered with success" })
			}
		})
	} else {
		res.status(422).json({ message: "Please provide all data for register process" })
	}
}

const login = (req, res) => {
	if (req.body && req.body.username && req.body.password) {
		console.log(req.body.username,req.body.password)
		var findUser = {
			username: req.body.username,
			password: req.body.password,
		}
		User.findOne(findUser)
			.then(data => {
				if (data == null) {
					res.status(401).json({ message: "Wrong combination" })
				} else {
					var token = JWT.sign(
						{
							username: req.body.username,
							exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60
						},
						CONFIG.JWT_SECRET_KEY
					)
					res.status(200).json({token})
				}
			})
			.catch(err => {
				res.status(500).json({ message: "Problems with data base" })
			})


	} else {
		res.status(422).json({ message: "Please provide all data for login process" })
	}
}

module.exports = {
	register,
	login
}