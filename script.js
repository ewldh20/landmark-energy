// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact form handling
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        farmSize: formData.get('farm-size'),
        location: formData.get('location'),
        message: formData.get('message')
    };

    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    formMessage.style.display = 'none';

    try {
        // Try to send via PHP backend if available
        const formDataToSend = new URLSearchParams();
        formDataToSend.append('name', data.name);
        formDataToSend.append('email', data.email);
        formDataToSend.append('phone', data.phone || '');
        formDataToSend.append('farm-size', data.farmSize || '');
        formDataToSend.append('location', data.location || '');
        formDataToSend.append('message', data.message);

        try {
            const response = await fetch('contact.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formDataToSend
            });

            const result = await response.json();

            if (result.success) {
                // Show success message
                formMessage.className = 'form-message success';
                formMessage.textContent = result.message || 'Thank you for your message! We\'ll get back to you soon.';
                formMessage.style.display = 'block';
                
                // Reset form
                contactForm.reset();
                
                // Scroll to message
                formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                throw new Error(result.message || 'Submission failed');
            }
        } catch (fetchError) {
            // If PHP backend fails, use mailto fallback
            console.log('Backend not available, using mailto fallback');
            const emailBody = `
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Farm Size: ${data.farmSize || 'Not provided'} hectares
Location: ${data.location || 'Not provided'}

Message:
${data.message}
            `.trim();

            // Open mailto as fallback
            window.location.href = `mailto:elliot@landmarkenergy.co.uk?subject=New Contact from ${encodeURIComponent(data.name)}&body=${encodeURIComponent(emailBody)}`;
            
            // Show success message (user will send via email client)
            formMessage.className = 'form-message success';
            formMessage.textContent = 'Your email client should open. If not, please email us directly at elliot@landmarkenergy.co.uk';
            formMessage.style.display = 'block';
            
            // Reset form
            contactForm.reset();
        }
        
    } catch (error) {
        // Show error message
        formMessage.className = 'form-message error';
        formMessage.textContent = 'Sorry, there was an error sending your message. Please email us directly at elliot@landmarkenergy.co.uk';
        formMessage.style.display = 'block';
        
        console.error('Form submission error:', error);
    } finally {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
});

// Optional: Add form validation feedback
const formInputs = contactForm.querySelectorAll('input, textarea');
formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value.trim()) {
            this.style.borderColor = 'var(--error-color)';
        } else {
            this.style.borderColor = 'var(--border-color)';
        }
    });
    
    input.addEventListener('input', function() {
        if (this.style.borderColor === 'rgb(220, 53, 69)') {
            this.style.borderColor = 'var(--border-color)';
        }
    });
});
