import { createFileRoute } from '@tanstack/react-router'
import HomePage from "../pageAccueil";

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return <HomePage />
}
