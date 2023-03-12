let jsonData = [];
let bookmarkState = JSON.parse(localStorage.getItem("bookmarkState")) || {};

function onJsonLoaded() {
  return fetch("data.json").then((response) => response.json());
}

const routes = {
  "#/home": displayHome,
  "#/movies": displayMoviesTab,
  "#/series": displaySeriesTab,
  "#/bookmarks": displayBookmarks,
};

function displayHome() {
  displayTrendingCards();
  displayRecommendationCards();
}

function displayMoviesTab() {
  displayMoviesCards();
}

function displaySeriesTab() {
  displaySeriesCards();
}

function displayBookmarks() {
  displayBookmarksCards();
}

function route() {
  const path = window.location.hash || "#/";
  const handler = routes[path];
  const tabs = document.querySelectorAll(".tab");
  const navLinks = document.querySelectorAll(".link");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((link) => {
        link.classList.remove("active_tab");
      });
      link.classList.add("active_tab");
    });
  });

  tabs.forEach((tab) => {
    console.log(tab.id);
    if (tab.id === path.replace("#/", "")) {
      tab.classList.remove("hidden");
    } else {
      tab.classList.add("hidden");
    }
  });

  if (handler) {
    onJsonLoaded().then((data) => {
      jsonData = data;

      handler();
      const bookmark = document.querySelectorAll(".bookmark");
      bookmark.forEach((bookmark) => {
        const cardId = parseInt(bookmark.closest(".card").dataset.cardId);
        if (bookmarkState[cardId]) {
          bookmark
            .querySelector(".bookmark_icon_1")
            .classList.remove("bookmark_active");
          bookmark
            .querySelector(".bookmark_icon_2")
            .classList.add("bookmark_active");
        } else {
          bookmark
            .querySelector(".bookmark_icon_1")
            .classList.add("bookmark_active");
          bookmark
            .querySelector(".bookmark_icon_2")
            .classList.remove("bookmark_active");
        }
      });
      bookmark.forEach((bookmark) => {
        bookmark.addEventListener("click", addBookmarks);
      });
    });
  } else {
    console.log("Page inconnue");
  }
}

window.addEventListener("popstate", route);
window.addEventListener("load", route);

function addBookmarks(event) {
  let card = event.target.parentNode;
  while (card && !card.hasAttribute("data-card-id")) {
    card = card.parentNode;
  }

  const cardId = parseInt(card.dataset.cardId);
  const signet = event.target
    .closest(".bookmark")
    .querySelector(".bookmark_icon_2");

  const cardData = jsonData.find((data) => data.id === cardId);
  cardData.isBookmarked = !cardData.isBookmarked;

  const index = jsonData.findIndex((data) => data.id === cardId);
  if (index !== -1) {
    jsonData[index] = cardData;
  }

  signet.classList.toggle("bookmark_active", cardData.isBookmarked);

  bookmarkState[cardId] = cardData.isBookmarked;

  localStorage.setItem("bookmarkState", JSON.stringify(bookmarkState));
}

