import { useState, useContext } from "react";
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from "@tanstack/react-router";
import { ThemeContext } from '../lib/fonctions/contexts';

const movieTitles = {
  guerre: ['come%20and%20see', 'apocalypse%20now', 'paths%20of%20glory', 'full%20metal%20jacket', 'fury', 'dunkirk', 'zone%20of%20interest', 'inglourious%20basterds'],
  crime: ['goodfellas', 'the%20godfather', 'the%20godfather%20part%20ii', 'heat', 'city%20of%20god', 'training%20day', 'the%20irishman', 'dog%20day%20afternoon'],
  action: ['mad%20max%20fury%20road', 'furiosa', 'seven%20samurai', 'terminator%20ii', 'die%20hard', 'pacific%20rim', 'sicario', 'godzilla%20minus%20one'],
  western: ['no%20country%20for%20old%20men', 'the%20good%20the%20bad%20and%20the%20ugly', 'once%20upon%20a%20time%20in%20the%20west', 'unforgiven', 'for%20a%20few%20dollars%20more', 'django%20unchained', 'a%20fistful%20of%20dollars', 'the%20hateful%20eight'],
  horreur: ['the%20thing', 'psycho', 'the%20shining', 'alien', 'the%20substance', 'the%20others', 'requiem%20for%20a%20dream', 'the%20lighthouse'],
  'science-fiction': ['2001%20a%20space%20odyssey', 'stalker', 'akira', 'blade%20runner%202049', 'aliens', '12%20monkeys', 'arrival', 'a%20clockwork%20orange'],
  animation: ['Fantastic%20Mr.%20Fox', 'perfect%20blue', 'the%20boy%20and%20the%20heron', 'princess%20mononoke', 'spirited%20away', 'spider%20man%20into%20the%20spider%20verse', 'spider%20man%20across%20the%20spider%20verse', 'the%20nightmare%20before%20christmas'],
  thriller: ['oldboy', 'memories%20of%20murder', 'eyes%20wide%20shut', 'se7en', 'the%20handmaiden', 'the%20silence%20of%20the%20lambs', 'rear%20window', 'gone%20girl'],
  comédie: ['snatch', 'fargo', 'the%20big%20lebowski', 'the%20nice%20guys', 'the%20grand%20budapest%20hotel', 'airplane', 'tropic%20thunder', 'superbad'],
  drame: ['mulholland%20drive', 'twin%20peaks%20fire%20walk%20with%20me', 'lost%20highway', 'barry%20lyndon', 'persona', 'one%20flew%20over%20the%20cuckoo%27s%20nest', 'there%20will%20be%20blood', 'magnolia'],
};

const fetchMoviesByCategory = async (titles, apiKey) => {
  const responses = await Promise.all(
    titles.map(title => fetch(`https://www.omdbapi.com/?t=${title}&apikey=${apiKey}`))
  );
  return Promise.all(responses.map(res => res.json()));
};

