const { YoutubeTranscript } = require('youtube-transcript');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    const { videoId } = req.query;

    if (!videoId) {
        return res.status(400).json({ error: 'فين الـ videoId يا وحش؟' });
    }

    try {
        const transcript = await YoutubeTranscript.fetchTranscript(videoId);
        const fullText = transcript.map(t => t.text).join(' ');
        res.status(200).json({ status: 'done', data: fullText });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
}; 
