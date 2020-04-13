var Track = function(jsonObject) {
    var that = Object.create(Artist.prototype);
    that.artists = jsonObject.artists;
    that.external_ids = jsonObject.external_ids;
    that.external_urls = jsonObject.external_urls;
    that.href = jsonObject.href;
    that.name = jsonObject.name;
    that.id = jsonObject.id;
    that.popularity = jsonObject.popularity;
    that.preview_url = jsonObject.preview_url;
    that.type = jsonObject.type;
    that.uri = jsonObject.uri;
    Object.freeze(that);
    return that;
 };
 
 
 
 module.exports = Track;