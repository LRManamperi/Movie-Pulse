import React, { useState, useEffect } from 'react';
import './App.css';

const API_KEY = '1cf50e6248dc270629e802686245c2c8';
const BASE_URL = 'https://api.themoviedb.org/3';
const DRAMA_GENRE_ID = 18; // Genre ID for Drama
const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&with_genres=${DRAMA_GENRE_ID}`;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = `${BASE_URL}/search/movie?api_key=${API_KEY}`;

const genres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' }
];

function App() {
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const [overlayContent, setOverlayContent] = useState(null);
  const [overlayOpen, setOverlayOpen] = useState();

  useEffect(() => {
    getMovies(API_URL);
  }, []);

  const getMovies = (url) => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.results.length !== 0) {
          setMovies(data.results);
          setCurrentPage(data.page);
          setTotalPages(data.total_pages);
        } else {
          setMovies([]);
        }
      });
  };

  const handleGenreClick = (id) => {
    const selected = [...selectedGenre];// Copy the selected genres
    const index = selected.indexOf(id);
    if (index > -1) {
      selected.splice(index, 1);
    } else {
      selected.push(id);
    }// Add or remove the genre
    setSelectedGenre(selected);
    getMovies(`${API_URL}&with_genres=${selected.join(',')}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
      getMovies(`${searchURL}&query=${searchTerm}`);
    } else {
      getMovies(API_URL);
    }
  };

  const handlePageChange = (page) => {
    getMovies(`${API_URL}&page=${page}`);
  };

  const openNav = (movie) => {
    fetch(`${BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(videoData => {
        if (videoData.results.length > 0) {
          const embed = videoData.results
            .filter(video => video.site === 'YouTube')
            .map(video => (
              <iframe
                key={video.key}
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${video.key}`}
                title={video.name}
                className={`embed ${activeSlide === videoData.results.indexOf(video) ? 'show' : 'hide'}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ));

          const dots = videoData.results.map((video, idx) => (
            <span
              key={idx}
              className={`dot ${activeSlide === idx ? 'active' : ''}`}
              onClick={() => setActiveSlide(idx)}
            >
              {idx + 1}
            </span>
          ));

          setOverlayContent(
            <div>
              <h1 className="no-results">{movie.original_title}</h1>
              <br />
              {embed}
              <br />
              <div className="dots">{dots}</div>
            </div>
          );
          setOverlayOpen(true);
        } else {
          setOverlayContent(<h1 className="no-results">No Results Found</h1>);
        }
      });
  };

  return (
    <div>
      <name>
        <h1>MoviePulse</h1>
      </name>
      <header>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="search"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </header>

      <div id="tags">
        {genres.map((genre) => (
          <div
            key={genre.id}
            className={`tag ${selectedGenre.includes(genre.id) ? 'highlight' : ''}`}
            onClick={() => handleGenreClick(genre.id)}
          >
            {genre.name}
          </div>
        ))}
        {selectedGenre.length > 0 && (
          <div className="tag highlight" onClick={() => setSelectedGenre([])}>
            Clear x
          </div>
        )}
      </div>

      <main>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className="movie">
              <img src={movie.poster_path ? `${IMG_URL}${movie.poster_path}` : 'http://via.placeholder.com/1080x1580'} alt={movie.title} />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <span className={getColor(movie.vote_average)}>{movie.vote_average}</span>
              </div>
              <div className="overview">
                <h3>Overview</h3>
                {movie.overview}
                <br />
                <button className="know-more" onClick={() => openNav(movie)}>Know More</button>
              </div>
            </div>
          ))
        ) : (
          <h1 className="no-results">No Results Found</h1>
        )}
      </main>

      <div className="pagination">
        <div className={`page ${currentPage <= 1 ? 'disabled' : ''}`} onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}>Prev</div>
        <div className="current">{currentPage}</div>
        <div className={`page ${currentPage >= totalPages ? 'disabled' : ''}`} onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}>Next</div>
      </div>

      {overlayOpen && (
        <div id="myNav" className="overlay">
          <a href="javascript:void(0)" className="closebtn" onClick={() => setOverlayOpen(false)}>&times;</a>
          <div className="overlay-content">
            {overlayContent}
          </div>
        </div>
      )}
    </div>
  );
}

function getColor(vote) {
  if (vote >= 8) {
    return 'green';
  } else if (vote >= 5) {
    return 'orange';
  } else {
    return 'red';
  }
}

export default App;
