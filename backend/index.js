const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');//library for download youtube video
require('dotenv').config({ path: './config/.env' });
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT;

const convertToFullURL = (shortUrl) => {
    const match = shortUrl.match(/youtu\.be\/([^?&]+)/);
    return match ? `https://www.youtube.com/watch?v=${match[1]}` : shortUrl;
};


//endpont for download video
app.post('/download', async (req, res) => {
    const { url } = req.body;

    const fullUrl = convertToFullURL(url);

    if (!ytdl.validateURL(fullUrl)) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    try {
        const info = await ytdl.getInfo(fullUrl);
        // console.log('Available formats:', info.formats); // Log all available formats

        const format = info.formats.find(f => f.qualityLabel === '144p') ||
            info.formats.find(f => f.qualityLabel === '360p') ||
            info.formats.find(f => f.qualityLabel === '720p');

        if (!format) {
            return res.status(400).json({ error: 'No suitable format available' });
        }
        res.setHeader('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp4"`);
        ytdl(fullUrl, { format: format }).pipe(res);

        
    } catch (err) {
        console.error('Error retrieving video information:', err);
        res.status(500).json({ error: 'Failed to retrieve video details' });
    }
});



app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
});
