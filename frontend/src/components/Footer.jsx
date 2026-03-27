import { Link } from '@tanstack/react-router'
import { Film, Github, Twitter, Mail } from 'lucide-react'

const Footer = ({ isDark = true }) => {
  const currentYear = new Date().getFullYear()

  const bgFooter = isDark ? 'bg-[#0d1117]' : 'bg-gray-800'
  const borderColor = isDark ? 'border-[#2c3440]' : 'border-gray-700'
  const textMain = isDark ? 'text-white' : 'text-white'
  const textSecondary = isDark ? 'text-[#9ab]' : 'text-gray-400'
  const accentColor = isDark ? 'text-[#00e054]' : 'text-green-400'

  return (
    <footer className={`${bgFooter} ${borderColor} border-t mt-auto`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Film className={`h-6 w-6 ${accentColor}`} />
              <span className={`ml-2 text-lg font-semibold ${textMain} tracking-tight`}>Front Row</span>
            </Link>
            <p className={`mt-3 ${textSecondary} text-sm`}>
              Votre plateforme de découverte cinématographique. Explorez, notez et partagez vos coups de cœur cinématographiques.
            </p>
          </div>

          <div>
            <h4 className={`${textMain} font-medium mb-4`}>Liens rapides</h4>
            <ul className="space-y-2">
              <li><Link to="/films" className={`${textSecondary} hover:${accentColor} text-sm transition-colors`}>Films</Link></li>
              <li><Link to="/profile" className={`${textSecondary} hover:${accentColor} text-sm transition-colors`}>Profil</Link></li>
              <li><Link to="/discussion" className={`${textSecondary} hover:${accentColor} text-sm transition-colors`}>Discussion</Link></li>
            </ul>
          </div>

          <div>
            <h4 className={`${textMain} font-medium mb-4`}>Nous suivre</h4>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={`${textSecondary} hover:${accentColor} transition-colors`}>
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={`${textSecondary} hover:${accentColor} transition-colors`}>
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="mailto:contact@cineconnect.com" className={`${textSecondary} hover:${accentColor} transition-colors`}>
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
        </div>

        <div className={`mt-8 pt-8 ${borderColor} border-t flex flex-col md:flex-row justify-between items-center`}>
          <p className={`${textSecondary} text-sm`}>© {currentYear} Front Row. Tous droits réservés.</p>
          <p className={`${textSecondary} text-sm mt-2 md:mt-0`}>Propulsé par OMDb API</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
