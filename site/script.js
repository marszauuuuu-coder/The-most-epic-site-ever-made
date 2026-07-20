// ==========================================
// 1. KONFIGURACJA SUPABASE
// ==========================================
const SUPABASE_URL = 'https://nodhzftlthehqyogoqru.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vZGh6ZnRsdGhlaHF5b2dvcXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0NzkyMjksImV4cCI6MjEwMDA1NTIyOX0.EdL4pC86Hn0jLkRxPEqtyP8vAYxntwqaOYaOyhWoh7c';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let loggedInUser = null;

// ==========================================
// 2. SYSTEM WIELEJĘZYCZNOŚCI (I18N)
// ==========================================
const translations = {
    pl: {
        title: "Epicka Strona Startowa",
        subtitle: "Witaj w przyszłości web designu. Wszystko jest płynne, dynamiczne i naszpikowane epickimi efektami.",
        mainBtn: "Kliknij po EP",
        authTitle: "Strefa Gracza",
        authSubtitle: "Zaloguj się, aby zbierać punkty i trafić do rankingu.",
        emailLabel: "Adres E-mail",
        passwordLabel: "Hasło",
        loginBtn: "Zaloguj się",
        registerBtn: "Zarejestruj",
        logoutBtn: "Wyloguj",
        galleryCaption1: "Epicki widok na futurystyczne miasto w nocy.",
        galleryCaption2: "Cybernetyczna technologia i niesamowite światła.",
        galleryCaption3: "Abstrakcyjna geometria w cyfrowym świecie.",
        leaderboardTitle: "🏆 Najbardziej Epiccy Gracze",
        leaderboardSubtitle: "Klikaj główny przycisk i dominuj w rankingu!",
        secretModalTitle: "🔓 Odkryto Sekretny Kod!",
        secretModalDesc: "Wykonałeś poprawną sekwencję w galerii (2 ➔ 3 ➔ 2)! Otrzymujesz potężny bonus.",
        secretModalBtn: "Odbierz 100 EP"
    },
    en: {
        title: "Epic Landing Page",
        subtitle: "Welcome to the future of web design. Everything is smooth, dynamic, and packed with epic effects.",
        mainBtn: "Click for EP",
        authTitle: "Player Zone",
        authSubtitle: "Log in to collect points and reach the leaderboard.",
        emailLabel: "Email Address",
        passwordLabel: "Password",
        loginBtn: "Log In",
        registerBtn: "Register",
        logoutBtn: "Log Out",
        galleryCaption1: "Epic view of a futuristic city at night.",
        galleryCaption2: "Cybernetic technology and amazing lights.",
        galleryCaption3: "Abstract geometry in the digital world.",
        leaderboardTitle: "🏆 Most Epic Players",
        leaderboardSubtitle: "Click the main button and dominate the leaderboard!",
        secretModalTitle: "🔓 Secret Code Unlocked!",
        secretModalDesc: "You performed the correct gallery sequence (2 ➔ 3 ➔ 2)! You receive a massive bonus.",
        secretModalBtn: "Claim 100 EP"
    },
    de: {
        title: "Epische Landing Page",
        subtitle: "Willkommen in der Zukunft des Webdesigns. Alles ist flüssig, dynamisch und voller epischer Effekte.",
        mainBtn: "Für EP klicken",
        authTitle: "Spielerzone",
        authSubtitle: "Logge dich ein, um Punkte zu sammeln und die Bestenliste zu erreichen.",
        emailLabel: "E-Mail-Adresse",
        passwordLabel: "Passwort",
        loginBtn: "Anmelden",
        registerBtn: "Registrieren",
        logoutBtn: "Abmelden",
        galleryCaption1: "Epischer Blick auf eine futuristische Stadt bei Nacht.",
        galleryCaption2: "Kybernetische Technologie und erstaunliche Lichter.",
        galleryCaption3: "Abstrakte Geometrie in der digitalen Welt.",
        leaderboardTitle: "🏆 Die Epischsten Spieler",
        leaderboardSubtitle: "Klicke auf den Hauptbutton und dominiere die Bestenliste!",
        secretModalTitle: "🔓 Geheimer Code Freigeschaltet!",
        secretModalDesc: "Du hast die richtige Galeriensequenz ausgeführt (2 ➔ 3 ➔ 2)! Du erhältst einen riesigen Bonus.",
        secretModalBtn: "100 EP Abholen"
    }
};

