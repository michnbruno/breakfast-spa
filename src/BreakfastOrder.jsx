import { useState } from 'react'
import config from './config'

function BreakfastOrder({ onOrderConfirmed }) {
  const [order, setOrder] = useState({
    drink: 'coffee',
    coffeeType: 'regular',
    eggs: 'scrambled',
    meat: 'bacon',
    toast: true,
    juice: 'none',
    notes: ''
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [confirmation, setConfirmation] = useState(null)
  const [error, setError] = useState(null)

  const handleChange = (field, value) => {
    setOrder(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/BreakfastOrder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      })
      if (!response.ok) throw new Error('Order failed')
      const data = await response.json()
      setConfirmation(data)
      setSubmitted(true)
    } catch (err) {
      setError('Could not reach the kitchen. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSubmitted(false)
    setConfirmation(null)
    setError(null)
    setOrder({ drink: 'coffee', coffeeType: 'regular', eggs: 'scrambled', meat: 'bacon', toast: true, juice: 'none', notes: '' })
  }

  const PageHeader = ({ title, subtitle }) => (
    <div className="page-header">
      <h2 className="page-title">{title}</h2>
      <p className="page-subtitle">{subtitle}</p>
      <div className="tech-strip">
        <span className="tech-strip-label">Stack</span>
        <span className="tech-badge">Azure App Service</span>
        <span className="tech-badge">Azure Web PubSub</span>
        <span className="tech-badge">.NET 8</span>
        <span className="tech-badge">React · Vite</span>
        <span className="tech-badge">GitHub Pages</span>
      </div>
    </div>
  )

  if (submitted && confirmation) {
    return (
      <>
        <PageHeader title="Order Confirmed" subtitle={`Order #${confirmation.orderId} · Est. ${confirmation.estimatedTime}`} />
        <div className="card">
          <div className="success-banner">
            ✅ Your breakfast is on its way!
          </div>
          <div className="order-summary">
            <div className="summary-item">
              {confirmation.drink === 'coffee' ? `Coffee (${confirmation.coffeeType})` : 'Tea'}
            </div>
            {confirmation.juice !== 'none' && <div className="summary-item">{confirmation.juice} juice</div>}
            <div className="summary-item">Eggs — {confirmation.eggs}</div>
            {confirmation.meat !== 'none' && <div className="summary-item">{confirmation.meat}</div>}
            {confirmation.toast && <div className="summary-item">Toast</div>}
            {confirmation.notes && <div className="summary-item">Note: {confirmation.notes}</div>}
          </div>
          <div className="next-step-banner">
            👇 Click <strong>Prepare My Breakfast</strong> to see the next step
          </div>
          <div className="btn-row">
            <button className="btn-primary" onClick={() => onOrderConfirmed(confirmation)}>
              Prepare My Breakfast →
            </button>
            <button className="btn-secondary" onClick={handleReset}>
              Place Another Order
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Place Your Order" subtitle="Build your perfect breakfast below." />

      <div className="card">
        {error && <div className="error-banner">{error}</div>}

        <div className="form-section">

          <div className="form-row">
            <span className="form-label-left">Drink</span>
            <div className="radio-group">
              {['coffee', 'tea'].map(option => (
                <label key={option} className="radio-label">
                  <input type="radio" name="drink" value={option}
                    checked={order.drink === option}
                    onChange={() => handleChange('drink', option)} />
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {order.drink === 'coffee' && (
            <div className="form-row">
              <span className="form-label-left">Coffee Type</span>
              <select className="form-select" value={order.coffeeType}
                onChange={e => handleChange('coffeeType', e.target.value)}>
                <option value="regular">Regular</option>
                <option value="decaf">Decaf</option>
                <option value="espresso">Espresso</option>
              </select>
            </div>
          )}

          <div className="form-row">
            <span className="form-label-left">Juice</span>
            <select className="form-select" value={order.juice}
              onChange={e => handleChange('juice', e.target.value)}>
              <option value="none">No juice</option>
              <option value="orange">Orange</option>
              <option value="apple">Apple</option>
              <option value="cranberry">Cranberry</option>
              <option value="pineapple">Pineapple</option>
            </select>
          </div>

          <div className="form-row">
            <span className="form-label-left">Eggs</span>
            <div className="radio-group">
              {['scrambled', 'fried', 'poached', 'none'].map(option => (
                <label key={option} className="radio-label">
                  <input type="radio" name="eggs" value={option}
                    checked={order.eggs === option}
                    onChange={() => handleChange('eggs', option)} />
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div className="form-row">
            <span className="form-label-left">Meat</span>
            <div className="radio-group">
              {['bacon', 'sausage', 'none'].map(option => (
                <label key={option} className="radio-label">
                  <input type="radio" name="meat" value={option}
                    checked={order.meat === option}
                    onChange={() => handleChange('meat', option)} />
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div className="form-row">
            <span className="form-label-left">Toast</span>
            <label className="checkbox-label">
              <input type="checkbox" checked={order.toast}
                onChange={e => handleChange('toast', e.target.checked)} />
              Include toast
            </label>
          </div>

          <div className="form-row form-row-stacked">
            <span className="form-label-left">Notes</span>
            <textarea className="form-textarea" placeholder="Any special requests..."
              value={order.notes} onChange={e => handleChange('notes', e.target.value)} rows={3} />
          </div>

        </div>

        <button className="btn-primary btn-submit" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Placing order...' : 'Place Order →'}
        </button>
      </div>
    </>
  )
}

export default BreakfastOrder
