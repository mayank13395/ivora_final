const fs = require('fs');
const { ipcRenderer } = require('electron');
const chokidar = require('chokidar');
var classifyPoint = require("robust-point-in-polygon");
var iconSize = 20;
var sensorSize = 20;
let tempimgArray = [];

// #........................... called on page load ........................

function onInit() {
  getSensorLocationAndShow();      // sensor loacations to show
  getActivityDetailsAndShow();     // activitydetais to show
  getSensorHealthAndShow();        // sensorhealth status check
  updatingDataOnChange();

}

// #..............................Matlab output data change listner ........................

function updatingDataOnChange() {
 
  let pathTOWatch = 'C:/ivoradatafiles/output';
  // let fileNametoWatch = ["activitydetails", "systemhealth"];
 const watcher = chokidar.watch(pathTOWatch, {
    persistent: true
  });
 watcher.on('change', (path, stats) => {
   console.log("path-changed",path);
   
    if (stats) {
      console.log("path", path);

      if (path.includes("activitydetails")) {
        console.log("Activity details changed");

        getActivityDetailsAndShow();
      } else if (path.includes("systemhealth")) {
        console.log("Sensor Health changed");

        getSensorHealthAndShow();
      }

    }

  });


  watcher.on('add', path => console.log(`File ${path} has been added`)
  );

}

// #..............................Reading SensorLocation and displaying it ........................

function getSensorLocationAndShow() {

  let sonsorLocations = fs.readFileSync('C:/ivoradatafiles/input/map.txt', 'utf8');
  //  console.log(sonsorLocations);

  //  height: 320,
  //  width: 467
  let tempSensorLocationsArray = sonsorLocations.split('\n');
  // console.log(tempSensorLocationsArray);

  for (let i = 1; i < 7; i++) {

    let img = new Image(sensorSize * 2, sensorSize * 2);
    img.style.position = 'absolute';
    img.src = 'assets/sensorgif1.gif';
    let leftNow = +tempSensorLocationsArray[i + 2].split(" ")[0];
    let topNow = +tempSensorLocationsArray[i + 2].split(" ")[1];
    // console.log('marginsss',margintop,marginleft);
    img.style.left = leftNow;
    img.style.top = topNow;
    img.style.transform = "translate(-90%, -90%)";
    document.getElementById('bgg').appendChild(img);
    // console.log(document.getElementById('bgg'));
  }




}

// #..............................Reading ActivityDetails and displaying it ........................

function getActivityDetailsAndShow() {


  // removing previous activity image.............
  if (tempimgArray.length > 0) {
    console.log("okkkk", tempimgArray);

    for (let i = 0; i <= tempimgArray.length; i++) {
      if (document.getElementById("img" + i)) {
        document.getElementById("img" + i).remove();
      }

    }

    tempimgArray = [];
  }

  // reading activity data and show............

  let activityDetails = fs.readFileSync('C:/ivoradatafiles/output/activitydetails.txt', 'utf8');

  let keysToSearch = ["Footsteps", "FOOTSTEPS", "VEHICLE", "ANIMAL", "UNCLASSIFIED", "ACTIVITY"];

   if(activityDetails) {
    let allLines = activityDetails.split("\n");

    for (let i = 0; i < allLines.length; i++) {
  
      for (let j = 0; j < keysToSearch.length; j++) {
  
        if (allLines[i].includes(keysToSearch[j])) {
          let img = new Image(iconSize * 2, iconSize * 2);
          img.style.position = 'absolute';
          img.id = "img" + i;
          // img.src = `assets/activityicons/${keysToSearch[j].toLowerCase()}.png`;
          img.src = "assets/activityicons/" + keysToSearch[j].toLowerCase() + ".png";
          // console.log('src',img.src);
          let imagePosition = allLines[i].trim().split(keysToSearch[j])[1].match(/\S+/g);
          // console.log('imagePosition',imagePosition);
          let leftNow = imagePosition[0];
          let topNow = imagePosition[1];
          img.style.left = leftNow;
          img.style.top = topNow;
          // img.style.transform = "translate(-50%, -50%)";
          document.getElementById('bgg').appendChild(img);
          tempimgArray.push(img);
  
  
        }
      }
  
  
    }
   }




}


//  #..............................Reading sensorhealth and displaying it ........................

function getSensorHealthAndShow() {
  let sensorHealth = fs.readFileSync('C:/ivoradatafiles/output/systemhealth.txt', 'utf8');
  console.log(sensorHealth);

  let tempActivityObj = {};

  let keysToSearch = ["sensor 1", "sensor 2", "sensor 3", "sensor 4", "sensor 5", "sensor 6"];

  let allLines = sensorHealth.split("\n");
  console.log(allLines);
  for (let i = 0; i < allLines.length; i++) {

    for (let j = 0; j < keysToSearch.length; j++) {
      if (allLines[i].includes(keysToSearch[j].toUpperCase())) {
        let tempSensorStatus = allLines[i].trim().split(keysToSearch[j].toUpperCase())[1].match(/\S+/g);

        if (tempSensorStatus[0] === "ON") {
          document.getElementById(keysToSearch[j]).style.borderColor = 'green';
        } else {
          document.getElementById(keysToSearch[j]).style.borderColor = 'red';
        }




      }

    }





  }
}