function displayTrendingCards() {
  let card = document.querySelector(".row_1");

  card.innerHTML = jsonData
    .filter((card) => card.isTrending === true)
    .map((card) => {
      return ` 
      <div class="fadeTrendingCard">
       <div class="trending_card fadeInTrendingCard card" data-card-id="${
         card.id
       }">
        <div class="bg_img_card  play_hover">
          <img
            class="opacity_hover"
            src="${card.thumbnail.trending.large}"
            alt=""
          />
          <div class="play_card row">
                <img src="./assets/icon-play.svg" alt="" />
                <p class="medium">Play</p>
          </div>
        </div>
        <div class="bookmark bookmark_trending bookmark_hover">
        <svg class="bookmark_icon bookmark_icon_1 " width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="m10.518.75.399 12.214-5.084-4.24-4.535 4.426L.75 1.036l9.768-.285Z" stroke-width="1.5" fill="none"/></svg>
        <svg class="bookmark_icon bookmark_icon_2" width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M10.61 0c.14 0 .273.028.4.083a1.03 1.03 0 0 1 .657.953v11.928a1.03 1.03 0 0 1-.656.953c-.116.05-.25.074-.402.074-.291 0-.543-.099-.756-.296L5.833 9.77l-4.02 3.924c-.218.203-.47.305-.756.305a.995.995 0 0 1-.4-.083A1.03 1.03 0 0 1 0 12.964V1.036A1.03 1.03 0 0 1 .656.083.995.995 0 0 1 1.057 0h9.552Z" fill="#FFF"/></svg>
        </div>
        <div class="col col_4">
          <div class="row row_2">
            <div class="light year year_trending font_15 fadeInTrendingText"><span>${
              card.year
            }</span></div>
            <div class="row light category category_trending fadeInTrendingText">
              <img src="./assets/icon-category-${
                card.category === "Movie" ? "movie" : "tv"
              }.svg" alt="" />
              <p class="font_15">${card.category}</p>
            </div>
            <p class="rating trend_rating light font_15 fadeInTrendingText">${
              card.rating
            }</p>
          </div>
          <div class="title_card title_trending_card medium">${card.title}</div>
        </div>
      </div>
      </div>`;
    })
    .join("");
}

function displayRecommendationCards() {
  let card = document.querySelector(".row_3");

  card.innerHTML = jsonData
    .filter((card) => card.isTrending === false)
    .map((card) => {
      return ` <div class="regular_card card col" data-card-id="${card.id}">
      
      <div class="regular_img play_hover fadeOpacity">
        <img
          class="bg_regular_img opacity_hover"
          src="${card.thumbnail.regular.large}"
          alt=""
        />
        <div class="play_card row">
        <img src="./assets/icon-play.svg" alt="" />
        <p class="medium">Play</p>
      </div>
        <div class="bookmark bookmark_regular bookmark_hover">
          <svg
            class="bookmark_icon bookmark_icon_1"
            width="12"
            height="14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m10.518.75.399 12.214-5.084-4.24-4.535 4.426L.75 1.036l9.768-.285Z"
              stroke-width="1.5"
              fill="none"
            />
          </svg>
          <svg class="bookmark_icon bookmark_icon_2" width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M10.61 0c.14 0 .273.028.4.083a1.03 1.03 0 0 1 .657.953v11.928a1.03 1.03 0 0 1-.656.953c-.116.05-.25.074-.402.074-.291 0-.543-.099-.756-.296L5.833 9.77l-4.02 3.924c-.218.203-.47.305-.756.305a.995.995 0 0 1-.4-.083A1.03 1.03 0 0 1 0 12.964V1.036A1.03 1.03 0 0 1 .656.083.995.995 0 0 1 1.057 0h9.552Z" fill="#FFF"/></svg>
        </div>
      </div>
      <div class="col col_6">
        <div class="row row_5">
          <p class="regular_year font_13 year light fadeAnimation">2019</p>
          <div class="row light regular_category category fadeAnimation">
            <img src="./assets/icon-category-${
              card.category === "Movie" ? "movie" : "tv"
            }.svg" alt="" />
            <p class="font_13">${card.category}</p>
          </div>
          <p class="regular_rating rating light font_13 fadeAnimation">${
            card.rating
          }</p>
        </div>
        <div class="regular_title title_card">
          <p class="medium fadeAnimation">${card.title}</p>
        </div>
      </div>
    </div>`;
    })
    .join("");
}

