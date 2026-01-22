/**
 * Media Tools Module
 * Audio Recorder
 */

const MediaTools = {
    _t: function (en, ar) {
        return document.documentElement.lang === 'ar' ? ar : en;
    },

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
    }
};

window.MediaTools = MediaTools;
