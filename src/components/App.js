import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Main from "./Main";
import Box from "./Box";
import ListMovies from "./ListMovies";
import WatchedSummary from "./WatchedSummary";
import WatchMoviesList from "./WatchMoviesList";
import MovieDetails from "./MovieDetails";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "5da69d9f";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedID, setSelectedID] = useState(null);
  // const query = "sdfsdfsdf";

  function handleSelectedMovie(id) {
    setSelectedID((selectedID) => (id === selectedID ? null : id));
  }

  function handleCloseBtn() {
    setSelectedID(null);
  }

  function handleWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const data = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          );

          if (!data.ok) {
            throw new Error("internet down");
          }

          const result = await data.json();

          if (result.Response === "False") {
            throw new Error("Movie not Found");
          }

          setMovies(result.Search);
          setIsLoading(false);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("Please search by a word..");
        return;
      }

      fetchMovies();
    },
    [query]
  );

  return (
    <>
      <Navbar query={query} setQuery={setQuery}>
        <p className="num-results">
          Found <strong>{movies.length}</strong> results
        </p>
      </Navbar>

      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : } */}
          {isLoading && <Loader />}
          {!isLoading && error && <ErrMsg msg={error} />}
          {!isLoading && !error && (
            <ListMovies movies={movies} onMovieSelect={handleSelectedMovie} />
          )}
        </Box>

        <Box>
          {selectedID ? (
            <MovieDetails
              selectedID={selectedID}
              closeBtn={handleCloseBtn}
              onWatchedMovie={handleWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} average={average} />
              <WatchMoviesList watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

export function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrMsg({ msg }) {
  return (
    <p className="error">
      <span>⛔</span> {msg}
    </p>
  );
}
