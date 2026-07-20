// ==========================================
// 1. ZMIENNE GLOBALNE I KONFIGURACJA GALERII
// ==========================================
const images = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80"
];

let currentImgIndex = 0;
let currentLang = 'en'; 
let loggedInUser = null; 

// Potężna baza tłumaczeń dla całego interfejsu
const translations = {
    pl: {
        title: "Najbardziej epicka strona, jaka kiedykolwiek powstała",
        desc: "Witamy w cyfrowym arcydziele. Ta strona została stworzona, aby zachwycać, inspirować i przekraczać granice zwykłego internetu. Poczuj czystą moc nowoczesnego designu.",
        btn: "Doświadcz Epickości",
        alert: "Właśnie doświadczyłeś maksymalnego poziomu epickości! Otrzymujesz 10 punktów!",
        captions: [
            "Epicki Widok 1: Cyfrowe płótno przyszłości",
            "Epicki Widok 2: Architektura jutra",
            "Epicki Widok 3: Abstrakcyjna eksplozja kolorów"
        ],
        authTitle: "Panel Wojownika",
        authSubtitle: "Zaloguj się nickiem, aby zbierać punkty",
        labelUsername: "Twój unikalny Nick",
        placeholderUsername: "Wpisz swój nick...",
        labelPassword: "Hasło",
        btnLogin: "Zaloguj",
        btnRegister: "Rejestracja",
        leaderboardTitle: "🏆 Najbardziej Epiccy Gracze 🏆",
        leaderboardSubtitle: "Klikaj główny przycisk i dominuj w rankingu!",
        leaderboardLoading: "Ładowanie rankingu...",
        leaderboardEmpty: "Brak graczy w rankingu. Zdobądź punkty jako pierwszy!",
        rankMaster: "Mistrz",
        rankWarrior: "Wojownik",
        rankNovice: "Nowicjusz",
        rankYou: "(Ty)",
        msgEmptyFields: "Proszę uzupełnić nick oraz hasło.",
        msgLoginProgress: "Trwa logowanie...",
        msgLoginErr: "Błąd logowania: Błędny nick lub hasło.",
        msgLoginSuccess: "Witaj ponownie, ",
        msgRegShort: "Hasło musi składać się z co najmniej 6 znaków.",
        msgRegProgress: "Tworzenie konta...",
        msgRegErr: "Błąd rejestracji: ",
        msgRegSuccess: "Konto utworzone pomyślnie! Możesz się teraz zalogować.",
        msgNotLoggedIn: "Musisz być zalogowany, aby zbierać punkty!"
    },
    en: {
        title: "The most epic site ever made",
        desc: "Welcome to a digital masterpiece. This website was built to amaze, inspire, and push the boundaries of the ordinary web. Feel the pure power of modern design.",
        btn: "Experience Epicness",
        alert: "You have just experienced the maximum level of epicness! You get 10 points!",
        captions: [
            "Epic View 1: The digital canvas of the future",
            "Epic View 2: The architecture of tomorrow",
            "Epic View 3: Abstract explosion of colors"
        ],
        authTitle: "Warrior Panel",
        authSubtitle: "Login with your nickname to collect points",
        labelUsername: "Your unique Nickname",
        placeholderUsername: "Enter your nickname...",
        labelPassword: "Password",
        btnLogin: "Login",
        btnRegister: "Register",
        leaderboardTitle: "🏆 The Most Epic Players",
        leaderboardSubtitle: "Click the main button and dominate the ranking!",
        leaderboardLoading: "Loading leaderboard...",
        leaderboardEmpty: "No players in the ranking. Be the first to score!",
        rankMaster: "Master",
        rankWarrior: "Warrior",
        rankNovice: "Novice",
        rankYou: "(You)",
        msgEmptyFields: "Please fill in both nickname and password.",
        msgLoginProgress: "Logging in...",
        msgLoginErr: "Login error: Invalid nickname or password.",
        msgLoginSuccess: "Welcome back, ",
        msgRegShort: "Password must be at least 6 characters long.",
        msgRegProgress: "Creating account...",
        msgRegErr: "Registration error: ",
        msgRegSuccess: "Account created successfully! You can now log in.",
        msgNotLoggedIn: "You must be logged in to collect points!"
    },
    de: {
        title: "Die epischste Website, die je erstellt wurde",
        desc: "Willkommen zu einem digitalen Meisterwerk. Diese Website wurde geschaffen, um zu staunen, zu inspirieren und die Grenzen des gewöhnlichen Internets zu sprengen. Spüren Sie die pure Kraft modernen Designs.",
        btn: "Epizität Erleben",
        alert: "Sie haben gerade das maximale Maß an Epizität erlebt! Sie erhalten 10 Punkte!",
        captions: [
            "Epische Ansicht 1: Die digitale Leinwand der Zukunft",
            "Epische Ansicht 2: Die Architektur von morgen",
            "Epische Ansicht 3: Abstrakte Farbexplosion"
        ],
        authTitle: "Krieger-Panel",
        authSubtitle: "Melden Sie sich mit Ihrem Nicknamen an, um Punkte zu sammeln",
        labelUsername: "Dein einzigartiger Nickname",
        placeholderUsername: "Gib deinen Nicknamen ein...",
        labelPassword: "Passwort",
        btnLogin: "Anmelden",
        btnRegister: "Registrieren",
        leaderboardTitle: "🏆 Die epischsten Spieler",
        leaderboardSubtitle: "Klicke auf den Hauptbutton und dominiere das Ranking!",
        leaderboardLoading: "Ranking wird geladen...",
        leaderboardEmpty: "Keine Spieler im Ranking. Hol dir als Erster Punkte!",
        rankMaster: "Meister",
        rankWarrior: "Krieger",
        rankNovice: "Neuling",
        rankYou: "(Du)",
        msgEmptyFields: "Bitte füllen Sie Nickname und Passwort aus.",
        msgLoginProgress: "Anmeldung läuft...",
        msgLoginErr: "Anmeldefehler: Falscher Nickname oder Passwort.",
        msgLoginSuccess: "Willkommen zurück, ",
        msgRegShort: "Das Passwort muss mindestens 6 Zeichen lang sein.",
        msgRegProgress: "Konto wird erstellt...",
        msgRegErr: "Registrierungsfehler: ",
        msgRegSuccess: "Konto erfolgreich erstellt! Du kannst dich jetzt einloggen.",
        msgNotLoggedIn: "Du musst eingeloggt sein, um Punkte zu sammeln!"
    }
};

