// --- KONFIGURACJA SUPABASE ---
// Podmień te wartości na swoje klucze z panelu Supabase!
const SUPABASE_URL = 'https://TWOJ_PROJEKT.supabase.co';
const SUPABASE_ANON_KEY = 'TWOJ_KLUCZ_ANON';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Zmienne globalne
let currentUser = null;
let currentNick = '';

// --- 1. SYSTEM JĘZYKOWY ---
const translations = {
    pl: { 
        loginTitle: 'Dołącz do gry', loginBtn: 'Wejdź', 
        gameTitle: 'Kliknij by zdobyć punkty!', 
        leaderboardTitle: 'Top Gracze', galleryTitle: 'Galeria', galleryDesc: 'Miejsce na epickie screeny z gry.'
    },
    en: { 
        loginTitle: 'Join the game', loginBtn: 'Enter', 
        gameTitle: 'Click to get points!', 
        leaderboardTitle: 'Top Players', galleryTitle: 'Gallery', galleryDesc: 'Place for epic game screenshots.'
    }
};

function setLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });
}

function autoDetectLanguage() {
    const lang = navigator.language || navigator.userLanguage;
    if (lang.toLowerCase().startsWith('pl')) {
        setLanguage('pl');
    } else {
        setLanguage('en');
    }
}

// --- 2. LOGOWANIE (Fake Email z Nickiem) ---
async function login() {
    const nick = document.getElementById('nickname').value.trim();
    if (!nick) {
        alert("Musisz podać nick!");
        return;
    }
    
    // Generowanie maila w locie na podstawie nicku
    const fakeEmail = `${nick.toLowerCase().replace(/\s+/g, '')}@fakegame.com`;
    const defaultPassword = 'EpicUser123!'; 

    // Próba logowania
    let { data, error } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password: defaultPassword
    });

    // Jeśli logowanie się nie powiodło (pewnie użytkownik nie istnieje), rejestrujemy
    if (error) {
        const signUpResp = await supabase.auth.signUp({
            email: fakeEmail,
            password: defaultPassword
        });
        data = signUpResp.data;

        // Tworzymy mu od razu wiersz z 0 pkt w tabeli 'leaderboard'
        if (data && data.user) {
            await supabase.from('leaderboard').insert([
                { user_id: data.user.id, nickname: nick, points: 0 }
            ]);
        }
    }

    // Sukces logowania/rejestracji
    if (data && data.user) {
        currentUser = data.user;
        currentNick = nick;
        
        // Zmiana widoku
        document.getElementById('auth-panel').style.display = 'none';
        document.getElementById('game-panel').style.display = 'block';
        
        // Odśwież ranking po wejściu
        fetchLeaderboard();
    }
}

// --- 3. DODAWANIE PUNKTÓW ---
async function addEpicPoints(pointsToAdd) {
    if (!currentUser) return;
    
    // Pobierz obecny stan punktów (W przyszłości zrób to przez RLS/funkcję RPC na bazie, by było bezpieczniej!)
    const { data: userRow } = await supabase
        .from('leaderboard')
        .select('points')
        .eq('user_id', currentUser.id)
        .single();
        
    const newPoints = (userRow?.points || 0) + pointsToAdd;

    // Aktualizuj bazę
    await supabase
        .from('leaderboard')
        .update({ points: newPoints })
        .eq('user_id', currentUser.id);
        
    // Odśwież widok rankingu
    fetchLeaderboard();
}

// --- 4. RENDEROWANIE RANKINGU ---
async function fetchLeaderboard() {
    // Odwołanie do poprawionego ID
    const listElement = document.getElementById('leaderboard-list');
    if (!listElement) return;

    // Pobierz top 10 graczy
    const { data, error } = await supabase
        .from('leaderboard')
        .select('nickname, points, user_id')
        .order('points', { ascending: false })
        .limit(10);

    if (error) {
        listElement.innerHTML = '<p style="color:red;">Błąd ładowania rankingu.</p>';
        console.error(error);
        return;
    }

    // Wyczyść tekst "Ładowanie..."
    listElement.innerHTML = '';
    
    data.forEach((player, index) => {
        const isMe = currentUser && player.user_id === currentUser.id;
        
        // POPRAWKA 2: box-shadow zamiast shadow (około linii 176 w Twoim starym kodzie)
        const rowStyle = isMe 
            ? 'border-color: rgba(108, 92, 231, 0.6); background: rgba(108, 92, 231, 0.15); box-shadow: 0 0 15px rgba(108, 92, 231, 0.4);' 
            : '';

        const item = document.createElement('div');
        item.className = 'leaderboard-item';
        item.style.cssText = rowStyle;
        
        item.innerHTML = `
            <span><strong>#${index + 1}</strong> ${player.nickname} ${isMe ? '<i>(Ty)</i>' : ''}</span>
            <span style="font-weight: bold; color: #0984e3;">${player.points} pkt</span>
        `;
        listElement.appendChild(item);
    });
}

// --- INIT ---
window.onload = () => {
    autoDetectLanguage();
    fetchLeaderboard();
};
