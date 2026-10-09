const tableBody = document.getElementById('catways-body');
const listMessage = document.getElementById('list-message');
const detailsSection = document.getElementById('details');
const detailsList = document.getElementById('details-list');
const form = document.getElementById('catway-form');
const formTitle = document.getElementById('form-title');
const formError = document.getElementById('form-error');
const submitButton = document.getElementById('submit-button');
const cancelButton = document.getElementById('cancel-button');

// null = mode création, sinon numéro du catway en cours de modif
let editingNumber = null;

function showListMessage(message) {
    listMessage.textContent = message;
    listMessage.hidden = false;
}

function createButton(label, onClick, variant) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'table__button' + (variant ? ` table__button--${variant}` : '');
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
}

function renderCatways(catways) {
    tableBody.replaceChildren();

    if (catways.length === 0) {
        showListMessage('Aucun catway.');
        return;
    }

    listMessage.hidden = true;

    catways
        .sort((a, b) => a.catwayNumber - b.catwayNumber)
        .forEach((catway) => {
            const row = document.createElement('tr');

            [catway.catwayNumber, catway.catwayType, catway.catwayState].forEach((value) => {
                const cell = document.createElement('td');
                cell.textContent = value;
                row.appendChild(cell);
            });

            const actions = document.createElement('td');
            actions.append(
                createButton('Détails', () => showDetails(catway.catwayNumber)),
                createButton('Modifier', () => startEdit(catway)),
                createButton('Supprimer', () => removeCatway(catway.catwayNumber), 'danger')
            );
            row.appendChild(actions);

            tableBody.appendChild(row);
        });
}

async function loadCatways() {
    try {
        renderCatways(await api('/catways'));
    } catch (error) {
        showListMessage(error.message);
    }
}

async function showDetails(number) {
    try {
        const catway = await api(`/catways/${number}`);

        detailsList.replaceChildren();

        [
            ['Numéro', catway.catwayNumber],
            ['Type', catway.catwayType],
            ['État', catway.catwayState]
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

function startEdit(catway) {
    editingNumber = catway.catwayNumber;

    form.catwayNumber.value = catway.catwayNumber;
    form.catwayType.value = catway.catwayType;
    form.catwayState.value = catway.catwayState;

    form.catwayNumber.disabled = true;
    form.catwayType.disabled = true;

    formTitle.textContent = `Modifier l'état du catway ${catway.catwayNumber}`;
    submitButton.textContent = 'Enregistrer';
    cancelButton.hidden = false;
    form.scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
    editingNumber = null;
    form.reset();
    form.catwayNumber.disabled = false;
    form.catwayType.disabled= false;
    formTitle.textContent = 'Ajouter un catway';
    submitButton.textContent ='Ajouter';
    cancelButton.hidden = true;
    formError.hidden = true;
}

async function removeCatway(number) {
    if (!confirm(`Supprimer le catway ${number} ?`)) {
        return;
    }

    try {
        await api(`/catways/${number}`, { method: 'DELETE' });

        if (editingNumber === number) {
            resetForm();
        }
        detailsSection.hidden = true;
        await loadCatways();
    } catch (error) {
        showListMessage(error.message);
    }
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    formError.hidden = true;

    try {
        if (editingNumber === null) {
            await api('/catways', {
                method: 'POST',
                body: JSON.stringify({
                    catwayNumber: Number(form.catwayNumber.value),
                    catwayType: form.catwayType.value,
                    catwayState: form.catwayState.value.trim()
                })
            });
        } else {
            await api (`/catways/${editingNumber}`, {
                method: 'PUT',
                body: JSON.stringify({ catwayState: form.catwayState.value.trim() })
            });
        }

        resetForm();
        await loadCatways();
    } catch (error) {
        formError.textContent = error.message;
        formError.hidden = false;
    }
});

cancelButton.addEventListener('click', resetForm);

loadCatways();