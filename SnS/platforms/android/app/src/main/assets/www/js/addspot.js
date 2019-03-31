let lat = 34.0705
let long = -118.4468
let map
function initMap() {
    map = new google.maps.Map(document.querySelector('#map'), {
        // defaults to center of LA
        center: { lat: lat, lng: long },
        zoom: 16,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false
    });
    makeSpot()
}
function updateSpot() {
    console.log('updating spot')
    lat = parseFloat(document.querySelector('#lat').value)
    long = parseFloat(document.querySelector('#long').value)
    makeSpot()
}
let marker = null
function makeSpot() {
    if(marker) {
        marker.setMap(null)
    }
    const p = {
        lat: lat,
        lng: long
    }
    marker = new google.maps.Marker({
        position: p,
        map: map,
        title: "New Spot Location"
    })
    map.setCenter(p)
}
function createStop() {
    addStop(lat, long).then(_ => {
        alert('Thanks for suggesting a bicycle stop')
    })
}