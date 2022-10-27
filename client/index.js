var gMap;
var locations;
var masterLocations;
var locationsGuessed;
var targetLocation;
var dataFetchStatus;

function initApplication(){
    grabLocations()
}

function displayWinModal(){
    $('#cheatCode').modal('toggle');
}

async function grabLocations(){
    try{
        const response = await fetch("/send")
        const data = await response.json()
        locations = Object.values(data.places)
        masterLocations = Object.values(data.places)
        targetLocation = Math.floor(Math.random() * (masterLocations.length - 1)) //start with a random location within my list.
        mapTarget()
        dataFetchStatus = true
        console.log("Fetched data")
    }catch(e){
        console.log(e)
        console.log("There was a problem fetching data.")
    }
}

function mapTarget(){
    var name = locations[targetLocation].name
    var lattitude = locations[targetLocation].lattitude
    var longitude = locations[targetLocation].longitude
    targetMarker = new google.maps.Marker({position: {lat:lattitude, lng:longitude}, map:gMap, title: name});
    //targetMarker.setVisible(false)
}

function getNewLocation(){
    if(guessedCorrectly()){ //pick new location when guessed correctly
        locationsGuessed.push(locations[targetLocation])
        locations.splice(targetLocation, 1)
        targetLocation = Math.floor(Math.random() * 10)
    }
}

function guessedCorrectly(){

}

function makePointsVisible(){
    for (let i = 0; i < masterLocations.length; i++){
        var name = masterLocations[i].name
        var lattitude = masterLocations[i].lattitude
        var longitude = masterLocations[i].longitude
        marker = new google.maps.Marker({position: {lat:lattitude, lng:longitude}, map:gMap, title: name});
        marker.setVisible(true)
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
    var zoomLevel = gMap.getZoom()
    var inBounds = false;

    if (dataFetchStatus){
        // Check if target location is in the currently displayed map
        if (gMap.getBounds().contains({lat:locations[targetLocation].lattitude, lng:locations[targetLocation].longitude})) {
            inBounds = true;
        }
        //this block will give hints 
        if (inBounds == false || (zoomLevel >= 0 && zoomLevel <= 3)){
            console.log("Freezing Cold")
        }else{
            if(inBounds == true && zoomLevel >= 4 && zoomLevel <= 6){
                console.log("Warmer")
            }else{
                if(inBounds == true && zoomLevel >= 7 && zoomLevel <= 8){
                    console.log("Very Warm")
                }else{
                    if(inBounds == true && zoomLevel >= 9){
                        console.log("RED HOT")
                    }
                }
            }
        }
        console.log("inBounds: "+inBounds+ " zoomLevel: "+zoomLevel);
    }
}