// Appelle l'API en JSON. Renvoie vers l'accueil si la session a expiré.
async function api(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
    });

    if (response.status === 401) {
        window.location.href = '/';
        throw new Error('Session expirée');
    }

    const data = response.status === 204 ? null : await response.json(() => null);

    if (!response.ok) {
        throw new Error((data && data.message) || 'Erreur serveur');
    }

    return data;

    const logoutButton = document.getElementById('logout-button');

    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            await fetch('/logout');
            window.location.href ='/';
        });
    }
}