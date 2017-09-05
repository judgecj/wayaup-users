var express = require('express');
var path = require('path');
var body = require('body-parser');
var cloudinary = require('cloudinary');
var  index = require('./router/index');
var tasts = require('./router/tasts');
var multer = require('multer');
// set the directory for the uploads to the uploaded to
var DIR = './uploads/';
//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
var upload = multer({dest: DIR}).single('photo');

var app = express();
var port = 4000;
cloudinary.config({
    cloud_name: 'easywaya',
    api_key: '941675619944356',
    api_secret: 'i7RjqCUHJhVSNB3NI6mz_ZBHzSc'
});

app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", "*");
    next();
});


app.post('/upload', function (req, res, next) {

    var path = '';
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            console.log(err);
            return res.status(422).send("an Error occured")
        }
        // No error occured.
        path = req.file.path;
        cloudinary.uploader.upload(path, function(result, req) {
            console.log(result);
        });
        return res.send("Upload Completed for "+path);

    });
});

///view engine
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
//app.engine('html', require('ejs').renderFile);
/// set start folde


/*cloudinary.uploader.upload("http://www.telegraph.co.uk/content/dam/film/CannesFestivalPics/love2-xlarge.jpg", function(result, req) {


             console.log(result);


});*/
app.use(express.static(path.join(__dirname,'client/dist')));
app.use(body.urlencoded({extended:true}));
app.use(body.json());
app.use(function(req, res, next) {

    console.log(req.method,  req.url );
    next();

});

app.use('/api', tasts);
app.use('*', function (req, res)  {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));

})
app.listen(port, function() {
    console.log('serve runing on port ' + port);

})

