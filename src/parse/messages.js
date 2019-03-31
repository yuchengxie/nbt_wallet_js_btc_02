
const OrgSheet=(message)=>{
    var command = 'orgsheet'
    var name = 'org_sheet'

    properties=[
        ('sequence', format.FtNumber('I')),
        ('pks_out', format.FtArray(format.FtVarStrList, 1)),
        ('last_uocks', format.FtArray(format.FtNumber('q'), 1)),  // 0 means has scan all, else, next utxo should > last_uock
        
        ('version', format.FtNumber('I')),
        ('tx_in', format.FtArray(format.FtTxnIn, 1)),
        ('tx_out', format.FtArray(format.FtTxnOut, 1)),
        ('lock_time', format.FtNumber('I')),
        
        ('signature', format.FtVarString()),
    ]
}

OrgSheet('');