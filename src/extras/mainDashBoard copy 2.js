const fs = require('fs');
const { ipcRenderer } = require('electron');
var classifyPoint = require("robust-point-in-polygon");
var inside = require('point-in-polygon');
var slider = document.getElementById("myRange");
var iconSizeVal = document.getElementById("iconSize");
var outputIconImageVal = document.getElementById("iconVal");
var output = document.getElementById("demo");
output.innerHTML = slider.value;
let sensitivityValue;
let activityPositionsData;
let deadZoneAreaVal;
let assetZoneAreaVal;
let assetsElement = [];
let newPolyArray = [];
let hideShowDeadZoneVal = false;
let hideShowAssetZoneVal = false;
let activityName;
var polygonAssetZone = [];
let totalNumberofAssets;
let newPolygonDeadzone = [];
let polyArray = [];
let polyBoundingArray = [];
let newTempPolygonDeadzone;
var polygonDeadzone = [];
let assetsDeadZoneElement = [];
let iconSize = 50;
let deadzoneArrayToSend;
let deadZonePolygonArray = [];
let assetd1val =10;
let assetd2val =50;
let assetd3val =80;

var d1Valel = document.getElementById("d1Val");
var d2Valel = document.getElementById("d2Val");
var d3Valel = document.getElementById("d3Val");

 let d1ValtoShow =  document.getElementById("d1ValtoShow");
 let d2ValtoShow =  document.getElementById("d2ValtoShow");
 let d3ValtoShow =  document.getElementById("d3ValtoShow");
 


d1Valel.oninput = function () {

    assetd1val = this.value;
    d1ValtoShow.innerHTML = this.value;

}

d2Valel.oninput = function () {

    assetd2val = this.value;
    d2ValtoShow.innerHTML = this.value;

}

d3Valel.oninput = function () {

    assetd3val = this.value;
    d3ValtoShow.innerHTML = this.value;

}

slider.oninput = function () {

    sensitivityValue = this.value;
    output.innerHTML = this.value;

}

iconSizeVal.oninput = function () {

    iconSize = this.value;
    outputIconImageVal.innerHTML = this.value;

    for (let i = 0; i < assetsElement.length; i++) {
        assetsElement[i].img.width = iconSize;
        assetsElement[i].img.height = iconSize;
    }

    for (let i = 0; i < assetsDeadZoneElement.length; i++) {
        assetsDeadZoneElement[i].img.width = iconSize;
        assetsDeadZoneElement[i].img.height = iconSize;
    }

}

// change sensitivity data in txt file........................
function saveSensitivityData() {

    // // // // //  // // // // // console.log('ssfs');

    fs.writeFile("C:/ivoradatafiles/output/info.txt", `sensitivity ${sensitivityValue}`, function (err) {
        if (err) {
            return // // // // //  // // // // // console.log(err);
        }
        // // // // console.log("The file was saved!");
    });

}

// change icon size...................
function changeIconSize() {
    // // // // // console.log('calllleddd', assetsElement, iconSize);

    for (let i = 0; i < assetsElement.length; i++) {
        assetsElement[i].img.width = iconSize;
        assetsElement[i].img.height = iconSize;
    }

    for (let i = 0; i < assetsDeadZoneElement.length; i++) {
        assetsDeadZoneElement[i].img.width = iconSize;
        assetsDeadZoneElement[i].img.height = iconSize;
    }

}

