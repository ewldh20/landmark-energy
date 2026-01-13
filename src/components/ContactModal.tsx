import { useState, FormEvent, useEffect } from 'react'

interface FormData {
  name: string
  email: string
  phone: string
  location: string
  message: string
}

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    location: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' })

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Only prevent body scroll on desktop, allow modal to scroll on mobile
      if (window.innerWidth > 768) {
        document.body.style.overflow = 'hidden'
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormMessage({ type: null, text: '' })

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api'
      const response = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          farmSize: '' // Keep for backend compatibility
        }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

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
          location: '',
          message: ''
        })
        // Auto-close after 3 seconds on success
        setTimeout(() => {
          onClose()
        }, 3000)
      } else {
        setFormMessage({
          type: 'error',
          text: result.message || 'Sorry, there was an error sending your message. Please try again.'
        })
      }
    } catch (error) {
      console.error('Form submission error:', error)
      const errorMessage = error instanceof Error 
        ? `Connection error: ${error.message}. Make sure the backend server is running on port 4051.`
        : 'Sorry, there was an error sending your message. Please email us directly at elliot@landmarkenergy.co.uk'
      setFormMessage({
        type: 'error',
        text: errorMessage
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ×
        </button>
        <div className="modal-header">
          <h2>Get In Touch</h2>
          <p>We'd love to help you maximise revenue from your cover crops. Get in touch and we'll make it happen.</p>
        </div>
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
  )
}

export default ContactModal
