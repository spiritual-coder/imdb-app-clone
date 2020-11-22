

const myApi = '338f4376f5a74bedfa6b37ea5c054802';
const baseUrl = 'https://api.themoviedb.org';
const movieUrl = "https://image.tmdb.org/t/p/w500/";

const imgURL = "https://image.tmdb.org/t/p/w500/";
const defaultImage = 'https://via.placeholder.com/150';

function getUrl(url, finish, error) {
    fetch(url)
        .then((res) => res.json())
        .then(finish)
        .catch(error);
}

function generateMovieDBUrl(path) {
    const url = `${baseUrl}/3${path}?api_key=${myApi}`;
    return url;
}


function searchMovie(value) {
    const url = generateMovieDBUrl('/search/movie') + '&query=' + value;
    getUrl(url, renderSearchMovies, handleGeneralError);
}


function getVideosByMovieId(movieId, content) {
    const url = generateMovieDBUrl(`/movie/${movieId}/videos`);
    getUrl(url, render, handleGeneralError);
}


const log = console.log;

// Selecting elements from the DOM

const searchButton = document.querySelector('#search');;
const searchInput = document.querySelector('#inputSearch');
const moviesContainer = document.querySelector('#movies-container');
const moviesSearchable = document.querySelector('#movies-searchable');

function createImageContainer(imageUrl, id) {
    const tempDiv = document.createElement('div');
    tempDiv.setAttribute('class', 'imageContainer');
    tempDiv.setAttribute('data-id', id);

    const movieElement = `
        <img src="${imageUrl}" alt="" data-movie-id="${id}">
    `;
    tempDiv.innerHTML = movieElement;

    return tempDiv;
}

function resetInput() {
    searchInput.value = '';
}

function handleGeneralError(error) {
    log('Error: ', error.message);
    alert(error.message || 'Internal Server');
}

function createSectionHeader(title) {
    const header = document.createElement('h2');
    header.innerHTML = title;

    return header;
}


function renderMovies(data) {
    const moviesBlock = generateMoviesBlock(data);
    const header = createSectionHeader(this.title);
    moviesBlock.insertBefore(header, moviesBlock.firstChild);
    moviesContainer.appendChild(moviesBlock);
}



function renderSearchMovies(data) {
    moviesSearchable.innerHTML = '';
    const moviesBlock = generateMoviesBlock(data);
    moviesSearchable.appendChild(moviesBlock);
}

function generateMoviesBlock(data) {
    const movies = data.results;
    const section = document.createElement('section');
    section.setAttribute('class', 'section');

    for (let i = 0; i < movies.length; i++) {
        const { poster_path, id } = movies[i];

        if (poster_path) {
            const imageUrl = movieUrl + poster_path;
    
            const imageContainer = createImageContainer(imageUrl, id);
            section.appendChild(imageContainer);
        }
    }

    const movieSectionAndContent = createMovieContainer(section);
    return movieSectionAndContent;
}



// Inserting section before content element

function createMovieContainer(section) {
    const movieElement = document.createElement('div');
    movieElement.setAttribute('class', 'movie');

    const template = `
        <div class="content">
            <p id="content-close"></p>
        </div>
    `;

    movieElement.innerHTML = template;
    movieElement.insertBefore(section, movieElement.firstChild);
    return movieElement;
}

searchButton.onclick = function (event) {
    event.preventDefault();
    const value = searchInput.value

   if (value) {
    searchMovie(value);
   }
    resetInput();
}

// Click on any movies
// Event Delegation
document.onclick = function (event) {
    log('Event: ', event);
    const { tagName, id } = event.target;
    if (tagName.toLowerCase() === 'img') {
        const movieId = event.target.dataset.movieId;
        const section = event.target.parentElement.parentElement;
        const content = section.nextElementSibling;
        content.classList.add('content-display');
        getVideosByMovieId(movieId, content);
    }

}

/* Carousel Functionality */

let slidePosition = 0;
const slides = document.getElementsByClassName('carousel__item');
const totalSlides = slides.length;

document.
  getElementById('carousel__button--next')
  .addEventListener("click", function() {
    moveToNextSlide();
  });
document.
  getElementById('carousel__button--prev')
  .addEventListener("click", function() {
    moveToPrevSlide();
  });

function updateSlidePosition() {
  for (let slide of slides) {
    slide.classList.remove('carousel__item--visible');
    slide.classList.add('carousel__item--hidden');
  }

  slides[slidePosition].classList.add('carousel__item--visible');
}

function moveToNextSlide() {
  if (slidePosition === totalSlides - 1) {
    slidePosition = 0;
  } else {
    slidePosition++;
  }

  updateSlidePosition();
}

function moveToPrevSlide() {
  if (slidePosition === 0) {
    slidePosition = totalSlides - 1;
  } else {
    slidePosition--;
  }

  updateSlidePosition();
}


