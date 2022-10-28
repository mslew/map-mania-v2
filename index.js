const express = require("express");
const app = express();

app.use(express.static(__dirname + '/client'))
app.use(express.json());
const port = process.env.PORT || 3000

var favoritePlaces = {
	"places":[
		{"name":"Paris IL", "lattitude": 39.6111, "longitude": -87.6961},
		{"name":"Oceanside CA", "lattitude": 33.1959, "longitude": -117.3795},
		{"name":"Chicago IL", "lattitude": 41.8781, "longitude": -87.6298},
		{"name":"Pheonix AZ", "lattitude": 33.4484, "longitude": -112.0740},
		{"name":"Sedona AZ", "lattitude": 34.8697, "longitude": -111.7610},
		{"name":"Microcenter", "lattitude": 41.81144519275075, "longitude": -87.97259194393423}, 
    	{"name":"Alpine Valley", "lattitude": 42.735998043919885, "longitude": -88.42802844391068},
    	{"name":"Legacy Adventure Park", "lattitude": 41.56686911330436, "longitude": -88.07059287277652}, 
    	{"name":"Badlands Off Road Park", "lattitude": 40.27257726862229, "longitude": -87.26623514397254}, 
    	{"name":"Cedar Point", "lattitude": 41.482359694051716, "longitude": -82.68350987277863}
    		
	]
}

app.get('/send', function(req, res) {
	console.log(favoritePlaces)
	res.json(favoritePlaces)
})

app.listen(port, function() {
	console.log("Server is running at http://localhost:3000/")
})
