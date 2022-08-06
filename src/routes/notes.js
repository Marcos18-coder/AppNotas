const express = require('express');
const router= express.Router();

const Note = require('../models/Note');
const {isAuthenticated}= require('../helpers/auth');

router.get('/notes/add',isAuthenticated, (req, res) => {
	res.render('notes/new-note');
});

router.post('/notes/new-note',isAuthenticated, async(req, res) => {
	const { title, description }=req.body;
	const errors=[];
	if(!title){
		errors.push({text:'Escribe el Titulo'});
	}

	if(!description){
		errors.push({text:'Escribe una Descripcion'});
	}

if(errors.length > 0){
		res.render('notes/new-note',{
			errors,
			title,
			description
		});
	}else{
		//insertar
		const newNote=new Note({title, description});
		//linea para hacer referencia de usuarios y tareas por usuario
		newNote.user = req.user.id;
		await newNote.save();
		req.flash('success_msg','Nota Agregada');
		res.redirect('/notes');
	}
});

//mostrar notas
router.get('/notes',isAuthenticated, async (req, res) => {
	// user:req.user.id esto es para que la consulta solo devuelva las notas de un usuario
	const notes = await Note.find({user: req.user.id}).sort({date:'desc'}).lean();
	res.render('notes/all-notes',{notes});
	console.log(notes);
});

//editar
router.get('/notes/edit/:id',isAuthenticated, async(req, res) =>{
	const note = await Note.findById(req.params.id).lean();
	res.render('notes/edit-note',{note});
});

//actualizar
router.put('/notes/edit-note/:id',isAuthenticated, async (req, res) =>{
	const {title, description} = req.body;
	await Note.findByIdAndUpdate(req.params.id,{title, description});
		req.flash('success_msg','Nota Actualizada');
	res.redirect('/notes');
});

//eliminar
router.delete('/notes/delete/:id',isAuthenticated, async(req, res) =>{
	await Note.findByIdAndDelete(req.params.id);
		req.flash('success_msg','Nota Eliminada');
	res.redirect('/notes');

});

module.exports = router; 