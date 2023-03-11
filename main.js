let jsonData = [];

function onJsonLoaded() {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      jsonData = data;

      displayTrending();
      displayRecommendation();
      fadeInTrendingCards();
    });
}

onJsonLoaded();

function displayTrending() {
  let card = document.querySelector(".row_1");

  card.innerHTML = jsonData
    .filter((card) => card.isTrending === true)
    .map((card) => {
      return ` 
      <div class="fadeTrendingCard">
       <div class="trending_card fadeInTrendingCard card">
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
        <svg width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="m10.518.75.399 12.214-5.084-4.24-4.535 4.426L.75 1.036l9.768-.285Z" stroke-width="1.5" fill="none"/></svg>
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

function displayRecommendation() {
  let card = document.querySelector(".row_3");

  card.innerHTML = jsonData
    .filter((card) => card.isTrending === false)
    .map((card) => {
      return ` <div class="recommendation_card card col">
      
      <div class="recommendation_img play_hover fadeOpacity">
        <img
          class="bg_recommendation_img opacity_hover"
          src="${card.thumbnail.regular.large}"
          alt=""
        />
        <div class="play_card row">
        <img src="./assets/icon-play.svg" alt="" />
        <p class="medium">Play</p>
      </div>
        <div class="bookmark bookmark_recommendation bookmark_hover">
          <svg
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
        </div>
      </div>
      <div class="col col_6">
        <div class="row row_5">
          <p class="recommendation_year font_13 year light fadeAnimation">2019</p>
          <div class="row light recommendation_category category fadeAnimation">
            <img src="./assets/icon-category-${
              card.category === "Movie" ? "movie" : "tv"
            }.svg" alt="" />
            <p class="font_13">${card.category}</p>
          </div>
          <p class="recommendation_rating rating light font_13 fadeAnimation">${
            card.rating
          }</p>
        </div>
        <div class="recommendation_title title_card">
          <p class="medium fadeAnimation">${card.title}</p>
        </div>
      </div>
    </div>`;
    })
    .join("");
}

function fadeInTrendingCards() {
  let fadeInTrendingCard = document.querySelectorAll(".fadeInTrendingCard");
  let fadeInTrendingText = document.querySelectorAll(".fadeInTrendingText");
  let delay = 0;

  fadeInTrendingCard.forEach((card, i) => {
    setTimeout(() => {
      card.classList.add("fadeInTrendingCard_active");
    }, delay);
    delay += 200;
  });

  fadeInTrendingText.forEach((text, i) => {
    setTimeout(() => {
      text.classList.add("fadeInTrendingText_active");
    }, delay);
  });
}
