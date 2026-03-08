if ('serviceWorker' in navigator) { navigator.serviceWorker.register('./sw.js'); }

setTimeout(() => {
    document.getElementById('splash').classList.add('hidden');
    if(localStorage.getItem('logged') === 'true') showDashboard();
    else document.getElementById('reg-page').classList.remove('hidden');
}, 4000);

function checkRole() {
    const role = document.getElementById('role').value;
    document.getElementById('code').classList.toggle('hidden', role === 'student');
}

function login() {
    const phone = document.getElementById('phone').value;
    const role = document.getElementById('role').value;
    const code = document.getElementById('code').value;

    if(!(phone.startsWith('09') || phone.startsWith('07')) || phone.length !== 10) {
        alert("የቴሌ ስልክ ብቻ ይጠቀሙ!"); return;
    }
    if(role === 'teacher' && code !== '121619') { alert("የመምህር ኮድ ስህተት!"); return; }
    if(role === 'admin' && code !== '12161921') { alert("የአስተዳዳሪ ኮድ ስህተት!"); return; }

    localStorage.setItem('logged', 'true');
    localStorage.setItem('role', role);
    showDashboard();
}

function showDashboard() {
    document.getElementById('reg-page').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    const role = localStorage.getItem('role');
    if(role === 'admin') document.getElementById('admin-panel').classList.remove('hidden');
    
    const savedNotice = localStorage.getItem('broadcast');
    if(savedNotice) {
        const nb = document.getElementById('notice-board');
        nb.innerText = "📢 ማስታወቂያ፡ " + savedNotice;
        nb.classList.remove('hidden');
    }
}

function showSubjects(grade) {
    document.getElementById('grade-view').classList.add('hidden');
    document.getElementById('content-view').classList.remove('hidden');
    document.getElementById('title').innerText = grade + "ኛ ክፍል ትምህርቶች";
    let list = document.getElementById('list');
    list.innerHTML = '';
    
    let subs = grade <= 10 ? ['Maths', 'English', 'Biology', 'Chemistry', 'Physics', 'History', 'Geography', 'Amharic', 'Civics', 'Economics'] : ['Natural Stream', 'Social Stream'];
    
    subs.forEach(s => {
        let btn = document.createElement('button');
        btn.innerText = s; btn.style.background = "white"; btn.style.color = "#333"; btn.style.textAlign = "left";
        btn.onclick = () => showMedia(s);
        list.appendChild(btn);
    });
}

function showMedia(s) {
    document.getElementById('list').innerHTML = `
        <div class="media-list">
            <div class="media-item" onclick="alert('PDF በመከፈት ላይ...')">📄 All PDF Files</div>
            <div class="media-item" onclick="alert('Video በመታየት ላይ...')">🎬 Video Lessons</div>
            <div class="media-item">🖼️ Images</div>
            <div class="media-item">📝 Text Notes</div>
            <div class="media-item">💬 Discussion Chat</div>
        </div>
    `;
    const role = localStorage.getItem('role');
    if(role === 'teacher' || role === 'admin') document.getElementById('upload-section').classList.remove('hidden');
}

function goBack() {
    const list = document.getElementById('list');
    if(list.innerHTML.includes('media-item')) {
        showSubjects(parseInt(document.getElementById('title').innerText));
        document.getElementById('upload-section').classList.add('hidden');
    } else {
        document.getElementById('content-view').classList.add('hidden');
        document.getElementById('grade-view').classList.remove('hidden');
    }
}

function sendNotice() {
    const msg = document.getElementById('global-msg').value;
    localStorage.setItem('broadcast', msg);
    alert("ማስታወቂያው ለሁሉም ተልኳል!");
    location.reload();
}

function logout() { localStorage.clear(); location.reload(); }