// ==========================================
// 2. LOGIKA ZMIANY JĘZYKA STRONY
// ==========================================
function changeLanguage(lang, element) {
    if (!element) {
        element = Array.from(document.querySelectorAll('.lang-btn')).find(b => {
            const onclickAttr = b.getAttribute('onclick');
            return onclickAttr && onclickAttr.includes(`'${lang}'`);
        });
    }

    currentLang = lang;
    const t = translations[lang];

    if (element) {
        const indicator = document.getElementById('indicator');
        if (indicator) {
            const targetX = element.offsetLeft - 6; 
            const targetWidth = element.offsetWidth;
            indicator.style.transform = `translateX(${targetX}px)`;
            indicator.style.width = `${targetWidth}px`;
        }
    }

    // Lista elementów do zmiany tekstu
    const elementsToUpdate = [
        { el: document.getElementById('main-title'), text: t.title },
        { el: document.getElementById('main-desc'), text: t.desc },
        { el: document.getElementById('main-btn'), text: t.btn },
        { el: document.getElementById('gallery-caption'), text: t.captions[currentImgIndex] },
        { el: document.getElementById('auth-title'), text: t.authTitle },
        { el: document.getElementById('auth-subtitle'), text: t.authSubtitle },
        { el: document.getElementById('label-username'), text: t.labelUsername },
        { el: document.getElementById('label-password'), text: t.labelPassword },
        { el: document.getElementById('btn-login'), text: t.btnLogin },
        { el: document.getElementById('btn-register'), text: t.btnRegister },
        { el: document.getElementById('leaderboard-title'), text: t.leaderboardTitle },
        { el: document.getElementById('leaderboard-subtitle'), text: t.leaderboardSubtitle }
    ];

    const inputUsername = document.getElementById('auth-username');
    const loadingText = document.getElementById('leaderboard-loading');

    // Animacja wygaszania
    elementsToUpdate.forEach(item => { if (item.el) item.el.classList.add('fade-out'); });

    setTimeout(() => {
        // Podmiana tekstu
        elementsToUpdate.forEach(item => { if (item.el) item.el.innerText = item.text; });
        if (inputUsername) inputUsername.placeholder = t.placeholderUsername;
        if (loadingText) loadingText.innerText = t.leaderboardLoading;
        
        // Odświeżenie rankingu (żeby zaktualizować odznaki na nowy język)
        fetchLeaderboard();

        // Animacja pojawiania się
        elementsToUpdate.forEach(item => { if (item.el) item.el.classList.remove('fade-out'); });
    }, 250);

    const buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(b => b.classList.remove('active'));
    if (element) {
        element.classList.add('active');
    }
}

