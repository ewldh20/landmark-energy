import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import IndustryContext from './components/IndustryContext'
import HowItWorks from './components/HowItWorks'
import Benefits from './components/Benefits'
import ContactModal from './components/ContactModal'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <div className="app">
      <Navbar onContactClick={openModal} />
      <Hero onContactClick={openModal} />
      <About />
      <IndustryContext />
      <HowItWorks />
      <Benefits />
      <ContactModal isOpen={isModalOpen} onClose={closeModal} />
      <Footer />
    </div>
  )
}

export default App
