const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: 'Tell us what you already grow',
      description: 'We assess your cover crops, break crops and SFI land that could be harvested instead of ploughed in.'
    },
    {
      number: 2,
      title: 'You harvest as normal',
      description: 'You cut it as a whole-crop. Roots and stubble stay in the ground. We arrange haulage.'
    },
    {
      number: 3,
      title: 'We connect you to buyers',
      description: 'We connect farms to refineries, work around your schedule, and ensure your offtake is compliant for government subsidy eligibility. We organise everything and simplify the process.'
    },
    {
      number: 4,
      title: 'You get paid',
      description: 'You\'re paid for the crop by the buyer — often at a higher market rate than what you\'re getting today — plus your share of the clean fuel government premium we unlock.'
    }
  ]

  return (
    <section id="how-it-works" className="section section-alt">
      <div className="container">
        <div className="section-header">
          <h2>How it works</h2>
          <p className="section-intro">
            Built around your existing rotation, machinery and agronomy.
          </p>
        </div>
        <div className="process-steps">
          {steps.map((step) => (
            <div key={step.number} className="step">
              <div className="step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
