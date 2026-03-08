// 1. Service Worker ምዝገባ (GitHub Pages አድራሻ ተስተካክሏል)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // አድራሻው ከሪፖዚቶሪህ ስም ጋር እንዲሄድ ተደርጓል
        navigator.serviceWorker.register('/Mertule-International-App/sw.js')
            .then(reg => {
                console.log('Service Worker ተመዝግቧል!', reg);
            })
            .catch(err => {
                console.log('ምዝገባ አልተሳካም! አድራሻውን ያረጋግጡ።', err);
            });
    });
}

// 2. ስፕላሽ ስክሪን እና ቀጥታ መግቢያ (Persistent Login)
setTimeout(() => {
    const splash = document.getElementById('splash');
    if (splash) splash.classList.add('hidden');
    
    // ተጠቃሚው ሎግ አውት ካላደረገ በቀጥታ ወደ ዳሽቦርድ ይገባል
    if(localStorage.getItem('logged') === 'true') {
        showDashboard();
    } else {
        const regPage = document.getElementById('reg-page');
        if (regPage) regPage.classList.remove('hidden');
    }
}, 4000);

// 3. የመለያ ኮድ ቁጥጥር (ለመምህር እና ለአስተዳዳሪ)
function checkRole() {
    const role = document.getElementById('role').value;
    const codeInput = document.getElementById('code');
    if (role === 'teacher' || role === 'admin') {
        codeInput.classList.remove('hidden');
    } else {
        codeInput.classList.add('hidden');
    }
}

// 4. የምዝገባ እና የኮድ ማረጋገጫ ሎጂክ
function login() {
    const phone = document.getElementById('phone').value;
    const role = document.getElementById('role').value;
    const code = document.getElementById('code').value;
    const fname = document.getElementById('fname').value;
    const lname = document.getElementById('lname').value;

    if(!fname || !lname || !phone) { 
        alert("እባክዎ ሁሉንም መረጃዎች በትክክል ይሙሉ!"); 
        return; 
    }

    // የኢትዮ ቴሌኮም ስልክ ቁጥር ማረጋገጫ (09 ወይም 07)
    if(!(phone.startsWith('09') || phone.startsWith('07')) || phone.length !== 10) {
        alert("ትክክለኛ የቴሌ ስልክ ብቻ ይጠቀሙ (09... ወይም 07...)!"); 
        return;
    }

    // አንተ በፈለግከው መሰረት የተስተካከሉ ኮዶች
    if(role === 'teacher' && code !== '121619') { 
        alert("የመምህር መለያ ኮድ ስህተት ነው!"); 
        return; 
    }
    if(role === 'admin' && code !== '12161921') { 
        alert("የአስተዳዳሪ መለያ ኮድ ስህተት ነው!"); 
        return; 
    }

    // መረጃን በስልኩ ሜሞሪ ውስጥ መያዝ (ለኦፍላይን አገልግሎት)
    localStorage.setItem('logged', 'true');
    localStorage.setItem('role', role);
    localStorage.setItem('userName', fname + " " + lname);
    showDashboard();
}

// 5. ዋናው ዳሽቦርድ (የክፍል ደረጃዎች)
function showDashboard() {
    document.getElementById('reg-page').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    const role = localStorage.getItem('role');
    
    // ለአስተዳዳሪ ብቻ የሚታይ የቁጥጥር ፓናል
    if(role === 'admin') {
        document.getElementById('admin-panel').classList.remove('hidden');
    }
    
    // ከአስተዳዳሪ የተላለፈ ማስታወቂያ ካለ ማሳያ
    const savedNotice = localStorage.getItem('broadcast');
    if(savedNotice) {
        const nb = document.getElementById('notice-board');
        nb.innerText = "📢 ማስታወቂያ፡ " + savedNotice;
        nb.classList.remove('hidden');
    }
}

// 6. የክፍል እና ትምህርት ዝርዝር (2018 Curriculum)
function showSubjects(grade) {
    document.getElementById('grade-view').classList.add('hidden');
    document.getElementById('content-view').classList.remove('hidden');
    document.getElementById('title').innerText = grade + "ኛ ክፍል ትምህርቶች";
    let list = document.getElementById('list');
    list.innerHTML = '';
    
    // በክፍል ደረጃ የተለዩ ትምህርቶች
    let subs = grade <= 10 
        ? ['Maths', 'English', 'Biology', 'Chemistry', 'Physics', 'History', 'Geography', 'Amharic', 'Civics', 'Economics'] 
        : ['Natural Stream', 'Social Stream'];
    
    subs.forEach(s => {
        let btn = document.createElement('button');
        btn.innerText = s; 
        btn.className = "subject-btn";
        btn.style.textAlign = "left";
        btn.style.marginBottom = "8px";
        btn.onclick = () => showMedia(s);
        list.appendChild(btn);
    });
}

// 7. ሚዲያ እና ፋይል ማሳያ (ቴሌግራም ስታይል)
function showMedia(s) {
    document.getElementById('list').innerHTML = `
        <div class="media-list" style="background:white; border-radius:15px; padding:10px;">
            <div class="media-item" onclick="alert('PDF በመከፈት ላይ...')">📄 All PDF Files (Offline)</div>
            <div class="media-item" onclick="alert('Video በመታየት ላይ...')">🎬 Video Lessons</div>
            <div class="media-item" onclick="alert('Images...')">🖼️ Images</div>
            <div class="media-item" onclick="alert('Notes...')">📝 Text Notes</div>
            <div class="media-item" onclick="alert('Chat...')">💬 Discussion Chatbox</div>
        </div>
    `;
    const role = localStorage.getItem('role');
    // መምህር እና አስተዳዳሪ ብቻ ፋይል የመጫን ስልጣን አላቸው
    if(role === 'teacher' || role === 'admin') {
        document.getElementById('upload-section').classList.remove('hidden');
    }
}

// 8. የባክ በተን (Back Button)
function goBack() {
    const list = document.getElementById('list');
    if(list.innerHTML.includes('media-list')) {
        showSubjects(parseInt(document.getElementById('title').innerText));
        document.getElementById('upload-section').classList.add('hidden');
    } else {
        document.getElementById('content-view').classList.add('hidden');
        document.getElementById('grade-view').classList.remove('hidden');
    }
}

// 9. የአስተዳዳሪ ማስታወቂያ መላኪያ (Global Broadcast)
function sendNotice() {
    const msg = document.getElementById('global-msg').value;
    if(!msg) return;
    localStorage.setItem('broadcast', msg);
    alert("ማስታወቂያው ለሁሉም ተማሪዎች እና መምህራን ደርሷል!");
    location.reload();
}

// 10. መውጫ (Logout)
function logout() { 
    localStorage.clear(); 
    location.reload(); 
}