export default function RecommendationsPage() {
    const [selectedCategory, setSelectedCategory] = useState("guerre");
    const { isDark } = useContext(ThemeContext);
    const navigate = useNavigate()
    const apiKey = import.meta.env.VITE_OMDB_API_KEY
    const { isPending, error, data } = useQuery({
        queryKey: ['movies', selectedCategory],
        queryFn: async () => {
          return fetchMoviesByCategory(movieTitles[selectedCategory], apiKey);
        },
        staleTime: 1000 * 30,
    })

    if (isPending) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    return (
        <>
        <style>{`
          @keyframes buttonPulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
            100% {
              transform: scale(1);
            }
          }

          .btn-active {
            animation: buttonPulse 0.4s ease;
          }
        `}</style>

        <div className={`mx-[150px] flex flex-wrap gap-2 mt-4 ${isDark ? 'text-white' : ''}`}>
          {Object.keys(movieTitles).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex-1 basis-1/5 px-2 py-1 text-sm border-2 rounded-lg transition-all duration-300 font-semibold ${
                selectedCategory === category
                  ? 'bg-black text-white border-black btn-active'
                  : isDark ? 'border-gray-600 bg-[#1c2228] text-white hover:bg-[#2c3440]' : 'border-gray-300 bg-white text-black hover:bg-gray-100 hover:border-gray-600'
              }`}
            >
              {category === 'science-fiction' ? 'SF' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div>
          {selectedCategory === "guerre" && (
            <div className="flex justify-center flex-col">
              <h3 className={`italic text-center m-[15px] ${isDark ? 'text-white' : 'text-black'}`}>"The horror... the horror"</h3>
            <div className='h-screen flex justify-center'>
              <div className='w-[700px] flex flex-wrap'>
                {isPending ? <p className={isDark ? 'text-white' : 'text-black'}>Chargement...</p> : data && (data.filter(Boolean)).map((movie) => (
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
                    <p className={isDark ? 'text-white' : 'text-black'}>{movie.Title}</p>
                    {movie.imdbRating && <p className={isDark ? 'text-white' : 'text-black'}>Note IMDb : {movie.imdbRating}/10</p>}
                  </div>
                ))}
              </div>
            </div>
            </div>
          )}

          {selectedCategory === "crime" && (
            <div className="flex justify-center flex-col">
              <h3 className={`italic text-center m-[15px] ${isDark ? 'text-white' : 'text-black'}`}>"I'm gonna make him an offer he can't refuse."</h3>
            <div className='h-screen flex justify-center'>
              <div className='w-[700px] flex flex-wrap'>
                {isPending ? <p className={isDark ? 'text-white' : 'text-black'}>Chargement...</p> : data && (data.filter(Boolean)).map((movie) => (
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
                    <p className={isDark ? 'text-white' : 'text-black'}>{movie.Title}</p>
                    {movie.imdbRating && <p className={isDark ? 'text-white' : 'text-black'}>Note IMDb : {movie.imdbRating}/10</p>}
                  </div>
                ))}
              </div>
            </div>
            </div>
          )}

          {selectedCategory === "action" && (
            <div className="flex justify-center flex-col">
              <h3 className={`italic text-center m-[15px] ${isDark ? 'text-white' : 'text-black'}`}>"I live, I die, I live again !"</h3>
            <div className='h-screen flex justify-center'>
              <div className='w-[700px] flex flex-wrap'>
                {isPending ? <p className={isDark ? 'text-white' : 'text-black'}>Chargement...</p> : data && (data.filter(Boolean)).map((movie) => (
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
                    <p className={isDark ? 'text-white' : 'text-black'}>{movie.Title}</p>
                    {movie.imdbRating && <p className={isDark ? 'text-white' : 'text-black'}>Note IMDb : {movie.imdbRating}/10</p>}
                  </div>
                ))}
              </div>
            </div>
            </div>
          )}

          {selectedCategory === "western" && (
            <div className="flex justify-center flex-col">
              <h3 className={`italic text-center m-[15px] ${isDark ? 'text-white' : 'text-black'}`}>"You see, in this world there's two kinds of people, my friend: Those with loaded guns and those who dig. You dig."</h3>
            <div className='h-screen flex justify-center'>
              <div className='w-[700px] flex flex-wrap'>
                {isPending ? <p className={isDark ? 'text-white' : 'text-black'}>Chargement...</p> : data && (data.filter(Boolean)).map((movie) => (
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
                    <p className={isDark ? 'text-white' : 'text-black'}>{movie.Title}</p>
                    {movie.imdbRating && <p className={isDark ? 'text-white' : 'text-black'}>Note IMDb : {movie.imdbRating}/10</p>}
                  </div>
                ))}
              </div>
            </div>
            </div>
          )}

          {selectedCategory === "horreur" && (
            <div className="flex justify-center flex-col">
              <h3 className={`italic text-center m-[15px] ${isDark ? 'text-white' : 'text-black'}`}>"Here come Johnny !"</h3>
            <div className='h-screen flex justify-center'>
              <div className='w-[700px] flex flex-wrap'>
                {isPending ? <p className={isDark ? 'text-white' : 'text-black'}>Chargement...</p> : data && (data.filter(Boolean)).map((movie) => (
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
                    <p className={isDark ? 'text-white' : 'text-black'}>{movie.Title}</p>
                    {movie.imdbRating && <p className={isDark ? 'text-white' : 'text-black'}>Note IMDb : {movie.imdbRating}/10</p>}
                  </div>
                ))}
              </div>
            </div>
            </div>
          )}

          {selectedCategory === "science-fiction" && (
            <div className="flex justify-center flex-col">
              <h3 className={`italic text-center m-[15px] ${isDark ? 'text-white' : 'text-black'}`}>If you could see your whole life from start to finish, would you change things ?</h3>
            <div className='h-screen flex justify-center'>
              <div className='w-[700px] flex flex-wrap'>
                {isPending ? <p className={isDark ? 'text-white' : 'text-black'}>Chargement...</p> : data && (data.filter(Boolean)).map((movie) => (
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
                    <p className={isDark ? 'text-white' : 'text-black'}>{movie.Title}</p>
                    {movie.imdbRating && <p className={isDark ? 'text-white' : 'text-black'}>Note IMDb : {movie.imdbRating}/10</p>}
                  </div>
                ))}
              </div>
            </div>
            </div>
          )}

          {selectedCategory === "animation" && (
            <div className="flex justify-center flex-col">
              <h3 className={`italic text-center m-[15px] ${isDark ? 'text-white' : 'text-black'}`}>"Everyone keeps telling me how my story is supposed to go. Nah. I'm-a do my own thing."</h3>
            <div className='h-screen flex justify-center'>
              <div className='w-[700px] flex flex-wrap'>
                {isPending ? <p className={isDark ? 'text-white' : 'text-black'}>Chargement...</p> : data && (data.filter(Boolean)).map((movie) => (
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
                    <p className={isDark ? 'text-white' : 'text-black'}>{movie.Title}</p>
                    {movie.imdbRating && <p className={isDark ? 'text-white' : 'text-black'}>Note IMDb : {movie.imdbRating}/10</p>}
                  </div>
                ))}
              </div>
            </div>
            </div>
          )}

          {selectedCategory === "thriller" && (
            <div className="flex justify-center flex-col">
              <h3 className={`italic text-center m-[15px] ${isDark ? 'text-white' : 'text-black'}`}>"Laugh and the world laughs with you. Weep and you weep alone."</h3>
            <div className='h-screen flex justify-center'>
              <div className='w-[700px] flex flex-wrap'>
                {isPending ? <p className={isDark ? 'text-white' : 'text-black'}>Chargement...</p> : data && (data.filter(Boolean)).map((movie) => (
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
                    <p className={isDark ? 'text-white' : 'text-black'}>{movie.Title}</p>
                    {movie.imdbRating && <p className={isDark ? 'text-white' : 'text-black'}>Note IMDb : {movie.imdbRating}/10</p>}
                  </div>
                ))}
              </div>
            </div>
            </div>
          )}
          
          {selectedCategory === "comédie" && (
            <div className="flex justify-center flex-col">
              <h3 className={`italic text-center m-[15px] ${isDark ? 'text-white' : 'text-black'}`}>"Shut the fuck up, Donny."</h3>
            <div className='h-screen flex justify-center'>
              <div className='w-[700px] flex flex-wrap'>
                {isPending ? <p className={isDark ? 'text-white' : 'text-black'}>Chargement...</p> : data && (data.filter(Boolean)).map((movie) => (
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
                    <p className={isDark ? 'text-white' : 'text-black'}>{movie.Title}</p>
                    {movie.imdbRating && <p className={isDark ? 'text-white' : 'text-black'}>Note IMDb : {movie.imdbRating}/10</p>}
                  </div>
                ))}
              </div>
            </div>
            </div>
          )}

          {selectedCategory === "drame" && (
            <div className="flex justify-center flex-col">
              <h3 className={`italic text-center m-[15px] ${isDark ? 'text-white' : 'text-black'}`}>"This is the girl."</h3>
            <div className='h-screen flex justify-center'>
              <div className='w-[700px] flex flex-wrap'>
                {isPending ? <p className={isDark ? 'text-white' : 'text-black'}>Chargement...</p> : data && (data.filter(Boolean)).map((movie) => (
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
                    <p className={isDark ? 'text-white' : 'text-black'}>{movie.Title}</p>
                    {movie.imdbRating && <p className={isDark ? 'text-white' : 'text-black'}>Note IMDb : {movie.imdbRating}/10</p>}
                  </div>
                ))}
              </div>
            </div>
            </div>
          )}

        </div>
        <div className={`text-center ${isDark ? 'text-white' : 'text-black'}`}>
          List made by : <a href="https://letterboxd.com/Zaco__/" className="text-blue-500 hover:underline">Zaco</a>
        </div>
        </>
    )
}