// called on page load..................
function getActivityDataAndDisplay() {
    
    assetZoneAreaVal = JSON.parse(localStorage.getItem('assetzone'));
     // // // //  // // // // // console.log(assetZoneAreaVal);
    if(assetZoneAreaVal){

        var polygonAssetZone = [];
        for (let i = 0; i < assetZoneAreaVal.length - 1; i++) {
            polygonAssetZone.push([assetZoneAreaVal[i].x, assetZoneAreaVal[i].y]);
    
        }
        // //  // // // // // console.log(polygonAssetZone);
        var poly = [];
        for (let i = 0; i < assetZoneAreaVal.length - 1; i++) {
            poly.push(new Vector2(assetZoneAreaVal[i].x, assetZoneAreaVal[i].y))
    
        }

        {
            let c = document.getElementById("myCanvas");
            // // // // // //  // // // // // console.log(c);
    
            ctx = c.getContext("2d");
            // ctx.strokeStyle = 'green';
            ctx.beginPath();
            // ctx.translate(0.5, 0.5);
            // ctx.moveTo(0, 0);
    
    
            for (let i = 0; i < assetZoneAreaVal.length - 1; i++) {

    
    
                ctx.moveTo(assetZoneAreaVal[i].xVal, assetZoneAreaVal[i].yVal);
    
                ctx.lineTo(assetZoneAreaVal[i + 1].xVal, assetZoneAreaVal[i + 1].yVal);
                ctx.strokeStyle = 'blue';
    
                ctx.stroke();
            }
        }
    

        
    }
    
   

    deadZoneAreaVal = JSON.parse(localStorage.getItem('deadzone'));
    // // // //  // // // // // console.log(deadZoneAreaVal);

    let sensorLocationsForMap = JSON.parse(localStorage.getItem('sensorLocationPosition'));
    // // // // // console.log(sensorLocationsForMap);

    deadzoneArrayToSend = JSON.parse(localStorage.getItem('deadzoneArray'));
    if(deadzoneArrayToSend) {
        document.getElementById('hideshowbtn').disabled = false;
    }

    // // // // // console.log(deadzoneArrayToSend);
     let mapbounds = JSON.parse(localStorage.getItem('mapbounds'));
     // // // // console.log(mapbounds);
     var veticalFactor = 414.75/(mapbounds.lat0-mapbounds.lat1);
     var  horizontalFactor= 600/(mapbounds.lng0-mapbounds.lng1);
     // // // // console.log(veticalFactor,horizontalFactor);
     
     

         if(sensorLocationsForMap){
            let sensorLocationKeys = Object.keys(sensorLocationsForMap);
            for (let i = 0; i < sensorLocationKeys.length; i++) {
                let img = new Image(iconSize*2, iconSize*2);
                img.style.position = 'absolute';
                img.src = 'assets/sensorgif1.gif';

                


                let margintop = +sensorLocationsForMap[sensorLocationKeys[i]][0] * veticalFactor;
                let marginleft = +sensorLocationsForMap[sensorLocationKeys[i]][1] * horizontalFactor;
                // // // // // console.log('marginsss',marginbottom,margintop);
        
                img.style.marginTop =  margintop;
                img.style.marginLeft = marginleft;
                img.style.transform = "translate(-50%, -50%)";
                document.getElementById('bgg').appendChild(img);
        
            }
         }
  

    let xArray = [];
    let yArray = [];
    // if (deadZoneAreaVal.length != 0) {
    //     for (let i = 0; i < deadZoneAreaVal.length; i++) {
    //         // polygonDeadzone.push([deadZoneAreaVal[i].x, deadZoneAreaVal[i].y]);
    //         xArray.push(deadZoneAreaVal[i].x);
    //         yArray.push(deadZoneAreaVal[i].y);

    //     }

    // }
    //  // // // // // console.log(polygonDeadzone);


    // var minXDeadzone = Math.min(...xArray);
    // var maxXDeadzone = Math.max(...xArray);

    // var minYDeadzone = Math.min(...yArray);
    // var maxYDeadzone = Math.max(...yArray);

    // // // // //  // // // // // console.log('hhhhhhhhhhhhhhhhhhh', minXDeadzone, maxXDeadzone, minYDeadzone, maxYDeadzone);

    // let xassetsArray = [];
    // let yassetsArray = [];
    // if (assetZoneAreaVal.length != 0) {
    //     for (let i = 0; i < assetZoneAreaVal.length; i++) {
    //         xassetsArray.push(assetZoneAreaVal[i].x);
    //         yassetsArray.push(assetZoneAreaVal[i].y);
    //     }

    // }

    // let centerxPointOfMarkAssets = (Math.min(...xassetsArray) + Math.max(...xassetsArray)) / 2;
    // let centeryPointOfMarkAssets = (Math.min(...yassetsArray) + Math.max(...yassetsArray)) / 2;


   

    // changeAssetZoneArea();



    if(deadzoneArrayToSend){
        let deadZoneobjKeys = Object.keys(deadzoneArrayToSend);
        for (let i = 0; i < deadZoneobjKeys.length; i++) {
            let tempPolyarry = [];
            for (let j = 0; j < deadzoneArrayToSend[deadZoneobjKeys[i]].length; j++) {
                tempPolyarry.push([deadzoneArrayToSend[deadZoneobjKeys[i]][j].x, deadzoneArrayToSend[deadZoneobjKeys[i]][j].y]);
            }
            deadZonePolygonArray.push(tempPolyarry);
        }
         
    {
        let c = document.getElementById("myCanvas");
        // // // // // //  // // // // // console.log(c);

        ctx = c.getContext("2d");
        ctx.strokeStyle = 'red';

        for (let i = 0; i < deadZoneobjKeys.length; i++) {
            ctx.beginPath();
            for (let j = 0; j < deadzoneArrayToSend[deadZoneobjKeys[i]].length - 1; j++) {
                // // // // // console.log(deadzoneArrayToSend[deadZoneobjKeys[i]][j].xVal,deadzoneArrayToSend[deadZoneobjKeys[i]][j].yVal);
                // // // // // console.log(deadzoneArrayToSend[deadZoneobjKeys[i]][j+1].xVal,deadzoneArrayToSend[deadZoneobjKeys[i]][j+1].yVal);

                ctx.moveTo(deadzoneArrayToSend[deadZoneobjKeys[i]][j].xVal, deadzoneArrayToSend[deadZoneobjKeys[i]][j].yVal);
                ctx.lineTo(deadzoneArrayToSend[deadZoneobjKeys[i]][j + 1].xVal, deadzoneArrayToSend[deadZoneobjKeys[i]][j + 1].yVal);
                ctx.stroke();
            }

        }

    }
    }

    // // // // // console.log('deadZonePolygonArray', deadZonePolygonArray.length);
    // // // // // console.log(inside([119, 102], deadZonePolygonArray[0]));
    addAssets();

    // mark deadzones areas...................
      

    // {
    //     let c = document.getElementById("myCanvas");
    //     // // // // // //  // // // // // console.log(c);

    //     ctx = c.getContext("2d");
    //     ctx.strokeStyle = 'red';

    //     for (let i = 0; i < deadZoneobjKeys.length; i++) {
    //         ctx.beginPath();
    //         for (let j = 0; j < deadzoneArrayToSend[deadZoneobjKeys[i]].length - 1; j++) {
    //             // // // // // console.log(deadzoneArrayToSend[deadZoneobjKeys[i]][j].xVal,deadzoneArrayToSend[deadZoneobjKeys[i]][j].yVal);
    //             // // // // // console.log(deadzoneArrayToSend[deadZoneobjKeys[i]][j+1].xVal,deadzoneArrayToSend[deadZoneobjKeys[i]][j+1].yVal);

    //             ctx.moveTo(deadzoneArrayToSend[deadZoneobjKeys[i]][j].xVal, deadzoneArrayToSend[deadZoneobjKeys[i]][j].yVal);
    //             ctx.lineTo(deadzoneArrayToSend[deadZoneobjKeys[i]][j + 1].xVal, deadzoneArrayToSend[deadZoneobjKeys[i]][j + 1].yVal);
    //             ctx.stroke();
    //         }

    //     }

    // }

    // {
    //     let c = document.getElementById("myCanvas");
    //     // // // // // //  // // // // // console.log(c);

    //     ctx = c.getContext("2d");
    //     // ctx.strokeStyle = 'green';
    //     ctx.beginPath();
    //     // ctx.translate(0.5, 0.5);
    //     // ctx.moveTo(0, 0);


    //     for (let i = 0; i < assetZoneAreaVal.length - 1; i++) {


    //         ctx.moveTo(assetZoneAreaVal[i].xVal, assetZoneAreaVal[i].yVal);

    //         ctx.lineTo(assetZoneAreaVal[i + 1].xVal, assetZoneAreaVal[i + 1].yVal);
    //         ctx.strokeStyle = 'blue';

    //         ctx.stroke();
    //     }
    // }


    // let deadZoneText = document.createElement('div');
    // deadZoneText.id = 'deadZoneText';
    // deadZoneText.style.position = "absolute";
    // let xpix = (minXDeadzone + maxXDeadzone) / 2 - 30;
    // // // // //  // // // // // console.log(xpix);


    // deadZoneText.style.marginLeft = xpix + "px";
    // deadZoneText.style.marginTop = (minYDeadzone + maxYDeadzone) / 2 + "px";
    // deadZoneText.innerText = 'DEADZONE';
    // deadZoneText.style.color = 'green';

    // document.getElementById('bgg').appendChild(deadZoneText);
    // // // //  // // // // // console.log(deadZoneText);

    checkForSensorHealth();

}


// change assetzone area..............
// function changeAssetzone() {
//     // // // // // console.log('calllleddd', assetsElement, iconSize);
//       changeAssetZoneArea();
// }

// event listener...................

document.getElementById('gotolatlngPage').addEventListener('click', () => {
    ipcRenderer.send('gotolatlngEntryPage');
    //  // // // console.log('going to lat lng page');
});




// event listener..............
document.getElementById('gotoMarkAssetZonePage').addEventListener('click', () => {
    ipcRenderer.send('gotoMarkAssetZonePage');
    // // // // //  // // // // // console.log('window button clicked');
});

