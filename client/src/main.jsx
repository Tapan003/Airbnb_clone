import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { StripeProvider } from './contexts/StripeContexts.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StripeProvider>
      <App />
    </StripeProvider>
  </StrictMode>,
)
