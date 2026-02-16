import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"

export default function Searchbar() {
  const navigate = useNavigate()
  const apiKey = import.meta.env.VITE_OMDB_API_KEY

  // input contrôlé
  const [input, setInput] = useState("")
  // valeur réellement utilisée pour la requête
  const [search, setSearch] = useState("")

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["movies", search],
    queryFn: async () => {
      const res = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(search)}&apikey=${apiKey}`
      )

      if (!res.ok) {
        throw new Error("Erreur réseau")
      }

      const data = await res.json()

      if (data.Response === "False") {
        throw new Error(data.Error)
      }

      return data.Search
    },
    enabled: !!search, // la requête ne se lance que si search n'est pas vide
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSearch(input.trim())
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Rechercher un film..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Rechercher</button>
      </form>

      {isPending && <p>Chargement...</p>}

      {isError && <p style={{ color: "red" }}>{error.message}</p>}

      <ul>
        {data?.map((movie) => (
          <li
            key={movie.imdbID}
            style={{ cursor: "pointer" }}
            onClick={() =>
              navigate({ to: `/movies/${movie.imdbID}` })
            }
          >
            {movie.Title} ({movie.Year})
          </li>
        ))}
      </ul>
    </div>
  )
}