// check sensor health data i.e, active or not.............
function checkForSensorHealth() {
    var sensorHealthData = fs.readFileSync('C:/ivoradatafiles/output/systemhealth.txt', 'utf8');
    if(sensorHealthData){
    setTimeout(() => {

        
        // // // // //  // // // // // console.log(sensorHealthData);
        
            let sensorHealthArray = sensorHealthData.split('\n');
            //  // // // // //  // // // // // console.log(sensorHealthArray);
    
            let sensorHealth = {};
            let data = [];
    
            for (let i = 0; i < sensorHealthArray.length; i++) {
                if (sensorHealthArray[i].includes('SENSOR 1')) {
    
                    // // // // //  // // // // // console.log('s1', sensorHealthArray[i]);
                    sensorHealth['s1'] = sensorHealthArray[i].split('1')[1];
    
                    if (sensorHealth.s1.split(' ')[1] === 'ON') {
                        document.getElementById('s1').style.borderColor = 'green';
                        // document.getElementById('s1').className = 'Blink';
    
                    } else {
                        document.getElementById('s1').style.borderColor = 'red';
                        // document.getElementById('s1').className = 'Blink';
    
                    }
    
                    if (sensorHealth.s1.split(' ')[2] === 'FALSE') {
    
                    }
    
    
                } else if (sensorHealthArray[i].includes('SENSOR 2')) {
    
                    // // // // //  // // // // // console.log('s2', sensorHealthArray[i]);
                    sensorHealth['s2'] = sensorHealthArray[i].split('2')[1];
    
                    if (sensorHealth.s2.split(' ')[1] === 'ON') {
                        document.getElementById('s2').style.borderColor = 'green';
                        // document.getElementById('s2').className = 'Blink';
    
                    } else {
                        document.getElementById('s2').style.borderColor = 'red';
                        // document.getElementById('s2').className = 'Blink';
    
                    }
    
                    if (sensorHealth.s2.split(' ')[2] === 'FALSE') {
    
                    }
    
    
                } else if (sensorHealthArray[i].includes('SENSOR 3')) {
    
                    // // // // //  // // // // // console.log('s3', sensorHealthArray[i]);
                    sensorHealth['s3'] = sensorHealthArray[i].split('3')[1];
                    // // // // // //  // // // // // console.log(sensorHealth.s1.split(' '));
    
                    if (sensorHealth.s3.split(' ')[1] === 'ON') {
                        document.getElementById('s3').style.borderColor = 'green';
                        // document.getElementById('s3').className = 'Blink'
    
                    } else {
                        document.getElementById('s3').style.borderColor = 'red';
                        // document.getElementById('s3').className = 'Blink';
    
    
                    }
    
                    if (sensorHealth.s1.split(' ')[2] === 'FALSE') {
    
                    }
    
    
                } else if (sensorHealthArray[i].includes('SENSOR 4')) {
    
                    // // // // //  // // // // // console.log('s4', sensorHealthArray[i]);
                    sensorHealth['s4'] = sensorHealthArray[i].split('4')[1];
                    if (sensorHealth.s4.split(' ')[1] === 'ON') {
                        document.getElementById('s4').style.borderColor = 'green';
                        // document.getElementById('s4').className = 'Blink';
    
                    } else {
                        document.getElementById('s4').style.borderColor = 'red';
                        // document.getElementById('s4').className = 'Blink';
    
                    }
    
                    if (sensorHealth.s4.split(' ')[2] === 'FALSE') {
    
                    }
    
    
                } else if (sensorHealthArray[i].includes('SENSOR 5')) {
    
                    // // // // //  // // // // // console.log('s5', sensorHealthArray[i]);
                    sensorHealth['s5'] = sensorHealthArray[i].split('5')[1];
                    // // // // // //  // // // // // console.log(sensorHealth.s1.split(' '));
    
                    if (sensorHealth.s5.split(' ')[1] === 'ON') {
                        document.getElementById('s5').style.borderColor = 'green';
                        // document.getElementById('s5').className = 'Blink';
    
                    } else {
                        document.getElementById('s5').style.borderColor = 'red';
                        // document.getElementById('s5').className = 'Blink';
    
                    }
    
                    if (sensorHealth.s5.split(' ')[2] === 'FALSE') {
    
                    }
    
    
    
    
                } else if (sensorHealthArray[i].includes('SENSOR 6')) {
    
                    // // // // //  // // // // // console.log('s6', sensorHealthArray[i]);
                    sensorHealth['s6'] = sensorHealthArray[i].split('6')[1];
                    if (sensorHealth.s6.split(' ')[1] === 'ON') {
                        document.getElementById('s6').style.borderColor = 'green';
                        document.getElementById('s6').className = 'Blink';
    
                    } else {
                        document.getElementById('s6').style.borderColor = 'red';
                        document.getElementById('s6').className = 'Blink';
    
                    }
    
                    if (sensorHealth.s6.split(' ')[2] === 'FALSE') {
    
                    }
    
    
    
                } else {
                    // // // // //  // // // // // console.log(sensorHealthArray[i]);
    
                    data.push(sensorHealthArray[i]);
                    sensorHealth['others'] = data;
    
    
    
                }
    
    
            }

        
     

        // // // // //  // // // // // console.log(sensorHealth);
        document.getElementById('systemBattery').innerText = "        " + sensorHealth.others[0].split(' ')[2];
        document.getElementById('cpuTemp').innerText = "  " + sensorHealth.others[1].split(' ')[2];
        document.getElementById('systemTemp').innerText = " " + sensorHealth.others[2].split(' ')[2];
        document.getElementById('cpuCoreVoltage').innerText = " " + sensorHealth.others[3].split(' ')[3];

    }, 2000);
}

}

// goto markdeadzone.html page....................

function gotoMarkDeadZonePage() {
 
    ipcRenderer.send('gotoMarkDeadZonePage');
};

