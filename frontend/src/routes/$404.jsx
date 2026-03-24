import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$404')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='relative text-center'>
    <img src="/img/black_lodge.png" alt="black lodge" />
    <div className="w-full absolute top-65 text-center text-5xl mt-10">
    <span className='text-orange-50 font-[NationalGothicW05-Regular] opacity-75'>The owls are not what they seem</span>
    </div>
  </div>
}
