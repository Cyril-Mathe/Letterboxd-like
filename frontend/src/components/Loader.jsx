import { Film } from 'lucide-react'
import { useContext } from 'react'
import { ThemeContext } from '../contexts'

export function Loader({ message = 'Chargement...' }) {
  const { isDark } = useContext(ThemeContext)

  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
      <div className="relative">
        <div className={`w-16 h-16 border-4 ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-full`} />
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-green-500 rounded-full animate-spin" />
        <Film className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-green-500" />
      </div>
      <p className="mt-4 text-sm font-medium">{message}</p>
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Loader message="Chargement de la page..." />
    </div>
  )
}

export function ErrorMessage({ message, onRetry }) {
  const { isDark } = useContext(ThemeContext)

  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] p-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-red-900/30' : 'bg-red-100'}`}>
        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <p className="text-lg font-medium mb-2">Oups, une erreur s'est produite</p>
      <p className="text-sm text-center mb-4 max-w-md">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Réessayer
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title, message, icon: Icon = Film }) {
  const { isDark } = useContext(ThemeContext)

  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] p-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-lg font-medium mb-2">{title}</p>
      <p className="text-sm text-center max-w-md">{message}</p>
    </div>
  )
}
