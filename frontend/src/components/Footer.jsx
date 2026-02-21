import { Link } from '@tanstack/react-router'
import { Film, Github, Twitter, Mail } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0d1117] border-t border-[#2c3440] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Film className="h-6 w-6 text-[#00e054]" />
              <span className="ml-2 text-lg font-semibold text-white tracking-tight">CINE CONNECT</span>
            </Link>
            <p className="mt-3 text-[#9ab] text-sm">
              Votre plateforme de découverte cinématographique. 
              Explorez, notez et partagez vos coups de cœur cinématographiques.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/films" 
                  className="text-[#9ab] hover:text-[#00e054] text-sm transition-colors"
                >
                  Films
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className="text-[#9ab] hover:text-[#00e054] text-sm transition-colors"
                >
                  Profil
                </Link>
              </li>
              <li>
                <Link 
                  to="/discussion" 
                  className="text-[#9ab] hover:text-[#00e054] text-sm transition-colors"
                >
                  Discussion
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-white font-medium mb-4">Nous suivre</h4>
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#9ab] hover:text-[#00e054] transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#9ab] hover:text-[#00e054] transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a 
                href="mailto:contact@cineconnect.com" 
                className="text-[#9ab] hover:text-[#00e054] transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-[#2c3440] flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#9ab] text-sm">
            © {currentYear} CINE CONNECT. Tous droits réservés.
          </p>
          <p className="text-[#9ab] text-sm mt-2 md:mt-0">
            Propulsé par OMDb API
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
