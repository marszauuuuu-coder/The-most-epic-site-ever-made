// Inicjalizacja Supabase z Twoimi kluczami publicznymi (Open Source Safe)
const SUPABASE_URL = 'https://nodhzftlthehqyogoqru.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vZGh6ZnRsdGhlaHF5b2dvcXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0NzkyMjksImV4cCI6MjEwMDA1NTIyOX0.EdL4pC86Hn0jLkRxPEqtyP8vAYxntwqaOYaOyhWoh7c';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Tablica ze zdjęciami karuzeli
const images = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80"
];

let currentImgIndex = 0;
let currentLang = 'en'; // Domyślny język awaryjny

// Pełna zintegrowana baza tłumaczeń (Interfejs + System Kont)
const translations = {
    pl: {
        title: "Najbardziej epicka strona, jaka kiedykolwiek powstała",
        desc: "Witamy w cyfrowym arcydziele. Ta strona została stworzona, aby zachwycać, inspirować i przekraczać granice zwykłego internetu. Poczuj czystą moc nowoczesnego designu.",
        btn: "Doświadcz Epickości",
        alert: "Właśnie doświadczyłeś maksymalnego poziomu epickości!",
        authTitle: "Dostęp do Konta",
        authTitleProfile: "Twój Profil",
        placeholderNick: "Nazwa użytkownika / Nick",
        placeholderPass: "Hasło (min. 6 znaków)",
        btnRegister: "Zarejestruj się",
        btnLogin: "Zaloguj się",
        btnLogout: "Wyloguj się",
        loading: "Przetwarzanie danych...",
        regSuccess: "Konto utworzone pomyślnie! Możesz się teraz zalogować.",
        loginSuccess: "Zalogowano pomyślnie!",
        logoutSuccess: "Wylogowano z systemu.",
        emptyFields: "Błąd: Wszystkie pola muszą być wypełnione!",
        errorPrefix: "Błąd: ",
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
        alert: "You have just experienced the maximum level of epicness!",
        authTitle: "Account Access",
        authTitleProfile: "Your Profile",
        placeholderNick: "Username / Nick",
        placeholderPass: "Password (min. 6 chars)",
        btnRegister: "Register",
        btnLogin: "Log In",
        btnLogout: "Log Out",
        loading: "Processing...",
        regSuccess: "Account created! You can now log in.",
        loginSuccess: "Logged in successfully!",
        logoutSuccess: "Logged out.",
        emptyFields: "Error: Please fill all fields!",
        errorPrefix: "Error: ",
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
        alert: "Sie haben gerade das maximale Maß an Epizität erlebt!",
        authTitle: "Kontozugriff",
        authTitleProfile: "Dein Profil",
        placeholderNick: "Benutzername / Nick",
        placeholderPass: "Passwort (mind. 6 Zeichen)",
        btnRegister: "Registrieren",
        btnLogin: "Einloggen",
        btnLogout: "Ausgeloggt",
        loading: "In Bearbeitung...",
        regSuccess: "Konto erstellt! Sie können sich jetzt einloggen.",
        loginSuccess: "Erfolgreich eingeloggt!",
        logoutSuccess: "Ausgeloggt.",
        emptyFields: "Fehler: Bitte alle Felder ausfüllen!",
        errorPrefix: "Fehler: ",
        captions: [
            "Epische Ansicht 1: Die digitale Leinwand der Zukunft",
            "Epische Ansicht 2: Die Architektur von morgen",
            "Epische Ansicht 3: Abstrakte Farbexplosion"
        ]
    }
};

// Funkcja zarządzająca dynamiczną zmianą języków oraz animacją przepływającego menu
function changeLanguage(lang, element) {
    if (!element) {
        // Szukanie przycisku na podstawie tekstu, jeśli wywołane automatycznie
        element = Array.from(document.querySelectorAll('.lang-btn')).find(b => {
            const txt = b.innerText.toLowerCase();
            if (lang === 'pl') return txt === 'polski';
            if (lang === 'de') return txt === 'deutsch';
            return txt === 'english';
        });
    }

    currentLang = lang;

    // --- Animacja Przepływającego Wskaźnika ---
    if (element) {
        const indicator = document.getElementById('indicator');
        const targetX = element.offsetLeft - 6; 
        const targetWidth = element.offsetWidth;
        indicator.style.transform = `translateX(${targetX}px)`;
        indicator.style.width = `${targetWidth}px`;
    }

    // --- Dynamiczne przełączanie klas do płynnego wygaszania (Fade-Out/In) ---
    const transElements = [
        { el: document.getElementById('main-title'), text: translations[lang].title },
        { el: document.getElementById('main-desc'), text: translations[lang].desc },
        { el: document.getElementById('main-btn'), text: translations[lang].btn },
        { el: document.getElementById('gallery-caption'), text: translations[lang].captions[currentImgIndex] }
    ];

    transElements.forEach(item => {
        if (item.el) item.el.classList.add('fade-out');
    });

    setTimeout(() => {
        transElements.forEach(item => {
            if (item.el) {
                item.el.innerText = item.text;
                item.el.classList.remove('fade-out');
            }
        });
    }, 250);

    // Odświeżenie klas przycisków w menu językowym
    const buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(b => b.classList.remove('active'));
    if (element) element.classList.add('active');

    // Aktualizacja tekstów w oknie logowania, pod warunkiem że użytkownik nie jest zalogowany
    updateAuthTexts();
}

