const API_URL = "http://localhost:3000";

document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.accessToken);
      window.location.href = '/html/feed.html';
    } else {
      alert(data.message || "Erreur connexion");
    }
  } catch (err) {
    console.error(err);
    alert("Erreur serveur");
  }
});

document.getElementById('registerForm').addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (res.ok) alert('Inscription réussie ! Connectez-vous.');
    else alert(data.message || "Erreur inscription");
  } catch (err) {
    console.error(err);
    alert("Erreur serveur");
  }
});
