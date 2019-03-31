let map
function initMap() {
    map = new google.maps.Map(document.querySelector('#map'), {
        center: { lat: 34.0522, lng: -118.2437 },
        zoom: 16
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