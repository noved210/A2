var upload = angular.module("upload", []);

upload.controller("upload_controller", function($scope, $http){

	$scope.output = $scope.method;
	//for file uploads try this: http://ngmodules.org/modules/ng-file-upload
	$scope.uploadImage = function(valid){
		//either image from file or from url

		if(valid == false){
			alert("please enter a filename");
			return;
		}

		if($scope.type == 'file'){

			//set up the config for the http
			var config = {
				headers:{"Content-Type": "application/json"}
			};

			//get the file object and read in the file location
			var files = document.getElementById("file_location").files;
			var file_path = document.getElementById("file_location").value;

			var file_data = [];

			var file_extention = file_path.split('.')[1];

			switch(file_extention){
				case 'jpg':
					file_extention = '.jpg';
					break;
				case 'png':
					file_extention = ".png";
					break;
				case 'bmp':
					file_extention = ".bmp";
					break;
				default:
					file_extention = ".txt";
					break;
			}

			var reader = new FileReader();
			var data;
			reader.onloadend = function(e){
				data = {"image": e.target.result, "image_name": $scope.image_name};
				$http.post("/upload_and_add_image", data, config).then(function(res){
						alert("Successfully uploaded local image!\n" + $scope.image_name);
				}, function(err){
					alert(err.data + " returned error");
				});
			}
			reader.readAsDataURL(files[0]);
			//upload the file to the node server
			//once that's done then tell the node server to upload the image to the cloud

		}else{
			//set the data and the header
			var data = {"url": $scope.file_url, "image_name":$scope.image_name};
			var config = {
				headers:{"Content-Type": "application/json"}
			};
			//get the url and tell then node server to tell the cloudinary server to upload the image
			$http.post("/add_image", data, config).then(function(res){
				if(res.status == 200){
					alert("Successfully uploaded image from url: " + $scope.file_url);
				}else{
					alert("error code " + res.status);
				}
			});
		}
	}

});



upload.controller("viewer_controller", function($scope, $http){

	$scope.viewImage = function(){

		var data = {"image_name":$scope.image_name};
		var config = {
			headers:{"Content-Type": "application/json"}
		};

		$http.post("/view_image", data, config).then(function(res){
			if(res.status == 200){
				$scope.image_url = res.data.url;
			}else{
				alert("failed");
			}
		});

	}

});

upload.controller("list_controller", function($scope, $http){

	$scope.format = 'jpg';

	//used this tutorial for help with getting a list of all the images
	//http://dailyjs.com/2013/02/21/cloudinary/
	$scope.getList = function(){
		$http.get("/get_image_list").then(function(res){
			$scope.list = res.data.resources;
		});
	}

	$scope.viewImage = function(image_url, image_ext){

		var data = {"image_name": image_url + "." + image_ext};
		var config = {
			headers:{"Content-Type": "application/json"}
		};

		$http.post("/view_image", data, config).then(function(res){
			if(res.status == 200){
				$scope.image_url = res.data.url;
			}else{
				alert("failed");
			}
		});

	}
	$scope.deleteImage = function(image_name){

		var data = {"image_name": image_name};
		var config = {
			headers:{"Content-Type": "application/json"}
		};

		$http.post("/delete_image", data, config).then(function(res){
			alert(res.data.image_name + " has been removed from the cloud");
		});
	}

});
