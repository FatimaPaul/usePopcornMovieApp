import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Main from "./Main";
import Box from "./Box";
import ListMovies from "./ListMovies";
import WatchedSummary from "./WatchedSummary";
import WatchMoviesList from "./WatchMoviesList";
import MovieDetails from "./MovieDetails";
import { useMovies } from "./useMovies";
import { useLocalStorage } from "./useLocalStorage";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedID, setSelectedID] = useState(null);

  // initializing function in state
  const [watched, setWatched] = useLocalStorage("watched");

  // CUSTOM HOOK
  const { movies, isLoading, error } = useMovies(query);

  function handleSelectedMovie(id) {
    setSelectedID((selectedID) => (id === selectedID ? null : id));
  }

  function handleCloseBtn() {
    setSelectedID(null);
  }

  function handleWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }

  function handleDeleteMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <Navbar query={query} setQuery={setQuery} onClose={handleCloseBtn}>
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
              <WatchMoviesList
                watched={watched}
                DeleteMovie={handleDeleteMovie}
              />
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
