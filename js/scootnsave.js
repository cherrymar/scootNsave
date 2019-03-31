let map
function initMap() {
    map = new google.maps.Map(document.querySelector('#map'), {
        center: { lat: 34.0522, lng: -118.2437 },
        zoom: 16,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false
    });


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onLocate, onLocateErr);
    }
    else {
        onLocateErr()
    }
}

function onLocate() {
    navigator.geolocation.watchPosition( setLocation, onLocateErr, {
        timeout: 1500
    })    
}
function onLocateErr() {
    handleLocationError(map.getCenter())
}
const markers = []

function clrMarkers() {
    for(let m of markers) {
        m.setMap(null)
    }
    markers.length = 0
}
let lat = 0
let long = 0
function setLocation(pos) {
    console.log(pos)
    lat = pos.coords.latitude
    long = pos.coords.longitude


    getNearest(lat, long).then((closeBy) => {
        clrMarkers()

        let counter = 0

        for(let m in closeBy) {
            console.log(m)
            let marker = new google.maps.Marker({
                position: {
                    lat: m.lat,
                    lng: m.long
                },
                map: map,
                title: m.type
            })
            markers.push(marker)
            let childNode

            if (counter < 5){
                let dist = measure(lat, long, m.lat, m.long)
                childNode = document.querySelector("#nearest").childNodes[counter]
                nearest.style.display = "block"
                nearest.childNodes[3].textContent = "Rack" + counter + '\t' + dist + "m"
            }
            counter++
        }

        // show "no bikes found", hide list
        if (counter == 0){
            document.querySelector("#nearest404").style.display = "block";
            document.querySelector("#nearest").style.display = "none";
        
        // hide "no bikes found", show list
        } else {
            document.querySelector("#nearest404").style.display = "none";
            document.querySelector("#nearest").style.display = "block";
        }
        while (counter < 5){
            document.querySelector("#nearest").childNodes[counter].style.display = "none"
            counter++
        }

        //draw self
        var p = {
            lat: lat,
            lng: long
        }
        let marker = new google.maps.Marker({
            position: p,
            map: map,
            title: 'You are here'
        })
        markers.push(marker)
        //console.log(pos)
        map.setCenter(p);
    })
}

function handleLocationError(pos) {
    infoWindow = new google.maps.InfoWindow()
    infoWindow.setPosition(pos);
    infoWindow.setContent('<div class="info">Error</div>');
    infoWindow.open(map);
}

function onPark() {
    stop(lat, long).then(r => {
        r.text().then(s => {       
            let park = document.querySelector('#parkbutton')
            park.textContent = s
            park.className = 'button disabled-button'
            park.classList.add(r.ok ? 'good-park' : 'bad-park')
            park.onclick = () => {}         
            park.href = "#"
        })
    })
}

function measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000; // meters
}