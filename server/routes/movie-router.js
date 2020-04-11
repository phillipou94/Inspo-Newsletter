const express = require('express')

const MovieCtrl = require('../controllers/movie-ctrl')
const MusicAppManager = require('../controllers/music_app_manager.js');

const router = express.Router()

router.post('/movie', MovieCtrl.createMovie)
router.put('/movie/:id', MovieCtrl.updateMovie)
router.delete('/movie/:id', MovieCtrl.deleteMovie)
router.get('/movie/:id', MovieCtrl.getMovieById)
router.get('/movies', MovieCtrl.getMovies)

router.get('/auth/start/:app', MusicAppManager.start_authentication)
router.post('/auth/register', MusicAppManager.register_music_app)


module.exports = router;