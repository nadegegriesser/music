execSync(`ffmpeg -loop 1 -i img/bg.jpg -i audio/lofi_final.wav -i audio/speech.mp3 -filter_complex "[1][2]amix=inputs=2" -c:v libx264 -t 30 -pix_fmt yuv420p output/final.mp4`);
