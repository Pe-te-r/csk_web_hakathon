import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from './store.ts';
import './index.css'
import App from './App.tsx'
import { BasketProvider } from './components/context/BasketProvider.tsx';
import { UserProvider } from './components/context/UserProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <UserProvider>
      <BasketProvider>
        <App />
      <Toaster/>
      </BasketProvider>
      </UserProvider>
    </Provider>
  </StrictMode>,
)
