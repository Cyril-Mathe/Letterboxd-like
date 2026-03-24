import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/$404')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    const fadeDelay = setTimeout(() => setIsFading(true), 100)
    const redirectDelay = setTimeout(() => navigate({ to: '/' }), 5000)

    return () => {
      clearTimeout(fadeDelay)
      clearTimeout(redirectDelay)
    }
  }, [navigate])

  return (
    <div className={`relative text-center h-screen w-screen overflow-hidden transition-opacity duration-5000 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
      <img className='absolute inset-0 object-cover w-full h-full' src="/img/black_lodge.png" alt="black lodge" />
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-bold text-orange-50 opacity-90 sm:text-6xl">The owls are not what they seem</h1>
      </div>
    </div>
  )
}