// ==========================================
// 3. LOGIKA GALERII ZDJĘĆ
// ==========================================
function updateGallery() {
    const imgElement = document.getElementById('gallery-img');
    const captionElement = document.getElementById('gallery-caption');
    
    if (imgElement && captionElement) {
        imgElement.classList.add('fade-out');
        captionElement.classList.add('fade-out');
        
        setTimeout(() => {
            imgElement.src = images[currentImgIndex];
            captionElement.innerText = translations[currentLang].captions[currentImgIndex];
            
            imgElement.classList.remove('fade-out');
            captionElement.classList.remove('fade-out');
        }, 250);
    }
}

function nextImage() {
    currentImgIndex = (currentImgIndex + 1) % images.length;
    updateGallery();
}

function prevImage() {
    currentImgIndex = (currentImgIndex - 1 + images.length) % images.length;
    updateGallery();
}

// ==========================================
// 4. KONFIGURACJA I OBSŁUGA SUPABASE
// ==========================================
const SUPABASE_URL = "https://nodhzftlthehqyogoqru.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vZGh6ZnRsdGhlaHF5b2dvcXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0NzkyMjksImV4cCI6MjEwMDA1NTIyOX0.EdL4pC86Hn0jLkRxPEqtyP8vAYxntwqaOYaOyhWoh7c";
const NICK_DOMAIN = "@twojadomena.internal";

const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const usernameInput = document.getElementById('auth-username'); 
const passwordInput = document.getElementById('auth-password');
const loginBtn = document.getElementById('btn-login');
const registerBtn = document.getElementById('btn-register');
const statusText = document.getElementById('auth-status');

function updateStatus(message, isSuccess = false) {
    if (statusText) {
        statusText.innerText = message;
        statusText.className = isSuccess ? 'status-success' : 'status-error';
    }
    showEpicToast(message, isSuccess ? 'success' : 'error');
}

if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        if (!supabaseClient) return;
        const t = translations[currentLang];
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!username || !password) {
            updateStatus(t.msgEmptyFields, false);
            return;
        }

        updateStatus(t.msgLoginProgress, true);
        const fakeEmail = `${username}${NICK_DOMAIN}`;

        const { error } = await supabaseClient.auth.signInWithPassword({
            email: fakeEmail,
            password: password,
        });

        if (error) {
            updateStatus(t.msgLoginErr, false);
        } else {
            loggedInUser = username;
            updateStatus(`${t.msgLoginSuccess}${username}!`, true);
            fetchLeaderboard();
        }
    });
}

if (registerBtn) {
    registerBtn.addEventListener('click', async () => {
        if (!supabaseClient) return;
        const t = translations[currentLang];

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!username || !password) {
            updateStatus(t.msgEmptyFields, false);
            return;
        }

        if (password.length < 6) {
            updateStatus(t.msgRegShort, false);
            return;
        }

        updateStatus(t.msgRegProgress, true);
        const fakeEmail = `${username}${NICK_DOMAIN}`;

        const { error } = await supabaseClient.auth.signUp({
            email: fakeEmail,
            password: password,
            options: { data: { display_name: username } }
        });

        if (error) {
            updateStatus(`${t.msgRegErr}${error.message}`, false);
        } else {
            updateStatus(t.msgRegSuccess, true);
        }
    });
}