// add assets image to the screen..................
function addAssets() {
    let imgId = 1;


    for(let i = 0; i<assetsElement.length;i++){
        document.getElementById(assetsElement[i].img.id).remove()
    }

    //  // // // // console.log('oksdad');
    //  // // // // // console.log(hideShowDeadZoneVal);
    assetsElement = [];
    // // // // // console.log(deadZonePolygonArray, deadZonePolygonArray.length);
    activityPositionsData = JSON.parse(localStorage.getItem('activityPositionsData'));
    if(activityPositionsData){
        // // // // console.log('okkk',activityPositionsData);
        
    // // // // // console.log(activityPositionsData);
    activityName = Object.keys(activityPositionsData);
    // // // // //  // // // // // console.log(activityPositionsData.VEHICLE.length);
    // document.createElement = 
    totalNumberofAssets = 0;
    // // console.log(newPolyArray);

    
    for (let i = 0; i < activityName.length; i++) {

        if (activityName[i] === 'ACTIVITY') {
            for (let k = 0; k < activityPositionsData.ACTIVITY.length; k++) {
                totalNumberofAssets++;

                let x = +activityPositionsData.ACTIVITY[k].split(' ')[1];
                let y = +activityPositionsData.ACTIVITY[k].split(' ')[2];
                let checkpoint = false;
                // // // // console.log(x, y);
  
                if(deadZonePolygonArray.length>0){
                    // // // // console.log('deadzonepolygonarray',deadZonePolygonArray);
                    
                    for (let l = 0; l < deadZonePolygonArray.length; l++) {
                        if (inside([x, y], deadZonePolygonArray[l])) {
                            checkpoint = true;
                            // // // // console.log('qqqqqqAAAAAAAAAAAq');
                            break;
                        }
                    }
                }
          
                if (!checkpoint || hideShowDeadZoneVal == true) {

                    let img = new Image(iconSize, iconSize);

                    if(newPolyArray.length>0){

                        if ((inside([x, y], newPolyArray[0])) == true ){
                            img.src = "assets/icons/LocationPopup.png";

                            // // // console.log('aaaaaaaaaaaaa',img);
                            // // // console.log(newPolyArray[0]);
                            

                            
                        }else
                        if ((inside([x, y], newPolyArray[0])) == false && (inside([x, y], newPolyArray[1])) == true) {
                            img.src = "assets/icons/LocationPopup.png";
                            // // // console.log('inside first region');
                            
    
                        } else if ((inside([x, y], newPolyArray[1])) == false && (inside([x, y], newPolyArray[2])) == true) {
                            img.src = "assets/icons/LocationPopup.png";
                            //  // // // // // console.log('second zone');
    
                        } else if ((inside([x, y], newPolyArray[2])) == false && (inside([x, y], newPolyArray[3])) == true) {
                            img.src = "assets/icons/LocationPopup.png";
                            
    
                        } else {
                            img.src = "assets/icons/LocationPopup.png";
                        }
                    }else {
                        img.src = "assets/icons/LocationPopup.png";
                    }
                   
                    // img.src = "https://img.icons8.com/officel/16/000000/human-head.png";
                    img.style.position = 'absolute';
                    img.className = 'Blink';
                    img.style.marginLeft = +activityPositionsData.ACTIVITY[k].split(' ')[1];
                    img.style.marginTop = +activityPositionsData.ACTIVITY[k].split(' ')[2];
                    img.style.transform = "translate(-50%, -50%)";
                    img.id = 'img'+imgId;
                    imgId++;

                    assetsElement.push({
                        img,
                        x,
                        y
                    });
                    // document.getElementById('bgg').appendChild(img);
                }

            }

        } else if (activityName[i] === 'FOOTSTEPS') {
            for (let k = 0; k < activityPositionsData.FOOTSTEPS.length; k++) {
                totalNumberofAssets++;
                let x = +activityPositionsData.FOOTSTEPS[k].split(' ')[1];
                let y = +activityPositionsData.FOOTSTEPS[k].split(' ')[2];
                // // // // console.log(x, y);

                let checkpoint = false;
                if(deadZonePolygonArray){
                    for (let l = 0; l < deadZonePolygonArray.length; l++) {
                        if (inside([x, y], deadZonePolygonArray[l]) == true) {
                            checkpoint = true;
                            // // // // console.log('qqqqqqfootq');
                            break;
                        }
                    }
                }
               

                if (!checkpoint || hideShowDeadZoneVal == true) {
                    let img = new Image(iconSize*0.6, iconSize*0.6);
                    if(newPolyArray.length>0){
                        // // // console.log('newPolyArrayyyyyyyyyyyyyyyyyyyyyyyyyyyy',newPolyArray);
                        if ((inside([x, y], newPolyArray[0])) == true ){
                            img.src = "assets/icons/Man/ManRed.png";
                            // // console.log('inside region',img);
                            // // // console.log(newPolyArray[0]);

                       
                        }else  if ((inside([x, y], newPolyArray[0])) == false && (inside([x, y], newPolyArray[1])) == true) {
                            img.src = "assets/icons/Man/ManRed.png";
                            // // console.log('inside first region',img);
                            
    
                        } else if ((inside([x, y], newPolyArray[1])) == false && (inside([x, y], newPolyArray[2])) == true) {
                            img.src = "assets/icons/Man/ManOrange.png";
                             // // console.log('second zone',img);
    
    
                        } else if ((inside([x, y], newPolyArray[2])) == false && (inside([x, y], newPolyArray[3])) == true) {
                            img.src = "assets/icons/Man/ManYellow.png";
                            // // console.log('inside third region',img);
                               
                        } else {
                            img.src = "assets/icons/Man/ManYellow.png";
                        }

                    }else{
                        img.src = "assets/icons/Man/ManYellow.png";
                    }
                  
                    // img.src = "https://img.icons8.com/android/24/000000/left-footprint.png";
                    img.style.position = 'absolute';
                    img.className = 'Blink';
                    img.style.marginLeft = +activityPositionsData.FOOTSTEPS[k].split(' ')[1];
                    img.style.marginTop = +activityPositionsData.FOOTSTEPS[k].split(' ')[2];
                    img.style.transform = "translate(-50%, -50%)";
                    img.id = 'img'+imgId;
                    imgId++;
                    assetsElement.push({
                        img,
                        x,
                        y
                    });
                    // document.getElementById('bgg').appendChild(img);
                }
            }

        } else if (activityName[i] === 'VEHICLE') {
            
            for (let k = 0; k < activityPositionsData.VEHICLE.length; k++) {
                totalNumberofAssets++;
                let x = +activityPositionsData.VEHICLE[k].split(' ')[1];
                let y = +activityPositionsData.VEHICLE[k].split(' ')[2];

                let checkpoint = false;
                for (let l = 0; l < deadZonePolygonArray.length; l++) {
                    if (inside([x, y], deadZonePolygonArray[l]) === true) {
                        checkpoint = true;
                        // // // // console.log('qqqqqqqvehi');
                        break;
                    }
                }

                if (!checkpoint || hideShowDeadZoneVal == true) {
                    // // // // //  // // // // // console.log('1111111111111111');
                    let img = new Image(iconSize, iconSize);

                    if(newPolyArray.length>0){

                        if ((inside([x, y], newPolyArray[0])) == true ){
                            img.src = "assets/icons/Truck/truckRed.png";

                            // // // console.log('aaaaaaaaaaaaa',img);
                            // // // console.log(newPolyArray[0]);
                       
                        }else   

                    if ((inside([x, y], newPolyArray[0])) == false && (inside([x, y], newPolyArray[1])) == true) {
                        img.src = "assets/icons/Truck/truckRed.png";

                    } else if ((inside([x, y], newPolyArray[1])) == false && (inside([x, y], newPolyArray[2])) == true) {
                        img.src = "assets/icons/Truck/TruckOrange.png";
                        // //  // // // // // console.log('second zone');


                    } else if ((inside([x, y], newPolyArray[2])) == false && (inside([x, y], newPolyArray[3])) == true) {
                        img.src = "assets/icons/Truck/TruckYellow.png";

                    } else {
                        img.src = "assets/icons/Truck/TruckYellow.png";
                    }
                }else {
                    img.src = "assets/icons/Truck/TruckYellow.png";
                }
                    // <div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/"             title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/"             title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
                    // img.src = "https://img.icons8.com/dotty/400/000000/half-track-vehicle.png";
                    img.style.position = 'absolute';
                    img.className = 'Blink';
                    img.style.marginLeft = +activityPositionsData.VEHICLE[k].split(' ')[1];
                    img.style.marginTop = +activityPositionsData.VEHICLE[k].split(' ')[2];
                    img.style.transform = "translate(-50%, -50%)";
                    img.id = 'img'+imgId;
                    imgId++;
                    assetsElement.push({
                        img,
                        x,
                        y
                    });
                    // document.getElementById('bgg').appendChild(img);
                }

            }

        } else if (activityName[i] === 'ANIMAL') {
            for (let k = 0; k < activityPositionsData.ANIMAL.length; k++) {
                totalNumberofAssets++;
                let x = +activityPositionsData.ANIMAL[k].split(' ')[1];
                let y = +activityPositionsData.ANIMAL[k].split(' ')[2];

                let checkpoint = false;
                for (let l = 0; l < deadZonePolygonArray.length; l++) {
                    if (inside([x, y], deadZonePolygonArray[l]) === true) {
                        checkpoint = true;
                        // // // // console.log('qqqqqqAAAAq');
                        break;
                    }
                }

                if (!checkpoint || hideShowDeadZoneVal == true) {
                    //  // // // // // console.log('okkkk');

                    let img = new Image(iconSize, iconSize);

                    if(newPolyArray.length>0){
                        if ((inside([x, y], newPolyArray[0])) == true ){
                            img.src = "assets/icons/animal/animalRed.png";

                            // // // console.log('aaaaaaaaaaaaa',img);
                            // // // console.log(newPolyArray[0]);
                            
                        }else
                        if ((inside([x, y], newPolyArray[0])) == false && (inside([x, y], newPolyArray[1])) == true) {
                            img.src = "assets/icons/animal/animalRed.png";
    
                        } else if ((inside([x, y], newPolyArray[1])) == false && (inside([x, y], newPolyArray[2])) == true) {
                            img.src = "assets/icons/animal/animalRed.png";
                            // //  // // // // // console.log('second zone');
    
    
                        } else if ((inside([x, y], newPolyArray[2])) == false && (inside([x, y], newPolyArray[3])) == true) {
                            img.src = "assets/icons/animal/animalRed.png";
    
                        } else {
                            img.src = "assets/icons/animal/animalRed.png";
                        }
                    }else {
                        img.src = "assets/icons/animal/animalRed.png";
                    }
                
                    // img.src = "https://img.icons8.com/color/48/000000/lion.png";
                    img.style.position = 'absolute';
                    img.className = 'Blink';
                    img.style.marginLeft = +activityPositionsData.ANIMAL[k].split(' ')[1];
                    img.style.marginTop = +activityPositionsData.ANIMAL[k].split(' ')[2];
                    img.style.transform = "translate(-50%, -50%)";
                    img.id = 'img'+imgId;
                    imgId++;
                    assetsElement.push({
                        img,
                        x,
                        y
                    });
                    // document.getElementById('bgg').appendChild(img);
                }

            }

        } else if (activityName[i] === 'UNCLASSIFIED') {
            for (let k = 0; k < activityPositionsData.UNCLASSIFIED.length; k++) {
                totalNumberofAssets++;
                let x = +activityPositionsData.UNCLASSIFIED[k].split(' ')[1];
                let y = +activityPositionsData.UNCLASSIFIED[k].split(' ')[2];

                let checkpoint = false;
                for (let l = 0; l < deadZonePolygonArray.length; l++) {
                    if (inside([x, y], deadZonePolygonArray[l]) === true) {
                        checkpoint = true;
                        // // // // console.log('qqqqqqq');

                        break;
                    }
                }

                if (!checkpoint || hideShowDeadZoneVal == true) {

                    let img = new Image(iconSize*0.3, iconSize*0.3);
                   
                    img.src = "assets/icons/question.png";
                    img.style.position = 'absolute';
                    img.className = 'Blink';
                    img.style.marginLeft = +activityPositionsData.UNCLASSIFIED[k].split(' ')[1];
                    img.style.marginTop = +activityPositionsData.UNCLASSIFIED[k].split(' ')[2];
                    img.style.transform = "translate(-50%, -50%)";
                    img.id = 'img'+imgId;
                    imgId++;
                    assetsElement.push({
                        img,
                        x,
                        y
                    });
                    // document.getElementById('bgg').appendChild(img);
                }

            }

        } else if (activityName[i] === 'TUNNEL') {
            // //  // // // // // console.log('tunnel');

            for (let k = 0; k < activityPositionsData.TUNNEL.length; k++) {
                totalNumberofAssets++;
                let x = +activityPositionsData.TUNNEL[k].split(' ')[1];
                let y = +activityPositionsData.TUNNEL[k].split(' ')[2];

                let checkpoint = false;
                for (let l = 0; l < deadZonePolygonArray.length; l++) {
                    if (inside([x, y], deadZonePolygonArray[l]) === true) {
                        checkpoint = true;
                        break;
                    }
                }

                if (!checkpoint || hideShowDeadZoneVal == true) {
                    let img = new Image(iconSize *0.5, iconSize *0.5);
                 if(newPolyArray.length>0){

                    if ((inside([x, y], newPolyArray[0])) == true ){
                        img.src = "assets/icons/tunnel.png";

                        // // // console.log('aaaaaaaaaaaaa',img);
                        // // // console.log(newPolyArray[0]);
                        

                        
                    }else
                        if ((inside([x, y], newPolyArray[0])) == false && (inside([x, y], newPolyArray[1])) == true) {
                            img.src = "assets/icons/tunnel.png";
    
                        } else if ((inside([x, y], newPolyArray[1])) == false && (inside([x, y], newPolyArray[2])) == true) {
                            img.src = "assets/icons/tunnel.png";
                            // //  // // // // // console.log('second zone');
    
                        } else if ((inside([x, y], newPolyArray[2])) == false && (inside([x, y], newPolyArray[3])) == true) {
                            img.src = "assets/icons/tunnel.png";
    
                        } else {
                            img.src = "assets/icons/tunnel.png";
                        }
                    }else {
                        img.src = "assets/icons/tunnel.png";
                    }
                   
                    // img.src = "https://img.icons8.com/android/24/000000/left-footprint.png";
                    img.style.position = 'absolute';
                    img.className = 'Blink';
                    img.style.marginLeft = +activityPositionsData.TUNNEL[k].split(' ')[1];
                    img.style.marginTop = +activityPositionsData.TUNNEL[k].split(' ')[2];
                    img.style.transform = "translate(-50%, -50%)";
                    img.id = 'img'+imgId;
                    imgId++;
                    assetsElement.push({
                        img,
                        x,
                        y
                    });
                    // document.getElementById('bgg').appendChild(img);
                }

            }


        }
    }


    // // console.log(assetsElement);
    
    for(let i = 0; i<assetsElement.length;i++){
        document.getElementById('bgg').appendChild(assetsElement[i].img);
    }


    }


}

