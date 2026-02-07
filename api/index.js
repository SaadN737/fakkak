const { getSubtitles } = require('youtube-captions-scraper');

module.exports = async (req, res) => {
    // إعدادات الـ CORS عشان n8n ميزعلش
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    const { videoId } = req.query;

    if (!videoId) {
        return res.status(400).json({ error: 'فين الـ videoId يا وحش؟' });
    }

    try {
        // بنحاول نسحب الترجمة
        const subtitles = await getSubtitles({
            videoID: videoId, // لازم الـ D تكون Capital هنا
            lang: 'ar'
        });

        // تحويل المصفوفة لنص واحد
        const fullText = subtitles.map(s => s.text).join(' ');

        res.status(200).json({
            status: 'success',
            data: fullText
        });
    } catch (error) {
        // لو فشل في العربي، بنجرب الإنجليزي كمحاولة أخيرة
        try {
            const enSubtitles = await getSubtitles({
                videoID: videoId,
                lang: 'en'
            });
            const enText = enSubtitles.map(s => s.text).join(' ');
            res.status(200).json({ status: 'success', data: enText });
        } catch (enError) {
            res.status(500).json({ 
                status: 'error', 
                message: 'يوتيوب قافل الترجمة تماماً للفيديو ده: ' + enError.message 
            });
        }
    }
};
