// Load News 
async function loadNews(topic = "all") {
  try {
    const endpoint = topic === "all" ? "/news" : `/news?topic=${topic}`;
    const response = await fetch(endpoint);
    const data = await response.json();

    const main = document.getElementById("news-container");
    main.innerHTML = "";

    if (data.articles && data.articles.length > 0) {
      data.articles.forEach(article => {
        const div = document.createElement("div");
        div.classList.add("news-card");

        const img = document.createElement("img");
        img.src = article.urlToImage || "images/placeholder.png";
        img.alt = article.title || "News Image";
        div.appendChild(img);

        const title = document.createElement("h3");
        title.textContent = article.title;
        div.appendChild(title);

        const desc = document.createElement("p");
        desc.textContent = article.description || "";
        div.appendChild(desc);

        const link = document.createElement("a");
        link.href = article.url;
        link.target = "_blank";
        link.textContent = "Read more";
        div.appendChild(link);

        // ⭐ Favorite button
        const favBtn = document.createElement("button");
        favBtn.textContent = "⭐ Favorite";
        favBtn.classList.add("favorite-btn");
        favBtn.addEventListener("click", () => addToFavorites(article));
        div.appendChild(favBtn);

        main.appendChild(div);
      });
    } else {
      main.innerHTML = "<p>No news found.</p>";
    }
  } catch (err) {
    console.error(err);
    document.querySelector("main").innerHTML = "<p>Error loading news.</p>";
  }
}

//  Add to Favorites
function addToFavorites(article) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (!favorites.some(fav => fav.url === article.url)) {
    favorites.push(article);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("⭐ Added to Favorites!");
  } else {
    alert("This article is already in Favorites!");
  }
}

//Show Favorites
document.getElementById("show-favorites").addEventListener("click", () => {
  const newsContainer = document.getElementById("news-container");
  const favoritesContainer = document.getElementById("favorites-container");

  // Toggle visibility
  if (favoritesContainer.style.display === "none") {
    newsContainer.style.display = "none";
    favoritesContainer.style.display = "grid";
    showFavorites();
  } else {
    favoritesContainer.style.display = "none";
    newsContainer.style.display = "grid";
  }
});

function showFavorites() {
  const container = document.getElementById("favorites-container");
  container.innerHTML = "";

  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.length === 0) {
    container.innerHTML = "<p>No favorites yet.</p>";
    return;
  }

  favorites.forEach(article => {
    const div = document.createElement("div");
    div.classList.add("news-card");

    div.innerHTML = `
      <img src="${article.urlToImage || 'images/placeholder.png'}" alt="">
      <h3>${article.title}</h3>
      <p>${article.description || ""}</p>
      <a href="${article.url}" target="_blank">Read more</a>
    `;

    // Remove button
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌ Remove";
    removeBtn.classList.add("remove-btn");
    removeBtn.addEventListener("click", () => removeFromFavorites(article.url));
    div.appendChild(removeBtn);

    container.appendChild(div);
  });
}

function removeFromFavorites(url) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites = favorites.filter(fav => fav.url !== url);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  showFavorites();
}

// Filters
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const topic = e.target.getAttribute("data-topic");

    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");

    loadNews(topic);
  });
});

// Load initial news
loadNews();