// hide show deadzone......................
function hideShowDeadZone(e) {

    let assetsInDeadzone = [];
    hideShowDeadZoneVal = e.target.checked;

    if (hideShowDeadZoneVal == true) {

        let c = document.getElementById("myCanvas");
        ctx = c.getContext("2d");
        ctx.clearRect(0, 0, 300, 150);
        // addAssets();
        adddeadZoneAssets();
        if (assetsInDeadzone.length > 0) {
            // // // // // console.log('qqqqqqqqqqqqq', assetsInDeadzone);

            for (let i = 0; i < assetsInDeadzone.length; i++) {
                assetsInDeadzone[i].img.style.visibility = 'visible ';
                document.getElementById('bgg').appendChild(assetsInDeadzone[i].img);
            }
        }

        if (hideShowAssetZoneVal == false) {
            ctx.strokeStyle = 'green';
            ctx.beginPath();

            if(assetZoneAreaVal){
                for (let i = 0; i < assetZoneAreaVal.length - 1; i++) {

                    ctx.moveTo(assetZoneAreaVal[i].xVal, assetZoneAreaVal[i].yVal);
                    ctx.lineTo(assetZoneAreaVal[i + 1].xVal, assetZoneAreaVal[i + 1].yVal);
                    ctx.strokeStyle = 'blue';
    
                    ctx.stroke();
    
                }
            }

         


        }






    } else {


        for (let j = 0; j < assetsDeadZoneElement.length; j++) {
            // // // // // console.log('fgfghdfhdfh');




            assetsDeadZoneElement[j].img.style.visibility = 'hidden';

            // assetsInDeadzone.push(assetsElement[j]);



        }


        let c = document.getElementById("myCanvas");
        //  // // // // // console.log('gotit', assetsElement);

        ctx = c.getContext("2d");
        ctx.strokeStyle = 'red';
        ctx.beginPath();




        {
            let c = document.getElementById("myCanvas");
            // // // // // //  // // // // // console.log(c);

            ctx = c.getContext("2d");
            ctx.strokeStyle = 'red';


            let deadZoneobjKeys = Object.keys(deadzoneArrayToSend);

            for (let i = 0; i < deadZoneobjKeys.length; i++) {
                // ctx.beginPath();
                for (let j = 0; j < deadzoneArrayToSend[deadZoneobjKeys[i]].length - 1; j++) {
                    // // // // // console.log(deadzoneArrayToSend[deadZoneobjKeys[i]][j].xVal,deadzoneArrayToSend[deadZoneobjKeys[i]][j].yVal);
                    // // // // // console.log(deadzoneArrayToSend[deadZoneobjKeys[i]][j+1].xVal,deadzoneArrayToSend[deadZoneobjKeys[i]][j+1].yVal);

                    ctx.moveTo(deadzoneArrayToSend[deadZoneobjKeys[i]][j].xVal, deadzoneArrayToSend[deadZoneobjKeys[i]][j].yVal);
                    ctx.lineTo(deadzoneArrayToSend[deadZoneobjKeys[i]][j + 1].xVal, deadzoneArrayToSend[deadZoneobjKeys[i]][j + 1].yVal);
                    ctx.stroke();
                }

            }


        }


        // for (let i = 0; i < deadZoneAreaVal.length - 1; i++) {
        //     // // // //  // // // // // console.log(deadZoneAreaVal[i].xVal, deadZoneAreaVal[i].yVal);



        //     ctx.moveTo(deadZoneAreaVal[i].xVal, deadZoneAreaVal[i].yVal);


        //     ctx.lineTo(deadZoneAreaVal[i + 1].xVal, deadZoneAreaVal[i + 1].yVal);


        //     ctx.stroke();



        // }

        // document.getElementById('deadZoneText').style.visibility = 'visible';

    }



}

