import socketIOClient from 'socket.io-client'
import sailsIOClient from 'sails.io.js'

export default class ChatSocket {
    constructor () {
        let io
        if (socketIOClient.sails) {
            io = socketIOClient
        } else {
            io = sailsIOClient(socketIOClient)
        }
        io.sails.url = process.env.API || `http://localhost:1337`
        // let socket = new WebSocket('wss://msg.ghtk.vn:1338/socket.io/?key=0TLRF1kgptlWpOEc3UKv5vW60aExDG&m=browser&__sails_io_sdk_language=javascript&EIO=3&transport=websocket')
        io.socket = io.sails.connect()
        this.instance = io
    }
}
