import { useState } from 'react'
import './App.css'
import BreakfastOrder from './BreakfastOrder'
import BreakfastPrep from './BreakfastPrep'

function App() {
  const [activeSection, setActiveSection] = useState('breakfast')
  const [currentOrder, setCurrentOrder] = useState(null)
  const [showPrep, setShowPrep] = useState(false)

    const handleOrderConfirmed = (order) => {
    setCurrentOrder(order)
    setShowPrep(true)
  }

  const handleBackToOrder = () => {
    setShowPrep(false)
    setCurrentOrder(null)
  }


  return (
    <div className="app">
      <nav className="main-nav">
        <div className="nav-brand">Breakfast Demo</div>
        <div className="nav-links">
          <button
            className={activeSection === 'breakfast' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => { setActiveSection('breakfast'); setShowPrep(false) }}
          >
            Breakfast
          </button>
          <button
            className={activeSection === 'files' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveSection('files')}
          >
            File Upload
          </button>
        </div>
      </nav>

      <main className="main-content">
        {activeSection === 'breakfast' && (
          showPrep && currentOrder
            ? <BreakfastPrep order={currentOrder} onBack={handleBackToOrder} />
            : <BreakfastOrder onOrderConfirmed={handleOrderConfirmed} />
        )}
        {activeSection === 'files' && (
          <div className="card">
            <h2>File Upload</h2>
            <p>Coming soon...</p>
          </div>
        )}
      </main>
    </div>
  )
}
export default App