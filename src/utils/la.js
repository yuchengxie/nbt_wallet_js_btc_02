function convpayload(msg) {

    var a = new Buffer(0);
    var b;
    for (var name in msg) {
        if (name === 'vcn') {
            b = new Buffer(2);
            b.writeUInt8(msg['vcn'])
            a = Buffer.concat([a, b]);
        }
        if (name === 'sequence') {
            b = new Buffer(4);
            b.writeUInt16LE(msg['sequence'])
            a = Buffer.concat([a, b]);
        }
        if (name === 'pay_from') {
            var num = msg['pay_from'].length;
            if (num < 0XFD) {
                b = new Buffer(1);
                b.writeUInt8(1);
                a = Buffer.concat([a, b]);
                for (var i = 0; i < num; i++) {
                    var payfrom = msg['pay_from'][i];
                    b = new Buffer(8);

                    var v = payfrom.value;
                    b.writeInt32LE(v);
                    var addr = payfrom.address;
                    a = Buffer.concat([a, b]);
                    var l_addr = payfrom.address.length;
                    if (l_addr < 0xFD) {
                        b = new Buffer(1);
                        b.writeInt8(l_addr);
                        a = Buffer.concat([a, b]);
                        b = new Buffer(payfrom.address);
                        a = Buffer.concat([a, b]);
                    }
                }
            }
        }

        if (name === 'pay_to') {
            var num = msg['pay_to'].length;
            if (num < 0XFD) {
                b = new Buffer(1);
                b.writeUInt8(1);
                a = Buffer.concat([a, b]);
                for (var i = 0; i < num; i++) {
                    var payto = msg['pay_to'][i];
                    b = new Buffer(8);

                    var v = payto.value;
                    b.writeInt32LE(v);
                    a = Buffer.concat([a, b]);
                    var l_addr = payto.address.length;
                    if (l_addr < 0xFD) {
                        b = new Buffer(1);
                        b.writeInt8(l_addr);
                        a = Buffer.concat([a, b]);

                        b = new Buffer(payto.address);
                        a = Buffer.concat([a, b]);
                    }
                }
            }
        }

        if (name === 'scan_count') {
            b = new Buffer(2);
            b.writeUInt8(msg['vcn'])
            a = Buffer.concat([a, b]);
        }

        if (name === 'min_utxo') {
            b = new Buffer(8);
            b.writeInt32LE(msg['min_utxo'])
            a = Buffer.concat([a, b]);
        }

        if (name === 'max_utxo') {
            b = new Buffer(8);
            b.writeInt32LE(msg['max_utxo'])
            a = Buffer.concat([a, b]);
        }

        if (name === 'sort_flag') {
            b = new Buffer(4);
            b.writeUInt16LE(msg['sort_flag'])
            a = Buffer.concat([a, b]);
        }

        if (name === 'last_uocks') {
            var num = msg['last_uocks'].length;
            if (num < 0xFD) {
                b = new Buffer(1);
                b.writeInt8(num);
                a = Buffer.concat([a, b]);
                for (var i = 0; i < num; i++) {
                    var lastuocks = msg['last_uocks'][i];
                    b = new Buffer(8);
                    b.writeInt32LE(lastuocks);
                    a = Buffer.concat([a, b]);
                }
            }
        }
    }
    return a;
}