// ==========================================
// 5. SYSTEM RANKINGU I RANG
// ==========================================
function getRankTag(points) {
    const t = translations[currentLang];
    if (points >= 100) return `<span style="font-size: 0.65em; color: #ffd700; border: 1px solid #ffd700; padding: 2px 8px; border-radius: 12px; margin-left: 8px; text-transform: uppercase; letter-spacing: 1px;">${t.rankMaster}</span>`;
    if (points >= 50) return `<span style="font-size: 0.65em; color: #6c5ce7; border: 1px solid #6c5ce7; padding: 2px 8px; border-radius: 12px; margin-left: 8px; text-transform: uppercase; letter-spacing: 1px;">${t.rankWarrior}</span>`;
    return `<span style="font-size: 0.65em; color: #b2bec3; border: 1px solid #b2bec3; padding: 2px 8px; border-radius: 12px; margin-left: 8px; text-transform: uppercase; letter-spacing: 1px;">${t.rankNovice}</span>`;
}

async function fetchLeaderboard() {
    if (!supabaseClient) return;
    const t = translations[currentLang];

    const { data, error } = await supabaseClient
        .from('leaderboard')
        .select('username, points')
        .order('points', { ascending: false })
        .limit(10);

    const listElement = document.getElementById('leaderboard-list');
    if (!listElement) return;

    if (error) {
        console.error("Błąd pobierania rankingu:", error.message);
        return;
    }

    listElement.innerHTML = ""; 

    if (data.length === 0) {
        listElement.innerHTML = `<p style="text-align:center; color:#636e72;">${t.leaderboardEmpty}</p>`;
        return;
    }

    data.forEach((row, index) => {
        const isMe = row.username === loggedInUser ? ` <span style="opacity: 0.7;">${t.rankYou}</span>` : "";
        const rowStyle = row.username === loggedInUser ? 'border-color: rgba(0, 206, 201, 0.5); background: rgba(0, 206, 201, 0.08); box-shadow: 0 0 15px rgba(0, 206, 201, 0.2);' : '';
        const rankBadge = getRankTag(row.points);
        
        const itemHtml = `
            <div class="leaderboard-item" style="${rowStyle}">
                <div class="leaderboard-player">
                    <span class="rank">#${index + 1}</span>
                    <span class="player-name">${row.username}${isMe} ${rankBadge}</span>
                </div>
                <span class="player-points">${row.points} EP</span>
            </div>
        `;
        listElement.insertAdjacentHTML('beforeend', itemHtml);
    });
}

async function addEpicPoints(amount) {
    if (!supabaseClient) return;
    const t = translations[currentLang];

    if (!loggedInUser) {
        updateStatus(t.msgNotLoggedIn, false);
        return;
    }

    const { data: player } = await supabaseClient
        .from('leaderboard')
        .select('points')
        .eq('username', loggedInUser)
        .single();

    if (player) {
        const newPoints = player.points + amount;
        await supabaseClient
            .from('leaderboard')
            .update({ points: newPoints })
            .eq('username', loggedInUser);
    } else {
        await supabaseClient
            .from('leaderboard')
            .insert([{ username: loggedInUser, points: amount }]);
    }

    fetchLeaderboard();
}

async function epicAction() {
    const t = translations[currentLang];
    showEpicToast(t.alert, 'success');
    
    if (loggedInUser) {
        await addEpicPoints(10);
    }
}

// ==========================================
// 6. SYSTEM POWIADOMIEŃ TOAST
// ==========================================
function showEpicToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `epic-toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">${type === 'success' ? '⚡' : '🔥'}</div>
        <div class="toast-message">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ==========================================
// 7. INTERAKTYWNE CZĄSTECZKI W TLE
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
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
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
        
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
}

// ==========================================
// 8. INICJALIZACJA SYSTEMU (ONLOAD)
// ==========================================
window.onload = function() {
    const userLanguage = (navigator.language || navigator.userLanguage).toLowerCase();
    let detectedLang = 'en'; 

    if (userLanguage.startsWith('pl')) {
        detectedLang = 'pl';
    } else if (userLanguage.startsWith('de')) {
        detectedLang = 'de';
    }

    changeLanguage(detectedLang);
    fetchLeaderboard();
    
    initParticles();
    animateParticles();
};
