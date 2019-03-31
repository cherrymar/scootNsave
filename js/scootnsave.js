var getPosition = function (options) {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
}

function timeout(ms, promise) {
    return new Promise(function (resolve, reject) {
        // create a timeout to reject promise if not resolved
        var timer = setTimeout(function () {
            reject(new Error("promise timeout"));
        }, ms);

        promise
            .then(function (res) {
                clearTimeout(timer);
                resolve(res);
            })
            .catch(function (err) {
                clearTimeout(timer);
                reject(err);
            });
    });
}

let map
function initMap() {
    map = new google.maps.Map(document.querySelector('#map'), {
        // defaults to center of LA
        center: { lat: 34.0522, lng: -118.2437 },
        zoom: 16,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false
    });

    timeout(3000, getPosition()
    .then(navigator.geolocation.getCurrentPosition(onLocate, onLocateErr))
    .catch(onLocateErr))
    .then(navigator.geolocation.getCurrentPosition(onLocate, onLocateErr)) // not sure if this line is necessary
    .catch(onLocateErr)
}

function onLocate() {
    navigator.geolocation.watchPosition(setLocation, onLocateErr, {
        timeout: 1500
    })
}

function onLocateErr() {
    handleLocationError(map.getCenter())
}

const markers = []

function clrMarkers() {
    for (let m of markers) {
        m.setMap(null)
    }
    markers.length = 0
}

let lat = 0
let long = 0
const markerImg = 'https://raw.githubusercontent.com/cherrymar/scootNsave/master/SnS_logo_resize.png'
function setLocation(pos) {
    lat = pos.coords.latitude
    long = pos.coords.longitude

    getNearest(lat, long).then((closeBy) => {
        clrMarkers()

        let counter = 0
        let nearest404 = document.querySelector("#nearest404")
        let nearest = document.querySelector("#nearest")

        for (let m of closeBy) {
            // places marker at each nearby bike rack
            let marker = new google.maps.Marker({
                position: {
                    lat: m.pos.lat,
                    lng: m.pos.long
                },
                map: map,
                title: m.type,
                label: 'P'
            })
            markers.push(marker)
            let childNode

            // Adds to list
            if (counter < 5) {
                const havershim = measure(lat, long, m.pos.lat, m.pos.long)
                let dist = Math.round(havershim)
                childNode = nearest.childNodes[2 * counter + 1]
                flex(childNode)
                childNode.childNodes[5].textContent = dist + " m away"
            }
            counter++
        }

        // show "no bikes found", hide list
        if (counter == 0) {
            show(nearest404)
            hide(nearest)

        // hide "no bikes found", show list
        } else {
            hide(nearest404)
            show(nearest)
        }
        while (counter < 5) {
            hide(nearest.childNodes[2 * counter + 1])
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
        map.setCenter(p)
    })
}

function handleLocationError(pos) {
    infoWindow = new google.maps.InfoWindow()
    infoWindow.setPosition(pos);
    infoWindow.setContent('Error: Cannot Get Location');
    infoWindow.open(map);
}

function onPark() {
    stop(lat, long).then(r => {
        r.text().then(s => {
            let park = document.querySelector('#parkbutton')
            park.textContent = s
            park.className = 'button disabled-button'
            park.classList.add(r.ok ? 'good-park' : 'bad-park')
            park.onclick = () => { }
            park.href = "#"
        })
    })
}

function flex(element) {
    element.style.display = "flex"
}

function show(element) {
    element.style.display = "block"
}

function hide(element) {
    element.style.display = "none"
}

function measure(lat1, lon1, lat2, lon2) {  // haversine formula
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d * 1000; // meters
}