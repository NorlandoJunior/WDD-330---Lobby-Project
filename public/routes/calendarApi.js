const calendarContainer = document.getElementById("calendar-container");

async function loadHolidays() {
  try {
    // Call to secure backend route
    const response = await fetch("/calendar");
    if (!response.ok) throw new Error("Failed to fetch calendar data");

    const holidays = await response.json();

    // Clean container and add title
    calendarContainer.innerHTML = "<h2>Holidays</h2>";

    if (!holidays || holidays.length === 0) {
      calendarContainer.innerHTML += "<p>Nenhum feriado encontrado.</p>";
      return;
    }

    // Criar cards para cada feriado
    holidays.forEach(holiday => {
      const div = document.createElement("div");
      div.classList.add("holiday-card");
      const date = holiday.date?.iso || "Data desconhecida";
      const name = holiday.name || "Nome desconhecido";

      div.innerHTML = `
        <p><strong>${date}</strong></p>
        <p>${name}</p>
      `;

      calendarContainer.appendChild(div);
    });
  } catch (error) {
    calendarContainer.innerHTML = "<p>Erro ao carregar o calendário.</p>";
    console.error(error);
  }
}

loadHolidays();
