import WatchMovie from "./WatchMovie";

export default function WatchMoviesList({ watched, DeleteMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchMovie
          key={movie.imdbID}
          movie={movie}
          DeleteMovie={DeleteMovie}
        />
      ))}
    </ul>
  );
}
