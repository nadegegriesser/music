import {readFileSync, createReadStream} from 'fs';
import {google} from 'googleapis';

const OAuth2 = google.auth.OAuth2;
const credentials = JSON.parse(fs.readFileSync('client_secret.json'));
const oauth2 = new OAuth2(credentials.installed.client_id, credentials.installed.client_secret, credentials.installed.redirect_uris[0]);
oauth2.setCredentials(JSON.parse(fs.readFileSync('token.json')));
const youtube = google.youtube({ version: 'v3', auth: oauth2 });

async function upload() {
  await youtube.videos.insert({
    part: 'snippet,status',
    requestBody: {
      snippet: { title: 'Für Elise – Jazz LoFi', description: 'Automatisch generiert via Magenta + RobotoVoice', tags: ['jazz','lofi','magenta'], categoryId: '10' },
      status: { privacyStatus: 'public' }
    },
    media: { body: fs.createReadStream('output/final.mp4') }
  });
}
upload();
