const {ipcRenderer}=require('electron')

btnCreate.addEventListener('click',function(){
    let data=phone.value+phonecode.value;
    ipcRenderer.send('create',data);
})

btnSave.addEventListener('click', function () {
    divModal.style.display = 'none';
    let address = address_input.value;
    ipcRenderer.send('save',address);
})

btnImport.addEventListener('click', function () {
    divModal.style.display = 'block';
})
divModal.addEventListener('click', function () {
    this.style.display = 'none';
})

btnBlock.addEventListener('click',function(){
    alert('1');
})

modalContent.addEventListener('click', function (e) {
    e = e || window.event;
    e.stopPropagation();
})



