import { useParams } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"

export default function MovieDetail() {
  const { movieId } = useParams({ from: "/movies/$movieId" })
  const apiKey = import.meta.env.VITE_OMDB_API_KEY

  const { data, isPending } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: async () => {
      const res = await fetch(
        `https://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`
      )
      return res.json()
    },
  })

  if (isPending) return <p>Chargement...</p>

  return (
    <div>
      <h1>{data.Title}</h1>
      <p>{data.Year}</p>
      <p>{data.Plot}</p>
      <img src={data.Poster} alt={data.Title} />
    </div>
  )
}