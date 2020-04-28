var mymap = L.map('worldmap').setView([48.866667, 2.333333], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mymap);



var cities = document.getElementsByClassName('city');

for (let i = 0; i < cities.length; i++) {
    var logo = L.icon({
        iconUrl: cities[i].dataset.logo,
    
        iconSize:     [38, 38], 
        popupAnchor:  [-5, -5] // point from which the popup should open relative to the iconAnchor
    });
    var long = cities[i].dataset.long;
    var lat = cities[i].dataset.lat;
    var nom = cities[i].dataset.nom;
    mymap.setView([lat, long], 4);
    var marker = L.marker([lat, long], {icon: logo}).addTo(mymap).bindPopup(nom)
}



  horloge('div_horloge');
 
   
  function horloge(el) {
    if(typeof el=="string") { el = document.getElementById(el); }
    function actualiser() {
      var date = new Date();
      var str = date.getHours();
      str += ':'+(date.getMinutes()<10?'0':'')+date.getMinutes();
      str += ':'+(date.getSeconds()<10?'0':'')+date.getSeconds();
      el.innerHTML = str;
    }
    actualiser();
    setInterval(actualiser,1000);
  }


  var villes = document.getElementsByClassName('ville');
  for (let i = 0; i < villes.length; i++) {
    villes[i].addEventListener("click", function(){
      var lat = villes[i].dataset.lat;
      var long = villes[i].dataset.long
    
    mymap.setView([lat, long, 4]);
    })
  }



  var testHorloge = document.getElementsByClassName('time');

  for (let i = 0; i < testHorloge.length; i++) {
    function actualiser(){
      var dateMaintenant = Date.now();
      var dateVille = dateMaintenant + testHorloge[i].dataset.timezone*1000 -7200*1000;
      var date = new Date(dateVille);
      var str = date.getHours();
      str += ':'+(date.getMinutes()<10?'0':'')+date.getMinutes();
      str += ':'+(date.getSeconds()<10?'0':'')+date.getSeconds();
      testHorloge[i].innerHTML = str.toString();
    }
    actualiser();
    setInterval(actualiser,1000);
  }
