'use strict';

/*************** variables *******************/
const express = require('express');
const app = express();
app.use(express.static(__dirname + '/src')); // js, css, html, images

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Express server listening on port http://localhost:%d in %s mode', server.address().port, app.settings.env);
});

const APIAI_TOKEN = '1a8e78c15b934f57b4240312b38ae4ac';
const APIAI_SESSION_ID = 'Jonathans_Sesion';
const apiai = require('apiai')(APIAI_TOKEN);
const io = require('socket.io')(server);

/************** socket on conection *********************/
io.on('connection', function(socket){
  console.log('a user connected');
});


app.get('/', (req, res) => {
  res.sendFile('index.html');
});

io.on('connection', function(socket) {
  socket.on('bot-message', (text) => {
    console.log('user message: ' + text);

    const apiaiResponse = apiai.textRequest(text, {
      sessionId: APIAI_SESSION_ID
    });

    apiaiResponse.on('response', (response) => {
      const nplResponse = response.result.fulfillment.speech;
      console.log('bot response: ' + nplResponse);
      socket.emit('bot-response', nplResponse);
    });

    apiaiResponse.on('error', (error) => {
      console.log(error);
    });

    apiaiResponse.end();

  });
});