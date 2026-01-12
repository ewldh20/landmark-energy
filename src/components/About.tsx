const About = () => {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-header">
          <h2>What we do</h2>
          <p className="section-intro">
            We source better-paying markets for crops you're already growing — turning break, cover and stewardship crops into additional revenue through clean-fuel buyers and government subsidies.
          </p>
        </div>
        <div className="about-grid">
          <div className="about-card">
            <div className="icon">🌾</div>
            <h3>Cover, break & stewardship crops</h3>
            <p>
              We use crops you already grow for black-grass control, rotation and SFI — rye, triticale, OSR, mixes and other cover.
            </p>
          </div>
          <div className="about-card">
            <div className="icon">⚡</div>
            <h3>Clean-fuel buyers</h3>
            <p>
              Your crop is sold to UK fuel producers who need sustainable feedstock for clean fuels. We ensure your offtake is compliant, making it eligible for additional government subsidy income.
            </p>
          </div>
          <div className="about-card">
            <div className="icon">💰</div>
            <h3>Additional Income</h3>
            <p>
              You sell crops you'd otherwise plough in or discount — while keeping your main cash crop and SFI income unchanged.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
