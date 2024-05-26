import axiosium from 'axios'

const axios = axiosium.create({ baseURL: 'http://localhost:5173/api', withCredentials: true })

export default axios
