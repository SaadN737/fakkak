const { YoutubeTranscript } = require('youtube-transcript');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    const { videoId } = req.query;

    if (!videoId) {
        return res.status(400).json({ error: 'يا وحش فين الـ videoId؟' });
    }

    try {
        // بنحاول نجيب الترجمة وبنقول للمكتبة تدور في العربي الأول وبعدين الإنجليزي
        const transcript = await YoutubeTranscript.fetchTranscript(videoId, {
            lang: 'ar' // جرب العربي الأول
        }).catch(() => {
            return YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' }); // لو فشل جرب الإنجليزي
        });

        const fullText = transcript.map(t => t.text).join(' ');
        res.status(200).json({ status: 'success', data: fullText });
    } catch (error) {
        res.status(500).json({ 
            status: 'error', 
            message: 'يوتيوب بيقولك: ' + error.message,
            tip: 'جرب فيديو تعليمي طويل، الفيديوهات القصيرة ساعات حمايتها أقوى'
        });
    }
};