//  hide show asset zone........................
function hideShowAsset(e) {
    // updateSpeedOAssets();
    // //  // // // // // console.log(e.target.checked);
    hideShowAssetZoneVal = e.target.checked;
    if (hideShowAssetZoneVal == true) {
        let c = document.getElementById("myCanvas");
        ctx = c.getContext("2d");
        ctx.clearRect(0, 0, 300, 150);

        if (hideShowDeadZoneVal == false) {
            ctx.strokeStyle = 'red';

            {
                let c = document.getElementById("myCanvas");
                ctx = c.getContext("2d");
                let deadZoneobjKeys = Object.keys(deadzoneArrayToSend);

                for (let i = 0; i < deadZoneobjKeys.length; i++) {
                    ctx.beginPath();
                    for (let j = 0; j < deadzoneArrayToSend[deadZoneobjKeys[i]].length - 1; j++) {

                        ctx.moveTo(deadzoneArrayToSend[deadZoneobjKeys[i]][j].xVal, deadzoneArrayToSend[deadZoneobjKeys[i]][j].yVal);
                        ctx.lineTo(deadzoneArrayToSend[deadZoneobjKeys[i]][j + 1].xVal, deadzoneArrayToSend[deadZoneobjKeys[i]][j + 1].yVal);
                        ctx.stroke();
                    }
                }
            }
        }

        for (let i = 0; i < assetsElement.length; i++) {
            assetsElement[i].img.style.animationDuration = '0s';

        }


    } else {
        let c = document.getElementById("myCanvas");
        ctx = c.getContext("2d");
        ctx.strokeStyle = 'red';
        ctx.beginPath();

          if(assetZoneAreaVal){
            for (let i = 0; i < assetZoneAreaVal.length - 1; i++) {
                ctx.moveTo(assetZoneAreaVal[i].xVal, assetZoneAreaVal[i].yVal);
                ctx.lineTo(assetZoneAreaVal[i + 1].xVal, assetZoneAreaVal[i + 1].yVal);
                ctx.strokeStyle = 'blue';
                ctx.stroke();
            }
          }
     

        // updateSpeedOAssets();

    }

}

// update speed after  hide show event....................
function updateSpeedOAssets() {
    let speedDivision = 1 / 4;
    let blinkSpeedsArray = [];
    let speed = speedDivision;

    for (let i = 0; i < newPolyArray.length; i++) {

        blinkSpeedsArray.push(speed);
        speed = speed + speedDivision;
    }
    // //  // // // // // console.log(blinkSpeedsArray);
    let count = blinkSpeedsArray.length;

    for (let k = 0; k < assetsElement.length; k++) {
        if (inside([assetsElement[k].x, assetsElement[k].y], newPolyArray[0]) == true) {
            // assetsElement[k].img.style.animationDuration = 0.1 + 's';
            // // // // // console.log('gotitttt');
        }
    }
     

 if(newPolyArray.length>0){
        for (let z = 0; z < newPolyArray.length - 1; z++) {
            for (let k = 0; k < assetsElement.length; k++) {
                if ((inside([assetsElement[k].x, assetsElement[k].y], newPolyArray[z])) == false && (inside([assetsElement[k].x, assetsElement[k].y], newPolyArray[z + 1])) == true) {
                    // assetsElement[k].img.style.animationDuration = blinkSpeedsArray[z] + 's';
                    // // // // // console.log('ok gotit');
    
    
                }
            }
        }

    }
   
}

