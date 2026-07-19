// ==========================================
// 1. ZMIENNE GLOBALNE I KONFIGURACJA GALERII
// ==========================================
const images = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80"
];

let currentImgIndex = 0;
let currentLang = 'en'; // Domyślny język awaryjny
let loggedInUser = null; // Przechowuje nick zalogowanego użytkownika

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
    // Jeżeli element menu nie został przekazany (przy autodetekcji), szukamy go w DOM po atrybucie onclick
    if (!element) {
        element = Array.from(document.querySelectorAll('.lang-btn')).find(b => {
            const onclickAttr = b.getAttribute('onclick');
            return onclickAttr && onclickAttr.includes(`'${lang}'`);
        });
    }

    currentLang = lang;

    // Płynny ruch neonowej obwódki (indykatora)
    if (element) {
        const indicator = document.getElementById('indicator');
        if (indicator) {
            const targetX = element.offsetLeft - 6; 
            const targetWidth = element.offsetWidth;
            indicator.style.transform = `translateX(${targetX}px)`;
            indicator.style.width = `${targetWidth}px`;
        }
    }

    // Pobranie elementów do przetłumaczenia
    const title = document.getElementById('main-title');
    const desc = document.getElementById('main-desc');
    const btn = document.getElementById('main-btn');
    const caption = document.getElementById('gallery-caption');

    // Animacja Fade-Out
    if (title) title.classList.add('fade-out');
    if (desc) desc.classList.add('fade-out');
    if (btn) btn.classList.add('fade-out');
    if (caption) caption.classList.add('fade-out');

    setTimeout(() => {
        if (title) title.innerText = translations[lang].title;
        if (desc) desc.innerText = translations[lang].desc;
        if (btn) btn.innerText = translations[lang].btn;
        if (caption) caption.innerText = translations[lang].captions[currentImgIndex];

        // Animacja Fade-In
        if (title) title.classList.remove('fade-out');
        if (desc) desc.classList.remove('fade-out');
        if (btn) btn.classList.remove('fade-out');
        if (caption) caption.classList.remove('fade-out');
    }, 250);

    // Wizualne przełączenie klasy active na przyciskach
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
// Zmień poniższe adresy na własne z panelu Supabase (Settings -> API)
const SUPABASE_URL = "https://TWÓJ-PROJEKT.supabase.co";
const SUPABASE_ANON_KEY = "TWÓJ_KLUCZ_ANON_KEY";

// Domena wewnętrzna do maskowania nicków jako e-mail w bazie Supabase
const NICK_DOMAIN = "@twojadomena.internal";

const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Referencje do formularza w DOM
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
}

if (!supabaseClient) {
    console.error("Nie znaleziono biblioteki Supabase. Sprawdź poprawność skryptu CDN w sekcji HTML <head>.");
}

// Obsługa logowania użytkownika
if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        if (!supabaseClient) return;
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!username || !password) {
            updateStatus("Proszę uzupełnić nick oraz hasło.");
            return;
        }

        updateStatus("Trwa logowanie...", true);
        const fakeEmail = `${username}${NICK_DOMAIN}`;

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: fakeEmail,
            password: password,
        });

        if (error) {
            updateStatus("Błąd logowania: Błędny nick lub hasło.", false);
        } else {
            loggedInUser = username; // Zapisujemy zalogowanego gracza globalnie
            updateStatus(`Witaj ponownie, ${username}!`, true);
            fetchLeaderboard(); // Odświeżamy ranking, by oznaczyć wiersz użytkownika
        }
    });
}

// Obsługa rejestracji użytkownika
if (registerBtn) {
    registerBtn.addEventListener('click', async () => {
        if (!supabaseClient) return;

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!username || !password) {
            updateStatus("Wypełnij oba pola, aby założyć konto.");
            return;
        }

        if (password.length < 6) {
            updateStatus("Hasło musi składać się z co najmniej 6 znaków.");
            return;
        }

        updateStatus("Tworzenie konta...", true);
        const fakeEmail = `${username}${NICK_DOMAIN}`;

        const { data, error } = await supabaseClient.auth.signUp({
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
// 5. SYSTEM RANKINGU (LEADERBOARD)
// ==========================================

// Pobieranie rankingu TOP 10 z bazy danych
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

    listElement.innerHTML = ""; // Reset listy

    if (data.length === 0) {
        listElement.innerHTML = `<p style="text-align:center; color:#636e72;">Brak graczy w rankingu. Zdobądź punkty jako pierwszy!</p>`;
        return;
    }

    data.forEach((row, index) => {
        const isMe = row.username === loggedInUser ? " (Ty)" : "";
        const rowStyle = isMe ? 'border-color: rgba(108, 92, 231, 0.5); background: rgba(108, 92, 231, 0.08); shadow: 0 0 10px rgba(108, 92, 231, 0.2);' : '';
        
        const itemHtml = `
            <div class="leaderboard-item" style="${rowStyle}">
                <div class="leaderboard-player">
                    <span class="rank">#${index + 1}</span>
                    <span class="player-name">${row.username}${isMe}</span>
                </div>
                <span class="player-points">${row.points} EP</span>
            </div>
        `;
        listElement.insertAdjacentHTML('beforeend', itemHtml);
    });
}

// Dodawanie punktów do konta w tabeli leaderboard
async function addEpicPoints(amount) {
    if (!supabaseClient) return;
    if (!loggedInUser) {
        updateStatus("Musisz być zalogowany, aby zbierać punkty za zadania!", false);
        return;
    }

    // Sprawdzenie, czy użytkownik ma już jakikolwiek wpis punktowy w tabeli
    const { data: player } = await supabaseClient
        .from('leaderboard')
        .select('points')
        .eq('username', loggedInUser)
        .single();

    if (player) {
        // Zwiększenie liczby punktów istniejącego rekordu
        const newPoints = player.points + amount;
        await supabaseClient
            .from('leaderboard')
            .update({ points: newPoints })
            .eq('username', loggedInUser);
    } else {
        // Tworzenie od zera pierwszego wpisu punktowego dla gracza
        await supabaseClient
            .from('leaderboard')
            .insert([{ username: loggedInUser, points: amount }]);
    }

    // Aktualizacja widoku tablicy wyników
    fetchLeaderboard();
}

// Główna akcja przycisku "Doświadcz Epickości"
async function epicAction() {
    alert(translations[currentLang].alert);
    
    if (loggedInUser) {
        // Przyznajemy zalogowanemu użytkownikowi 10 punktów epickości
        await addEpicPoints(10);
    }
}

// ==========================================
// 6. INICJALIZACJA SYSTEMU (ONLOAD)
// ==========================================
window.onload = function() {
    // Autodetekcja języka przeglądarki użytkownika
    const userLanguage = (navigator.language || navigator.userLanguage).toLowerCase();
    let detectedLang = 'en'; 

    if (userLanguage.startsWith('pl')) {
        detectedLang = 'pl';
    } else if (userLanguage.startsWith('de')) {
        detectedLang = 'de';
    }

    // Uruchomienie języka startowego
    changeLanguage(detectedLang);
    
    // Załadowanie aktualnego stanu rankingu z Supabase
    fetchLeaderboard();
};
