import React from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {

  const [movies, setMovies] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  /*const fetchMovieHandler = () => {
    fetch('https://swapi.dev/api/films')//.catch(error)
      .then(response => {
        return response.json()
      })
      .then(data => {
        const transformedMovies = data.results.map(movieData => {
          return {
            id: movieData.episode_id,
            title: movieData.title,
            openingText: movieData.opening_crawl,
            releaseDate: movieData.release_date
          }
        })
        setMovies(transformedMovies)
      })
  }*/

  const fetchMovieHandler = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      //const response = await fetch('https://swapi.dev/api/films')

      //firebase needs a (name).json added at the end of the link
      const response = await fetch('https://react-http-request-fe1b6-default-rtdb.firebaseio.com/movies.json')

      if (!response.ok) {
        throw new Error('Something went wrong!')
      }

      const data = await response.json()

      /* STAR WARS API
      const transformedMovies = data.results.map(movieData => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date
        }
      })
      
      setMovies(transformedMovies)
      */

      const loadMovies = []

      for (const key in data) {
        loadMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate
        })
      }
      setMovies(loadMovies)
    }
    catch (error) {
      setError(error.message)
    }

    setIsLoading(false)
  }, [])

  React.useEffect(() => {
    fetchMovieHandler()
  }, [fetchMovieHandler])

  async function addMovieHandler(movie) {
    const response = await fetch('https://react-http-request-fe1b6-default-rtdb.firebaseio.com/movies.json', {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

  }

  let content = <p>No movies found.</p>

  if (isLoading) {
    content = <p>Loading...</p>
  }

  if (!isLoading && error) {
    content = <p>{error}</p>
  }

  if (!isLoading && movies.length > 0) {
    content = <MoviesList movies={movies} />
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;
