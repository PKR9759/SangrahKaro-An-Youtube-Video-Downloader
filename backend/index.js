const express= require('express');
const ytdl= require('ytdl-core');//library for download youtube video
require('dotenv').config({ path: './config/.env' });
const app = express();
app.use(express.json());
const PORT=process.env.PORT;

//endpont for download video
app.post('/download',async(req, res) => {

    const {url} = req.body;
    if(!ytdl.validateURL(url)){
        return res.status(404).json({error:"Invalid URL"});
    }

    try{
        const info=await ytdl.getInfo(url);
        const format=ytdl.chooseFormat(info.formats,{quality:'144p'});

        res.json({
            title:info.videoDetails.title,
            downloadUrl:format.url,
        });
    }
    catch(err) {
        res.status(500).json({error:"failed to retrieve video details"});
    }

});

    
app.listen(PORT,() => {
    console.log('listening on port '+PORT);
});
