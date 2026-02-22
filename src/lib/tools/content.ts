
export const SOCIAL_PLATFORMS = [
    { name: 'Instagram', data: [{ type: 'Post (Square)', size: '1080 x 1080 px' }, { type: 'Post (Portrait)', size: '1080 x 1350 px' }, { type: 'Story / Reel', size: '1080 x 1920 px' }] },
    { name: 'Twitter (X)', data: [{ type: 'Post Image', size: '1600 x 900 px' }, { type: 'Header', size: '1500 x 500 px' }] },
    { name: 'TikTok', data: [{ type: 'Video', size: '1080 x 1920 px' }] },
    { name: 'YouTube', data: [{ type: 'Thumbnail', size: '1280 x 720 px' }, { type: 'Channel Art', size: '2560 x 1440 px' }] },
    { name: 'LinkedIn', data: [{ type: 'Post', size: '1200 x 627 px' }, { type: 'Cover', size: '1128 x 191 px' }] },
];

export const CAPTION_TEMPLATES: Record<string, string[]> = {
    'Professional': ["We are thrilled to announce {topic}.", "Excited to share our latest work on {topic}.", "Efficiency meets innovation with {topic}."],
    'Casual': ["Guess what? {topic} is finally here! 🎉", "You asked, we delivered: {topic} 😎", "Weekend vibes with {topic}."],
    'Arabic': ["سعداء لإعلان {topic}. خطوة جديدة! 🚀", "أخيراً! {topic} أصبح متاحاً. شاركونا رأيكم 👇", "تميز مع {topic}."]
};

export function generateCaption(topic: string, tone: string) {
    const templates = CAPTION_TEMPLATES[tone] || CAPTION_TEMPLATES['Professional'];
    return templates.map(t => t.replace('{topic}', topic));
}

export function generateContentIdeas(niche: string) {
    const patterns = ["How to get started with {niche}", "Top 5 mistakes in {niche}", "The future of {niche}", "A beginner's guide to {niche}"];
    return patterns.map(p => p.replace('{niche}', niche));
}

export function proofreadText(text: string) {
    // Simple mock logic for now
    let p = text.replace(/\s+([،.!:?])/g, '$1').replace(/([،.!:?])(?=[^\s])/g, '$1 ').replace(/\s+/g, ' ');
    p = p.replace(/انشاء/g, 'إنشاء').replace(/هاذا/g, 'هذا');
    return p;
}
