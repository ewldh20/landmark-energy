import Carousel from './Carousel'

const Benefits = () => {
  const benefits = [
    {
      title: 'No change to your rotation',
      description: 'We only use crops you\'re already growing for compliance, cover or breaks.'
    },
    {
      title: 'Market-linked clean-fuel pricing',
      description: 'Your crop is sold into the clean-fuel market — typically higher value than feed or plough-in.'
    },
    {
      title: 'No soil penalty',
      description: 'Roots and stubble stay in the ground — SFI and soil benefits remain.'
    },
    {
      title: 'Premium clean-fuel markets',
      description: 'Your crop is sold into UK clean-fuel markets, where government premiums make it worth more than feed or plough-in.'
    },
    {
      title: 'We handle the paperwork',
      description: 'We handle government premiums, contracts and buyers. You just grow and harvest.'
    },
    {
      title: 'Start small, scale up',
      description: 'Trial a few fields, then expand if it works for you.'
    }
  ]

  const benefitCards = benefits.map((benefit, index) => (
    <div key={index} className="benefit-item">
      <h3>✓ {benefit.title}</h3>
      <p>{benefit.description}</p>
    </div>
  ))

  return (
    <section id="benefits" className="section">
      <div className="container">
        <div className="section-header">
          <h2>Why farmers work with us</h2>
          <p className="section-intro">
            Benefits designed specifically for UK farms and land managers.
          </p>
        </div>
        <div className="benefits-grid">
          {benefitCards.map((card, index) => (
            <div key={index}>{card}</div>
          ))}
        </div>
        <div className="benefits-carousel">
          <Carousel className="benefits-carousel-inner">
            {benefitCards}
          </Carousel>
        </div>
      </div>
    </section>
  )
}

export default Benefits