function topPicks() {
  fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=338f4376f5a74bedfa6b37ea5c054802`)
  .then(res =>  { 
    if(!res.ok) {
      throw Error("Error");
    }
    return res.json()
  })
  .then(data => {
    console.log(data);
    //because we wanna map over movie in fetch
    const html = data.results.map(movie =>  {
       return `
 
          <div class="poster-card">
            <div class="image" style="background: url(${imgURL + movie.poster_path}); background-position: center;
  background-size: cover;" id="popup" onclick="togglePopup(${movie.id})">   
            </div>

            <div class="ratings">
              <div>
                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" class="ipc-icon ipc-icon--star-inline" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path d="M12 20.1l5.82 3.682c1.066.675 2.37-.322 2.09-1.584l-1.543-6.926 5.146-4.667c.94-.85.435-2.465-.799-2.567l-6.773-.602L13.29.89a1.38 1.38 0 0 0-2.581 0l-2.65 6.53-6.774.602C.052 8.126-.453 9.74.486 10.59l5.147 4.666-1.542 6.926c-.28 1.262 1.023 2.26 2.09 1.585L12 20.099z"></path></svg>
              </div>

              <div>
                <span>${movie.vote_average}</span>
              </div>
              
            </div>

            <div class="movie-title" id="popup" onclick="togglePopup(${movie.id})">
              <a href="#">${movie.title}</a>
            </div>

            <div class="watchlist">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="ipc-icon ipc-icon--add ipc-button__icon ipc-button__icon--pre" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z"></path></svg>
              </div>

              <div>
                <span>Watchlist</span>
              </div>
              
            </div>

            <div class="trailer-and-info">

              <div class="trailer">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="ipc-icon ipc-icon--play-arrow ipc-button__icon ipc-button__icon--pre" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 0 0 0-1.69L9.54 5.98A.998.998 0 0 0 8 6.82z"></path></svg>
                </div>

                <div>
                  <span>Trailer</span>
                </div>
                
              </div>

              <div class="info">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="ipc-icon ipc-icon--info" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></svg>
              </div>
            </div>
          </div>
`;
    }).join('')
    ;
    console.log(html);
    document
    .querySelector("#top-picks-container").insertAdjacentHTML("afterbegin",html);
  })
  .catch(err => {
    console.log(err);
  })
}
topPicks();


function inTheaters() {
  fetch(`https://api.themoviedb.org/3/movie/popular?api_key=9a6434ee9cfe93901b99601cc5900981`)
  .then(res =>  { 
    if(!res.ok) {
      throw Error("Error");
    }
    return res.json()
  })
  .then(data => {
    console.log(data);
    //because we wanna map over movie in fetch
    const html = data.results.map(movie =>  {
       return `
 
          <div class="poster-card">
            <div class="image" style="background: url(${imgURL + movie.poster_path}); background-position: center;
  background-size: cover;" id="popup" onclick="togglePopup(${movie.id})">   
            </div>

            <div class="ratings">
              <div>
                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" class="ipc-icon ipc-icon--star-inline" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path d="M12 20.1l5.82 3.682c1.066.675 2.37-.322 2.09-1.584l-1.543-6.926 5.146-4.667c.94-.85.435-2.465-.799-2.567l-6.773-.602L13.29.89a1.38 1.38 0 0 0-2.581 0l-2.65 6.53-6.774.602C.052 8.126-.453 9.74.486 10.59l5.147 4.666-1.542 6.926c-.28 1.262 1.023 2.26 2.09 1.585L12 20.099z"></path></svg>
              </div>

              <div>
                <span>${movie.vote_average}</span>
              </div>
              
            </div>

            <div class="movie-title" id="popup" onclick="togglePopup(${movie.id})">
              <a href="#">${movie.title}</a>
            </div>

            <div class="watchlist">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="ipc-icon ipc-icon--add ipc-button__icon ipc-button__icon--pre" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z"></path></svg>
              </div>

              <div>
                <span>Watchlist</span>
              </div>
              
            </div>

            <div class="trailer-and-info">

              <div class="trailer">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="ipc-icon ipc-icon--play-arrow ipc-button__icon ipc-button__icon--pre" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 0 0 0-1.69L9.54 5.98A.998.998 0 0 0 8 6.82z"></path></svg>
                </div>

                <div>
                  <span>Trailer</span>
                </div>
                
              </div>

              <div class="info">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="ipc-icon ipc-icon--info" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></svg>
              </div>
            </div>
          </div>
`;
    }).join('')
    ;
    console.log(html);
    document
    .querySelector("#in-theaters-container").insertAdjacentHTML("afterbegin",html);
  })
  .catch(err => {
    console.log(err);
  })
}
inTheaters();


function togglePopup(id) {
  console.log(id);
    var url = `https://api.themoviedb.org/3/movie/${id}?api_key=9a6434ee9cfe93901b99601cc5900981`;
  const imgURL = "https://image.tmdb.org/t/p/w500";
  fetch(url)
  .then(res =>  { 
    if(!res.ok) {
      throw Error("Error");
    }
    return res.json()
  })
  .then(data => {
    console.log(data);
    //because we wanna map over movie in fetch

    document.getElementById("popup").innerHTML=  `
                  <div class="popup" id="popup-box">
                    <div class="content">
                      <div class="img-bx" style="background: url(${imgURL + data.poster_path}); background-position: center;
  background-size: cover;"></div>
              <div class="movie-overview">
              <h1>${data.title}</h1>
              <p>${data.overview}</p>
            </div>
                    </div>
                    <a href="#")>Close</a>
                  </div>
                  `; 
                    document.getElementById("popup-box").classList.toggle("active");

          function close () {
            document.getElementById("popup-box").style.display = "none";
          }

  })
  .catch(err => {
    console.log(err);
  })

}
