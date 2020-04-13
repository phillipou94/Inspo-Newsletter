const User = require('../models/User.js')

createUser = (req, res) => {
    const body = req.body;
    console.log(body);
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a user object',
        })
    }

    const user = new User(body)

    if (!user) {
        return res.status(400).json({ success: false, error: err })
    }

    user
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                _id: user._id,
                message: 'User created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'User not created!',
            })
        })

}

updateUser = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'User not found!',
            })
        }
        console.log("bodyy!!");
        console.log(req.body);
        user.name = body.name ? body.name : user.name;
        user.email = body.email ? body.email : user.name;
        user.default_music_app = body.default_music_app ? body.default_music_app : user.default_music_app;
        user.music_app_id = body.music_app_id ? body.music_app_id : user.music_app_id;
        user
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    user: user,
                    message: 'User updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'User not updated!',
                })
            })
    })
}


module.exports = {
    createUser,
    updateUser
}