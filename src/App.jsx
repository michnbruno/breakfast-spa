import { useState } from 'react'
import './App.css'
import BreakfastOrder from './BreakfastOrder'
import BreakfastPrep from './BreakfastPrep'

const DEFAULT_ORDER = {
  orderId: 'DEFAULT',
  drink: 'coffee',
  coffeeType: 'regular',
  eggs: 'scrambled',
  meat: 'bacon',
  toast: true,
  juice: 'none',
  notes: '',
  estimatedTime: '8-15 minutes'
}

const SWAGGER_URL = 'https://breakfast-demo-api-hnekdkgmfed6dxa7.eastus-01.azurewebsites.net/swagger'

function App() {
  const [activeView, setActiveView] = useState('order')
  const [currentOrder, setCurrentOrder] = useState(DEFAULT_ORDER)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigate = (view) => {
    setActiveView(view)
    setSidebarOpen(false)
  }

  const handleOrderConfirmed = (order) => {
    setCurrentOrder(order)
    navigate('prep')
  }

  return (
    <div className="app">

      <div className="topbar">
        <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
        <span className="topbar-title">Breakfast Demo</span>
      </div>

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">🍳 Breakfast Demo</div>
          <div className="sidebar-sub">Azure · React · .NET 8</div>
        </div>

        <div className="sidebar-nav">

          <div className="nav-group">
            <div className="nav-group-label">Breakfast</div>
            <button
              className={`nav-item ${activeView === 'order' ? 'active' : ''}`}
              onClick={() => navigate('order')}
            >
              <span className="nav-icon">📋</span>
              Order Breakfast
            </button>
            <button
              className={`nav-item ${activeView === 'prep' ? 'active' : ''}`}
              onClick={() => navigate('prep')}
            >
              <span className="nav-icon">🍳</span>
              Prepare Breakfast
            </button>
          </div>

          <div className="nav-group">
            <div className="nav-group-label">File Upload</div>
            <button
              className={`nav-item ${activeView === 'upload' ? 'active' : ''}`}
              onClick={() => navigate('upload')}
            >
              <span className="nav-icon">📁</span>
              Upload a File
            </button>
          </div>

          <div className="nav-group">
            <div className="nav-group-label">API Reference</div>
            <a
              className="nav-item nav-external"
              href={SWAGGER_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-icon">⚡</span>
              Swagger Docs
              <span className="nav-ext-icon">↗</span>
            </a>
          </div>

        </div>

        <div className="sidebar-footer">
          <a href="https://mbruno-projects.com" className="sidebar-portfolio-link">
            ← mbruno-projects.com
          </a>
        </div>
      </nav>

      <main className="main-content">
        {activeView === 'order' && (
          <BreakfastOrder onOrderConfirmed={handleOrderConfirmed} />
        )}
        {activeView === 'prep' && (
          <BreakfastPrep
            order={currentOrder}
            onBack={() => navigate('order')}
            isDefault={currentOrder.orderId === 'DEFAULT'}
          />
        )}
        {activeView === 'upload' && (
          <div className="card">
            <h2>📁 File Upload</h2>
            <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
              Upload images or PDFs — the API detects the file type, returns size and processing time.
            </p>
            <div style={{
              marginTop: '1.5rem',
              padding: '2rem',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '2px dashed #e2e8f0',
              textAlign: 'center',
              color: '#94a3b8',
              fontSize: '0.95rem'
            }}>
              Coming soon — P2 backend in progress
            </div>
          </div>
        )}
      </main>

    </div>
  )
}

export default App