const userNameEl = document.getElementById('user-name');
const userEmailEl = document.getElementById('user-email');
const todayEl = document.getElementById('today');
const tableBody = document.getElementById('reservations-body');
const emptyMessage = document.getElementById('reservations-empty');
const logoutButton = document.getElementById('logout-button');

const DAY = 24 * 60 * 60 * 1000;

// Affiche l'user connecté, ou renvoie à l'accueil s'il ne l'est pas
async function loadUser() {
    const reponse = await fetch('/me');

    if (reponse.status === 401) {
        window.location.href = '/';
        return false;
    }

    const data = await reponse.json();
    userNameEl.textContent = data.user.username;
    userEmailEl.textContent = data.user.email;
    return true;
}

function showToday() {
    todayEl.textContent = new Date().toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// Récupére les réservations de tous les catways, puis garde celles en cours
async function loadCurrentReservations() {
    const catwaysResponse = await fetch('/catways');
    const catways = await catwaysResponse.json();

    const lists = await Promise.all(
        catways.map(async (catway) => {
            const response = await fetch(`/catways/${catway.catwayNumber}/reservations`);
            return response.ok ? response.json() : [];
        })
    );

    const now = Date.now();

    return lists
    .flat()
    .filter((reservation) => {
        const start = new Date(reservation.startDate).getTime();
        const end = new Date(reservation.endDate).getTime();
        return start <= now && now < end + DAY;
    })
    .sort((a, b) => a.catwayNumber - b.catwayNumber);
}

function formatDate(isoDate) {
    // timeZone UTC : Les dates sont enregistrées à minuit UTC
    return new Date(isoDate).toLocaleDateString('fr-FR', { timeZone: 'UTC' });
}

function renderReservations(reservations) {
    tableBody.replaceChildren();

    if (reservations.lenght === 0) {
        emptyMessage.hidden = false;
        return;
    }

    emptyMessage.hidden = true;

    reservations.forEach((reservation) => {
        const row = document.createElement('tr');

        [
            reservation.catwayNumber,
            reservation.clientName,
            reservation.boatName,
            formatDate(reservation.startDate),
            formatDate(reservation.endDate)
        ].forEach((value) => {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });
}

logoutButton.addEventListener('click', async () => {
    await fetch('/logout');
    window.location.href = '/';
});

async function init() {
    showToday();

    try {
        const connected = await loadUser();
        if (!connected) {
            return;
        }

        const reservations = await loadCurrentReservations();
        renderReservations(reservations);
    } catch (error) {
        emptyMessage.textContent = 'Impossible de charger les réservations.';
        emptyMessage.hidden = false;
    }
}

init();