async function loadNews() {
  try {
    const response = await fetch("/news");
    const data = await response.json();

    const main = document.getElementById("news-container");
    main.innerHTML = "<h2>Top Headlines</h2>";

    if (data.articles) {
      data.articles.forEach(article => {
        const div = document.createElement("div");
        div.classList.add("news-card");

        const img = document.createElement("img");
        img.src = article.urlToImage || 'images/placeholder.png';
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
      main.innerHTML += "<p>No news found.</p>";
    }
  } catch (err) {
    console.error(err);
    document.querySelector("main").innerHTML = "<p>Error loading news.</p>";
  }
}

loadNews();
