const express = require('express');
const ytdl = require('@distube/ytdl-core');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Frontend folder ya file serve karne ke liye
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Download route
app.get('/download', async (req, res) => {
    const videoURL = req.query.url;

    if (!videoURL || !ytdl.validateURL(videoURL)) {
        return res.status(400).send('Galat ya invalid YouTube URL hai!');
    }

    try {
        // Video ki info nikalna taaki file ka naam theek se set ho sake
        const info = await ytdl.getInfo(videoURL);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, ''); // Special characters hatane ke liye

        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
        
        // Video stream ko user ke browser par bhejna
        ytdl(videoURL, {
            format: 'mp4',
            quality: 'highest'
        }).pipe(res);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Video download karne mein error aaya. YouTube ki policy ya link ki wajah se yeh ho sakta hai.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
