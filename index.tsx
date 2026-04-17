
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("Iniciando dashboard Maple Bear - Bear Lead...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("ERRO: Elemento 'root' não encontrado no HTML.");
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
