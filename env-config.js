const dev = process.env.NODE_ENV !== 'production';
const staging = process.env.STAGING == 1;

module.exports = {
  DEV: dev,
  HOST: dev ? 'http://localhost:3000' : staging,
  API_URL: 'http://localhost:8900',
  FB_AOO_ID: '',
  SOCKET_URL: ''
}