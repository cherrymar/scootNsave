const API_ROOT = 'http://127.0.0.1:3000/'

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