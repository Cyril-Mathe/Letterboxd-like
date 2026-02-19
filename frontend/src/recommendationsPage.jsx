import { useState } from "react";
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from "@tanstack/react-router";

export default function RecommendationsPage() {
    const [categories, setCategories] = useState("guerre", "crime", "action", "western", "horreur", "science-fiction", "animation", "thriller", "comédie", "drame");
    const navigate = useNavigate()
    const apiKey = import.meta.env.VITE_OMDB_API_KEY
    const { isPending, error, data } = useQuery({
        queryKey: ['movie'],
        queryFn: async () => {
        // fetch films de guerre
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
        // fetch films de mafia
        const crime1 = await fetch(`https://www.omdbapi.com/?t=goodfellas&apikey=${apiKey}`)
        const crime2 = await fetch(`https://www.omdbapi.com/?t=the%20godfather&apikey=${apiKey}`)
        const crime3 = await fetch(`https://www.omdbapi.com/?t=the%20godfather%20part%20ii&apikey=${apiKey}`)
        const crime4 = await fetch(`https://www.omdbapi.com/?t=heat&apikey=${apiKey}`)
        const crime5 = await fetch(`https://www.omdbapi.com/?t=city%20of%20god&apikey=${apiKey}`)
        const crime6 = await fetch(`https://www.omdbapi.com/?t=training%20day&apikey=${apiKey}`)
        const crime7 = await fetch(`https://www.omdbapi.com/?t=the%20departed&apikey=${apiKey}`)
        const crime8 = await fetch(`https://www.omdbapi.com/?t=dog%20day%20afternoon&apikey=${apiKey}`)
        const data1c = await crime1.json()
        const data2c = await crime2.json()
        const data3c = await crime3.json()
        const data4c = await crime4.json()
        const data5c = await crime5.json()
        const data6c = await crime6.json()
        const data7c = await crime7.json()
        const data8c = await crime8.json()
        return {
          data1, data2, data3, data4, data5, data6, data7, data8, data1c, data2c, data3c, data4c, data5c, data6c, data7c, data8c
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
          <button onClick={() => setCategories("crime")}>Crime</button>
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

          {categories === "crime" && (
            <div className='h-screen flex justify-center'>
              <div className='w-[700px] flex flex-wrap'>
                {data && ([data.data1c, data.data2c, data.data3c, data.data4c, data.data5c, data.data6c, data.data7c, data.data8c].filter(Boolean)).map((movie) => (
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