/* ============================================
   PROFILE SITE — JAVASCRIPT
   ============================================ */


// ===== PARTICLES =====
(function () {
  const c = document.getElementById('particles');
  const colors = ['#e8839b', '#d46b85', '#f5c6d0', '#f2cc8f', '#c9a0dc', '#81b29a', '#f7b7c5'];
  const shapes = ['dot','dot','dot','square','square','diamond','diamond','triangle','ring','ring','cross','star','hex'];

  for (let i = 0; i < 35; i++) {
    const p = document.createElement('div');
    const shape  = shapes[Math.floor(Math.random() * shapes.length)];
    const color  = colors[Math.floor(Math.random() * colors.length)];
    const size   = Math.random() * 20 + 6;
    const opacity = Math.random() * 0.25 + 0.08;
    const dur    = Math.random() * 25 + 18;
    const delay  = Math.random() * -30;

    p.className = 'particle ' + shape;
    let css = `left:${Math.random()*100}%;animation-duration:${dur}s;animation-delay:${delay}s;opacity:${opacity};`;

    if (shape === 'triangle') {
      css += `--tri-size:${Math.round(size/2)}px;--tri-color:${color};`;
    } else if (shape === 'ring') {
      css += `width:${size}px;height:${size}px;--ring-color:${color};`;
    } else if (shape === 'cross') {
      css += `width:${size}px;height:${size}px;--cross-color:${color};`;
    } else {
      css += `width:${size}px;height:${size}px;background:${color};`;
    }

    p.style.cssText = css;
    c.appendChild(p);
  }
})();


// ===== PAGE NAVIGATION =====
const pages    = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('nav a[data-page]');

function navigate(pageName) {
  pages.forEach(p => p.classList.remove('active'));
  navLinks.forEach(l => l.classList.remove('active'));
  document.getElementById('page-' + pageName)?.classList.add('active');
  document.querySelector(`nav a[data-page="${pageName}"]`)?.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

navLinks.forEach(link => {
  link.addEventListener('click', e => { e.preventDefault(); navigate(link.dataset.page); });
});


// ===== PROJECT FILTERS =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.status === filter) ? 'block' : 'none';
    });
  });
});


// ===== PROJECT DETAIL =====
const projectData = {
  bloom: {
    title: '🌸 Bloom', status: 'live', badge: 'badge-live',
    desc: 'A mindful journaling app with ambient soundscapes and mood tracking. Designed for people who want to build a daily reflection habit without the overwhelm.',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    links: [{ label: 'Live Demo', url: '#' }, { label: 'Source Code', url: '#' }]
  },
  terracotta: {
    title: '🏺 Terracotta', status: 'wip', badge: 'badge-wip',
    desc: 'An open-source design system with warm, earthy tones. Provides a complete component library for building cozy, human-centered interfaces.',
    stack: ['TypeScript', 'Storybook', 'CSS Variables', 'Figma'],
    links: [{ label: 'Documentation', url: '#' }, { label: 'NPM Package', url: '#' }]
  },
  campfire: {
    title: '🔥 Campfire', status: 'archived', badge: 'badge-archived',
    desc: 'Real-time collaborative workspace for creative teams. Combines a whiteboard, persistent chat, and file sharing into one fluid experience.',
    stack: ['Go', 'WebSocket', 'Redis', 'React'],
    links: [{ label: 'Archive', url: '#' }]
  },
  sprout: {
    title: '🌱 Sprout', status: 'new', badge: 'badge-new',
    desc: 'A habit tracker with a twist — your habits grow into a visual garden. Complete tasks to plant seeds, maintain streaks to watch them bloom.',
    stack: ['Vue', 'Supabase', 'Tailwind', 'Canvas API'],
    links: [{ label: 'Try It', url: '#' }, { label: 'Source Code', url: '#' }]
  },
  drift: {
    title: '🌊 Drift', status: 'archived', badge: 'badge-archived',
    desc: 'Minimal Pomodoro timer paired with ambient rain sounds and weekly focus statistics. No accounts, no clutter, just focus.',
    stack: ['Svelte', 'Firebase', 'Web Audio API'],
    links: [{ label: 'Archive', url: '#' }]
  }
};

function openDetail(e, key) {
  e.preventDefault();
  const d = projectData[key];
  if (!d) return;
  document.getElementById('detailContent').innerHTML = `
    <h2>${d.title}</h2>
    <span class="project-badge ${d.badge}" style="margin-bottom:16px">${d.status}</span>
    <p>${d.desc}</p>
    <div class="detail-stack">
      <h4>Tech Stack</h4>
      <div class="pills">${d.stack.map(s => `<span class="tech-pill">${s}</span>`).join('')}</div>
    </div>
    <div class="detail-links">
      ${d.links.map(l => `<a href="${l.url}">${l.label}</a>`).join('')}
      <a href="#" class="secondary" onclick="closeDetail()">close</a>
    </div>
  `;
  document.getElementById('detailOverlay').classList.add('open');
}

