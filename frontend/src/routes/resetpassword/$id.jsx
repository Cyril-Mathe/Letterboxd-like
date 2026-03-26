import { createFileRoute } from '@tanstack/react-router'
import Resetpassword from '../../resetpassword'

export const Route = createFileRoute('/resetpassword/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div><Resetpassword /></div>
}
