const dev = process.env.NODE_ENV !== 'production';
const staging = process.env.STAGING == 1;

module.exports = {
  DEV: dev,
  HOST: dev ? 'http://localhost:3000' : 'https://codetrainee.codes',
  API_URL: dev ? 'http://localhost:1337' : 'https://api.codetrainee.codes',
  FB_AOO_ID: '',
  SOCKET_URL: ''
}

// const envConfig = {
//   DEV: dev,
//   HOST: dev ? 'http://localhost:3000' : 'https://codetrainee.codes',
//   API_URL: dev ? 'http://localhost:1337' : 'https://api.codetrainee.codes',
//   FB_AOO_ID: '',
//   SOCKET_URL: ''
// }

// export default envConfig