function displayMoviesCards() {
  let card = document.querySelector(".row_9");

  card.innerHTML = jsonData
    .filter((card) => card.category === "Movie")
    .map((card) => {
      return ` <div class="regular_card card col" data-card-id="${card.id}">
      
      <div class="regular_img play_hover fadeOpacity">
        <img
          class="bg_regular_img opacity_hover"
          src="${card.thumbnail.regular.large}"
          alt=""
        />
        <div class="play_card row">
        <img src="./assets/icon-play.svg" alt="" />
        <p class="medium">Play</p>
      </div>
        <div class="bookmark bookmark_regular bookmark_hover">
          <svg
            class="bookmark_icon bookmark_icon_1"
            width="12"
            height="14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m10.518.75.399 12.214-5.084-4.24-4.535 4.426L.75 1.036l9.768-.285Z"
              stroke-width="1.5"
              fill="none"
            />
          </svg>
          <svg class="bookmark_icon bookmark_icon_2" width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M10.61 0c.14 0 .273.028.4.083a1.03 1.03 0 0 1 .657.953v11.928a1.03 1.03 0 0 1-.656.953c-.116.05-.25.074-.402.074-.291 0-.543-.099-.756-.296L5.833 9.77l-4.02 3.924c-.218.203-.47.305-.756.305a.995.995 0 0 1-.4-.083A1.03 1.03 0 0 1 0 12.964V1.036A1.03 1.03 0 0 1 .656.083.995.995 0 0 1 1.057 0h9.552Z" fill="#FFF"/></svg>
        </div>
      </div>
      <div class="col col_6">
        <div class="row row_5">
          <p class="regular_year font_13 year light fadeAnimation">2019</p>
          <div class="row light regular_category category fadeAnimation">
            <img src="./assets/icon-category-movie.svg" alt="" />
            <p class="font_13">${card.category}</p>
          </div>
          <p class="regular_rating rating light font_13 fadeAnimation">${card.rating}</p>
        </div>
        <div class="regular_title title_card">
          <p class="medium fadeAnimation">${card.title}</p>
        </div>
      </div>
    </div>`;
    })
    .join("");
}

function displaySeriesCards() {
  let card = document.querySelector(".row_8");

  card.innerHTML = jsonData
    .filter((card) => card.category === "TV Series")
    .map((card) => {
      return ` <div class="regular_card card col" data-card-id="${card.id}">
      
      <div class="regular_img play_hover fadeOpacity">
        <img
          class="bg_regular_img opacity_hover"
          src="${card.thumbnail.regular.large}"
          alt=""
        />
        <div class="play_card row">
        <img src="./assets/icon-play.svg" alt="" />
        <p class="medium">Play</p>
      </div>
        <div class="bookmark bookmark_regular bookmark_hover">
          <svg
            class="bookmark_icon bookmark_icon_1"
            width="12"
            height="14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m10.518.75.399 12.214-5.084-4.24-4.535 4.426L.75 1.036l9.768-.285Z"
              stroke-width="1.5"
              fill="none"
            />
          </svg>
          <svg class="bookmark_icon bookmark_icon_2" width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M10.61 0c.14 0 .273.028.4.083a1.03 1.03 0 0 1 .657.953v11.928a1.03 1.03 0 0 1-.656.953c-.116.05-.25.074-.402.074-.291 0-.543-.099-.756-.296L5.833 9.77l-4.02 3.924c-.218.203-.47.305-.756.305a.995.995 0 0 1-.4-.083A1.03 1.03 0 0 1 0 12.964V1.036A1.03 1.03 0 0 1 .656.083.995.995 0 0 1 1.057 0h9.552Z" fill="#FFF"/></svg>
        </div>
      </div>
      <div class="col col_6">
        <div class="row row_5">
          <p class="regular_year font_13 year light fadeAnimation">2019</p>
          <div class="row light regular_category category fadeAnimation">
            <img src="./assets/icon-category-tv.svg" alt="" />
            <p class="font_13">${card.category}</p>
          </div>
          <p class="regular_rating rating light font_13 fadeAnimation">${card.rating}</p>
        </div>
        <div class="regular_title title_card">
          <p class="medium fadeAnimation">${card.title}</p>
        </div>
      </div>
    </div>`;
    })
    .join("");
}

