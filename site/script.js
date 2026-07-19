// Tablica ze zdjęciami karuzeli
const images = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80"
];

let currentImgIndex = 0;
let currentLang = 'en'; // Domyślny język awaryjny (angielski)

// Baza tłumaczeń dla 3 języków
const translations = {
    pl: {
        title: "Najbardziej epicka strona, jaka kiedykolwiek powstała",
        desc: "Witamy w cyfrowym arcydziele. Ta strona została stworzona, aby zachwycać, inspirować i przekraczać granice zwykłego internetu. Poczuj czystą moc nowoczesnego designu.",
        btn: "Doświadcz Epickości",
        alert: "Właśnie doświadczyłeś maksymalnego poziomu epickości!",
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
        captions: [
            "Epische Ansicht 1: Die digitale Leinwand der Zukunft",
            "Epische Ansicht 2: Die Architektur von morgen",
            "Epische Ansicht 3: Abstrakte Farbexplosion"
        ]
    }
};

// Funkcja zmieniająca język na stronie z płynną animacją i PRZEPŁYWAJĄCĄ obwódką
function changeLanguage(lang, element) {
    // Jeżeli element menu nie został przekazany (np. przy autodetekcji na starcie), szukamy go w DOM
    if (!element) {
        element = Array.from(document.querySelectorAll('.lang-btn')).find(b => b.innerText.toLowerCase() === lang);
    }

    currentLang = lang;

    // --- Magia Przepływającej Obwódki ---
    if (element) {
        const indicator = document.getElementById('indicator');
        const targetX = element.offsetLeft - 6; 
        const targetWidth = element.offsetWidth;

        indicator.style.transform = `translateX(${targetX}px)`;
        indicator.style.width = `${targetWidth}px`;
    }

    // --- Animacja Fade-Out dla Tekstów ---
    const title = document.getElementById('main-title');
    const desc = document.getElementById('main-desc');
    const btn = document.getElementById('main-btn');
    const caption = document.getElementById('gallery-caption');

    title.classList.add('fade-out');
    desc.classList.add('fade-out');
    btn.classList.add('fade-out');
    caption.classList.add('fade-out');

    setTimeout(() => {
        title.innerText = translations[lang].title;
        desc.innerText = translations[lang].desc;
        btn.innerText = translations[lang].btn;
        caption.innerText = translations[lang].captions[currentImgIndex];

        title.classList.remove('fade-out');
        desc.classList.remove('fade-out');
        btn.classList.remove('fade-out');
        caption.classList.remove('fade-out');
    }, 250);

    // Aktualizacja klas tekstowych aktywności dla przycisków
    const buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(b => b.classList.remove('active'));
    if (element) {
        element.classList.add('active');
    }
}

// Inicjalizacja: Wykrywanie języka kraju użytkownika po załadowaniu strony
window.onload = function() {
    // navigator.language zwraca np. "pl", "pl-PL", "de", "de-DE", "en-US"
    const userLanguage = (navigator.language || navigator.userLanguage).toLowerCase();
    let detectedLang = 'en'; // Domyślnie angielski dla reszty świata

    if (userLanguage.startsWith('pl')) {
        detectedLang = 'pl';
    } else if (userLanguage.startsWith('de')) {
        detectedLang = 'de';
    }

    // Wywołanie zmiany języka i ustawienie obwódki na właściwym przycisku
    changeLanguage(detectedLang);
};

// Logika galerii zdjęć
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

// Akcja po kliknięciu głównego przycisku
function epicAction() {
    alert(translations[currentLang].alert);
}
// --- KONFIGURACJA SUPABASE ---
// Zmień poniższe adresy na własne z panelu Supabase (Settings -> API)
const SUPABASE_URL = "https://TWÓJ-PROJEKT.supabase.co";
const SUPABASE_ANON_KEY = "TWÓJ_KLUCZ_ANON_KEY";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const emailInput = document.getElementById('auth-email');
const passwordInput = document.getElementById('auth-password');
const loginBtn = document.getElementById('btn-login');
const registerBtn = document.getElementById('btn-register');
const statusText = document.getElementById('auth-status');

function updateStatus(message, isSuccess = false) {
    statusText.innerText = message;
    statusText.className = isSuccess ? 'status-success' : 'status-error';
}

// LOGOWANIE
loginBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        updateStatus("Proszę uzupełnić e-mail oraz hasło.");
        return;
    }

    updateStatus("Trwa logowanie...", true);

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        updateStatus(`Błąd logowania: ${error.message}`, false);
    } else {
        updateStatus("Zalogowano pomyślnie!", true);
        console.log("Użytkownik:", data.user);
    }
});

// REJESTRACJA
registerBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        updateStatus("Wypełnij oba pola, aby założyć konto.");
        return;
    }

    if (password.length < 6) {
        updateStatus("Hasło musi składać się z co najmniej 6 znaków.");
        return;
    }

    updateStatus("Tworzenie konta...", true);

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
        updateStatus(`Błąd rejestracji: ${error.message}`, false);
    } else {
        updateStatus("Konto utworzone! Sprawdź e-mail, aby je aktywować.", true);
    }
});
