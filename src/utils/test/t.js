const buf = Buffer.allocUnsafe(4);

buf.writeUInt32BE(0xfeedface, 0);

console.log(buf);
// 输出: <Buffer fe ed fa ce>

// buf.writeUInt32LE(0xfeedface, 0);
buf.writeUInt32LE(4277009102, 0);


console.log(buf);