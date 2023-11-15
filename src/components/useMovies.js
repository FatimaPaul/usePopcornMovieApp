import { useState, useEffect } from "react";
const KEY = "5da69d9f";
// donot pass as props pass as a parameter
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

      // handleCloseBtn();
      fetchMovies();

      //cleanup function
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, error };
}
