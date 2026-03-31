import { useState } from 'react'

function BreakfastOrder() {
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

  const handleChange = (field, value) => {
    setOrder(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  const handleReset = () => {
    setSubmitted(false)
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

  if (submitted) {
    return (
      <div className="card">
        <h2>✅ Order Confirmed!</h2>
        <p style={{ marginBottom: '1rem' }}>Here's what's coming up:</p>
        <div className="order-summary">
          <div className="summary-item">
            ☕ {order.drink === 'coffee' ? `Coffee (${order.coffeeType})` : 'Tea'}
          </div>
          {order.juice !== 'none' && (
            <div className="summary-item">🥤 {order.juice} juice</div>
          )}
          <div className="summary-item">🍳 Eggs — {order.eggs}</div>
          <div className="summary-item">🥓 {order.meat}</div>
          {order.toast && <div className="summary-item">🍞 Toast</div>}
          {order.notes && (
            <div className="summary-item">📝 Note: {order.notes}</div>
          )}
        </div>
        <button className="btn-primary" onClick={handleReset}>
          Place Another Order
        </button>
      </div>
    )
  }

  return (
    <div className="card">
      <h2>🍳 Place Your Order</h2>
      <p>Build your perfect breakfast below.</p>

      <div className="form-section">

        {/* Drink */}
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

        {/* Coffee type — only shows if coffee selected */}
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

        {/* Juice */}
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

        {/* Eggs */}
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

        {/* Meat */}
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

        {/* Toast */}
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

        {/* Notes */}
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

        <button className="btn-primary" onClick={handleSubmit}>
          Place Order →
        </button>

      </div>
    </div>
  )
}

export default BreakfastOrder