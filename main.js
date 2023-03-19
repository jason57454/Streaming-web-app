window.addEventListener("load", () => {
  var tab = document.querySelectorAll(".tab");
  var loader = document.querySelector(".loader");

  function showScreen() {
    const path = window.location.hash || "#/";
    loader.style.opacity = "1";
    for (let i = 0; i < tab.length; i++) {
      tab[i].style.display = "none";
      if (tab[i].dataset.path === path) {
        console.log(tab);
        tab[i].style.display = "flex";
        loader.style.opacity = "0";
      }
    }
  }

  window.addEventListener("hashchange", () => {
    showScreen();
  });

  showScreen();
});

let jsonData = [];
if (typeof bookmarkState === "undefined") {
  bookmarkState = {};
}
if (localStorage.getItem("bookmarkState")) {
  bookmarkState = JSON.parse(localStorage.getItem("bookmarkState"));
} else {
  jsonData.forEach((data) => {
    bookmarkState[data.id] = false;
  });
}

function onJsonLoaded() {
  return fetch("data.json").then((response) => response.json());
}

// Handling tabs
const routes = {
  "#/home": displayHome,
  "#/movie": displayMoviesTab,
  "#/series": displaySeriesTab,
  "#/bookmarks": displayBookmarks,
};

function displayHome() {
  displayTrendingCards();
  displayRecommendationCards();
  displaySearch(
    "input_home",
    ".result_home",
    ".result_home_message",
    ".row_13",
    ".on_search_home",
    jsonData
  );
}

function displayMoviesTab() {
  displayMoviesCards();
}

function displaySeriesTab() {
  displaySeriesCards();
}

function displayBookmarks() {
  displayBookmarksCards();
  displaySearch(
    "input_bookmarks",
    ".result_bookmarks",
    ".result_bookmarks_message",
    ".row_16",
    ".on_search_bookmarks",
    jsonData
  );
}

