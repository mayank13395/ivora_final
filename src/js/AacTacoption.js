const {ipcRenderer} = require('electron');

document.getElementById('aas').addEventListener('click', ()=>{
    fetch('C:/ivoradatafiles/input/map.txt1').then((d)=>{
        // console.log(d);
        ipcRenderer.send('gotoDashBoard');
    })
    .catch((e)=>{
        // console.log('error');
        ipcRenderer.send('gotolatlngEntryPage');
        fs.writeFile("C:/ivoradatafiles/input/customsettings.txt", "Sensitivity 0.7", function (err) {
            if (err) {
                return // console.log(err);
            }
            // console.log("The file was saved!");
        });
    })
});