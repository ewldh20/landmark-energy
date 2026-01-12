interface HeroProps {
  onContactClick: () => void
}

const Hero = ({ onContactClick }: HeroProps) => {
  const scrollToContent = () => {
    const element = document.getElementById('about')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section className="hero">
      <div className="hero-background"></div>
      <div className="hero-overlay"></div>
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">Maximise Off-Cycle & Compliance Crop Revenue</h1>
          <p className="hero-subtitle">
            Through certified clean-fuel markets
          </p>
          <div className="hero-cta">
            <button onClick={scrollToContent} className="btn-primary btn-large">
              Learn More
            </button>
          </div>
        </div>
      </div>
      <div className="scroll-indicator">
        <span>Scroll to explore</span>
        <div className="scroll-arrow">↓</div>
      </div>
    </section>
  )
}

export default Hero
