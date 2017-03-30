
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:

const kDishesVersionName = "dishesVersion";
const kRestaurantVersionName = "restaurantVersion";
const kPhotoRestaurantVersionName = "photoRestaurantVersion";


Parse.Cloud.define("hi", function(request, response) {
  response.success("Hello world!");
});

//Function to keep the last date in the table
Parse.Cloud.afterSave("Dishes",function(request){
	
	var updatedAt = request.object.updatedAt;
	var VersionDate = Parse.Object.extend("dataVersion");
	
	var query = new Parse.Query(VersionDate);
	query.equalTo("attributeVersion",kDishesVersionName);

	query.find({
		success: function(results) {
			var dishVersion = results[0];
			console.log("Cambiando la version de: " + dishVersion.get("attributeVersion"));
			console.log("Fecha de la version es: " + updatedAt);

			dishVersion.set("dateVersion",updatedAt);
			dishVersion.save();
		}
	});
});

Parse.Cloud.afterSave("Restaurant",function(request){
	
	var updatedAt = request.object.updatedAt;
	var VersionDate = Parse.Object.extend("dataVersion");
	
	var query = new Parse.Query(VersionDate);
	query.equalTo("attributeVersion",kRestaurantVersionName);

	query.find({
		success: function(results) {
			var photoRestaurantVersion = results[0];
			console.log("Cambiando la version de: " + photoRestaurantVersion.get("attributeVersion"));
			console.log("Fecha de la version es: " + updatedAt);

			photoRestaurantVersion.set("dateVersion",updatedAt);
			photoRestaurantVersion.save();
		}
	});
});

Parse.Cloud.afterSave("Photo_Restaurant",function(request){
	var updatedAt = request.object.updatedAt;
	var VersionDate = Parse.Object.extend("dataVersion");
	
	var query = new Parse.Query(VersionDate);
	query.equalTo("attributeVersion",kPhotoRestaurantVersionName);

	query.find({
		success: function(results) {
			var restaurantVersion = results[0];
			console.log("Cambiando la version de: " + restaurantVersion.get("attributeVersion"));
			console.log("Fecha de la version es: " + updatedAt);

			restaurantVersion.set("dateVersion",updatedAt);
			restaurantVersion.save();
		}
	});
});