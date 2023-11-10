import Movie from "./Movie";

export default function ListMovies({ movies, onMovieSelect }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} onMovieSelect={onMovieSelect} />
      ))}
    </ul>
  );
}
