var interFaces = new Map();
var fs = require('fs');
var files=[];
var chalk = require('chalk')
try{
    files = fs.readdirSync(__dirname + '/data');
}catch(e){
    console.log(chalk.red('The directory "/mock/data"  is not found!\n'))
}
files.map((file) => {
    var data = require(__dirname + '/data/' + file);
    Object.keys(data).map((key) => {
        if(typeof data[key].$params==='undefined' && typeof data[key].$method==='undefined' && typeof data[key].$contentType==='undefined' && typeof data[key].$specParams==='undefined'){
            interFaces.set(key.toLowerCase(), data[key].$res || data[key]);
        }else{
            if(typeof interFaces.get(key.toLowerCase())==='undefined'){
                interFaces.set(key.toLowerCase(), []);
            }
            interFaces.get(key.toLowerCase()).push(data[key]);
        }
    })
});
module.exports = {
    define: {
        isProxy: false,
        matchPath: /\/api/i,
        domain: "http://tcysystinker.admin.ct108.org:1505"
    },
    interFaces: interFaces,
    getInterFace(key){
        return interFaces.get(key.toLowerCase());
    }
};
