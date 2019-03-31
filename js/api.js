const API_ROOT = 'http://localhost:3000/'//'https://lahacks19-84.appspot.com/'

function getNearest(lat, long) {
    return new Promise((res, rej) => {
        fetch(API_ROOT+
            'nearest?lat='+lat+
            '&long='+long)
            .then(_ => _.json())
            .then(res)
            .catch(rej)
    })
}
function stop(lat, long) {
    return new Promise((res, rej) => {
        fetch(API_ROOT+
            'stop?lat='+lat+
            '&long='+long)
            .then(res)
            .catch(rej)
    })
}
function addStop(lat, long) {
    return new Promise((res, rej) => {
        fetch(API_ROOT+
            'addrack', {
                method: 'POST',
                body: JSON.stringify({
                    lat: lat,
                    long: long
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res)
            .catch(rej)
    })
}
function listBadStops() {
    return new Promise((res, rej) => {
        fetch(API_ROOT+
            'badstops')
            .then(res)
            .catch(rej)
    })
}
function getStops() {
    return new Promise((res, rej) => {
        fetch(API_ROOT+
            'stops')
            .then(res)
            .catch(rej)
    })
}
function getStats() {
    return new Promise((res, rej) => {
        fetch(API_ROOT+
            'stats')
            .then(res)
            .catch(rej)
    })
}