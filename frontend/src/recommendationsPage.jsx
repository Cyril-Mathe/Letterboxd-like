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
        const crime7 = await fetch(`https://www.omdbapi.com/?t=the%20irishman&apikey=${apiKey}`)
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
        const action5 = await fetch(`https://www.omdbapi.com/?t=pacific%20rim&apikey=${apiKey}`)
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
        const western2 = await fetch(`https://www.omdbapi.com/?t=the%20good%20the%20bad%20and%20the%20ugly&apikey=${apiKey}`)
        const western3 = await fetch(`https://www.omdbapi.com/?t=once%20upon%20a%20time%20in%20the%20west&apikey=${apiKey}`)
        const western4 = await fetch(`https://www.omdbapi.com/?t=for%20a%20few%20dollars%20more&apikey=${apiKey}`)
        const western5 = await fetch(`https://www.omdbapi.com/?t=django%20unchained&apikey=${apiKey}`)
        const western6 = await fetch(`https://www.omdbapi.com/?t=a%20fistful%20of%20dollars&apikey=${apiKey}`)
        const western7 = await fetch(`https://www.omdbapi.com/?t=the%20hateful%20eight&apikey=${apiKey}`)
        const western8 = await fetch(`https://www.omdbapi.com/?t=&apikey=${apiKey}`)
        const data1w = await western1.json()
        const data2w = await western2.json()
        const data3w = await western3.json()
        const data4w = await western4.json()
        const data5w = await western5.json()
        const data6w = await western6.json()
        const data7w = await western7.json()
        const data8w = await western8.json()
        // fetch de films d'horreur
        const horreur1 = await fetch(`https://www.omdbapi.com/?t=the%20thing&apikey=${apiKey}`)
        const horreur2 = await fetch(`https://www.omdbapi.com/?t=psycho&apikey=${apiKey}`)
        const horreur3 = await fetch(`https://www.omdbapi.com/?t=the%20shining&apikey=${apiKey}`)
        const horreur4 = await fetch(`https://www.omdbapi.com/?t=alien&apikey=${apiKey}`)
        const horreur5 = await fetch(`https://www.omdbapi.com/?t=the%20substance&apikey=${apiKey}`)
        const horreur6 = await fetch(`https://www.omdbapi.com/?t=the%20others&apikey=${apiKey}`)
        const horreur7 = await fetch(`https://www.omdbapi.com/?t=requiem%20for%20a%20dream&apikey=${apiKey}`)
        const horreur8 = await fetch(`https://www.omdbapi.com/?t=sinners&apikey=${apiKey}`)
        const data1h = await horreur1.json()
        const data2h = await horreur2.json()
        const data3h = await horreur3.json()
        const data4h = await horreur4.json()
        const data5h = await horreur5.json()
        const data6h = await horreur6.json()
        const data7h = await horreur7.json()
        const data8h = await horreur8.json()
        // fetch de films de science-fiction
        const sf1 = await fetch(`https://www.omdbapi.com/?t=2001%20a%20space%20odyssey&apikey=${apiKey}`)
        const sf2 = await fetch(`https://www.omdbapi.com/?t=stalker&apikey=${apiKey}`)
        const sf3 = await fetch(`https://www.omdbapi.com/?t=akira&apikey=${apiKey}`)
        const sf4 = await fetch(`https://www.omdbapi.com/?t=blade%20runner%202049&apikey=${apiKey}`)
        const sf5 = await fetch(`https://www.omdbapi.com/?t=aliens&apikey=${apiKey}`)
        const sf6 = await fetch(`https://www.omdbapi.com/?t=12%20monkeys&apikey=${apiKey}`)
        const sf7 = await fetch(`https://www.omdbapi.com/?t=arrival&apikey=${apiKey}`)
        const sf8 = await fetch(`https://www.omdbapi.com/?t=a%20clockwork%20orange&apikey=${apiKey}`)
        const data1sf = await sf1.json()
        const data2sf = await sf2.json()
        const data3sf = await sf3.json()
        const data4sf = await sf4.json()
        const data5sf = await sf5.json()
        const data6sf = await sf6.json()
        const data7sf = await sf7.json()
        const data8sf = await sf8.json()
        // fetch de films d'animations
        const animation1 = await fetch(`https://www.omdbapi.com/?t=Fantastic%20Mr.%20Fox&apikey=${apiKey}`)
        const animation2 = await fetch(`https://www.omdbapi.com/?t=perfect%20blue&apikey=${apiKey}`)
        const animation3 = await fetch(`https://www.omdbapi.com/?t=the%20boy%20and%20the%20heron&apikey=${apiKey}`)
        const animation4 = await fetch(`https://www.omdbapi.com/?t=princess%20mononoke&apikey=${apiKey}`)
        const animation5 = await fetch(`https://www.omdbapi.com/?t=spirited%20away&apikey=${apiKey}`)
        const animation6 = await fetch(`https://www.omdbapi.com/?t=spider%20man%20into%20the%20spider%20verse&apikey=${apiKey}`)
        const animation7 = await fetch(`https://www.omdbapi.com/?t=spider%20man%20across%20the%20spider%20verse&apikey=${apiKey}`)
        const animation8 = await fetch(`https://www.omdbapi.com/?t=the%20nightmare%20before%20christmas&apikey=${apiKey}`)
        const data1an = await animation1.json()
        const data2an = await animation2.json()
        const data3an = await animation3.json()
        const data4an = await animation4.json()
        const data5an = await animation5.json()
        const data6an = await animation6.json()
        const data7an = await animation7.json()
        const data8an = await animation8.json()
        const thriller1 = await fetch(`https://www.omdbapi.com/?t=oldboy&apikey=${apiKey}`)
        const thriller2 = await fetch(`https://www.omdbapi.com/?t=memories%20of%20murder&apikey=${apiKey}`)
        const thriller3 = await fetch(`https://www.omdbapi.com/?t=eyes%20wide%20shut&apikey=${apiKey}`)
        const thriller4 = await fetch(`https://www.omdbapi.com/?t=se7en&apikey=${apiKey}`)
        const thriller5 = await fetch(`https://www.omdbapi.com/?t=the%20handmaiden&apikey=${apiKey}`)
        const thriller6 = await fetch(`https://www.omdbapi.com/?t=the%20silence%20of%20the%20lambs&apikey=${apiKey}`)
        const thriller7 = await fetch(`https://www.omdbapi.com/?t=rear%20window&apikey=${apiKey}`)
        const thriller8 = await fetch(`https://www.omdbapi.com/?t=gone%20girl&apikey=${apiKey}`)
        const data1t = await thriller1.json()
        const data2t = await thriller2.json()
        const data3t = await thriller3.json()
        const data4t = await thriller4.json()
        const data5t = await thriller5.json()
        const data6t = await thriller6.json()
        const data7t = await thriller7.json()
        const data8t = await thriller8.json()
        const comedy1 = await fetch(`https://www.omdbapi.com/?t=snatch&apikey=${apiKey}`)
        const comedy2 = await fetch(`https://www.omdbapi.com/?t=fargo&apikey=${apiKey}`)
        const comedy3 = await fetch(`https://www.omdbapi.com/?t=the%20nice%20guys&apikey=${apiKey}`)
        const comedy4 = await fetch(`https://www.omdbapi.com/?t=the%20big%20lebowski&apikey=${apiKey}`)
        const comedy5 = await fetch(`https://www.omdbapi.com/?t=the%20grand%20budapest%20hotel&apikey=${apiKey}`)
        const comedy6 = await fetch(`https://www.omdbapi.com/?t=airplane&apikey=${apiKey}`)
        const comedy7 = await fetch(`https://www.omdbapi.com/?t=tropic%20thunder&apikey=${apiKey}`)
        const comedy8 = await fetch(`https://www.omdbapi.com/?t=superbad&apikey=${apiKey}`)
        const data1com = await comedy1.json()
        const data2com = await comedy2.json()
        const data3com = await comedy3.json()
        const data4com = await comedy4.json()
        const data5com = await comedy5.json()
        const data6com = await comedy6.json()
        const data7com = await comedy7.json()
        const data8com = await comedy8.json()
        const drama1 = await fetch(`https://www.omdbapi.com/?t=mulholland%20drive&apikey=${apiKey}`)
        const drama2 = await fetch(`https://www.omdbapi.com/?t=twin%20peaks%20fire%20walk%20with%20me&apikey=${apiKey}`)
        const drama3 = await fetch(`https://www.omdbapi.com/?t=lost%20highway&apikey=${apiKey}`)
        const drama4 = await fetch(`https://www.omdbapi.com/?t=barry%20lyndon&apikey=${apiKey}`)
        const drama5 = await fetch(`https://www.omdbapi.com/?t=persona&apikey=${apiKey}`)
        const drama6 = await fetch(`https://www.omdbapi.com/?t=one%20flew%20over%20the%20cuckoo%27s%20nest&apikey=${apiKey}`)
        const drama7 = await fetch(`https://www.omdbapi.com/?t=there%20will%20be%20blood&apikey=${apiKey}`)
        const drama8 = await fetch(`https://www.omdbapi.com/?t=magnolia&apikey=${apiKey}`)
        const data1d = await drama1.json()
        const data2d = await drama2.json()
        const data3d = await drama3.json()
        const data4d = await drama4.json()
        const data5d = await drama5.json()
        const data6d = await drama6.json()
        const data7d = await drama7.json()
        const data8d = await drama8.json()
        return {
          data1, data2, data3, data4, data5, data6, data7, data8, data1c, data2c, data3c, data4c, data5c, data6c, data7c, data8c, data1a, data2a, data3a, data4a, data5a, data6a, data7a, data8a, data1w, data2w, data3w, data4w, data5w, data6w, data7w, data8w, data1h, data2h, data3h, data4h, data5h, data6h, data7h, data8h, data1sf, data2sf, data3sf, data4sf, data5sf ,data6sf, data7sf, data8sf, data1an, data2an, data3an, data4an, data5an, data6an, data7an, data8an, data1t, data2t, data3t, data4t, data5t, data6t, data7t, data8t, data1com, data2com, data3com, data4com, data5com, data6com, data7com, data8com, data1d, data2d, data3d, data4d, data5d, data6d, data7d, data8d
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

          {categories === "horreur" && (
            <div className='h-screen flex justify-center'>
              <div className='w-[700px] flex flex-wrap'>
                {data && ([data.data1h, data.data2h, data.data3h, data.data4h, data.data5h, data.data6h, data.data7h, data.data8h].filter(Boolean)).map((movie) => (
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

          {categories === "science-fiction" && (
            <div className='h-screen flex justify-center'>
              <h3>Non il n'y a pas Interstellar</h3>
              <div className='w-[700px] flex flex-wrap'>
                {data && ([data.data1sf, data.data2sf, data.data3sf, data.data4sf, data.data5sf, data.data6sf, data.data7sf, data.data8sf].filter(Boolean)).map((movie) => (
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

          {categories === "animation" && (
            <div className='h-screen flex justify-center'>
              <div className='w-[700px] flex flex-wrap'>
                {data && ([data.data1an, data.data2an, data.data3an, data.data4an, data.data5an, data.data6an, data.data7an, data.data8an].filter(Boolean)).map((movie) => (
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

          {categories === "thriller" && (
            <div className='h-screen flex justify-center'>
              <div className='w-[700px] flex flex-wrap'>
                {data && ([data.data1t, data.data2t, data.data3t, data.data4t, data.data5t, data.data6t, data.data7t, data.data8t].filter(Boolean)).map((movie) => (
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
          
          {categories === "comédie" && (
            <div className='h-screen flex justify-center'>
              <div className='w-[700px] flex flex-wrap'>
                {data && ([data.data1com, data.data2com, data.data3com, data.data4com, data.data5com, data.data6com, data.data7com, data.data8com].filter(Boolean)).map((movie) => (
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

          {categories === "drame" && (
            <div className='h-screen flex justify-center'>
              <div className='w-[700px] flex flex-wrap'>
                {data && ([data.data1d, data.data2d, data.data3d, data.data4d, data.data5d, data.data6d, data.data7d, data.data8d].filter(Boolean)).map((movie) => (
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

        </div>
        </>
    )
}