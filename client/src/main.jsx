import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './context.jsx'
import { UserProvider } from './contexts/UserContext.jsx'
import { BrowserRouter } from 'react-router-dom'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)
