//require libs
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

//connect mongodb

mongoose.connect('mongodb://localhost/DataSet');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
console.log('connection successful!');
});

//create schema
var Schema = mongoose.Schema;
var macrocategorySchema = new Schema({
             macrocategory:  { type: String, required: true, unique: true },
             listplaces: [],
             listvenues: []

  });

var instagramIdSchema = new Schema({
             id:  { type: String, required: true, unique: true },
             foursquare_v2_id: { type: String, required: true, unique: true },
             category_place: String,
             name: String,
             latitude: String,
             longitude:String

	});

var instagramIdSchema2 = new Schema({
             id:  { type: String, required: true, unique: true },
             foursquare_v2_id: { type: String, required: true, unique: true },
             category_place: String,
             name: String,
             latitude: Number,
             longitude:Number,
             macrocategory: String

	});

instagramIdSchema2.plugin(uniqueValidator);
var instagramId2 = mongoose.model('instagram_venues_macrocategory', instagramIdSchema2);

instagramIdSchema.plugin(uniqueValidator);
var instagramId = mongoose.model('instagram_venues2', instagramIdSchema);

macrocategorySchema.plugin(uniqueValidator);
var macrocategory = mongoose.model('macrocategory', macrocategorySchema);

//functions
function updateCategory(single_category, id, four,lat,lng,name){
//add the macrocategory for every type of category
var stream3 = macrocategory.find().stream();
stream3.on('data', function (doc3) {

for (var i = 0; i < doc3.listplaces.length; i++) {
  if (single_category==doc3.listplaces[i]) {
    var newdata= {
              'id' : id,
              'foursquare_v2_id' : four,
              'category_place': single_category,
              "name": name,
              "latitude": lat,
              "longitude":lng,
              'macrocategory': doc3.macrocategory
            }

    saveVenues(new instagramId2(newdata));
  }
}

}).on('error', function (err) {
  // handle the error
  console.log(err);
}).on('close', function () {
  // the stream is closed
  // console.log("end steam 2!");
});

}

function	saveVenues(venues){
	venues.save(function (err) {
		if (err) {
      //console.log(err);
			count2++;
			console.log("venue duplicate = "+ count2);
		}else{
			count3++;
			console.log("new venue saved --------------->   "+venues);
			console.log("Number venues save = "+count3);
		}
	});
  return;
};
//end functions

var stream2 = instagramId.find({}).stream();
stream2.on('data', function (doc2) {
console.log(doc2);
//  console.log(doc2.category_place);
  updateCategory(doc2.category_place,doc2.id,doc2.foursquare_v2_id,doc2.latitude,doc2.longitude, doc2.name);

}).on('error', function (err) {

  console.log(err);

}).on('close', function () {

});


var count2=0;
var count3=0;
