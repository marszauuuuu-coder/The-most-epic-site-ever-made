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

// Baza tłumaczeń dla 3 języków
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
        ]
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
        ]
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
        ]
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

    if (element) {
        const indicator = document.getElementById('indicator');
        if (indicator) {
            const targetX = element.offsetLeft - 6; 
            const targetWidth = element.offsetWidth;
            indicator.style.transform = `translateX(${targetX}px)`;
            indicator.style.width = `${targetWidth}px`;
        }
    }

    const title = document.getElementById('main-title');
    const desc = document.getElementById('main-desc');
    const btn = document.getElementById('main-btn');
    const caption = document.getElementById('gallery-caption');

    if (title) title.classList.add('fade-out');
    if (desc) desc.classList.add('fade-out');
    if (btn) btn.classList.add('fade-out');
    if (caption) caption.classList.add('fade-out');

    setTimeout(() => {
        if (title) title.innerText = translations[lang].title;
        if (desc) desc.innerText = translations[lang].desc;
        if (btn) btn.innerText = translations[lang].btn;
        if (caption) caption.innerText = translations[lang].captions[currentImgIndex];

        if (title) title.classList.remove('fade-out');
        if (desc) desc.classList.remove('fade-out');
        if (btn) btn.classList.remove('fade-out');
        if (caption) caption.classList.remove('fade-out');
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

if (!supabaseClient) {
    console.error("Nie znaleziono biblioteki Supabase.");
}

if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        if (!supabaseClient) return;
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!username || !password) {
            updateStatus("Proszę uzupełnić nick oraz hasło.", false);
            return;
        }

        updateStatus("Trwa logowanie...", true);
        const fakeEmail = `${username}${NICK_DOMAIN}`;

        const { error } = await supabaseClient.auth.signInWithPassword({
            email: fakeEmail,
            password: password,
        });

        if (error) {
            updateStatus("Błąd logowania: Błędny nick lub hasło.", false);
        } else {
            loggedInUser = username;
            updateStatus(`Witaj ponownie, ${username}!`, true);
            fetchLeaderboard();
        }
    });
}

if (registerBtn) {
    registerBtn.addEventListener('click', async () => {
        if (!supabaseClient) return;

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!username || !password) {
            updateStatus("Wypełnij oba pola, aby założyć konto.", false);
            return;
        }

        if (password.length < 6) {
            updateStatus("Hasło musi składać się z co najmniej 6 znaków.", false);
            return;
        }

        updateStatus("Tworzenie konta...", true);
        const fakeEmail = `${username}${NICK_DOMAIN}`;

        const { error } = await supabaseClient.auth.signUp({
            email: fakeEmail,
            password: password,
            options: {
                data: { display_name: username }
            }
        });

        if (error) {
            updateStatus(`Błąd rejestracji: ${error.message}`, false);
        } else {
            updateStatus("Konto utworzone pomyślnie! Możesz się teraz zalogować.", true);
        }
    });
}

// ==========================================
// 5. SYSTEM RANKINGU I RANG
// ==========================================
function getRankTag(points) {
    if (points >= 100) return `<span style="font-size: 0.65em; color: #ffd700; border: 1px solid #ffd700; padding: 2px 8px; border-radius: 12px; margin-left: 8px; text-transform: uppercase; letter-spacing: 1px;">Mistrz</span>`;
    if (points >= 50) return `<span style="font-size: 0.65em; color: #6c5ce7; border: 1px solid #6c5ce7; padding: 2px 8px; border-radius: 12px; margin-left: 8px; text-transform: uppercase; letter-spacing: 1px;">Wojownik</span>`;
    return `<span style="font-size: 0.65em; color: #b2bec3; border: 1px solid #b2bec3; padding: 2px 8px; border-radius: 12px; margin-left: 8px; text-transform: uppercase; letter-spacing: 1px;">Nowicjusz</span>`;
}

async function fetchLeaderboard() {
    if (!supabaseClient) return;

    const { data, error } = await supabaseClient
        .from('leaderboard')
        .select('username, points')
        .order('points', { ascending: false })
        .limit(10);

    if (error) {
        console.error("Błąd pobierania rankingu:", error.message);
        return;
    }

    const listElement = document.getElementById('leaderboard-list');
    if (!listElement) return;

    listElement.innerHTML = ""; 

    if (data.length === 0) {
        listElement.innerHTML = `<p style="text-align:center; color:#636e72;">Brak graczy w rankingu. Zdobądź punkty jako pierwszy!</p>`;
        return;
    }

    data.forEach((row, index) => {
        const isMe = row.username === loggedInUser ? " (Ty)" : "";
        const rowStyle = isMe ? 'border-color: rgba(0, 206, 201, 0.5); background: rgba(0, 206, 201, 0.08); box-shadow: 0 0 15px rgba(0, 206, 201, 0.2);' : '';
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
    if (!loggedInUser) {
        updateStatus("Musisz być zalogowany, aby zbierać punkty za zadania!", false);
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
    showEpicToast(translations[currentLang].alert, 'success');
    
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
