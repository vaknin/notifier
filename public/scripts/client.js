// Connectivity
const client = io();

// Synth voice
const synth = window.speechSynthesis;
const utter = new SpeechSynthesisUtterance();

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

//Recieve a message
client.on('newTicket', msg => {
    speak(msg);
});