// Global variables
const client = io();
const synth = window.speechSynthesis;
const utter = new SpeechSynthesisUtterance();
utter.rate = 0.9;

//#region Speech synthesis configuration

// Wait for synth voices to load and then change the voice
speechSynthesis.onvoiceschanged = () => {
    let voices = synth.getVoices();
    for (let voice of voices){
        if (voice.name == 'Google UK English Female'){
            return utter.voice = voice;
        }
    }
};

// Text-To-Speech
function speak(text){
    utter.text = text;
    synth.speak(utter);
}

//#endregion

//#region Messages from the server

// A new ticket has been received, speak the given text
client.on('newTicket', text => {
    speak(text);
});

//#endregion
