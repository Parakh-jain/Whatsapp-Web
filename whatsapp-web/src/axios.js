import axios from 'axios'

const instance =axios.create({
    baseURL:"https://whatsapp-web-mern.herokuapp.com",
});
export default instance;