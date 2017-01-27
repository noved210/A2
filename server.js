var express = require("express");
var cloudinary = require("cloudinary");
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();

cloudinary.config({
  cloud_name: 'noved210',
  api_key: '785669961732571',
  api_secret: 'qaKXYye9MxH0UDj4lGgvyZGfUcE'
});

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));


app.post("/upload_and_add_image", function(req, res){

  var image_data = req.body.image;
  var data = image_data.replace(/^data:image\/\w+;base64,/, "");

  var buffer = new Buffer(data, "base64");

  var file_name = req.body.image_name;

  fs.writeFile(file_name, buffer, function(err){
    if(err) throw err;
    console.log("file saved");
    cloudinary.uploader.upload("./"+file_name, function(result){
      console.log(result);
      res.end();
    }, {public_id: file_name});
  });

});

app.post("/delete_image", function(req, res){

  cloudinary.uploader.destroy(req.body.image_name, function(result){
    console.log(result);
    res.json({});
    res.end();
  })

});

app.get("/get_image_list", function(req, res){

  cloudinary.api.resources(function(items){
    res.json(items);
    res.end();
  });

});

app.post("/view_image", function(req, res){

  console.log(req.body.image_name);

  res.json({"url": cloudinary.url(req.body.image_name)});
  res.end();

});

app.post("/add_image", function(req, res){
  console.log(req.body.url);
  cloudinary.uploader.upload(req.body.url, function(result) {
    console.log(result);
    res.end();
  }, {public_id:req.body.image_name});
});

app.get("*", function(req, res){
  res.sendfile("./public/index.html");
});

var server = app.listen(8080, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log("example app is listening at http://%s:%s", host, port);
})
