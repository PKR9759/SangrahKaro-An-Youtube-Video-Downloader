const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');//library for download youtube video
// const { DisTube } = require('distube');
const ytpl= require('@distube/ytpl');
require('dotenv').config({ path: './config/.env' });
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT;

const convertToFullURL = (shortUrl) => {
    const match = shortUrl.match(/youtu\.be\/([^?&]+)/);
    return match ? `https://www.youtube.com/watch?v=${match[1]}` : shortUrl;
};


app.post('/get-videos', async (req, res) => {
    const { url } = req.body;
    const fullUrl = convertToFullURL(url);

    try {

        if (fullUrl.includes('playlist')) {
            // Handle playlist URL

            const playlistId = new URL(fullUrl).searchParams.get('list');
            if (!playlistId) {
                return res.status(400).json({ error: 'Invalid playlist URL' });
            }

            const playlist = await ytpl(playlistId);
            // console.log('Playlist response:', playlist);
            
            
            const videoDetails = await Promise.all(playlist.items.map(async (video) => {
                const videoUrl = convertToFullURL(video.url); // Ensure URL format is correct
                console.log('Video URL:', videoUrl);

                try {
                    const info = await ytdl.getInfo(videoUrl);
                    return {
                        id: info.videoDetails.videoId,
                        title: info.videoDetails.title,
                        formats: info.formats
                    };
                } catch (err) {
                    console.error('Error retrieving info for video:', videoUrl, err);
                    return null; // Handle error by skipping this video
                }
            }));

            // Filter out any null results due to errors
            const filteredVideoDetails = videoDetails.filter(video => video !== null);

            res.json({ videos: filteredVideoDetails });
        }
        else {
            // Handle single video URL

            const info = await ytdl.getInfo(fullUrl);
            const formats = info.formats;
            const defaultFormat = formats.find(f => f.qualityLabel === '144p') ||
                formats.find(f => f.qualityLabel === '360p') ||
                formats.find(f => f.qualityLabel === '720p');
            const video = {
                id: info.videoDetails.videoId,
                title: info.videoDetails.title,
                formats: formats,
                defaultFormat: defaultFormat
            };
            res.json({ videos: [video] });
        }
    } catch (err) {
        console.error('Error retrieving video information:', err);
        res.status(500).json({ error: 'Failed to retrieve video details' });
    }
});

//endpont for download video
app.post('/download', async (req, res) => {
    const { videoId, quality, format } = req.body;
    const fullUrl = `https://www.youtube.com/watch?v=${videoId}`;

    if (!ytdl.validateURL(fullUrl)) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    try {
        const info = await ytdl.getInfo(fullUrl);
        const formats = info.formats;

        let chosenFormat;
        if (format === 'mp3') {
            // Find the best audio format available
            chosenFormat = formats.find(f => f.mimeType.includes('audio/mp4'));
            if (!chosenFormat) {
                return res.status(400).json({ error: 'No suitable audio format available' });
            }
            res.setHeader('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp3"`);
            ytdl(fullUrl, { format: chosenFormat, filter: 'audioonly' }).pipe(res);
        } else {
            // Find the chosen video format
            chosenFormat = formats.find(f => f.qualityLabel === quality && f.mimeType.includes('video/mp4')) ||
                formats.find(f => f.qualityLabel === '360p') ||
                formats.find(f => f.qualityLabel === '720p');
            if (!chosenFormat) {
                return res.status(400).json({ error: 'No suitable video format available' });
            }
            res.setHeader('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp4"`);
            ytdl(fullUrl, { format: chosenFormat }).pipe(res);
        }
    } catch (err) {
        console.error('Error retrieving video information:', err);
        res.status(500).json({ error: 'Failed to retrieve video details' });
    }
});


app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
});
