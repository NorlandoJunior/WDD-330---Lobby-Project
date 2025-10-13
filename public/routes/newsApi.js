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

// Inicialize with all news
loadNews();

// Ad event listeners to filter buttons
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const topic = e.target.getAttribute("data-topic");

    // Remove active class from all buttons and add to the clicked one
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");

    // Reload news based on the selected topic
    loadNews(topic);
  });
});
