const API_URL = "http://localhost:3000";
const token = localStorage.getItem("token");

if (!token) window.location.href = "../index.html";

const viewUserId = localStorage.getItem("viewUserId") || null;

async function loadProfile() {
  const res = await fetch(`${API_URL}/users/${viewUserId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const user = await res.json();

  document.getElementById("userName").innerText = user.name;
  document.getElementById("userEmail").innerText = user.email;
  document.getElementById("userCreated").innerText = new Date(user.createdAt).toLocaleDateString();

  // Check follow status
  const followRes = await fetch(`${API_URL}/users/${viewUserId}/follow-status`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const { following } = await followRes.json();
  const btn = document.getElementById("followBtn");
  btn.innerText = following ? "Ne plus suivre" : "Suivre";
  btn.onclick = async () => {
    if (following) {
      await fetch(`${API_URL}/users/${viewUserId}/unfollow`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    } else {
      await fetch(`${API_URL}/users/${viewUserId}/follow`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    }
    loadProfile();
  };
}

// Logout
function logout() {
  localStorage.removeItem("token");
  window.location.href = "../index.html";
}

// Posts de l'utilisateur
async function loadPosts() {
  const res = await fetch(`${API_URL}/posts/user/${viewUserId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const posts = await res.json();
  const container = document.getElementById("userPosts");
  container.innerHTML = "";

  posts.forEach(post => {
    const card = document.createElement("div");
    card.className = "card shadow-sm";
    card.innerHTML = `
      <div class="card-body">
        <p>${post.content}</p>
        ${post.imageUrl ? `<img src="${post.imageUrl}" class="img-fluid rounded mb-2"/>` : ""}
      </div>
    `;
    container.appendChild(card);
  });
}

loadProfile();
loadPosts();