// Handling route
function route() {
  const path = window.location.hash || "#/";
  const handler = routes[path];
  const tabs = document.querySelectorAll(".tab");
  const navLinks = document.querySelectorAll(".link");

  // changing nav link colors depending on the active tab
  navLinks.forEach((link) => {
    link.classList.remove("active_tab");
    if (link.hash === path) {
      link.classList.add("active_tab");
    }
  });

  // changing tab depending on nav link click
  tabs.forEach((tab) => {
    if (tab.id === path.replace("#/", "")) {
      tab.classList.remove("hidden");
      const activeNavLink = document.querySelector(`.link[href='${path}']`);
      if (activeNavLink && !activeNavLink.classList.contains("active_tab")) {
        navLinks.forEach((link) => {
          link.classList.remove("active_tab");
        });
        activeNavLink.classList.add("active_tab");
      }
    } else {
      tab.classList.add("hidden");
    }
  });

  if (handler) {
    // loading content after json is fully loaded
    onJsonLoaded().then((data) => {
      jsonData = data;
      bookmarkState = JSON.parse(localStorage.getItem("bookmarkState")) || {};
      data.forEach((item) => {
        bookmarkState[item.id] = bookmarkState[item.id] || false;
      });
      handler();

      const storedBookmarkState = JSON.parse(
        localStorage.getItem("bookmarkState")
      );
      if (storedBookmarkState) {
        Object.keys(bookmarkState).forEach((key) => {
          if (storedBookmarkState.hasOwnProperty(key)) {
            bookmarkState[key] = storedBookmarkState[key];
          }
        });
      }
      // creating copy to save the bookmark_active state
      const bookmark = document.querySelectorAll(".bookmark");

      // calling addBookmarks function
      bookmark.forEach((bookmark) => {
        const cardId = parseInt(bookmark.closest(".card").dataset.cardId);
        const isBookmarked = bookmarkState[cardId] || false;

        bookmark
          .querySelector(".bookmark_icon_1")
          .classList.toggle("bookmark_active", !isBookmarked);
        bookmark
          .querySelector(".bookmark_icon_2")
          .classList.toggle("bookmark_active", isBookmarked);
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
  const card = event.currentTarget.closest(".card");
  const cardId = parseInt(card.dataset.cardId);
  const signet = event.target
    .closest(".bookmark")
    .querySelector(".bookmark_icon_2");

  const index = jsonData.findIndex((data) => data.id === cardId);
  if (index !== -1) {
    const cardData = jsonData[index];
    const isBookmarked = !bookmarkState[cardId]; // inverse l'état actuel de signet
    console.log(isBookmarked);
    signet.classList.toggle("bookmark_active", isBookmarked);
    cardData.isBookmarked = isBookmarked;
    bookmarkState[cardId] = isBookmarked; // stocke l'état de signet dans bookmarkState
    localStorage.setItem("bookmarkState", JSON.stringify(bookmarkState));

    displayBookmarksCards(); // appel de la fonction pour mettre à jour les signets affichés
  }
}

function displaySearch(
  inputId,
  resultClass,
  resultMessageClass,
  displayResultClass,
  onSearchClass,
  jsonData
) {
  let input = document.getElementById(inputId);
  let onSearch = document.querySelector(onSearchClass);
  let result = document.querySelector(resultClass);
  let resultMessage = document.querySelector(resultMessageClass);
  let displayResult = document.querySelector(displayResultClass);
  value = input.value.trim();

  input.addEventListener("keydown", function (event) {
    if (event.key) {
      onSearch.style.display = "none";
      result.style.display = "flex";
      value = input.value.trim();
      resultMessage.innerHTML = "";
      const filteredData = jsonData.filter((item) =>
        item.title.toLowerCase().includes(value.toLowerCase())
      );

      if (
        value === null ||
        value === undefined ||
        value === "" ||
        filteredData.length === 0
      ) {
        resultMessage.innerHTML = `No result found for "${value}". 
        You can try again or you can reload the page<a href="#" onclick="location.reload()">here.</a>`;
        displayResult.style.display = "none";
      } else if (filteredData.length <= 1) {
        resultMessage.innerHTML = `Found ${filteredData.length} result for 
        '${value}'.`;
      } else {
        resultMessage.innerHTML = `Found ${filteredData.length} results for '${value}'.`;
      }

      if (filteredData.length > 0) {
        console.log(displayResult);
        displayResult.style.display = "flex";
        displayResult.innerHTML = filteredData
          .map((card) => {
            return ` 
            <div class="regular_card card col" data-card-id="${card.id}">
      
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
    }
  });
}

function displayTrendingCards() {
  let card = document.querySelector(".row_1");

  let mobileCards = window.matchMedia("(max-width: 520px)");

  if (mobileCards.matches) {
    card.innerHTML = jsonData
      .filter((card) => card.isTrending === true)
      .map((card) => {
        return ` 
      <div class="fadeTrendingCard">
       <div class="trending_card fadeInTrendingCard splide__slide card" data-card-id="${
         card.id
       }">
        <div class="bg_img_card  play_hover">
          <img
            class="opacity_hover"
            src="${card.thumbnail.trending.small}"
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
  } else {
    card.innerHTML = jsonData
      .filter((card) => card.isTrending === true)
      .map((card) => {
        return ` 
      <div class="fadeTrendingCard">
       <div class="trending_card fadeInTrendingCard splide__slide card" data-card-id="${
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
  displaySearch(
    "input_movies",
    ".result_movie",
    ".result_movie_message",
    ".row_14",
    ".on_search_movie",
    jsonData
  );

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
  displaySearch(
    "input_series",
    ".result_series",
    ".result_series_message",
    ".row_15",
    ".on_search_series",
    jsonData
  );

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
  const bookmarkedCards = jsonData.filter(
    (card) => cardIds.indexOf(card.id.toString()) !== -1
  );
  console.log(bookmarkedCards);

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
  if (!bookmarkedMovies || bookmarkedMovies.innerHTML === "") {
    bookmarkedMovies.innerHTML = `<div class="add_bookmarks light col">
          <p>No bookmarks added yet</p>
          <a href="#/movie" class="medium link">Add movies</a>
        </div>`;
  }

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
  if (!bookmarkedSeries || bookmarkedSeries.innerHTML === "") {
    bookmarkedSeries.innerHTML = `<div class="add_bookmarks light col">
        <p>No bookmarks added yet</p>
        <a href="#/series" class="medium link">Add series</a>
      </div>`;
  }
}
