import { useState } from "react";
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from "@tanstack/react-router";

export default function RecommendationsPage() {
    const [categories, setCategories] = useState("guerre", "mafia", "action", "western", "horreur", "science-fiction", "animation", "thriller", "comédie", "drame");
    const navigate = useNavigate()
    const apiKey = import.meta.env.VITE_OMDB_API_KEY
    const { isPending, error, data } = useQuery({
        queryKey: ['movie'],
        queryFn: async () => {
        const war1 = await fetch(`https://www.omdbapi.com/?t=come%20and%20see&apikey=${apiKey}`)
        const war2 = await fetch(`https://www.omdbapi.com/?t=apocalypse%20now&apikey=${apiKey}`)
        const war3 = await fetch(`https://www.omdbapi.com/?t=paths%20of%20glory&apikey=${apiKey}`)
        const war4 = await fetch(`https://www.omdbapi.com/?t=full%20metal%20jacket&apikey=${apiKey}`)
        const war5 = await fetch(`https://www.omdbapi.com/?t=fury&apikey=${apiKey}`)
        const war6 = await fetch(`https://www.omdbapi.com/?t=dunkirk&apikey=${apiKey}`)
        const war7 = await fetch(`https://www.omdbapi.com/?t=zone%20of%20interest&apikey=${apiKey}`)
        const war8 = await fetch(`https://www.omdbapi.com/?t=inglourious%20basterds&apikey=${apiKey}`)
        const data1 = await war1.json()
        const data2 = await war2.json()
        const data3 = await war3.json()
        const data4 = await war4.json()
        const data5 = await war5.json()
        const data6 = await war6.json()
        const data7 = await war7.json()
        const data8 = await war8.json()
        return {
          data1, data2, data3, data4, data5, data6, data7, data8
        }
      },
      staleTime: 1000 * 30,
    })

    if (isPending) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    return (
        <>
        <div className="mb-4">
          <button onClick={() => setCategories("guerre")}>Guerre</button>
          <button onClick={() => setCategories("mafia")}>Mafia</button>
          <button onClick={() => setCategories("action")}>Action</button>
          <button onClick={() => setCategories("western")}>Western</button>
          <button onClick={() => setCategories("horreur")}>Horreur</button>
          <button onClick={() => setCategories("science-fiction")}>Science-fiction</button>
          <button onClick={() => setCategories("animation")}>Animation</button>
          <button onClick={() => setCategories("thriller")}>Thriller</button>
          <button onClick={() => setCategories("comédie")}>Comédie</button>
          <button onClick={() => setCategories("drame")}>Drame</button>
        </div>

        <div>
          {categories === "guerre" && (
            <div className='h-screen flex justify-center'>
              <div className='w-[700px] flex flex-wrap'>
                {data && ([data.data1, data.data2, data.data3, data.data4, data.data5, data.data6, data.data7, data.data8].filter(Boolean)).map((movie) => (
                  <div className='w-[175px]' key={movie.imdbID}>
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
            </div>
          )}

          {categories === "mafia" && <div>zz</div>}
          {categories === "action" && <div>ae</div>}
          {categories === "western" && <div>azeaz</div>}
          {categories === "horreur" && <div>BB</div>}
          {categories === "science-fiction" && <div>CC</div>}
          {categories === "animation" && <div>DD</div>}
          {categories === "thriller" && <div>AA</div>}
          {categories === "comédie" && <div>EE</div>}
          {categories === "drame" && <div>FF</div>}
        </div>
        </>
    )
}