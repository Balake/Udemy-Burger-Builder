import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://react-my-burger-1ce11.firebaseio.com/'
})

export default instance