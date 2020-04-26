var mymap = L.map('worldmap',
    {
        center: [48.866667, 2.333333],
        zoom: 4
    }
    );

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
    var marker = L.marker([lat, long], {icon: logo}).addTo(mymap).bindPopup(nom)
}