//Initialiser la base de données MONGODB
var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true
};

var password = "Nini2010";
mongoose.connect(
    "mongodb+srv://SebParain:" + password + "@cluster0-dbc2k.mongodb.net/test?retryWrites=true&w=majority",
    options,
    function(error){
        if (error) {
            console.log(error);
        } else {
            console.log("La connexion à MongoDB s'est effectuée avec succes");
        }
    }
);
