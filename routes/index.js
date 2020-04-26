var express = require('express');
var router = express.Router();
//d'apres la doc npm ils conseillent de ne pas utiliser sync-request dans une production mais plutot
//then-request
//npm install then-request
//mettre la route en asynchorne et la request GET en await et utiliser getBody() au lieu de body.
//Regarder la documentation pour gestion des erreurs
var request = require('sync-request');
var cityModel = require('../models/cities');
var userModel = require('../models/users');

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('login', { title: 'Express', emailUsed: false, usernameUsed: false, emailInUsed: false });
});



router.get('/weather', async function(req, res, next) {
  //On va chercher la liste des villes qui sont stockés dans la DB
  if(req.session.user == null) {
    res.redirect('/');
  } else {
    var cities = await cityModel.find();
  res.render('weather', { title: 'Express', cityList: cities, user: req.session.user});
  }
  
});

router.post('/add-city', async function(req, res, next) {
  //On récupère la valeur de l'input de ville de l'utilisateur sur le site
  var inputCity = req.body.cityInput;
  //On va chercher grâce a l'API les infos de cette ville
  var city = await request("GET", "http://api.openweathermap.org/data/2.5/weather?q=" + inputCity + "&appid=c8ba9ac0a380e95ee4626271a6cab7b1&lang=fr&units=metric");
  //On fait de la réponse quelque chose qu'on pourra utiliser donc un objet
  city = JSON.parse(city.body);
  //On va chercher sur le MONGODB la liste des villes déjà dans la base de données
  var cities = await cityModel.find();
  //On initialise une variable qui nous servira pour savoir si la ville est déjà présente
  var cityAlreadyPresent = await cityModel.findOne({
    nom: city.name
  });
   
    //Si on a pas trouvé le nom de ville dans notre DB et que on a un retour de l'API (city.name = true)
    if (cityAlreadyPresent === null && city.name) {
      //On crée une nouvelle ville selon le modele
      var newCity = new cityModel({
        nom: city.name,
        descriptif: city.weather[0].description,
        tMin: city.main.temp_min,
        tMax: city.main.temp_max,
        url: "http://openweathermap.org/img/wn/" + city.weather[0].icon + "@2x.png",
        apiId: city.id,
        long: city.coord.lon,
        lat: city.coord.lat
      });
      //On l'ajoute dans notre DB
      await newCity.save();
    } 
    //On refait un tour dans notre DB pour voir quelle est maintenant la nouvelle liste
    cities = await cityModel.find();

  res.render('weather', { title: 'Express', cityList: cities, user: req.session.user });
});

router.get('/delete-city', async function(req, res, next) {
  //On demande de supprimer dans notre DB l'élément qui a l'id qu'on renvoie depuis le frontend
  await cityModel.deleteOne({_id: req.query.id});
  //Après avoir supprimé on refait un tour dans la DB pour voir de quoi elle a l'air maintenant
  var cities = await cityModel.find();

  res.render('weather', { title: 'Express', cityList: cities, user: req.session.user });
});

router.get('/update-data', async function(req, res, next) {
  //On va voir dans la DB a quoi ressemble al liste de villes pour le moment
  var cities = await cityModel.find();
  //On boucle sur toute la longueur
  for (let i = 0; i < cities.length; i++) {
    //On crée une nouvelle variable updateCity qui ira chercher les nouvelles infos via l'API (on cherche via le apiID pour qu'on ait pas de probleme d'ecritures de villes avec des accents)
    var updateCity = await request("GET", "http://api.openweathermap.org/data/2.5/weather?id=" + cities[i].apiId + "&appid=c8ba9ac0a380e95ee4626271a6cab7b1&lang=fr&units=metric");
    //On le transforme en objet utilisable
    updateCity = JSON.parse(updateCity.body);
    //On fait la mise à jour de la ville. Le premier paramètre est celui qu'on donne pour trouver la bonne ville
    await cityModel.updateOne({_id: cities[i]._id}, {
      //Le deuxième parametre c'est les infos qu'on veut modifier dans cette ville
      tMax: updateCity.main.temp_max,
      tMin: updateCity.main.temp_min,
      url: "http://openweathermap.org/img/wn/" + updateCity.weather[0].icon + "@2x.png",
      descriptif: updateCity.weather[0].description
    });
  }
  //Ensuite on regarde de nouveau de quoi a l'air notre DB et on renvoie le tout au front
  cities = await cityModel.find();

  res.render('weather', { title: 'Express', cityList: cities, user: req.session.user});
});


module.exports = router;
