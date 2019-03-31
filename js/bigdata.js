let lat = 34.0705
let long = -118.4468
const p = {
    lat: lat,
    lng: long
}
let knownMap;
let desiredMap;
function initMap() {
    knownMap = new google.maps.Map(document.querySelector('#known'), {
        // defaults to center of LA
        center: { lat: lat, lng: long },
        zoom: 16,
    });
    desiredMap = new google.maps.Map(document.querySelector('#desired'), {
        // defaults to center of LA
        center: { lat: lat, lng: long },
        zoom: 16,
    });
    knownMap.setCenter(p)
    desiredMap.setCenter(p)

    //stack up them API reqs
    getStats().then(_ => _.json()).then(stats => {
        console.log(stats)
        let sum = stats.good + stats.bad + stats.neutral
        if(!sum) {
            sum = 1
        }
        document.getElementById('goodStat').textContent = 'Good parkers: '+stats.good+' ('+Math.round(stats.good / sum * 100)+')%'
        document.getElementById('badStat').textContent = 'Bad parkers: '+stats.bad+' ('+Math.round(stats.bad / sum * 100)+')%'
        document.getElementById('neutralStat').textContent = 'Neutral parkers: '+stats.neutral+' ('+Math.round(stats.neutral / sum * 100)+')%'
    })
    listBadStops().then(_ => _.json()).then(res => {
        for(let m of res) {
            makeSpot(m.lat, m.long, desiredMap)
        }
    })
    getStops().then(_ => _.json()).then(res => {
        console.log(res)
        for(let m of res) {
            makeSpot(m.pos.lat, m.pos.long, desiredMap, m.stops)
        }
    })
}
function makeSpot(lat, long, map, text) {
    if(!text) {
        text = ''
    }
    const p = {
        lat: lat,
        lng: long
    }
    marker = new google.maps.Marker({
        position: p,
        map: map,
        title: text
    })
}