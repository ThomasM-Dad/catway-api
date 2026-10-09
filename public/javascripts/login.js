const form = document.getElementById('login-form');
const errorBox = document.getElementById('login-error');

form.addEventListener('submit', async (event) => {
    // Empêche le rechargement de la page par le navigateur
    event.preventDefault();
    errorBox.hidden = true;

    const email = form.email.value.trim();
    const password = form.password.value;

    try {
        const reponse = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (reponse.ok) {
            window.location.href = '/dashboard.html';
            return;
        }

        const data = await reponse.json();
        showError(data.message || 'Connexion impossible');
    } catch (error) {
        showError('Le serveur est injoignable');
    }
});

function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
}