let currentLang = 'pl';

function changeLanguage(lang) {
    currentLang = lang;
    const t = translations[lang];

    // Animacja zmiany tekstu (Fade Out -> Fade In)
    const elementsToFade = document.querySelectorAll('h1, p, .epic-btn, #gallery-caption, .glass-card');
    elementsToFade.forEach(el => el.classList.add('fade-out'));

    setTimeout(() => {
        document.getElementById('main-title').innerText = t.title;
        document.getElementById('main-subtitle').innerText = t.subtitle;
        document.getElementById('main-btn').innerText = t.mainBtn;
        
        document.getElementById('auth-title').innerText = t.authTitle;
        document.getElementById('auth-subtitle').innerText = t.authSubtitle;
        document.getElementById('email-label').innerText = t.emailLabel;
        document.getElementById('password-label').innerText = t.passwordLabel;
        document.getElementById('login-btn').innerText = loggedInUser ? t.logoutBtn : t.loginBtn;
        document.getElementById('register-btn').style.display = loggedInUser ? 'none' : 'block';

        document.getElementById('leaderboard-title').innerText = t.leaderboardTitle;
        document.getElementById('leaderboard-subtitle').innerText = t.leaderboardSubtitle;

        updateGalleryCaption();

        elementsToFade.forEach(el => el.classList.remove('fade-out'));
    }, 250);

    updateLangIndicator(lang);
}

function updateLangIndicator(lang) {
    const btn = document.getElementById(`btn-${lang}`);
    const indicator = document.getElementById('nav-indicator');
    if (btn && indicator) {
        indicator.style.width = `${btn.offsetWidth}px`;
        indicator.style.transform = `translateX(${btn.offsetLeft - 6}px)`;
    }
}

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        changeLanguage(e.target.dataset.lang);
    });
});

window.addEventListener('load', () => updateLangIndicator('pl'));

