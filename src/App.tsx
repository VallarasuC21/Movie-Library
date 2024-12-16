import React, { useState } from 'react';
import axios from 'axios';
import './MovieLibrary.css';

interface Movie {
  id: string;
  title: string;
  poster: string;
  rating: number;
}

const MovieLibrary: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMovies = async () => {
    try {
      const response = await axios.get(
        `http://www.omdbapi.com/?s=${searchQuery}&apikey=67c9e655`
      );
      const fetchedMovies = response.data.Search.map((movie: any) => ({
        id: movie.imdbID,
        title: movie.Title,
        poster: movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150',
        rating: 0,
      }));
      setMovies(fetchedMovies);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const addToWatchlist = (movie: Movie) => {
    if (!watchlist.some((m) => m.id === movie.id)) {
      setWatchlist([...watchlist, movie]);
    }
  };

  const updateRating = (id: string, rating: number) => {
    setWatchlist((prevWatchlist) =>
      prevWatchlist.map((movie) =>
        movie.id === id ? { ...movie, rating } : movie
      )
    );
  };

  const removeFromWatchlist = (id: string) => {
    setWatchlist((prevWatchlist) =>
      prevWatchlist.filter((movie) => movie.id !== id)
    );
  };

  return (
    <div className="movie-library">
      <h1>Movie Library</h1>
      <div className="search-section">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for movies..."
        />
        <button onClick={fetchMovies}>Search</button>
      </div>

      <div className="movies-list">
        <h2>Search Results</h2>
        {movies.map((movie) => (
          <div key={movie.id} className="movie-item">
            <img src={movie.poster} alt={movie.title} className="movie-poster" />
            <span>{movie.title}</span>
            <button onClick={() => addToWatchlist(movie)}>Add to Watchlist</button>
          </div>
        ))}
      </div>

      <div className="watchlist">
        <h2>Watchlist</h2>
        {watchlist.map((movie) => (
          <div key={movie.id} className="movie-item">
            <img src={movie.poster} alt={movie.title} className="movie-poster" />
            <span>{movie.title}</span>
            <input
              type="number"
              value={movie.rating}
              min="0"
              max="10"
              onChange={(e) => updateRating(movie.id, parseFloat(e.target.value))}
            />
            <button onClick={() => removeFromWatchlist(movie.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieLibrary;