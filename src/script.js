'use strict';


/*************** variables *******************/
const socket = io();


const botOutput = document.querySelector('.bot-output');
const conversationContainer = document.querySelector('.conversation');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'es';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const synth = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance();

/*************** listerners for speech recognition *******************/

// on start
document.querySelector('.start-conversation').addEventListener('click', () => {
  console.log('conversation start')
  recognition.start();
});
// on end
document.querySelector('.end-conversation').addEventListener('click', () => {
  console.log('conversation stop')
  recognition.stop();
});
// on speech starr
recognition.addEventListener('speechstart', () => {
  console.log('conversation has started.');
});
// on speech end
recognition.addEventListener('speechend', () => {
  console.log('conversation has finished.');
  recognition.stop();
});
// on spech result
recognition.addEventListener('result', (event) => {
  console.log('conversation result');
  const last = event.results.length - 1;
  const text = event.results[last][0].transcript;
  const element = userElement(text)
  conversationContainer.insertAdjacentHTML('beforeend', element)
  console.log('user said: ' + text);
  socket.emit('bot-message', text);
});
// on error
recognition.addEventListener('error', (event) => {
  botOutput.textContent = 'Error: ' +event.error;
});

// synth.getVoices().forEach(function(voice, key) {
  //   console.log('Hi! My name is ', voice.name, key);
  // });

// speak function
function speakResponse(text) {
  const voice = synth.getVoices()
  utterance.voice = voice[51];
  utterance.text = text;
  synth.speak(utterance);
}
// socket on bot response from dialogflow
socket.on('bot-response', function(botResponse) {
  if(botResponse == '') {
    botResponse = 'no Response from bot, please try again';
  }
  const element = botElement(botResponse)
  conversationContainer.insertAdjacentHTML('beforeend', element)
  speakResponse(botResponse);
});

function userElement(userOutput){
  const user = `<p class="p-user-output"><strong>Usuario:</strong> <span class="user-output">${userOutput}</span></p>`;
  return user;
}

function botElement(botOutput){
  const user = `<p class="p-bot-output"><span class="bot-output">${botOutput}</span><strong> :JohnnyBot</strong> </p>`;
  return user;
}