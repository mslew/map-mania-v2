var gMap;
var score = 0;
var cheated = false;
var locations;
var allLocations;
var locationsGuessed = [];
var targetName;
var targetLocation;
var targetLatitude;
var targetLongitude;
var dataFetchStatus;
var latitudeClick;
var longitudeClick;
var targetRadius;
var zoomLevel = gMap.getZoom()
var inBounds = false;

function initApplication(){
    document.getElementById("score").value = '0000'
    document.getElementById("hints").value = "Freezing Cold";
    document.getElementById("correctlyGuessed").value = "Place";
    grabLocations()
}

function displayCheatModal(){
    $('#cheatCode').modal('toggle');
}

function displayWinModal(){
    $('#winModal').modal('toggle');
}

function refresh(){
    window.location.reload();
}

async function grabLocations(){
    try{
        const response = await fetch("/send")
        const data = await response.json()
        locations = Object.values(data.places)
        allLocations = Object.values(data.places)
        mapTarget()
        dataFetchStatus = true
        console.log("Fetched data")
    }catch(e){
        console.log(e)
        console.log("There was a problem fetching data.")
    }
}

function mapTarget(){
    targetLocation = Math.floor(Math.random() * (locations.length - 1))
    targetName = locations[targetLocation].name
    targetLatitude = locations[targetLocation].lattitude
    targetLongitude = locations[targetLocation].longitude
    targetMarker = new google.maps.Marker({
        position: {lat:targetLatitude, lng:targetLongitude}, 
        map:gMap, 
        title: name});
    targetRadius = new google.maps.Circle({
        map: gMap,
        radius: 16093,
        fillOpacity: 0,
        strokeOpacity: 0
    });
    google.maps.event.addListener(targetRadius, 'click', function() {
        score += 100
        document.getElementById("score").value = score.toString()
        getNewLocation()
    });
    targetRadius.bindTo('center', targetMarker, 'position');
    targetMarker.setVisible(false)
}

function getNewLocation(){
    document.getElementById("correctlyGuessed").value = locations[targetLocation].name;
    locationsGuessed.push(locations[targetLocation])
    locations.splice(targetLocation, 1)
    targetMarker.setVisible(true)
    targetRadius.setMap(null)
    if (locations.length == 0) {
        displayWinModal()
        console.log("End Game")
    }else{
        mapTarget()
        giveHints()  
    }
}

function makePointsVisible(){
    for (let i = 0; i < allLocations.length; i++){
        var name = allLocations[i].name
        var lattitude = allLocations[i].lattitude
        var longitude = allLocations[i].longitude
        marker = new google.maps.Marker({position: {lat:lattitude, lng:longitude}, map:gMap, title: name});
        marker.setVisible(true)
    }
    targetMarker.setMap(null)
    targetRadius.setMap(null)
    document.getElementById("score").value = '0000'
    document.getElementById("hints").value = "";
    document.getElementById("correctlyGuessed").value = "";
    cheated = true;
}

function giveHints(){
    if(!cheated){
        if (gMap.getBounds().contains({lat:locations[targetLocation].lattitude, lng:locations[targetLocation].longitude})) {
            inBounds = true;
        }
        if (inBounds == false || (zoomLevel >= 0 && zoomLevel <= 3)){
            document.getElementById("hints").value = "Freezing Cold"
        }else{
            if(inBounds == true && zoomLevel >= 4 && zoomLevel <= 6){
                document.getElementById("hints").value = "Warmer"
            }else{
                if(inBounds == true && zoomLevel >= 7 && zoomLevel <= 8){
                    document.getElementById("hints").value = "Very Warm"
                }else{
                    if(inBounds == true && zoomLevel >= 9){
                        document.getElementById("hints").value = "RED HOT";
                    }
                }
            }
        }   
    }
}

function initMap() {
    gMap = new google.maps.Map(document.getElementById("myMapID"), {
      center: { lat: 39.8283, lng: -98.5795 }, //geographic center of US
      zoom: 3,
      gestureHandling: "greedy",
    });

    // Note that several message boards suggested using 'idle' instead of 'bounds_changed' because 
    // 'bounds_changed' gets called over and over when the user drags the map.
    google.maps.event.addListener(gMap, 'idle', function() {
        updateGame()
    });
}

function updateGame() { //use this for hints 
    zoomLevel = gMap.getZoom()
    inBounds = false;

    if (dataFetchStatus){
        // Check if target location is in the currently displayed map
        giveHints()
        console.log("inBounds: "+inBounds+ " zoomLevel: "+zoomLevel);
    }
}