var gMap;

function initApplication(){
    console.log("Map Mania Lite - Starting!")
    start()
}

async function start(){
    try{
        const response = await fetch("/send")
        const data = await response.json()
        mapPoints(data)
    }catch(e){
        console.log("There was a problem fetching data.")
    }
}

function mapPoints(data){
    var jsonArray = Object.values(data.places)
    for (let i = 0; i < jsonArray.length; i++){
        var name = jsonArray[i].name
        var lattitude = jsonArray[i].lattitude
        var longitude = jsonArray[i].longitude
        new google.maps.Marker({position: {lat:lattitude, lng:longitude}, map:gMap, title: name});
    }
}

function initMap() {
    gMap = new google.maps.Map(document.getElementById("myMapID"), {
      center: { lat: 39.8283, lng: -98.5795 }, //geographic center of US
      zoom: 6,
    });

    // Note that several message boards suggested using 'idle' instead of 'bounds_changed' because 
    // 'bounds_changed' gets called over and over when the user drags the map.
    google.maps.event.addListener(gMap, 'idle', function() {
        updateGame()
    });
  }

function updateGame() {
    console.log('function UpdateGame()');
    var zoomLevel = gMap.getZoom()
    var inBounds = false;

    // Check if Phoenix is in the currently displayed map
    if (gMap.getBounds().contains({lat:33.4484, lng:-112.0740})) {
        inBounds = true;
    }

    console.log("inBounds:"+inBounds+" zoomLevel:"+zoomLevel);
}
  