// ==========================================
// 3. SYSTEM POWIADOMIŃ (TOAST)
// ==========================================
function showEpicToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `epic-toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === 'success' ? '⚡' : '⚠️'}</span>
        <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 50);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

// ==========================================
// 4. PRZEGLĄDARKA ZDJĘĆ (GALERIA) + SEKRETNA SEKWENCJA
// ==========================================
const images = [
    { src: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop', captionKey: 'galleryCaption1' },
    { src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop', captionKey: 'galleryCaption2' },
    { src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop', captionKey: 'galleryCaption3' }
];

let currentImgIndex = 0;
let galleryHistory = [];

function updateGallery() {
    const imgElement = document.getElementById('gallery-img');
    imgElement.classList.add('fade-out');

    setTimeout(() => {
        imgElement.src = images[currentImgIndex].src;
        updateGalleryCaption();
        imgElement.classList.remove('fade-out');
    }, 250);
}

function updateGalleryCaption() {
    const captionElement = document.getElementById('gallery-caption');
    captionElement.innerText = translations[currentLang][images[currentImgIndex].captionKey];
}

window.nextImage = function() {
    currentImgIndex = (currentImgIndex + 1) % images.length;
    updateGallery();
    checkGallerySequence(currentImgIndex);
};

window.prevImage = function() {
    currentImgIndex = (currentImgIndex - 1 + images.length) % images.length;
    updateGallery();
    checkGallerySequence(currentImgIndex);
};

// Sprawdzanie sekwencji: zdj 2 (indeks 1) -> zdj 3 (indeks 2) -> zdj 2 (indeks 1)
function checkGallerySequence(newIndex) {
    galleryHistory.push(newIndex);
    if (galleryHistory.length > 3) {
        galleryHistory.shift();
    }

    if (galleryHistory.length === 3 && galleryHistory[0] === 1 && galleryHistory[1] === 2 && galleryHistory[2] === 1) {
        showSecretModal();
        galleryHistory = [];
    }
}

// ==========================================
// 5. MODAL SEKRETÓW
// ==========================================
function showSecretModal() {
    let modal = document.getElementById('secret-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'secret-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(10, 10, 18, 0.85); backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px); display: flex; justify-content: center;
            align-items: center; z-index: 10000; opacity: 0; transition: opacity 0.3s ease;
        `;
        
        const t = translations[currentLang];
        modal.innerHTML = `
            <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(0, 206, 201, 0.4); 
                        padding: 2.5rem; border-radius: 20px; text-align: center; max-width: 400px; width: 90%;
                        box-shadow: 0 20px 40px rgba(0,0,0,0.6), 0 0 25px rgba(0,206,201,0.2); transform: scale(0.9);
                        transition: transform 0.3s ease;" id="secret-modal-content">
                <h2 style="color: #ffd700; margin-bottom: 1rem; font-size: 1.5rem;">${t.secretModalTitle}</h2>
                <p style="color: #b2bec3; margin-bottom: 2rem; font-size: 1rem;">${t.secretModalDesc}</p>
                <button id="modal-claim-btn" style="background: linear-gradient(45deg, #6c5ce7, #00ceca); color: #fff; 
                        border: none; padding: 12px 30px; font-weight: bold; border-radius: 50px; cursor: pointer;
                        box-shadow: 0 4px 15px rgba(0,206,201,0.4);">${t.secretModalBtn}</button>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('modal-claim-btn').addEventListener('click', async () => {
            if (loggedInUser) {
                await addEpicPoints(100);
                showEpicToast("🚀 Przyznano +100 EP za sekretną sekwencję!", "success");
            } else {
                showEpicToast("Zaloguj się, aby zapisać 100 EP w rankingu!", "error");
            }
            closeSecretModal();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeSecretModal();
        });
    }

    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('#secret-modal-content').style.transform = 'scale(1)';
    }, 10);
}

function closeSecretModal() {
    const modal = document.getElementById('secret-modal');
    if (modal) {
        modal.style.opacity = '0';
        modal.querySelector('#secret-modal-content').style.transform = 'scale(0.9)';
        setTimeout(() => { modal.style.display = 'none'; }, 300);
    }
}

// ==========================================
// 6. SUPABASE: AUTH I LEADERBOARD
// ==========================================
async function handleLogin() {
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    const statusEl = document.getElementById('auth-status');

    if (!email || !password) {
        statusEl.innerText = "Wypełnij wszystkie pola!";
        statusEl.className = "status-error";
        return;
    }

    if (loggedInUser) {
        await supabase.auth.signOut();
        loggedInUser = null;
        document.getElementById('login-btn').innerText = translations[currentLang].loginBtn;
        document.getElementById('register-btn').style.display = 'block';
        statusEl.innerText = "Wylogowano pomyślnie.";
        statusEl.className = "status-success";
        loadLeaderboard();
        return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        statusEl.innerText = error.message;
        statusEl.className = "status-error";
    } else {
        loggedInUser = data.user;
        statusEl.innerText = "Zalogowano pomyślnie!";
        statusEl.className = "status-success";
        document.getElementById('login-btn').innerText = translations[currentLang].logoutBtn;
        document.getElementById('register-btn').style.display = 'none';
        loadLeaderboard();
    }
}

async function handleRegister() {
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    const statusEl = document.getElementById('auth-status');

    if (!email || !password) {
        statusEl.innerText = "Wypełnij wszystkie pola!";
        statusEl.className = "status-error";
        return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
        statusEl.innerText = error.message;
        statusEl.className = "status-error";
    } else {
        statusEl.innerText = "Konto założone! Sprawdź email lub zaloguj się.";
        statusEl.className = "status-success";
    }
}

async function addEpicPoints(amount = 10) {
    if (!loggedInUser) {
        showEpicToast("Zaloguj się, aby zbierać punkty!", "error");
        return;
    }

    const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', loggedInUser.id)
        .single();

    let currentPoints = profile ? profile.points || 0 : 0;
    let newPoints = currentPoints + amount;

    const { error: updateError } = await supabase
        .from('profiles')
        .upsert({ id: loggedInUser.id, email: loggedInUser.email, points: newPoints });

    if (!updateError) {
        showEpicToast(`Dodano +${amount} EP do Twojego konta!`, "success");
        loadLeaderboard();
    } else {
        showEpicToast("Błąd zapisu punktów w bazie.", "error");
    }
}

async function loadLeaderboard() {
    const listEl = document.getElementById('leaderboard-list');
    if (!listEl) return;

    const { data, error } = await supabase
        .from('profiles')
        .select('email, points')
        .order('points', { ascending: false })
        .limit(5);

    if (error) {
        console.error("Błąd ładowania rankingu:", error);
        return;
    }

    listEl.innerHTML = '';
    if (!data || data.length === 0) {
        listEl.innerHTML = '<div style="color: #636e72; text-align:center;">Brak graczy w rankingu</div>';
        return;
    }

    data.forEach((player, index) => {
        const username = player.email ? player.email.split('@')[0] : 'Anonim';
        const item = document.createElement('div');
        item.className = 'leaderboard-item';
        item.innerHTML = `
            <div class="leaderboard-player">
                <span class="rank">#${index + 1}</span>
                <span>${username}</span>
            </div>
            <span class="player-points">${player.points || 0} EP</span>
        `;
        listEl.appendChild(item);
    });
}

document.getElementById('main-btn').addEventListener('click', async () => {
    if (loggedInUser) {
        await addEpicPoints(10);
    } else {
        showEpicToast("Zaloguj się w strefie gracza poniżej, aby klikać punkty!", "error");
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadLeaderboard();
});

// ==========================================
// 7. INTERAKTYWNE CZĄSTECZKI W TLE (ZE ZŁOTYM SEKRETEM)
// ==========================================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particlesArray = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const mouse = { x: null, y: null, radius: 150 };
window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Particle {
    constructor(x, y, directionX, directionY, size, color, isGolden = false) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.isGolden = isGolden;
        this.pulseDir = 0.02;
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        
        if (this.isGolden) {
            this.size += this.pulseDir;
            if (this.size > 5 || this.size < 2.5) this.pulseDir = -this.pulseDir;
            
            ctx.fillStyle = '#ffd700';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ffd700';
        } else {
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 0;
        }
        
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 5;
            if (mouse.x > this.x && this.x > this.size * 10) this.x -= 5;
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 5;
            if (mouse.y > this.y && this.y > this.size * 10) this.y -= 5;
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function initParticles() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 18000;
    
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 1) - 0.5;
        let directionY = (Math.random() * 1) - 0.5;
        let color = 'rgba(0, 206, 201, 0.3)';
        
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color, false));
    }

    let goldenSize = 3.5;
    let gx = Math.random() * innerWidth;
    let gy = Math.random() * innerHeight;
    particlesArray.push(new Particle(gx, gy, 0.8, 0.8, goldenSize, '#ffd700', true));
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
}

initParticles();
animateParticles();

canvas.addEventListener('click', async (event) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const goldenOne = particlesArray.find(p => p.isGolden);
    if (!goldenOne) return;

    let dx = clickX - goldenOne.x;
    let dy = clickY - goldenOne.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 25) {
        showEpicToast("🎉 Znalazłeś ukrytą Złotą Cząsteczkę! +50 punktów!", "success");
        if (loggedInUser) {
            await addEpicPoints(50);
        }
        goldenOne.x = Math.random() * innerWidth;
        goldenOne.y = Math.random() * innerHeight;
    }
});
