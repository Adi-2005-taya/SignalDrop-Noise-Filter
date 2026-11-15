import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Auto-repair any corrupted group name in client storage
try {
  const item = localStorage.getItem('signaldrop_current_data');
  if (item) {
    const parsed = JSON.parse(item);
    if (parsed.groupName && (parsed.groupName.includes('\n') || parsed.groupName.startsWith('[') || parsed.groupName.length > 50)) {
      parsed.groupName = 'Imported WhatsApp Group';
      localStorage.setItem('signaldrop_current_data', JSON.stringify(parsed));
    }
  }
} catch (e) {}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

