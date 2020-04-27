var express = require('express');
var router = express.Router();
var userModel = require('../models/users');



router.post('/sign-up', async function(req, res, next) {
  //On va controler si l'email entré est déjà utilisé par un autre utilisateur dans la base de donnée
  var emailAlreadyUsed = await userModel.findOne({
    email: req.body.email
  });
  //On va également checker si le username est déjà utilisé
  var userNameAlreadyUsed = await userModel.findOne({
    userName: req.body.username
  });
  //Si un des deux revient, c'est-à-dire si il a trouvé dans la base de données un username pareil ou un email pareil
  //Rends la page login sans rien faire
  if(emailAlreadyUsed && userNameAlreadyUsed) {
    res.render('login', {emailUsed: true, usernameUsed: true, emailInUsed: false });
  } else if (emailAlreadyUsed){
    res.render('login', {emailUsed: true, usernameUsed: false, emailInUsed: false});
  } else if (userNameAlreadyUsed){
    res.render('login', {emailUsed: false, usernameUsed: true, emailInUsed: false});
  }
    //Sinon crée un nouvel user avec les infos entrées dans le formulaire
     else {
    var user = new userModel({
      userName: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
    //Sauvegarde l'utilisateur dans la base de données
   user = await user.save();
    //crée une variable de session pour garder ces informations
   req.session.user = {name: user.userName, id: user._id};
   //Redirige moi vers la page weather
   res.redirect('/weather', {cityList: user.cities, user: req.session.user});
  }
});

router.post('/sign-in', async function(req, res, next) {
  //Controle si un utilisateur existe déjà dans la base de données avec les infos renseignées par l'utilisateur
  var user = await userModel.findOne({
    email: req.body.email,
    password: req.body.password
  });
  //Si c'est le cas entre les informations dans la variable de session
  if (user) {
    req.session.user = {name: user.userName, id: user._id};
    //Et redirige moi vers la page weather
    res.redirect('/weather');
  } else {
    //Si c'est pas le cas redonne moi la page login
    res.render('login', {emailUsed: false, usernameUsed:false, emailInUsed: true});
  }

});

router.get('/logout', function(req, res, next) {
  //Désactive la variable de session en la rendant null
  req.session.user = null;
  //Redirige moi vers la page login
  res.redirect('/');
})





module.exports = router;
