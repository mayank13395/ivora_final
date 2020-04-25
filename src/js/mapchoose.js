const { ipcRenderer } = require('electron');



document.getElementById('gotoPreviousPage').addEventListener('click', () => {
    ipcRenderer.send('gotolatlngEntryPage');
    // console.log('window button clicked');
});