function closeDetail(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('detailOverlay').classList.remove('open');
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDetail(); });



const audio     = document.getElementById('audioPlayer');
const playBtn   = document.getElementById('playBtn');
const prevBtn   = document.getElementById('prevBtn');
const nextBtn   = document.getElementById('nextBtn');
const muteBtn   = document.getElementById('muteBtn');
const curTime   = document.getElementById('currentTime');
const totTime   = document.getElementById('totalTime');
const progressFill = document.getElementById('progressFill');
const progressBar  = document.getElementById('progressBar');
const volumeBar    = document.getElementById('volumeBar');
const volumeFill   = document.getElementById('volumeFill');
const volumePct    = document.getElementById('volumePct');

// Default volume
audio.volume = 0.8;
volumeFill.style.width = '80%';
volumePct.textContent = '80%';

// Format detik ke mm:ss
function formatTime(sec) {
  if (isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ':' + String(s).padStart(2, '0');
}

// Play / Pause
playBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play().catch(() => {
      showToast('⚠️ Letakkan file musik (.mp3) di folder yang sama');
    });
  } else {
    audio.pause();
  }
});

// Update tombol play/pause
audio.addEventListener('play', () => {
  playBtn.querySelector('.play-icon').style.display = 'none';
  playBtn.querySelector('.pause-icon').style.display = 'block';
});
audio.addEventListener('pause', () => {
  playBtn.querySelector('.play-icon').style.display = 'block';
  playBtn.querySelector('.pause-icon').style.display = 'none';
});

// Update progress bar
audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    const pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = pct + '%';
    curTime.textContent = formatTime(audio.currentTime);
  }
});

// Set total duration saat metadata loaded
audio.addEventListener('loadedmetadata', () => {
  totTime.textContent = formatTime(audio.duration);
});

// Selesai
audio.addEventListener('ended', () => {
  playBtn.querySelector('.play-icon').style.display = 'block';
  playBtn.querySelector('.pause-icon').style.display = 'none';
  progressFill.style.width = '0%';
  curTime.textContent = '0:00';
});

// Klik progress bar untuk seek
progressBar.addEventListener('click', (e) => {
  if (!audio.duration) return;
  const rect = progressBar.getBoundingClientRect();
  const pct  = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * audio.duration;
});

// Klik volume bar untuk adjust
volumeBar.addEventListener('click', (e) => {
  const rect = volumeBar.getBoundingClientRect();
  const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  audio.volume = pct;
  audio.muted  = false;
  volumeFill.style.width = (pct * 100) + '%';
  volumePct.textContent  = Math.round(pct * 100) + '%';
  updateMuteIcon();
});

// Drag volume bar (mouse hold)
let draggingVolume = false;
volumeBar.addEventListener('mousedown', (e) => {
  draggingVolume = true;
  setVolumeFromMouse(e);
});
document.addEventListener('mousemove', (e) => {
  if (draggingVolume) setVolumeFromMouse(e);
});
document.addEventListener('mouseup', () => { draggingVolume = false; });

function setVolumeFromMouse(e) {
  const rect = volumeBar.getBoundingClientRect();
  const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  audio.volume = pct;
  audio.muted  = false;
  volumeFill.style.width = (pct * 100) + '%';
  volumePct.textContent  = Math.round(pct * 100) + '%';
  updateMuteIcon();
}

// Mute / Unmute
muteBtn.addEventListener('click', () => {
  audio.muted = !audio.muted;
  updateMuteIcon();
});

function updateMuteIcon() {
  var volOn = muteBtn.querySelector('.vol-on');
  var volOff = muteBtn.querySelector('.vol-off');
  if (audio.muted || audio.volume === 0) {
    volOn.style.display = 'none';
    volOff.style.display = 'block';
  } else {
    volOn.style.display = 'block';
    volOff.style.display = 'none';
  }
}

// Previous — balik ke awal
prevBtn.addEventListener('click', () => {
  audio.currentTime = 0;
});

// Next — skip ke akhir (trigger ended)
nextBtn.addEventListener('click', () => {
  if (audio.duration) {
    audio.currentTime = audio.duration;
  }
});

// Scroll mouse di atas player untuk volume
document.querySelector('.music-player')?.addEventListener('wheel', (e) => {
  e.preventDefault();
  const delta = e.deltaY > 0 ? -0.05 : 0.05;
  audio.volume = Math.max(0, Math.min(1, audio.volume + delta));
  volumeFill.style.width = (audio.volume * 100) + '%';
  volumePct.textContent  = Math.round(audio.volume * 100) + '%';
  updateMuteIcon();
}, { passive: false });


// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.opacity = '1';
  t.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(20px)';
  }, 2500);
}
