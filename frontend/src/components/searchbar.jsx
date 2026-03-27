import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"

export default function Searchbar() {
  const navigate = useNavigate()
  const apiKey = import.meta.env.VITE_OMDB_API_KEY

  // input contrôlé
  const [input, setInput] = useState("")
  // valeur réellement utilisée pour la requête
  const [search, setSearch] = useState("")

  // Recherche exacte d'abord, puis large si pas de résultat exact
  const { data, isPending, isError, error, dataUpdated } = useQuery({
    queryKey: ["movies", search],
    queryFn: async () => {
      if (!search) return []

      // D'abord, essayer une recherche exacte avec ?t=
      const exactRes = await fetch(
        `https://www.omdbapi.com/?t=${encodeURIComponent(search)}&apikey=${apiKey}`
      )

      if (!exactRes.ok) {
        throw new Error("Erreur réseau")
      }

      const exactData = await exactRes.json()

      // Si on a une correspondance exacte (titre identique, insensible à la casse)
      if (exactData.Response === "True" && 
          exactData.Title.toLowerCase() === search.toLowerCase()) {
        return [exactData]
      }

      // Sinon, recherche large avec ?s=
      const searchRes = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(search)}&apikey=${apiKey}`
      )

      if (!searchRes.ok) {
        throw new Error("Erreur réseau")
      }

      const searchData = await searchRes.json()

      if (searchData.Response === "False") {
        throw new Error(searchData.Error)
      }

      // Trier pour mettre le film exact en premier s'il existe dans les résultats
      const results = searchData.Search || []
      const exactMatchIndex = results.findIndex(
        (m) => m.Title.toLowerCase() === search.toLowerCase()
      )
      
      if (exactMatchIndex > 0) {
        const exactMatch = results.splice(exactMatchIndex, 1)[0]
        results.unshift(exactMatch)
      }

      return results
    },
    enabled: !!search, // la requête ne se lance que si search n'est pas vide
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSearch(input.trim())
  }

  // Effacer les résultats quand l'input est vide
  useEffect(() => {
    if (!input.trim()) {
      setSearch("")
    }
  }, [input])

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
