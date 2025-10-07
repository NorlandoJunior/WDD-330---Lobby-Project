fetch("http://localhost:3000/news?country=us")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("news");
    container.innerHTML = "";

    if (data.articles && data.articles.length > 0) {
      data.articles.forEach(article => {
        const div = document.createElement("div");
        div.classList.add("news-article"); // To add some styling if needed
        div.innerHTML = `
          <h2>${article.title}</h2>
          ${article.urlToImage ? `<img src="${article.urlToImage}" alt="${article.title}" style="max-width:100%; margin: 10px 0;">` : ""}
          <p>${article.description || ""}</p>
          <a href="${article.url}" target="_blank">Read more</a>
          <hr>
        `;
        container.appendChild(div);
      });
    } else {
      container.textContent = "No news found.";
    }
  })
  .catch(err => {
    console.error(err);
    document.getElementById("news").textContent = "Error loading news.";
  });
