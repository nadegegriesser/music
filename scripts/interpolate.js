const fs = require('fs');
const mm = require('@magenta/music');
const model = new mm.MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small');

async function run() {
  await model.initialize();
  const elise = mm.midiToSequenceProto(fs.readFileSync('midi/fur_elise.mid'));
  //const jazz = mm.midiToSequenceProto(fs.readFileSync('seeds/jazz_seed.mid'));
  const jazzSeed = {
  notes: [
    { pitch: 60, startTime: 0, endTime: 0.5 },
    { pitch: 63, startTime: 0.5, endTime: 1 },
    { pitch: 67, startTime: 1, endTime: 1.5 },
    { pitch: 70, startTime: 1.5, endTime: 2 }
  ],
  totalTime: 2,
  quantizationInfo: { stepsPerQuarter: 4 }
};
  const [out] = await model.interpolate([elise, jazzSeed], 3);
  fs.writeFileSync('audio/combined.mid', mm.sequenceProtoToMidi(out));
}
run();
