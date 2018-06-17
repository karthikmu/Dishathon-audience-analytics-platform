var fs = require("fs");
var logger = require('logzio-nodejs').createLogger({
    token: 'ALTASdtFTGaIkdElfYMMOBQYZJkhbarW',
    host: 'listener.logz.io',
    type: 'dishathon'     // OPTIONAL (If none is set, it will be 'nodejs')
});

// sending text
//logger.log('This is a log message');


var fs = require('fs');
var filePath = 'data.txt';
var file = fs.readFileSync(filePath);
console.log('Initial File content : ' + file);
// setInterval(function(){
//     fs.readFileSync(filePath).toString().split("\n").forEach(function(line, index, arr) {
//         if (index === arr.length - 1 && line === "") { return; }
//         console.log(index + " " + line);
//     });
// },2000);
var CONTEXT_DATA = {};
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

fs.watch(filePath, function(event, filename) {
  if(filename && event === 'change'){
    CONTEXT_DATA = {
        female:{},
        male:{}

    };
    console.log('Event : ' + event);
    console.log(filename + ' file Changed ...');
    fs.readFileSync(filePath).toString().split("\n").forEach(function(line, index, arr) {
        if (index === arr.length - 1 && line === "") { return; }

        // do the magic here
        arr = line.split("_");
        console.log("Length:" + arr.length + "\n");
        switch(arr[0]){
            case 'M':
            CONTEXT_DATA.male = {};
            CONTEXT_DATA.male.ageGroup = [];
            for(var i=1;i<arr.length;i++){
              if(arr[i])
                CONTEXT_DATA.male.ageGroup[i-1] = parseInt(arr[i]);
            }
            break;
            case 'F':
            CONTEXT_DATA.female = {};
            CONTEXT_DATA.female.ageGroup = [];
            for(var i=1;i<arr.length;i++){
              if(arr[i])
                CONTEXT_DATA.female.ageGroup[i-1] = parseInt(arr[i]);
            }
            break;
            case 'FC':
            CONTEXT_DATA.female.count = (arr.length > 1?parseInt(arr[1]): 0);
            break;
            case 'MC':
            CONTEXT_DATA.male.count =  (arr.length > 1?parseInt(arr[1]): 0);
            break;
            case 'TC':
            CONTEXT_DATA.count =  (arr.length > 1?parseInt(arr[1]): 0);
            break;
        }

        console.log(index + " " + line);
      });
      console.log(CONTEXT_DATA);
    // file = fs.readFileSync(filePath);
    // console.log('File content at : ' + new Date() + ' is \n' + file);
    CONTEXT_DATA.message = "dishathon";
    logger.log(CONTEXT_DATA);
  }
  else{
    console.log('filename not provided')
  }
});
