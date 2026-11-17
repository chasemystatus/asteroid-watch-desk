const form = document.querySelector("form");
const dateInput = document.querySelector("#date");
const responseMessage = document.querySelector("#response-message");
const output = document.querySelector("#output");
const observationNote = document.querySelector("#observation-note");

function handleSubmit(event) {
  event.preventDefault();

  const date = dateInput.value;

  axios
    .get("/.netlify/functions/asteroids", { params: { date: date } })

    .then(function (response) {
      if (dateInput.value !== date) {
        return;
      }

      const dateForDisplay = new Date(`${response.data.date}T00:00:00`);

      const readableDate = new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(dateForDisplay);

      const count = response.data.count;
      let responseWording = "asteroids";

      if (count === 1) {
        responseWording = "asteroid";
      }

      responseMessage.textContent = `For ${readableDate}, NASA lists ${count} near-earth ${responseWording} making a close approach.`;

      observationNote.hidden = false;
      output.hidden = false;
    })

    .catch(function (error) {
      if (dateInput.value !== date) {
        return;
      }

      observationNote.hidden = true;

      if (error.response) {
        responseMessage.textContent = error.response.data.error;
      } else {
        responseMessage.textContent =
          "Could not load asteroid data. Please try again.";
      }
      output.hidden = false;
    });
}

form.addEventListener("submit", handleSubmit);

dateInput.addEventListener("input", function () {
  responseMessage.textContent = "";
  output.hidden = true;
});

function formatDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let monthText = month;
  if (month < 10) {
    monthText = "0" + month;
  }

  let dayText = day;
  if (day < 10) {
    dayText = "0" + day;
  }

  return `${year}-${monthText}-${dayText}`;
}

const now = new Date();
dateInput.value = formatDate(now);
