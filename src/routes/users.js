const express = require('express');
const router= express.Router();


const User=require('../models/User');

const passport=require('passport');


router.get('/users/signin', (req, res) => {
	res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
	successRedirect: '/notes',
	failureRedirect: '/users/signin',
	failureFlash: true
}));


//registrar
router.get('/users/signup', (req, res) => {
	res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
	const {name, email, password, confirm_password}=req.body;
	const errors=[];
	if (name.length <= 0) {
		errors.push({text: 'Ingrese tu Nombre'});
	}
	if (password != confirm_password) {
		errors.push({text: 'Las contraseñas no son iguales'});
	} 
	if (password.length < 4) {
		errors.push({text: 'La contraseña debe de ser al menos 4 digitos'});
	}
	if (errors.length > 0) {
		res.render('users/signup', {errors, name, email, password, confirm_password});
	}else{
		const emailUser=await User.findOne({email: email}).lean();
		if (emailUser) {
			console.log(emailUser);
			req.flash('error_msg', 'EL correo ya esta registrado');
			res.redirect('/users/signup');
		}
		const newUser=new User({name, email, password});
		newUser.password=await newUser.encryptPassword(password);
		await newUser.save();
		req.flash('success_msg', 'Registro Completado');
		res.redirect('/users/signin');
	}
});


router.get('/users/logout',(req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router; 