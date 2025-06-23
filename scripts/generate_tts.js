const googleTTS = require('google-tts-api');

(async()=>{
  const url = googleTTS.getAudioUrl("Here is Für Elise in a smooth jazz style, enjoy!", {lang:'en'});
  execSync(`curl "${url}" -o audio/speech.mp3`);
})();
