function ftBytes(n) {
    var b = payload.slice(offset, offset + n);
    offset += n;
    return bufToStr(b);
}


function ftArrayq() {
    n = payload.readUInt8(offset, 1);
    offset += 1;
    var num = [];
    if (n < 0xFD) {
        n = ftNumberq();
        num.push(n);
    }
    return num;
}


function ftNumberq() {
    var buf = payload.slice(offset, offset + 8);
    offset += 8;
    var b = buf.reverse();
    n = bufToNumber(b);
    return n;
}

function ftNumberI() {
    n = payload.readUInt32LE(offset, offset + 4);
    // offset += 4;
    // return n;
    return payload.slice(offset,offset+4);
}

function ftVarStrList() {
    console.log('offset:', offset);
    n = payload.readUInt8(offset, offset + 1);
    offset += 1;
    var s = '';
    var list = [];
    if (n < 0xFD) {
        for (var i = 0; i < n; i++) {
            var varstrList = new VarStrList();
            var m = payload.readUInt8(offset, offset + 1);
            offset += 1;
            if (m < 0xFD) {
                for (var j = 0; j < m; j++) {
                    var x = payload.readUInt8(offset, offset + 1);
                    var s = payload.slice(offset, offset + x);
                    offset += x;
                    s = bufToStr(s)
                    varstrList.items.push(s);
                }
                list.push(varstrList);
            }
        }
    }
    console.log('>>> list:', list, list.length);

    return list;
}

function ftVarString() {
    n = payload.readUInt8(offset, offset + 1);
    offset += 1;
    var s = '';
    if (n < 0xFD) {
        var s = payload.slice(offset, offset + n).toString('latin1');
        offset += n;
    }
    // console.log('last offset:',offset);
    return s;
}