// Inicjalizacja: Wykrywanie języka na podstawie ustawień lokalnych kraju użytkownika
window.onload = function() {
    const userLanguage = (navigator.language || navigator.userLanguage).toLowerCase();
    let detectedLang = 'en'; // Domyślny angielski dla całego świata

    if (userLanguage.startsWith('pl')) {
        detectedLang = 'pl';
    } else if (userLanguage.startsWith('de')) {
        detectedLang = 'de';
    }

    // Uruchomienie języka i dopasowanie wskaźnika
    changeLanguage(detectedLang);
    
    // Sprawdzenie aktywnej sesji użytkownika w bazie danych Supabase
    checkUserSession();
};

// --- LOGIKA OBSŁUGI BAZY DANYCH (SUPABASE AUTH) ---

function updateAuthTexts() {
    const titleEl = document.getElementById('auth-title');
    const nickEl = document.getElementById('auth-nick');
    const passEl = document.getElementById('auth-pass');
    const btns = document.querySelectorAll('.auth-buttons button');

    // Aktualizujemy tylko, jeśli elementy formularza fizycznie istnieją (czyli użytkownik jest wylogowany)
    if (nickEl && passEl && titleEl) {
        titleEl.innerText = translations[currentLang].authTitle;
        nickEl.placeholder = translations[currentLang].placeholderNick;
        passEl.placeholder = translations[currentLang].placeholderPass;
        if(btns[0]) btns[0].innerText = translations[currentLang].btnRegister;
        if(btns[1]) btns[1].innerText = translations[currentLang].btnLogin;
    }
}

async function handleRegister() {
    const nick = document.getElementById('auth-nick').value.trim();
    const pass = document.getElementById('auth-pass').value;
    const statusEl = document.getElementById('auth-status');

    if (!nick || !pass) {
        statusEl.innerText = translations[currentLang].emptyFields;
        return;
    }

    statusEl.innerText = translations[currentLang].loading;
    const fakeEmail = `${nick}@epic-user.local`;

    const { data, error } = await supabase.auth.signUp({
        email: fakeEmail,
        password: pass
    });

    if (error) {
        statusEl.innerText = translations[currentLang].errorPrefix + error.message;
    } else {
        statusEl.innerText = translations[currentLang].regSuccess;
    }
}

async function handleLogin() {
    const nick = document.getElementById('auth-nick').value.trim();
    const pass = document.getElementById('auth-pass').value;
    const statusEl = document.getElementById('auth-status');

    if (!nick || !pass) {
        statusEl.innerText = translations[currentLang].emptyFields;
        return;
    }

    statusEl.innerText = translations[currentLang].loading;
    const fakeEmail = `${nick}@epic-user.local`;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password: pass
    });

    if (error) {
        statusEl.innerText = translations[currentLang].errorPrefix + error.message;
    } else {
        statusEl.innerText = translations[currentLang].loginSuccess;
        checkUserSession(); 
    }
}

async function handleLogout() {
    await supabase.auth.signOut();
    // Przywracamy podstawowy szablon formularza logowania
    const container = document.getElementById('auth-container');
    container.innerHTML = `
        <h3 id="auth-title"></h3>
        <div class="input-group"><input type="text" id="auth-nick"></div>
        <div class="input-group"><input type="password" id="auth-pass"></div>
        <div class="auth-buttons">
            <button class="btn-secondary" onclick="handleRegister()"></button>
            <button class="btn-primary" onclick="handleLogin()"></button>
        </div>
        <p id="auth-status"></p>
    `;
    changeLanguage(currentLang); // Przeładowanie języka odświeży wstrzyknięty HTML
    document.getElementById('auth-status').innerText = translations[currentLang].logoutSuccess;
}

async function checkUserSession() {
    const { data: { session } } = await supabase.auth.getSession();
    const container = document.getElementById('auth-container');
    
    if (session && session.user && session.user.email) {
        const userNick = session.user.email.split('@')[0];
        
        container.innerHTML = `
            <h3 id="auth-title">${translations[currentLang].authTitleProfile}</h3>
            <div class="profile-info" style="margin: 20px 0; font-size: 1.2rem; font-weight: bold; color: #00d2ff; text-shadow: 0 0 10px rgba(0,210,255,0.3);">
                ⚡ ${userNick}
            </div>
            <button class="btn-primary" style="width: 100%;" onclick="handleLogout()">${translations[currentLang].btnLogout}</button>
            <p id="auth-status"></p>
        `;
    }
}

// --- LOGIKA GALERII ZDJĘĆ ---

function updateGallery() {
    const imgElement = document.getElementById('gallery-img');
    const captionElement = document.getElementById('gallery-caption');
    
    imgElement.classList.add('fade-out');
    captionElement.classList.add('fade-out');
    
    setTimeout(() => {
        imgElement.src = images[currentImgIndex];
        captionElement.innerText = translations[currentLang].captions[currentImgIndex];
        
        imgElement.classList.remove('fade-out');
        captionElement.classList.remove('fade-out');
    }, 250);
}

function nextImage() {
    currentImgIndex = (currentImgIndex + 1) % images.length;
    updateGallery();
}

function prevImage() {
    currentImgIndex = (currentImgIndex - 1 + images.length) % images.length;
    updateGallery();
}

function epicAction() {
    alert(translations[currentLang].alert);
}
