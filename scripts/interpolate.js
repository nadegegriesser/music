const fs = require('fs');
const mm = require('@magenta/music/node/music_vae_node');
const model = new mm.MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small');

async function run() {
  await model.initialize();
  const elise = mm.midiToSequenceProto(fs.readFileSync('midi/fur_elise.mid'));
  const jazz = mm.midiToSequenceProto(fs.readFileSync('seeds/jazz_seed.mid'));
  const [out] = await model.interpolate([elise, jazz], 3);
  fs.writeFileSync('audio/combined.mid', mm.sequenceProtoToMidi(out));
}
run();
