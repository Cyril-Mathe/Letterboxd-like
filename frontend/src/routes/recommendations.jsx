import { createFileRoute } from '@tanstack/react-router'
import RecommendationsPage from '../components/recommendationsPage'

export const Route = createFileRoute('/recommendations')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RecommendationsPage />;
}
