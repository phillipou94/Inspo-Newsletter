var Artist = function(jsonObject) {
   var that = Object.create(Artist.prototype);
   that.external_urls = jsonObject.external_urls;
   that.followers = jsonObject.followers;
   that.genres = jsonObject.genres;
   that.images = jsonObject.images;
   that.name = jsonObject.name;
   that.id = jsonObject.id;
   that.href = jsonObject.href;
   that.popularity = jsonObject.popularity;
   that.type = jsonObject.type;
   that.uri = jsonObject.uri;
   Object.freeze(that);
   return that;
};



module.exports = Artist;