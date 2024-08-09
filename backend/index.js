const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');//library for download youtube video
const youtubePlaylist = require('youtube-playlist');//for playlist fetch 

require('dotenv').config({ path: './config/.env' });
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT;

const convertToFullURL = (shortUrl) => {
    const match = shortUrl.match(/youtu\.be\/([^?&]+)/);
    return match ? `https://www.youtube.com/watch?v=${match[1]}` : shortUrl;
};

// Helper function to fetch playlist items using YouTube Data API v3
const fetchPlaylistVideos = async (playlistId) => {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems`;
    const params = {
        part: 'snippet',
        playlistId: playlistId,
        maxResults: 50, // Adjust as needed
        key: YOUTUBE_API_KEY
    };
    const response = await axios.get(url, { params });
    return response.data.items.map(item => `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`);
};


app.post('/get-videos', async (req, res) => {
    const { url } = req.body;
    const fullUrl = convertToFullURL(url);

    try {

        if (fullUrl.includes('playlist')) {
            // Handle playlist URL

            const playlistId = new URL(fullUrl).searchParams.get('list');
            // console.log(playlistId);
            if (!playlistId) {
                return res.status(400).json({ error: 'Invalid playlist URL' });
            }
            const playlist = await youtubePlaylist(playlistId);
            console.log("playlist",playlist);
            const videoDetails = await Promise.all(playlist.items.map(async (videoUrl) => {
                const info = await ytdl.getInfo(videoUrl);
                return {
                    id: info.videoDetails.videoId,
                    title: info.videoDetails.title,
                    formats: info.formats
                };
            }));
            console.log(videoDetails);
            res.json({ videos: videoDetails });
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
