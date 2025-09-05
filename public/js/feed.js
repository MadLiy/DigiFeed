const API_URL = "http://localhost:3000";
const token = localStorage.getItem('token');

if (!token) window.location.href = '../index.html';

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = '../index.html';
});

async function loadFeed() {
  try {
    const res = await fetch(`${API_URL}/posts/feed`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const posts = await res.json();

    const container = document.getElementById('postsContainer');
    container.innerHTML = '';

    posts.data.forEach(post => {
      const div = document.createElement('div');
      div.className = 'card mb-3';
      div.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">${post.author.name}</h5>
          <p class="card-text">${post.content}</p>
          <small class="text-muted">${new Date(post.createdAt).toLocaleString()}</small>
          <div class="mt-2">
            <button class="btn btn-sm btn-primary likeBtn" data-id="${post.id}">Like</button>
            <span class="ms-2" id="likes-${post.id}">${post.likes.length}</span> likes
          </div>
        </div>
      `;
      container.appendChild(div);
    });

    // ajout des listeners like
    document.querySelectorAll('.likeBtn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const postId = btn.dataset.id;
        try {
          await fetch(`${API_URL}/likes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ postId: parseInt(postId) })
          });
          loadFeed(); // reload
        } catch(err){ console.error(err);}
      });
    });

  } catch (err) {
    console.error(err);
    alert("Impossible de charger le feed");
  }
}

loadFeed();
