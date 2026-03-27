import { createFileRoute, redirect } from '@tanstack/react-router'
import { useContext } from 'react'
import HomePage from '../components/pageAccueil'
import { AuthContext } from '../lib/fonctions/contexts'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    // Check if user is authenticated
    const user = localStorage.getItem('cineconnect_user')
    if (!user) {
      throw redirect({
        to: '/login',
        search: {},
      })
    }
  },
  component: Index,
})

function Index() {
  return <HomePage />
}
