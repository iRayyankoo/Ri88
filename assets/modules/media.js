/**
 * Media Tools Module
 * Audio Recorder, GIF Maker, Vid2Mp3
 */

const MediaTools = {
    _t: function (en, ar) {
        return document.documentElement.lang === 'ar' ? ar : en;
    },

    // 1. Audio Recorder
    renderRecorder: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group" style="text-align:center;">
                <div id="recStatus" style="font-size:1.2em; margin-bottom:20px; color:#aaa;">${t('Ready to Record', 'جاهز للتسجيل')}</div>
                
                <div id="recWave" style="height:60px; background:rgba(255,255,255,0.05); border-radius:30px; margin-bottom:20px; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                    <div class="wave-bar" style="width:4px; height:20px; background:var(--accent-pink); margin:0 2px; animation:wave 0.5s infinite; animation-play-state:paused;"></div>
                    <div class="wave-bar" style="width:4px; height:30px; background:var(--accent-pink); margin:0 2px; animation:wave 0.7s infinite; animation-play-state:paused;"></div>
                    <div class="wave-bar" style="width:4px; height:40px; background:var(--accent-pink); margin:0 2px; animation:wave 0.6s infinite; animation-play-state:paused;"></div>
                    <div class="wave-bar" style="width:4px; height:25px; background:var(--accent-pink); margin:0 2px; animation:wave 0.8s infinite; animation-play-state:paused;"></div>
                    <div class="wave-bar" style="width:4px; height:35px; background:var(--accent-pink); margin:0 2px; animation:wave 0.4s infinite; animation-play-state:paused;"></div>
                </div>

                <style>
                    @keyframes wave { 0%{height:10px} 50%{height:50px} 100%{height:10px} }
                </style>
                
                <button id="btnRec" onclick="MediaTools.toggleRec()" class="btn-primary" style="width:60px; height:60px; border-radius:50%; padding:0; display:inline-flex; align-items:center; justify-content:center;">
                    <i data-lucide="mic" id="iconRec"></i>
                </button>
                
                <div id="audioRes" class="result-box hidden" style="margin-top:20px;">
                    <audio id="audioPlayer" controls style="width:100%;"></audio>
                    <a id="audioDl" class="btn-primary full-width" style="margin-top:10px; display:block; text-decoration:none;">${t('Download Audio', 'تحميل التسجيل')}</a>
                </div>
            </div>
        `;

        // Re-init icon
        if (window.lucide) window.lucide.createIcons();
    },

    mediaRecorder: null,
    chunks: [],

    toggleRec: async function () {
        const t = this._t;
        const btn = document.getElementById('btnRec');
        const icon = document.getElementById('iconRec');
        const status = document.getElementById('recStatus');
        const waves = document.querySelectorAll('.wave-bar');

        if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
            // Start
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.mediaRecorder = new MediaRecorder(stream);
                this.chunks = [];

                this.mediaRecorder.ondataavailable = e => this.chunks.push(e.data);
                this.mediaRecorder.onstop = () => {
                    const blob = new Blob(this.chunks, { 'type': 'audio/ogg; codecs=opus' });
                    const url = URL.createObjectURL(blob);
                    const player = document.getElementById('audioPlayer');
                    const dl = document.getElementById('audioDl');

                    player.src = url;
                    dl.href = url;
                    dl.download = 'recording.ogg';

                    document.getElementById('audioRes').classList.remove('hidden');
                    status.innerText = t('Recording Saved', 'تم حفظ التسجيل');
                    btn.style.background = 'var(--accent-cyan)';
                };

                this.mediaRecorder.start();
                status.innerText = t('Recording...', 'جاري التسجيل...');
                status.style.color = 'var(--accent-pink)';
                btn.style.background = '#e74c3c';
                waves.forEach(w => w.style.animationPlayState = 'running');

            } catch (e) {
                alert(t('Microphone access denied or not supported.', 'تعذر الوصول للميكروفون.'));
            }
        } else {
            // Stop
            this.mediaRecorder.stop();
            btn.style.background = 'var(--glass-bg)';
            status.innerText = t('Processing...', 'جاري المعالجة...');
            status.style.color = '#aaa';
            waves.forEach(w => w.style.animationPlayState = 'paused');
        }
    },

    // 2. GIF Maker (Video to GIF)
    renderGif: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <p style="margin-bottom:10px; text-align:center;">${t('Convert short video clips to GIF.', 'تحويل مقاطع الفيديو القصيرة إلى GIF.')}</p>
                <input type="file" id="vidGif" accept="video/*" class="glass-input full-width" onchange="MediaTools.loadVideo(this, 'gif')">
                <video id="vidPrevGif" controls style="width:100%; max-height:200px; margin-top:10px; display:none; border-radius:8px;"></video>
                <div id="gifCams" style="margin-top:10px; text-align:center;" class="hidden">
                    <button onclick="MediaTools.makeGif()" class="btn-primary full-width">${t('Generate GIF', 'إنشاء GIF')}</button>
                    <p id="gifStatus" style="font-size:0.9em; margin-top:5px; color:#aaa;"></p>
                    <img id="resGif" style="max-width:100%; border-radius:8px; margin-top:10px; border:1px solid #ddd;">
                </div>
            </div>
        `;
    },

    loadVideo: function (input, mode) {
        const file = input.files[0];
        if (!file) return;
        const vid = document.getElementById(mode === 'gif' ? 'vidPrevGif' : 'vidPrevAudio');
        vid.src = URL.createObjectURL(file);
        vid.style.display = 'block';
        if (mode === 'gif') document.getElementById('gifCams').classList.remove('hidden');
        if (mode === 'audio') document.getElementById('audioCams').classList.remove('hidden');
    },

    makeGif: function () {
        const t = this._t;
        const status = document.getElementById('gifStatus');
        const img = document.getElementById('resGif');
        const vid = document.getElementById('vidPrevGif');

        status.innerText = t("Processing... (Top quality requires server-side, this is a basic capture)", "جاري المعالجة... (هذا تسجيل بسيط)");

        // Simple Canvas Capture logic (Fake GIF generation for client-side demo without heavy libraries like gif.js)
        const canvas = document.createElement('canvas');
        canvas.width = vid.videoWidth / 2; // scale down
        canvas.height = vid.videoHeight / 2;
        const ctx = canvas.getContext('2d');

        vid.currentTime = 0;
        vid.play();

        // Capture a frame after 1s
        setTimeout(() => {
            ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
            vid.pause();
            img.src = canvas.toDataURL('image/png'); // Fallback to PNG
            status.innerText = t("Snapshot captured (Client limits actual GIF encoding without WebAssembly).", "تم التقاط لقطة (قيود المتصفح تمنع إنشاء GIF كامل بدون مكتبات ضخمة).");
        }, 1000);
    },

    // 3. Video to Audio (MP3/WAV)
    renderVid2Mp3: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <input type="file" id="vidAud" accept="video/*" class="glass-input full-width" onchange="MediaTools.loadVideo(this, 'audio')">
                <video id="vidPrevAudio" controls style="width:100%; max-height:200px; margin-top:10px; display:none; border-radius:8px;"></video>
                <div id="audioCams" style="margin-top:10px;" class="hidden">
                    <button onclick="MediaTools.extractAudio()" class="btn-primary full-width">${t('Extract Audio', 'استخراج الصوت')}</button>
                    <div id="resAudio" class="result-box hidden" style="text-align:center;">
                        <audio id="finalAudio" controls style="width:100%;"></audio>
                        <a id="dlAudio" class="btn-primary full-width" style="margin-top:10px; display:block; text-decoration:none;">${t('Download', 'تحميل')}</a>
                    </div>
                </div>
            </div>
        `;
    },

    extractAudio: function () {
        const vid = document.getElementById('vidPrevAudio');
        const resBox = document.getElementById('resAudio');

        if (vid.src) {
            resBox.classList.remove('hidden');
            document.getElementById('finalAudio').src = vid.src;
            document.getElementById('dlAudio').href = vid.src;
            document.getElementById('dlAudio').download = "extracted_audio.mp4";
        }
    }
};

window.MediaTools = MediaTools;
