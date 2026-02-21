import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useNavigate } from "@tanstack/react-router";
export default function MoviesPage() {
  return <MoviesList />
}

export function MoviesList() {
  const navigate = useNavigate()
  const apiKey = import.meta.env.VITE_OMDB_API_KEY
  const queryClient = useQueryClient()
  const { isPending, error, data } = useQuery({
    queryKey: ['movie'],    
    queryFn: async () => {
      const res1 = await fetch(`https://www.omdbapi.com/?t=mulholland&apikey=${apiKey}`)
      const res2 = await fetch(`https://www.omdbapi.com/?t=batman&apikey=${apiKey}`)
      const res3 = await fetch(`https://www.omdbapi.com/?t=batman&apikey=${apiKey}`)
      const res4 = await fetch(`https://www.omdbapi.com/?t=batman&apikey=${apiKey}`)
      const res5 = await fetch(`https://www.omdbapi.com/?t=batman&apikey=${apiKey}`)





      const data1 = await res1.json()
      const data2 = await res2.json()
      const data3 = await res3.json()
      const data4 = await res4.json()
      const data5 = await res5.json()
      return [data1,data2,data3,data4,data5]},
      staleTime: 1000 * 30,
})

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <div className='h-screen bg-lime-50'>
      <p>Liste de films :</p>
      <div className='flex flex-wrap'>
        {data.map((movie) => (
          <div className='w-[200px]' key={movie.imdbID}>
            {movie.Poster && movie.Poster !== 'N/A' && (
              <div
                onClick={() => navigate({ to: `/movies/${movie.imdbID}` })}
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src={movie.Poster} 
                  alt={movie.Title} 
                  width={150}
                  style={{ display: 'block' }}
                />
              </div>
            )}
            <p>{movie.Title}</p>
            {movie.imdbRating && <p>Note IMDb : {movie.imdbRating}/10</p>}
          </div>
        ))}
      </div>
      <button onClick={() => {queryClient.invalidateQueries({ queryKey: ['movie'] })}}>refresh</button>
    </div>
  )
}