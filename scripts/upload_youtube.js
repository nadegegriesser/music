import {createReadStream} from 'fs';
import {google} from 'googleapis';

const OAuth2 = google.auth.OAuth2;
const oauth2 = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'https://developers.google.com/oauthplayground');
oauth2.setCredentials({refresh_token: process.env.GOOGLE_REFRESH_TOKEN});
const youtube = google.youtube({ version: 'v3', auth: oauth2 });

async function upload() {
  await youtube.videos.insert({
    part: 'snippet,status',
    requestBody: {
      snippet: { title: 'Für Elise – Jazz LoFi', description: 'Automatisch generiert via Magenta + RobotoVoice', tags: ['jazz','lofi','magenta'], categoryId: '10' },
      status: { privacyStatus: 'public' }
    },
    media: { body: createReadStream('output/final.mp4') }
  });
}
upload();