// add deadzone image to screen...........
function adddeadZoneAssets() {

    assetsDeadZoneElement = [];

    activityPositionsData = JSON.parse(localStorage.getItem('activityPositionsData'));
    // // // //  // // // // // console.log(activityPositionsData);
    activityName = Object.keys(activityPositionsData);
    // // // // //  // // // // // console.log(activityPositionsData.VEHICLE.length);

    // document.createElement = 

    totalNumberofAssets = 0;

    for (let i = 0; i < activityName.length; i++) {

        if (activityName[i] === 'ACTIVITY') {
            for (let k = 0; k < activityPositionsData.ACTIVITY.length; k++) {
                totalNumberofAssets++;

                let x = +activityPositionsData.ACTIVITY[k].split(' ')[1];
                let y = +activityPositionsData.ACTIVITY[k].split(' ')[2];

                let checkpoint = false;

                if(deadZonePolygonArray.length>0){
                    for (let l = 0; l < deadZonePolygonArray.length; l++) {
                        if (inside([x, y], deadZonePolygonArray[l]) === true) {
                            checkpoint = true;
                            // // // // console.log('gotittttttttttt');
    
                            break;
                        }
                    }
    
                    if (checkpoint) {
                        let img = new Image(iconSize, iconSize);
                        img.src = "assets/icons/LocationPopup.png";
    
                        // img.src = "https://img.icons8.com/officel/16/000000/human-head.png";
                        img.style.position = 'absolute';
                        img.className = 'Blink';
                        img.style.marginLeft = +activityPositionsData.ACTIVITY[k].split(' ')[1];
                        img.style.marginTop = +activityPositionsData.ACTIVITY[k].split(' ')[2];
                        img.style.transform = "translate(-50%, -50%)";
                        assetsDeadZoneElement.push({
                            img,
                            x,
                            y
                        });
                        document.getElementById('bgg').appendChild(img);
    
    
                    }
                }else {
                    let img = new Image(iconSize, iconSize);
                        img.src = "assets/icons/LocationPopup.png";
    
                        // img.src = "https://img.icons8.com/officel/16/000000/human-head.png";
                        img.style.position = 'absolute';
                        img.className = 'Blink';
                        img.style.marginLeft = +activityPositionsData.ACTIVITY[k].split(' ')[1];
                        img.style.marginTop = +activityPositionsData.ACTIVITY[k].split(' ')[2];
                        img.style.transform = "translate(-50%, -50%)";
                        assetsDeadZoneElement.push({
                            img,
                            x,
                            y
                        });
                        document.getElementById('bgg').appendChild(img);
                }
              
            }

        } else if (activityName[i] === 'FOOTSTEPS') {
            for (let k = 0; k < activityPositionsData.FOOTSTEPS.length; k++) {
                totalNumberofAssets++;
                let x = +activityPositionsData.FOOTSTEPS[k].split(' ')[1];
                let y = +activityPositionsData.FOOTSTEPS[k].split(' ')[2];

                let checkpoint = false;

                if(deadZonePolygonArray.length>0){
                    for (let l = 0; l < deadZonePolygonArray.length; l++) {
                        if (inside([x, y], deadZonePolygonArray[l]) === true) {
                            checkpoint = true;
                            break;
                        }
                    }
                    if (checkpoint) {
                        let img = new Image(iconSize, iconSize);
    
                        img.src = "assets/icons/Man/ManRed.png";
                        img.style.position = 'absolute';
                        img.className = 'Blink';
                        img.style.marginLeft = +activityPositionsData.FOOTSTEPS[k].split(' ')[1];
                        img.style.marginTop = +activityPositionsData.FOOTSTEPS[k].split(' ')[2];
                        img.style.transform = "translate(-50%, -50%)";
                        assetsDeadZoneElement.push({
                            img,
                            x,
                            y
                        });
                        document.getElementById('bgg').appendChild(img);
                    }
                }else {
                    let img = new Image(iconSize, iconSize);
    
                    img.src = "assets/icons/Man/ManRed.png";
                    img.style.position = 'absolute';
                    img.className = 'Blink';
                    img.style.marginLeft = +activityPositionsData.FOOTSTEPS[k].split(' ')[1];
                    img.style.marginTop = +activityPositionsData.FOOTSTEPS[k].split(' ')[2];
                    img.style.transform = "translate(-50%, -50%)";
                    assetsDeadZoneElement.push({
                        img,
                        x,
                        y
                    });
                    document.getElementById('bgg').appendChild(img);
                }
               

            }

        } else if (activityName[i] === 'VEHICLE') {

            for (let k = 0; k < activityPositionsData.VEHICLE.length; k++) {
                totalNumberofAssets++;
                let x = +activityPositionsData.VEHICLE[k].split(' ')[1];
                let y = +activityPositionsData.VEHICLE[k].split(' ')[2];

                let checkpoint = false;

                if(deadZonePolygonArray.length>0){
                    for (let l = 0; l < deadZonePolygonArray.length; l++) {
                        if (inside([x, y], deadZonePolygonArray[l]) === true) {
                            checkpoint = true;
                            break;
                        }
                    }
    
                    if (checkpoint) {
    
                        let img = new Image(iconSize, iconSize);
                        img.src = "assets/icons/Truck/TruckYellow.png";
                        img.style.transform = "translate(-50%, -50%)";
                        assetsDeadZoneElement.push({
                            img,
                            x,
                            y
                        });
    
    
                        img.style.position = 'absolute';
                        img.className = 'Blink';
                        img.style.marginLeft = +activityPositionsData.VEHICLE[k].split(' ')[1];
                        img.style.marginTop = +activityPositionsData.VEHICLE[k].split(' ')[2];
    
                        document.getElementById('bgg').appendChild(img);
                    }
                }else {
                    let img = new Image(iconSize, iconSize);
                    img.src = "assets/icons/Truck/TruckYellow.png";
                    img.style.transform = "translate(-50%, -50%)";
                    assetsDeadZoneElement.push({
                        img,
                        x,
                        y
                    });


                    img.style.position = 'absolute';
                    img.className = 'Blink';
                    img.style.marginLeft = +activityPositionsData.VEHICLE[k].split(' ')[1];
                    img.style.marginTop = +activityPositionsData.VEHICLE[k].split(' ')[2];

                    document.getElementById('bgg').appendChild(img);
                }
            
            }

        } else if (activityName[i] === 'ANIMAL') {
            for (let k = 0; k < activityPositionsData.ANIMAL.length; k++) {
                totalNumberofAssets++;
                let x = +activityPositionsData.ANIMAL[k].split(' ')[1];
                let y = +activityPositionsData.ANIMAL[k].split(' ')[2];

                let checkpoint = false;

                if(deadZonePolygonArray.length>0){
                for (let l = 0; l < deadZonePolygonArray.length; l++) {
                    if (inside([x, y], deadZonePolygonArray[l]) === true) {
                        checkpoint = true;
                        break;
                    }
                }

                if (checkpoint) {
                    //  // // // // // console.log('okkkk');

                    let img = new Image(iconSize, iconSize);
                    img.src = "assets/icons/animal/animalYellow.png";
                    img.style.transform = "translate(-50%, -50%)";
                    assetsDeadZoneElement.push({
                        img,
                        x,
                        y
                    });
                    // img.src = "https://img.icons8.com/color/48/000000/lion.png";
                    img.style.position = 'absolute';
                    img.className = 'Blink';
                    img.style.marginLeft = +activityPositionsData.ANIMAL[k].split(' ')[1];
                    img.style.marginTop = +activityPositionsData.ANIMAL[k].split(' ')[2];

                    // document.getElementById('bgg').appendChild(img);
                }
            }else {
                let img = new Image(iconSize, iconSize);
                img.src = "assets/icons/animal/animalYellow.png";
                img.style.transform = "translate(-50%, -50%)";
                assetsDeadZoneElement.push({
                    img,
                    x,
                    y
                });
                // img.src = "https://img.icons8.com/color/48/000000/lion.png";
                img.style.position = 'absolute';
                img.className = 'Blink';
                img.style.marginLeft = +activityPositionsData.ANIMAL[k].split(' ')[1];
                img.style.marginTop = +activityPositionsData.ANIMAL[k].split(' ')[2];
            }
            }

        } else if (activityName[i] === 'UNCLASSIFIED') {
            for (let k = 0; k < activityPositionsData.UNCLASSIFIED.length; k++) {
                totalNumberofAssets++;
                let x = +activityPositionsData.UNCLASSIFIED[k].split(' ')[1];
                let y = +activityPositionsData.UNCLASSIFIED[k].split(' ')[2];

                let checkpoint = false;

                if(deadZonePolygonArray.length>0){
                    for (let l = 0; l < deadZonePolygonArray.length; l++) {
                        if (inside([x, y], deadZonePolygonArray[l]) === true) {
                            checkpoint = true;
                            break;
                        }
                    }
                    if (checkpoint) {
                        let img = new Image(iconSize, iconSize);
                        img.src = "assets/icons/question.png"
                        // img.src = "https://img.icons8.com/ios-filled/50/000000/ios-app-icon-shape.png";
                        img.style.position = 'absolute';
    
                        img.className = 'Blink';
                        img.style.marginLeft = +activityPositionsData.UNCLASSIFIED[k].split(' ')[1];
                        img.style.marginTop = +activityPositionsData.UNCLASSIFIED[k].split(' ')[2];
                        img.style.transform = "translate(-50%, -50%)";
                        assetsDeadZoneElement.push({
                            img,
                            x,
                            y
                        });
    
                        document.getElementById('bgg').appendChild(img);
                    }
                }else {
                    let img = new Image(iconSize, iconSize);
                        img.src = "assets/icons/question.png"
                        // img.src = "https://img.icons8.com/ios-filled/50/000000/ios-app-icon-shape.png";
                        img.style.position = 'absolute';
    
                        img.className = 'Blink';
                        img.style.marginLeft = +activityPositionsData.UNCLASSIFIED[k].split(' ')[1];
                        img.style.marginTop = +activityPositionsData.UNCLASSIFIED[k].split(' ')[2];
                        img.style.transform = "translate(-50%, -50%)";
                        assetsDeadZoneElement.push({
                            img,
                            x,
                            y
                        });
    
                        document.getElementById('bgg').appendChild(img);
                }
            
            }

        } else if (activityName[i] === 'TUNNEL') {
            // //  // // // // // console.log('tunnel');

            for (let k = 0; k < activityPositionsData.TUNNEL.length; k++) {
                totalNumberofAssets++;
                let x = +activityPositionsData.TUNNEL[k].split(' ')[1];
                let y = +activityPositionsData.TUNNEL[k].split(' ')[2];

                let checkpoint = false;

                if(deadZonePolygonArray.length>0){
                    for (let l = 0; l < deadZonePolygonArray.length; l++) {
                        if (inside([x, y], deadZonePolygonArray[l]) === true) {
                            checkpoint = true;
                            break;
                        }
                    }
    
                    if (checkpoint) {
                        let img = new Image(iconSize, iconSize);
                        img.src = "assets/icons/tunnel.png";
    
                        // img.src = "https://img.icons8.com/android/24/000000/left-footprint.png";
                        img.style.position = 'absolute';
                        img.className = 'Blink';
                        img.style.marginLeft = +activityPositionsData.TUNNEL[k].split(' ')[1];
                        img.style.marginTop = +activityPositionsData.TUNNEL[k].split(' ')[2];
                        img.style.transform = "translate(-50%, -50%)";
                        assetsDeadZoneElement.push({
                            img,
                            x,
                            y
                        });
    
                        document.getElementById('bgg').appendChild(img);
                    }
                }else {
                    let img = new Image(iconSize, iconSize);
                    img.src = "assets/icons/tunnel.png";

                    // img.src = "https://img.icons8.com/android/24/000000/left-footprint.png";
                    img.style.position = 'absolute';
                    img.className = 'Blink';
                    img.style.marginLeft = +activityPositionsData.TUNNEL[k].split(' ')[1];
                    img.style.marginTop = +activityPositionsData.TUNNEL[k].split(' ')[2];
                    img.style.transform = "translate(-50%, -50%)";
                    assetsDeadZoneElement.push({
                        img,
                        x,
                        y
                    });

                    document.getElementById('bgg').appendChild(img);
                }
                

            }
        }
    }

}