function displayBookmarksCards() {
  let bookmarkedMovies = document.querySelector(".row_11");
  let bookmarkedSeries = document.querySelector(".row_12");
  const cardIds = Object.keys(bookmarkState).filter((id) => bookmarkState[id]);

  const bookmarkedCards = cardIds.map((id) =>
    jsonData.find((card) => card.id === parseInt(id))
  );

  bookmarkedMovies.innerHTML = bookmarkedCards
    .filter((card) => card.category === "Movie")
    .map((card) => {
      return ` <div class="regular_card card col" data-card-id="${card.id}">
      
      <div class="regular_img play_hover fadeOpacity">
        <img
          class="bg_regular_img opacity_hover"
          src="${card.thumbnail.regular.large}"
          alt=""
        />
        <div class="play_card row">
        <img src="./assets/icon-play.svg" alt="" />
        <p class="medium">Play</p>
      </div>
        <div class="bookmark bookmark_regular bookmark_hover">
          <svg
            class="bookmark_icon bookmark_icon_1"
            width="12"
            height="14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m10.518.75.399 12.214-5.084-4.24-4.535 4.426L.75 1.036l9.768-.285Z"
              stroke-width="1.5"
              fill="none"
            />
          </svg>
          <svg class="bookmark_icon bookmark_icon_2" width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M10.61 0c.14 0 .273.028.4.083a1.03 1.03 0 0 1 .657.953v11.928a1.03 1.03 0 0 1-.656.953c-.116.05-.25.074-.402.074-.291 0-.543-.099-.756-.296L5.833 9.77l-4.02 3.924c-.218.203-.47.305-.756.305a.995.995 0 0 1-.4-.083A1.03 1.03 0 0 1 0 12.964V1.036A1.03 1.03 0 0 1 .656.083.995.995 0 0 1 1.057 0h9.552Z" fill="#FFF"/></svg>
        </div>
      </div>
      <div class="col col_6">
        <div class="row row_5">
          <p class="regular_year font_13 year light fadeAnimation">2019</p>
          <div class="row light regular_category category fadeAnimation">
            <img src="./assets/icon-category-movie.svg" alt="" />
            <p class="font_13">${card.category}</p>
          </div>
          <p class="regular_rating rating light font_13 fadeAnimation">${card.rating}</p>
        </div>
        <div class="regular_title title_card">
          <p class="medium fadeAnimation">${card.title}</p>
        </div>
      </div>
    </div>`;
    })
    .join("");

  bookmarkedSeries.innerHTML = bookmarkedCards
    .filter((card) => card.category === "TV Series")
    .map((card) => {
      return ` <div class="regular_card card col" data-card-id="${card.id}">
      
      <div class="regular_img play_hover fadeOpacity">
        <img
          class="bg_regular_img opacity_hover"
          src="${card.thumbnail.regular.large}"
          alt=""
        />
        <div class="play_card row">
        <img src="./assets/icon-play.svg" alt="" />
        <p class="medium">Play</p>
      </div>
        <div class="bookmark bookmark_regular bookmark_hover">
          <svg
            class="bookmark_icon bookmark_icon_1"
            width="12"
            height="14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m10.518.75.399 12.214-5.084-4.24-4.535 4.426L.75 1.036l9.768-.285Z"
              stroke-width="1.5"
              fill="none"
            />
          </svg>
          <svg class="bookmark_icon bookmark_icon_2" width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M10.61 0c.14 0 .273.028.4.083a1.03 1.03 0 0 1 .657.953v11.928a1.03 1.03 0 0 1-.656.953c-.116.05-.25.074-.402.074-.291 0-.543-.099-.756-.296L5.833 9.77l-4.02 3.924c-.218.203-.47.305-.756.305a.995.995 0 0 1-.4-.083A1.03 1.03 0 0 1 0 12.964V1.036A1.03 1.03 0 0 1 .656.083.995.995 0 0 1 1.057 0h9.552Z" fill="#FFF"/></svg>
        </div>
      </div>
      <div class="col col_6">
        <div class="row row_5">
          <p class="regular_year font_13 year light fadeAnimation">2019</p>
          <div class="row light regular_category category fadeAnimation">
            <img src="./assets/icon-category-movie.svg" alt="" />
            <p class="font_13">${card.category}</p>
          </div>
          <p class="regular_rating rating light font_13 fadeAnimation">${card.rating}</p>
        </div>
        <div class="regular_title title_card">
          <p class="medium fadeAnimation">${card.title}</p>
        </div>
      </div>
    </div>`;
    })
    .join("");
}
