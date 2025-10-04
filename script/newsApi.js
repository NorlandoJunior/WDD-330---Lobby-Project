const apiKey = "f5d8d3ee6ff84a7a8f8924fe6abeeec6";
const url = `https://newsapi.org/v2/top-headlines?country=br&apiKey=${apiKey}`;

async function getNews() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data.articles);

    // Exibir no HTML
    const container = document.getElementById("news");
    data.articles.forEach(article => {
      const div = document.createElement("div");
      div.innerHTML = `
        <h2>${article.title}</h2>
        <p>${article.description || ""}</p>
        <a href="${article.url}" target="_blank">Ler mais</a>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    console.error("Erro ao buscar notícias:", error);
  }
}

getNews();
