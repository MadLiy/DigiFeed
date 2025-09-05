
const API_URL = "http://localhost:3000";
const token = localStorage.getItem("token");

if (!token) window.location.href = "../index.html";

// Logout
function logout() {
  localStorage.removeItem("token");
  window.location.href = "../index.html";
}

// Charger le feed
async function loadFeed() {
  const res = await fetch(`${API_URL}/posts/feed`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const posts = await res.json();
  const container = document.getElementById("feedContainer");
  container.innerHTML = "";

  posts.forEach(post => {
    const card = document.createElement("div");
    card.className = "card shadow-sm";

    card.innerHTML = `
      <div class="card-body">
        <h5>${post.author.name}</h5>
        <p>${post.content}</p>
        ${post.imageUrl ? `<img src="${post.imageUrl}" class="img-fluid rounded mb-2"/>` : ""}
        <button class="btn btn-sm btn-outline-primary" onclick="likePost(${post.id})">
          ❤️ ${post.likes.length}
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Publier un post
document.getElementById("postForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const content = form.content.value;
  const imageUrl = form.imageUrl.value || null;

  await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ content, imageUrl })
  });

  form.reset();
  loadFeed();
});

// Like/Unlike
async function likePost(postId) {
  await fetch(`${API_URL}/likes/${postId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });
  loadFeed();
}

// Charger au démarrage
loadFeed();

posts.forEach(post => {
  const card = document.createElement("div");
  card.className = "card shadow-sm";

  card.innerHTML = `
    <div class="card-body">
      <h5 style="cursor:pointer;" onclick="viewProfile(${post.author.id})">${post.author.name}</h5>
      <p>${post.content}</p>
      ${post.imageUrl ? `<img src="${post.imageUrl}" class="img-fluid rounded mb-2"/>` : ""}
      <button class="btn btn-sm btn-outline-primary" onclick="likePost(${post.id})">
        ❤️ ${post.likes.length}
      </button>
    </div>
  `;
  container.appendChild(card);
});

// Redirection vers le profil
function viewProfile(userId) {
  localStorage.setItem("viewUserId", userId);
  window.location.href = "./html/profile.html";
}