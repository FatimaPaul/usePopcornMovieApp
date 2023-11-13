import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Main from "./Main";
import Box from "./Box";
import ListMovies from "./ListMovies";
import WatchedSummary from "./WatchedSummary";
import WatchMoviesList from "./WatchMoviesList";
import MovieDetails from "./MovieDetails";

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
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const data = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
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
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
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

      //cleanup function
      return function () {
        controller.abort();
      };
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
