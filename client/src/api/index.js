import axios from 'axios'

const BASE_URL = "http://localhost:5000/api"

var api = axios.create({
    baseURL: 'http://localhost:5000/api',
})


export const insertMovie = payload => api.post(`/movie`, payload)
export const getAllMovies = () => api.get(`/movies`)
export const updateMovieById = (id, payload) => api.put(`/movie/${id}`, payload)
export const deleteMovieById = id => api.delete(`/movie/${id}`)
export const getMovieById = id => api.get(`/movie/${id}`)


var music_app_api = axios.create({
    baseURL: BASE_URL
})
music_app_api.start_authentication = app => music_app_api.get(`/auth/start/${app}`)
music_app_api.register_music_app = payload => music_app_api.post(`/auth/register`, payload)

// refresh token!
music_app_api.interceptors.response.use(function(response) {
    return response;
}, function (error) {
    if (error.response.status != 401) {
        return error
    }

    var request = error.response.request
    console.log("interceptor!");
    console.log(request);
    refresh_token(request.body);
});

var refresh_token = payload => music_app_api.put(`/auth/refresh`, payload)
music_app_api.refresh_token = refresh_token;


var user_api = axios.create({
    baseURL: BASE_URL+"/user"
})
user_api.create_user = payload => user_api.post('/',payload)
user_api.update_user = (id, payload) => user_api.put(`/${id}`, payload)


var recommendation_api = axios.create({
    baseURL: BASE_URL+"/recommendation"
});

recommendation_api.create_recommendation = (music_app_id, payload) => recommendation_api.post(`/${music_app_id}`, payload);

export {api, user_api, music_app_api, recommendation_api}