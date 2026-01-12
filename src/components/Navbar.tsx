interface NavbarProps {
  onContactClick: () => void
}

const Navbar = ({ onContactClick }: NavbarProps) => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-brand">
          <img src="/logo.png" alt="Landmark Energy" className="nav-logo" />
          <h1>Landmark Energy</h1>
        </div>
        <button onClick={onContactClick} className="btn-primary">
          Get in Touch
        </button>
      </div>
    </nav>
  )
}

export default Navbar
