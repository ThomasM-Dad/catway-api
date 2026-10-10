const catwaySelect = document.getElementById('catway-select');
const tableBody = document.getElementById('reservations-body');
const listMessage = document.getElementById('list-message');
const detailsSection = document.getElementById('details');
const detailsList = document.getElementById('details-list');
const form = document.getElementById('reservation-form');
const formTitle = document.getElementById('form-title');
const formError = document.getElementById('form-error');
const submitButton = document.getElementById('submit-button');
const cancelButton = document.getElementById('cancel-button');

let editingId = null;

function formatDate(isoDate) {
    return new Date(isoDate).toLocaleDateString('fr-FR', { timeZone: 'UTC' });
}

// Format YYYY-MM-DD attendu
function toInputDate(isoDate) {
    return isoDate.slice(0, 10);
}

function showListMessage(message) {
    listMessage.textContent = message;
    listMessage.hidden = false;
}

function showFormError(message) {
    formError.textContent = message;
    formError.hidden = false;
}

function createButton(label, onClick, variant) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'table__button' + (variant ? ` table__button--${variant}` : '');
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
}

// Remplit le sélecteur avec la liste des catways
async function loadCatwayOptions() {
    try {
        const catways = await api('/catways');

        catways
            .sort((a, b) => a.catwayNumber - b.catwayNumber)
            .forEach((catway) => {
                const option = document.createElement('option');
                option.value = catway.catwayNumber;
                option.textContent = `Catway ${catway.catwayNumber} (${catway.catwayType})`;
                catwaySelect.appendChild(option);
            });

            if (catways.length === 0) {
                showListMessage("Aucun catway : créez-en un avant d'ajouter des réservations.");
            }
    } catch (error) {
        showListMessage(error.message);
    }
}

function renderReservations(reservations) {
    tableBody.replaceChildren();

    if (reservations.length === 0) {
        showListMessage('Aucune réservation pour ce catway.');
        return;
    }

    listMessage.hidden = true;

    reservations
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        .forEach((reservation) => {
            const row = document.createElement('tr');

            [
                reservation.clientName,
                reservation.boatName,
                formatDate(reservation.startDate),
                formatDate(reservation.endDate)
            ].forEach((value) => {
                const cell = document.createElement('td');
                cell.textContent = value;
                row.appendChild(cell);
            });

            const actions = document.createElement('td');
            actions.append(
                createButton('Détails', () => showDetails(reservation._id)),
                createButton('Modifier', () => startEdit(reservation)),
                createButton('Supprimer', () => removeReservation(reservation._id), 'danger')
            );
            row.appendChild(actions);

            tableBody.appendChild(row);
        });
}

async function loadReservations() {
    tableBody.replaceChildren();
    detailsSection.hidden = true;

    if (!catwaySelect.value) {
        showListMessage('Choisissez un catway pour voir ses réservations.');
        return;
    }

    try {
        const reservations = await api(`/catways/${catwaySelect.value}/reservations`);
        renderReservations(reservations);
    } catch (error) {
        showListMessage(error.message);
    }
}

async function showDetails(id) {
    try {
        const reservation = await api(`/catways/${catwaySelect.value}/reservations/${id}`);

        detailsList.replaceChildren();

        [
            ['Catway', reservation.catwayNumber],
            ['Client', reservation.clientName],
            ['Bateau', reservation.boatName],
            ['Début', formatDate(reservation.startDate)],
            ['Fin', formatDate(reservation.endDate)]
        ].forEach(([label, value]) => {
            const term = document.createElement('dt');
            term.textContent = label;
            const description = document.createElement('dd');
            description.textContent = value;
            detailsList.append(term, description);
        });

        detailsSection.hidden = false;
    } catch (error) {
        showListMessage(error.message);
    }
}

function startEdit(reservation) {
    editingId = reservation._id;

    form.clientName.value = reservation.clientName;
    form.boatName.value = reservation.boatName;
    form.startDate.value = toInputDate(reservation.startDate);
    form.endDate.value = toInputDate(reservation.endDate);

    formError.hidden = true;
    formTitle.textContent = 'Modifier la réservation';
    submitButton.textContent = 'Enregistrer';
    cancelButton.hidden = false;
    form.scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
    editingId = null;
    form.reset();
    formTitle.textContent = 'Ajouter une réservation';
    submitButton.textContent = 'Ajouter';
    cancelButton.hidden = true;
    formError.hidden = true;
}

async function removeReservation(id) {
    if (!confirm('Supprimer cette réservation ?')) {
        return;
    }

    try {
        await api(`/catways/${catwaySelect.value}/reservations/${id}`, { method: 'DELETE' });

        if (editingId === id) {
            resetForm();
        }
        await loadReservations();
    } catch (error) {
        showListMessage(error.message);
    }
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    formError.hidden = true;

    if (!catwaySelect.value) {
        showFormError("Choisissez d'abord un catway.");
        return;
    }

    const body = JSON.stringify({
        clientName: form.clientName.value.trim(),
        boatName: form.boatName.value.trim(),
        startDate: form.startDate.value,
        endDate: form.endDate.value
    });

    try {
        if (editingId === null) {
            await api(`/catways/${catwaySelect.value}/reservations`, { method: 'POST', body });

        } else {
            await api(`/catways/${catwaySelect.value}/reservations/${editingId}`, { method: 'PUT', body });
        }

        resetForm();
        await loadReservations();
    } catch (error) {
        showFormError(error.message);
    }
});

catwaySelect.addEventListener('change', () => {
    resetForm();
    loadReservations();
});

cancelButton.addEventListener('click', resetForm);

loadCatwayOptions();
loadReservations();