var poly = [];
function changeAssetZoneArea (){
    // // console.log('changing asset zone area',newPolyArray);
    
    newPolyArray = [];

    if(assetZoneAreaVal){
        for (let i = 0; i < assetZoneAreaVal.length - 1; i++) {
            polygonAssetZone.push([assetZoneAreaVal[i].x, assetZoneAreaVal[i].y]);
    
        }
    }

    newPolyArray.push(polygonAssetZone);
    // // // console.log(polygonAssetZone); 
    if(assetZoneAreaVal){
        for (let i = 0; i < assetZoneAreaVal.length - 1; i++) {
            poly.push(new Vector2(assetZoneAreaVal[i].x, assetZoneAreaVal[i].y));
        }
       
        let d1 = assetd1val;
        let d2 = assetd2val;
        let d3 = assetd3val;
        let polyCount = d1;
        // // console.log(d1,d2,d3);

        polyArray = [];
        
    
        for (let k = 0; k < 3; k++) {
            // // // console.log(polyCount);
            
            let a = straight_skeleton(poly, polyCount);
            // // // console.log(a);
    
            for (let i = 0; i < a.length; i++) {
                polyBoundingArray.push([a[i].x, a[i].y]);
            }
            // // // // // console.log(polyBoundingArray);
            if (k == 0) {
                polyCount = d2;
            } else if (k == 1) {
                polyCount = d3;
            }
    
            // // // //  // // // // // console.log(inside([400, 584], polyBoundingArray));
    
            // if (inside([400, 584], polyBoundingArray) === false) {
                polyArray.push(polyBoundingArray);
    
            // } 
            // else
            //  if (inside([400, 584], polyBoundingArray) === true) {
            //     // // // // //  // // // // // console.log('break');
    
            //     break;
            // }
    
            polyBoundingArray = [];
    
        }
        // // console.log(polyArray);
        
     
    for (let i = 0; i < polyArray.length; i++) {

        newPolyArray.push(polyArray[i])
      
    }
    // // // console.log(newPolyArray);
    
    for (let z = 0; z < newPolyArray.length - 1; z++) {

        for (let k = 0; k < assetsElement.length; k++) {
            if ((inside([assetsElement[k].x, assetsElement[k].y], newPolyArray[z])) == false && (inside([assetsElement[k].x, assetsElement[k].y], newPolyArray[z + 1])) == true) {
                // assetsElement[k].img.style.animationDuration = blinkSpeedsArray[z] + 's';
                // // // // // console.log('3333333333333');

            }
        }
    }
    }

    addAssets();
    // drawAssetzones();
    // // console.log('changed asset zone area',newPolyArray);
    
}

// change polygonezone by increasing size

function Vector2(x, y) {
    this.x = x;
    this.y = y;
}

function straight_skeleton(poly, spacing) {
    // http://stackoverflow.com/a/11970006/796832
    // Accompanying Fiddle: http://jsfiddle.net/vqKvM/35/

    var resulting_path = [];
    var N = poly.length;
    var mi, mi1, li, li1, ri, ri1, si, si1, Xi1, Yi1;
    for (var i = 0; i < N; i++) {
        mi = (poly[(i + 1) % N].y - poly[i].y) / (poly[(i + 1) % N].x - poly[i].x);
        mi1 = (poly[(i + 2) % N].y - poly[(i + 1) % N].y) / (poly[(i + 2) % N].x - poly[(i + 1) % N].x);
        li = Math.sqrt((poly[(i + 1) % N].x - poly[i].x) * (poly[(i + 1) % N].x - poly[i].x) + (poly[(i + 1) % N].y - poly[i].y) * (poly[(i + 1) % N].y - poly[i].y));
        li1 = Math.sqrt((poly[(i + 2) % N].x - poly[(i + 1) % N].x) * (poly[(i + 2) % N].x - poly[(i + 1) % N].x) + (poly[(i + 2) % N].y - poly[(i + 1) % N].y) * (poly[(i + 2) % N].y - poly[(i + 1) % N].y));
        ri = poly[i].x + spacing * (poly[(i + 1) % N].y - poly[i].y) / li;
        ri1 = poly[(i + 1) % N].x + spacing * (poly[(i + 2) % N].y - poly[(i + 1) % N].y) / li1;
        si = poly[i].y - spacing * (poly[(i + 1) % N].x - poly[i].x) / li;
        si1 = poly[(i + 1) % N].y - spacing * (poly[(i + 2) % N].x - poly[(i + 1) % N].x) / li1;
        Xi1 = (mi1 * ri1 - mi * ri + si - si1) / (mi1 - mi);
        Yi1 = (mi * mi1 * (ri1 - ri) + mi1 * si - mi * si1) / (mi1 - mi);
        // Correction for vertical lines
        if (poly[(i + 1) % N].x - poly[i % N].x == 0) {
            Xi1 = poly[(i + 1) % N].x + spacing * (poly[(i + 1) % N].y - poly[i % N].y) / Math.abs(poly[(i + 1) % N].y - poly[i % N].y);
            Yi1 = mi1 * Xi1 - mi1 * ri1 + si1;
        }
        if (poly[(i + 2) % N].x - poly[(i + 1) % N].x == 0) {
            Xi1 = poly[(i + 2) % N].x + spacing * (poly[(i + 2) % N].y - poly[(i + 1) % N].y) / Math.abs(poly[(i + 2) % N].y - poly[(i + 1) % N].y);
            Yi1 = mi * Xi1 - mi * ri + si;
        }

        //// // // //  // // // // // console.log("mi:", mi, "mi1:", mi1, "li:", li, "li1:", li1);
        //// // // //  // // // // // console.log("ri:", ri, "ri1:", ri1, "si:", si, "si1:", si1, "Xi1:", Xi1, "Yi1:", Yi1);

        resulting_path.push({
            x: Xi1,
            y: Yi1
        });
    }

    return resulting_path;
}


function drawAssetzones(){
    // // // console.log(newPolyArray);
    
    
    for (let j = 1; j < newPolyArray.length; j++) {
       
        for (let i = 0; i < newPolyArray[j].length - 1; i++) {
            // // // // // // // console.log(deadZoneAreaVal[i].xVal, deadZoneAreaVal[i].yVal);

            let x = newPolyArray[j][i][0];
            let y = newPolyArray[j][i][1];
            // // // // // // console.log(x, y);
            let c = document.getElementById("myCanvas");
            // // // // // // // // // console.log(c);

            ctx = c.getContext("2d");
            ctx.strokeStyle = 'green';
            ctx.beginPath();


            ctx.moveTo(newPolyArray[j][i][0] * (300 / 584), newPolyArray[j][i][1] * (150 / 400));
            ctx.lineTo(newPolyArray[j][i + 1][0] * (300 / 584), newPolyArray[j][i + 1][1] * (150 / 400));
            ctx.stroke();
            
        }
        // // // console.log('adsafdasfasf');

    }
}