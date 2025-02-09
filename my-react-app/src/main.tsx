import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from './store.ts';
import './index.css'
import App from './App.tsx'
import { BasketProvider } from './context/BasketProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BasketProvider>
        <App />
      </BasketProvider>
      <Toaster/>
    </Provider>
  </StrictMode>,
)
