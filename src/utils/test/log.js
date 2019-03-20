function info(v){
    if(typeof v ==='string' || (typeof v==='object' && v.constructor===Array)){
        // console.log('1');
        // console.log("> {0}:{0},{0}".format(v));
    }else{
        console.log('不满足条件')
    }
}
exports.info=info;