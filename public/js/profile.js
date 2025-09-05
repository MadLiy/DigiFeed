const API_URL = "http://localhost:3000";
const token = localStorage.getItem('token');

if (!token) window.location.href = '../index.html';

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = '../index.html';
});

const userId = new URLSearchParams(window.location.search).get('id') || 'me';
const followBtn = document.getElementById('followBtn');

async function loadProfile() {
  try {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const user = await res.json();
    document.getElementById('userName').innerText = user.data.name;

    // check si déjà suivi
    const followersRes = await fetch(`${API_URL}/users/${userId}/followers`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const followers = await followersRes.json();
    const isFollowing = followers.data.some(f => f.id === parseInt(localStorage.getItem('myId')));
    followBtn.innerText = isFollowing ? 'Unfollow' : 'Follow';

    followBtn.onclick = async () => {
      const method = isFollowing ? 'DELETE' : 'POST';
      await fetch(`${API_URL}/users/${userId}/follow`, {
        method,
        headers: { Authorization: `Bearer ${token}` }
      });
      loadProfile();
    };

    // abonnés
    const followingList = await fetch(`${API_URL}/users/${userId}/following`, { headers: { Authorization: `Bearer ${token}` } });
    const followingData = await followingList.json();
    document.getElementById('followingList').innerHTML = followingData.data.map(u => `<li>${u.name}</li>`).join('');

    document.getElementById('followersList').innerHTML = followers.data.map(u => `<li>${u.follower.name}</li>`).join('');

  } catch(err) {
    console.error(err);
    alert("Erreur chargement profil");
  }
}

loadProfile();
