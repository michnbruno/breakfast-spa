import { useState, useEffect, useRef } from 'react'
import { WebPubSubClient } from '@azure/web-pubsub-client'
import config from './config'

function BreakfastPrep({ order, onBack }) {
  const [prepMode, setPrepMode] = useState('async')
  const [events, setEvents] = useState([])
  const [preparing, setPreparing] = useState(false)
  const [done, setDone] = useState(false)
  const clientRef = useRef(null)
  const eventsEndRef = useRef(null)

  useEffect(() => {
    connectToPubSub()
    return () => {
      if (clientRef.current) clientRef.current.stop()
    }
  }, [])

  useEffect(() => {
    eventsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [events])

  const connectToPubSub = async () => {
    try {
      const res = await fetch(`${config.apiBaseUrl}/api/BreakfastOrder/negotiate`)
      const { url } = await res.json()

      const client = new WebPubSubClient(url)
      clientRef.current = client

      client.on('server-message', (e) => {
        const text = e.message.data
        const isDone = text.includes('Breakfast is ready')
        addEvent(text, isDone ? 'done' : 'info')
        if (isDone) {
          setPreparing(false)
          setDone(true)
        }
      })

      await client.start()
    } catch (err) {
      addEvent('Could not connect to real-time service.', 'error')
    }
  }

  const addEvent = (text, type = 'info') => {
    setEvents(prev => [...prev, {
      id: Date.now() + Math.random(),
      text: text.replace(/<[^>]*>/g, ''),
      type,
      time: new Date().toLocaleTimeString()
    }])
  }

  const startPrep = async () => {
    setEvents([])
    setDone(false)
    setPreparing(true)

    const endpoints = {
      async: 'BreakfastAsynchronous',
      sync: 'BreakfastSynchronous',
      fireforget: 'BreakfastFireForget'
    }

    try {
      await fetch(`${config.apiBaseUrl}/api/${endpoints[prepMode]}`)
    } catch (err) {
      addEvent('Could not reach the kitchen.', 'error')
      setPreparing(false)
    }
  }

  const eventColor = (type) => {
    if (type === 'done') return '#065f46'
    if (type === 'error') return '#991b1b'
    return '#1e293b'
  }

  const eventBg = (type) => {
    if (type === 'done') return '#d1fae5'
    if (type === 'error') return '#fee2e2'
    return '#f8fafc'
  }

  return (
    <div className="card">
      <h2>Prepare My Breakfast</h2>
      <p style={{ color: '#64748b', marginBottom: '1.25rem' }}>
        Choose how the kitchen prepares your order and watch it happen in real time.
      </p>

      {/* Mode selector */}
      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
        <label className="form-label">Preparation method</label>
        <div className="radio-group" style={{ flexDirection: 'column', gap: '0.6rem' }}>

          <label className="radio-label" style={{ alignItems: 'flex-start', gap: '0.6rem' }}>
            <input
              type="radio"
              name="prepMode"
              value="async"
              checked={prepMode === 'async'}
              onChange={() => setPrepMode('async')}
              disabled={preparing}
            />
            <div>
              <div style={{ fontWeight: 500 }}>Asynchronous</div>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Eggs, bacon and toast cook simultaneously. Fastest — ~7 seconds.
              </div>
            </div>
          </label>

          <label className="radio-label" style={{ alignItems: 'flex-start', gap: '0.6rem' }}>
            <input
              type="radio"
              name="prepMode"
              value="sync"
              checked={prepMode === 'sync'}
              onChange={() => setPrepMode('sync')}
              disabled={preparing}
            />
            <div>
              <div style={{ fontWeight: 500 }}>Synchronous</div>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Each item cooked one at a time. Slower — ~14 seconds.
              </div>
            </div>
          </label>

          <label className="radio-label" style={{ alignItems: 'flex-start', gap: '0.6rem' }}>
            <input
              type="radio"
              name="prepMode"
              value="fireforget"
              checked={prepMode === 'fireforget'}
              onChange={() => setPrepMode('fireforget')}
              disabled={preparing}
            />
            <div>
              <div style={{ fontWeight: 500 }}>Fire and forget</div>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Kitchen starts immediately, API returns at once. Watch events arrive in background.
              </div>
            </div>
          </label>

        </div>
      </div>

      {/* Start button */}
      <button
        className="btn-primary"
        onClick={startPrep}
        disabled={preparing}
        style={{ marginBottom: '1.5rem' }}
      >
        {preparing ? 'Preparing...' : 'Start Preparation →'}
      </button>

      {/* Event panel */}
      {(events.length > 0 || preparing) && (
        <div style={{
          background: '#0f172a',
          borderRadius: '8px',
          padding: '1rem',
          minHeight: '160px',
          maxHeight: '320px',
          overflowY: 'auto'
        }}>
          <div style={{
            fontSize: '0.72rem',
            color: '#475569',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '0.75rem'
          }}>
            Kitchen events — live
          </div>

          {events.map(event => (
            <div key={event.id} style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
              marginBottom: '0.5rem',
              padding: '0.4rem 0.6rem',
              background: eventBg(event.type),
              borderRadius: '4px'
            }}>
              <span style={{
                fontSize: '0.72rem',
                color: '#64748b',
                whiteSpace: 'nowrap',
                marginTop: '1px'
              }}>
                {event.time}
              </span>
              <span style={{
                fontSize: '0.88rem',
                color: eventColor(event.type),
                fontWeight: event.type === 'done' ? 600 : 400
              }}>
                {event.text}
              </span>
            </div>
          ))}

          {preparing && (
            <div style={{
              display: 'flex',
              gap: '4px',
              alignItems: 'center',
              padding: '0.4rem 0.6rem'
            }}>
              <div style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: '#60a5fa',
                animation: 'pulse 1s infinite'
              }}/>
              <span style={{ fontSize: '0.82rem', color: '#475569' }}>
                Waiting for kitchen...
              </span>
            </div>
          )}

          <div ref={eventsEndRef}/>
        </div>
      )}

      {done && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: '#d1fae5',
          borderRadius: '6px',
          color: '#065f46',
          fontWeight: 500,
          fontSize: '0.95rem'
        }}>
          Breakfast is ready! Enjoy your meal.
        </div>
      )}

      <button
        className="btn-secondary"
        onClick={onBack}
        style={{ marginTop: '1rem' }}
      >
        ← Back to order
      </button>
    </div>
  )
}

export default BreakfastPrep