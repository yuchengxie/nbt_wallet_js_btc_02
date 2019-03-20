
ipcRenderer.on('save_success',function(err,data){
    alert('保存成功');
})

ipcRenderer.on('replycreate',function(err,data){
    addr.innerText='地址:'+data;
})