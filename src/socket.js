import io from 'socket.io-client'


const socket = io('https://travel-map-socket-service.herokuapp.com/')


export default socket;