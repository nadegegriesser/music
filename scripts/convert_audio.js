const { execSync } = require('child_process');
execSync(`fluidsynth -ni 'Creative (emu10k1)8MBGMSFX.SF2' audio/combined.mid -F audio/lofi.wav -r 44100`);
execSync(`ffmpeg -i audio/lofi.wav -af "lowpass=f=1500,acompressor,volume=1.1" audio/lofi_final.wav`);
