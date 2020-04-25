const { ipcRenderer } = require('electron');
let sensorLocations = [];

document.getElementById('gotoPreviousPage').addEventListener('click', () => {
    ipcRenderer.send('gotoAacTacoptionPage');
    // console.log('window button clicked');
});

let i = 6;

function showMap() {
    // console.log('uuguih');
    let sensorLocations = setLocation(i);
    let s = JSON.stringify(sensorLocations);
    // console.log("fsf", s);
    ipcRenderer.send('gotomapchoosePage');

    // // console.log('window button clicked');
}

function setLocation(n) {
    // console.log(n);
    // console.log('setting location');
    let sensorLat = [];
    let sensorLon = [];

    for (let i = 1; i <= n; i++) {
        let x = document.getElementById('sensorLat'+i).value;
        sensorLat.push (document.getElementById('sensorLat' + i).value);
        sensorLon.push(document.getElementById('sensorLon' + i).value);
    }

    for(let j = 0;j<sensorLat.length; j++){
        sensorLocations.push({
            lat: sensorLat[j],
            lng: sensorLon[j]
        });
    }

    // console.log('sensor loca',sensorLocations);

    localStorage.setItem("sensorData", JSON.stringify(sensorLocations));
    return sensorLocations;
}


function setLatLng() {
    console.log("on-page-load");

    let sensorData = JSON.parse(localStorage.getItem("sensorData"));
    console.log("sensordata",sensorData,sensorData.length);


    if(sensorData) {
        for (let i = 0; i < sensorData.length; i++) {
             console.log("okkk");

             
            document.getElementById('sensorLat'+(i+1)).value = sensorData[i].lat;
            document.getElementById('sensorLon'+(i+1)).value = sensorData[i].lng;
            // console.log(document.getElementById('sensorLat'+i).value);
            // console.log( document.getElementById('sensorLon'+i).value);
            
           
        }
    }
    
}