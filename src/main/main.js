const {ipcMain}=require('electron')
let file=require('../utils/file')
let info=require('./info');

ipcMain.on('save',function(event,data){
    file.save(data);
})

ipcMain.on('create',function(event,data){
    let addr=file.create(data);
    if(addr){
       event.sender.send('replycreate',addr);
    }
})

ipcMain.on('info',function(event,data){
    console.log('data:',data);
    let account='addr1';
    let password='xieyc';
    let pv=false;
    let pb=false;
    let after=0;
    let before=0;
    let address='';
    let v=info.getInfo(account,password,pv,pb,after,before,address);
})



/**
 * test
 */
ipcMain.on('test',function(event,data){
    console.log('data:',data);
})
ipcMain.on('test2',function(event,data){
    console.log('data:',data);
})