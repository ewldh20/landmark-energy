import { useState, FormEvent } from 'react'

interface FormData {
  name: string
  email: string
  phone: string
  farmSize: string
  location: string
  message: string
}

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    farmSize: '',
    location: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormMessage({ type: null, text: '' })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setFormMessage({
          type: 'success',
          text: result.message || "Thank you for your message! We'll get back to you soon."
        })
        setFormData({
          name: '',
          email: '',
          phone: '',
          farmSize: '',
          location: '',
          message: ''
        })
      } else {
        setFormMessage({
          type: 'error',
          text: result.message || 'Sorry, there was an error sending your message. Please try again.'
        })
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setFormMessage({
        type: 'error',
        text: 'Sorry, there was an error sending your message. Please email us directly at elliot@landmarkenergy.co.uk'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="section section-alt">
      <div className="container">
        <div className="section-header">
          <h2>Get In Touch</h2>
          <p className="section-intro">
            Interested in learning more? Fill out the form below and we'll get back to you.
          </p>
        </div>
        <div className="contact-wrapper">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="farmSize">Farm Size (hectares)</label>
              <input
                type="number"
                id="farmSize"
                name="farmSize"
                value={formData.farmSize}
                onChange={handleChange}
                min="0"
                placeholder="e.g. 200"
              />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Somerset, East Anglia"
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                required
                placeholder="Tell us about your farm and how we might be able to help..."
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary btn-large"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
            {formMessage.type && (
              <div className={`form-message ${formMessage.type}`}>
                {formMessage.text}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact
