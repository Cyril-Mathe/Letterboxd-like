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
        // fetch de films d'actions
        const action1 = await fetch(`https://www.omdbapi.com/?t=mad%20max%20fury%20road&apikey=${apiKey}`)
        const action2 = await fetch(`https://www.omdbapi.com/?t=furiosa&apikey=${apiKey}`)
        const action3 = await fetch(`https://www.omdbapi.com/?t=seven%20samurai&apikey=${apiKey}`)
        const action4 = await fetch(`https://www.omdbapi.com/?t=terminator%20ii&apikey=${apiKey}`)
        const action5 = await fetch(`https://www.omdbapi.com/?t=&apikey=${apiKey}`)
        const action6 = await fetch(`https://www.omdbapi.com/?t=&apikey=${apiKey}`)
        const action7 = await fetch(`https://www.omdbapi.com/?t=&apikey=${apiKey}`)
        const action8 = await fetch(`https://www.omdbapi.com/?t=&apikey=${apiKey}`)
        const data1a = await action1.json()
        const data2a = await action2.json()
        const data3a = await action3.json()
        const data4a = await action4.json()
        const data5a = await action5.json()
        const data6a = await action6.json()
        const data7a = await action7.json()
        const data8a = await action8.json()
        // fetch de westerns
        const western1 = await fetch(`https://www.omdbapi.com/?t=no%20country%20for%20old%20men&apikey=${apiKey}`)
        const western2 = await fetch(`https://www.omdbapi.com/?t=the%20good%20the%bad%20and%20the%20ugly&apikey=${apiKey}`)
        const western3 = await fetch(`https://www.omdbapi.com/?t=for%20a%20few%20dollars%20more&apikey=${apiKey}`)
        const western4 = await fetch(`https://www.omdbapi.com/?t=django%20unchained&apikey=${apiKey}`)
        const western5 = await fetch(`https://www.omdbapi.com/?t=a%20fistful%20of%20dollars&apikey=${apiKey}`)
        const western6 = await fetch(`https://www.omdbapi.com/?t=the%20hateful%20eight&apikey=${apiKey}`)
        const western7 = await fetch(`https://www.omdbapi.com/?t=&apikey=${apiKey}`)
        const western8 = await fetch(`https://www.omdbapi.com/?t=&apikey=${apiKey}`)
        const data1w = await western1.json()
        const data2w = await western2.json()
        const data3w = await western3.json()
        const data4w = await western4.json()
        const data5w = await western5.json()
        const data6w = await western6.json()
        const data7w = await western7.json()
        const data8w = await western8.json()
        return {
          data1, data2, data3, data4, data5, data6, data7, data8, data1c, data2c, data3c, data4c, data5c, data6c, data7c, data8c, data1a, data2a, data3a, data4a, data5a, data6a, data7a, data8a, data1w, data2w, data3w, data4w, data5w, data6w, data7w, data8w
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

          {categories === "action" && (
            <div className='h-screen flex justify-center'>
              <div className='w-[700px] flex flex-wrap'>
                {data && ([data.data1a, data.data2a, data.data3a, data.data4a, data.data5a, data.data6a, data.data7a, data.data8a].filter(Boolean)).map((movie) => (
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

          {categories === "western" && (
            <div className='h-screen flex justify-center'>
              <div className='w-[700px] flex flex-wrap'>
                {data && ([data.data1w, data.data2w, data.data3w, data.data4w, data.data5w, data.data6w, data.data7w, data.data8w].filter(Boolean)).map((movie) => (
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