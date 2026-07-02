import { useState, useEffect } from 'react'
import BIGTVHub from './Pages/BIGTVHub.jsx'
import ProfilePortal from './Pages/ProfilePortal.jsx'
import Login from './Pages/Login.jsx'
import Register from './Pages/Register.jsx'
import Dashboard from './Pages/Dashboard.jsx'
import AparnaKurup from './Pages/AparnaKurup.jsx'
import AryaSurendran from './Pages/AryaSurendran.jsx'
import BinilPothan from './Pages/BinilPothan.jsx'
import PendingPayment from './Pages/PendingPayment.jsx'

function App() {
  const [hash, setHash] = useState(window.location.hash || '#/')

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash || '#/')
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [hash])

  // Basic routing matching hash
  if (hash.startsWith('#/pending-payment')) {
    return <PendingPayment />
  }

  if (hash.startsWith('#/ganesh-yarakala')) {
    return <ProfilePortal identifier="ganesh@bigtv.com" />
  }

  if (hash.startsWith('#/sujaya-parvathy')) {
    return <ProfilePortal identifier="sujaya@bigtv.com" />
  }

  if (hash.startsWith('#/aparna-kurup')) {
    return <AparnaKurup />
  }

  if (hash.startsWith('#/arya-surendran')) {
    return <AryaSurendran />
  }

  if (hash.startsWith('#/binil-pothen')) {
    return <BinilPothan />
  }

  if (hash.startsWith('#/profile/')) {
    const identifier = hash.replace('#/profile/', '')
    const decoded = decodeURIComponent(identifier)
    if (decoded.toLowerCase() === 'binil@bigtv.com') {
      window.location.hash = '#/binil-pothen'
      return null
    }
    if (decoded.toLowerCase() === 'sujaya@bigtv.com') {
      window.location.hash = '#/sujaya-parvathy'
      return null
    }
    return <ProfilePortal identifier={decoded} />
  }

  if (hash.startsWith('#/login')) {
    return <Login />
  }

  if (hash.startsWith('#/register')) {
    return <Register />
  }

  if (hash.startsWith('#/dashboard')) {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) {
      // Force redirect to login page
      setTimeout(() => {
        window.location.hash = '#/login'
      }, 0)
      return null
    }
    return <Dashboard />
  }

  return <BIGTVHub />
}

export default App
