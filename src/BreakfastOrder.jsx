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
    setOrder({
      drink: 'coffee',
      coffeeType: 'regular',
      eggs: 'scrambled',
      meat: 'bacon',
      toast: true,
      juice: 'none',
      notes: ''
    })
  }

  if (submitted && confirmation) {
    return (
      <div className="card">
        <div style={{
          background: '#d1fae5',
          border: '1px solid #6ee7b7',
          color: '#065f46',
          padding: '1rem 1.25rem',
          borderRadius: '8px',
          marginBottom: '1.25rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.25rem' }}>
            ✅ Order Confirmed!
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.85 }}>
            Order #{confirmation.orderId} &nbsp;·&nbsp; Est. {confirmation.estimatedTime}
          </div>
        </div>
        <div className="order-summary">
          <div className="summary-item">
            {confirmation.drink === 'coffee'
              ? `Coffee (${confirmation.coffeeType})`
              : 'Tea'}
          </div>
          {confirmation.juice !== 'none' && (
            <div className="summary-item">{confirmation.juice} juice</div>
          )}
          <div className="summary-item">Eggs — {confirmation.eggs}</div>
          {confirmation.meat !== 'none' && (
            <div className="summary-item">{confirmation.meat}</div>
          )}
          {confirmation.toast && (
            <div className="summary-item">Toast</div>
          )}
          {confirmation.notes && (
            <div className="summary-item">Note: {confirmation.notes}</div>
          )}
        </div>
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fcd34d',
          color: '#92400e',
          padding: '0.6rem 1rem',
          borderRadius: '6px',
          marginBottom: '1rem',
          fontSize: '0.88rem',
          fontWeight: '500',
          textAlign: 'center'
        }}>
          👇 Click <strong>Prepare My Breakfast</strong> to see the next step
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            className="btn-primary"
            onClick={() => onOrderConfirmed(confirmation)}
          >
            Prepare My Breakfast →
          </button>
          <button className="btn-secondary" onClick={handleReset}>
            Place Another Order
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h2>Place Your Order</h2>
      <p>Build your perfect breakfast below.</p>

      <div style={{
        background: '#f0f9ff',
        border: '1px solid #bae6fd',
        color: '#0369a1',
        padding: '0.6rem 1rem',
        borderRadius: '6px',
        marginTop: '0.75rem',
        fontSize: '0.88rem',
        fontWeight: '500',
        textAlign: 'center'
      }}>
        👆 Select your breakfast choices below
      </div>

      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#991b1b',
          padding: '0.75rem 1rem',
          borderRadius: '6px',
          marginTop: '1rem',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}

      <div className="form-section">

        <div className="form-group">
          <label className="form-label">Drink</label>
          <div className="radio-group">
            {['coffee', 'tea'].map(option => (
              <label key={option} className="radio-label">
                <input
                  type="radio"
                  name="drink"
                  value={option}
                  checked={order.drink === option}
                  onChange={() => handleChange('drink', option)}
                />
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {order.drink === 'coffee' && (
          <div className="form-group">
            <label className="form-label">Coffee type</label>
            <select
              className="form-select"
              value={order.coffeeType}
              onChange={e => handleChange('coffeeType', e.target.value)}
            >
              <option value="regular">Regular</option>
              <option value="decaf">Decaf</option>
              <option value="espresso">Espresso</option>
            </select>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Juice</label>
          <select
            className="form-select"
            value={order.juice}
            onChange={e => handleChange('juice', e.target.value)}
          >
            <option value="none">No juice</option>
            <option value="orange">Orange</option>
            <option value="apple">Apple</option>
            <option value="cranberry">Cranberry</option>
            <option value="pineapple">Pineapple</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Eggs</label>
          <div className="radio-group">
            {['scrambled', 'fried', 'poached', 'none'].map(option => (
              <label key={option} className="radio-label">
                <input
                  type="radio"
                  name="eggs"
                  value={option}
                  checked={order.eggs === option}
                  onChange={() => handleChange('eggs', option)}
                />
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Meat</label>
          <div className="radio-group">
            {['bacon', 'sausage', 'none'].map(option => (
              <label key={option} className="radio-label">
                <input
                  type="radio"
                  name="meat"
                  value={option}
                  checked={order.meat === option}
                  onChange={() => handleChange('meat', option)}
                />
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={order.toast}
              onChange={e => handleChange('toast', e.target.checked)}
            />
            Include toast
          </label>
        </div>

        <div className="form-group">
          <label className="form-label">Special requests</label>
          <textarea
            className="form-textarea"
            placeholder="Any special requests..."
            value={order.notes}
            onChange={e => handleChange('notes', e.target.value)}
            rows={3}
          />
        </div>

        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Placing order...' : 'Place Order →'}
        </button>

      </div>
    </div>
  )
}

export default BreakfastOrder