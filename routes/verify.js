var http = require('http');
var captchapng = require('captchapng');

var verify = function (req, res) {
    if(req.url == '/verify'){
        var numRandom = parseInt(Math.random()*9000+1000);
        var p = new captchapng(80,30,numRandom); // width,height,numeric captcha
        p.color(50, 50, 50, 50);  // First color: background (red, green, blue, alpha)
        p.color(0, 80, 80, 255); // Second color: paint (red, green, blue, alpha)
        global.code = numRandom;
        this.code = numRandom;
        var img = p.getBase64();
        var imgbase64 = new Buffer(img,'base64');
        //console.log(numRandom);
        res.writeHead(200, {
            'Content-Type': 'image/png'
        });

        res.end(imgbase64);

    }else{
        res.end('');
    };
}

exports.verify = verify;