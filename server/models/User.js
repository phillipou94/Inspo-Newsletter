var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
    name: String,
    email: String,
    default_music_app: String,
    created_at: Date,
    updated_at: Date
});

// var User = mongoose.model("User", UserSchema);

var User = mongoose.model('User', UserSchema);

// var User = (function(UserModel) {
//     var that = {}

//     that.create = function(name, email, default_music_app) {
        
//         return new Promise (
//             (resolve, reject) => {
                
//             });
            
//     }


//     Object.freeze(that);
//     return that;
// })(UserModel);

module.exports = User;
