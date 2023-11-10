import { useState } from "react";
import { useEffect } from "react";
import Star from "../Star";
import { Loader } from "../components/App";
const KEY = "5da69d9f";

export default function MovieDetails({
  selectedID,
  closeBtn,
  onWatchedMovie,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [loader, setLoader] = useState(false);
  const [userRating, setUserRating] = useState("");
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedID);
  // console.log(isWatched);

  const {
    Title: title,
    Year: year,
    Released: released,
    Actors: actors,
    Genre: genre,
    Runtime: runtime,
    Plot: plot,
    Director: director,
    Poster: poster,
    imdbRating,
    imdbID,
  } = movie;

  function handleAddBtn() {
    const newWatchedMovie = {
      title,
      imdbID,
      poster,
      year,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    onWatchedMovie(newWatchedMovie);
    closeBtn();
  }

  useEffect(
    function () {
      async function getMovieDetails() {
        setLoader(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}`
        );
        const data = await res.json();
        setLoader(false);
        // console.log(data);
        setMovie({ ...data });
      }

      getMovieDetails();
    },
    [selectedID]
  );
  return (
    <div className="details">
      {loader ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={closeBtn}>
              &larr;
            </button>
            <img src={poster} alt={`poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span> {imdbRating} IMDb Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <Star
                    maxRating={10}
                    size={24}
                    color="yellow"
                    onSet={setUserRating}
                  />
                  {userRating && (
                    <button className="btn-add" onClick={handleAddBtn}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>You already rated this movie</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
            <p>
              <span>🎯</span> Genre {genre}
            </p>
            <p>
              <span>⏱</span> Runtime {runtime}
            </p>
          </section>
        </>
      )}
    </div>
  );
}
