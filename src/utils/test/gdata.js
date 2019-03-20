
function MathRand(len){
    let str='';
    for(let i=0;i<len;i++){
        str+=Math.floor(Math.random()*10);
    }
    return str;
}

exports.MathRand=MathRand
