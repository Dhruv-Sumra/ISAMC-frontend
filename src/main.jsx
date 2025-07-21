import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react';
import { GalleryProvider } from './store/GalleryContext.jsx';

createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain="dev-wplzooyqy4teep8u.us.auth0.com"
    clientId="vzZRB6gCjgSRXCFxNt4PWgk3Fl6YuGI4"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <GalleryProvider>
      <App />
    </GalleryProvider>
  </Auth0Provider>,
)
