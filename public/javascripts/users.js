const tableBody = document.getElementById('users-body');
const listMessage = document.getElementById('list-message');
const detailsSection = document.getElementById('details');
const detailsList = document.getElementById('details-list');
const form = document.getElementById('user-form');
const formTitle = document.getElementById('form-title');
const formError = document.getElementById('form-error');
const submitButton = document.getElementById('submit-button');
const cancelButton = document.getElementById('cancel-button');

let editingEmail = null;

let currentEmail = null;

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

function userUrl(email) {
    return `/users/${encodeURIComponent(email)}`;
}

function renderUsers(users) {
    tableBody.replaceChildren();

    if (users.length === 0) {
        showListMessage('Aucun utilisateur.');
        return;
    }

    listMessage.hidden = true;

    users
        .sort((a, b) => a.username.localeCompare(b.username))
        .forEach((user) => {
            const row = document.createElement('tr');

            [user.username, user.email].forEach((value) => {
                const cell = document.createElement('td');
                cell.textContent = value;
                row.appendChild(cell);
            });

            const actions = document.createElement('td');
            actions.append(
                createButton('Détails', () => showDetails(user.email)),
                createButton('Modifier', () => startEdit(user)),
                createButton('Supprimer', () => removeUser(user.email), 'danger')
            );
            row.appendChild(actions);

            tableBody.appendChild(row);
        });
}

async function loadUsers() {
    try {
        renderUsers(await api('/users'));
    } catch (error) {
        showListMessage(error.message);
    }
}

async function showDetails(email) {
    try {
        const user = await api(userUrl(email));

        detailsList.replaceChildren();

        [
            ["Nom d'utilisateur", user.username],
            ['Adresse e-mail', user.email]
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

function startEdit(user) {
    editingEmail = user.email;

    form.username.value = user.username;
    form.email.value = user.email;
    form.password.value = '';

    // A la modif, le MDP est facultatif
    form.password.required = false;
    form.password.placeholder = 'Laisser vide pour ne pas le changer';

    formError.hidden = true;
    formTitle.textContent = "Modifier l'utilisateur";
    submitButton.textContent = 'Enregistrer';
    cancelButton.hidden = false;
    form.scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
    editingEmail = null;
    form.reset();
    form.password.required = true;
    form.password.placeholder = '';
    formTitle.textContent = 'Ajouter un utilisateur';
    submitButton.textContent = 'Ajouter';
    cancelButton.hidden = true;
    formError.hidden = true;
}

async function removeUser(email) {
    const isSelf = email === currentEmail;
    const message = isSelf
        ? 'Vous allez supprimer votre propre compte et être déconnecté. Continuer ?'
        : `Supprimer l'utilisateur ${email} ?`;

    if (!confirm(message)) {
        return;
    }

    try {
        await api(userUrl(email), { method: 'DELETE' });

        if (isSelf) {
            await fetch('/logout');
            window.location.href = '/';
            return;
        }

        if(editingEmail === email) {
            resetForm();
        }
        detailsSection.hidden = true;
        await loadUsers();
    } catch (error) {
        showListMessage(error.message);
    }
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    formError.hidden = true;

    const data = {
        username: form.username.value.trim(),
        email: form.email.value.trim()
    };

    if (form.password.value) {
        data.password = form.password.value;
    }

    try {
        if (editingEmail === null) {
            await api('/users', { method: 'POST', body: JSON.stringify(data) });
        } else {
            await api(userUrl(editingEmail), { method: 'PUT', body: JSON.stringify(data) });

            if (editingEmail === currentEmail) {
                currentEmail = data.email.toLowerCase();
            }
        }

        resetForm();
        detailsSection.hidden = true;
        await loadUsers();
    } catch (error) {
        showFormError(error.message);
    }
});

cancelButton.addEventListener('click', resetForm);

async function init() {
    try {
        const data = await api('/me');
        currentEmail = data.user.email;
    } catch (error) {

    }

    await loadUsers();
}

init();