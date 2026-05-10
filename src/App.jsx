// Importamos React
import React from 'react';
// Importamos los componentes de enrutamiento
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importamos nuestras vistas
import Login from './components/Login';
import Layout from './components/Layout';
import Inicio from './components/Inicio';

import Iva from './components/Iva';
import Iibb from './components/Iibb';
import Bancos from './components/Bancos';


function App() {
  return (
    // BrowserRouter envuelve toda la aplicación para habilitar la navegación
    <BrowserRouter>
      <Routes>
        
        {/* Ruta pública para el Login */}
        <Route path="/" element={<Login />} />

        {/* Rutas privadas envueltas en el Layout (molde con navbar) */}
        <Route element={<Layout />}>
          {/* Si navegamos a /inicio, cargamos el componente Inicio */}
          <Route path="/inicio" element={<Inicio />} />
          
          {/* Dejamos preparadas las rutas para las siguientes vistas (por ahora redirigen a inicio) */}
          {/* 2. Reemplazamos el Navigate por el componente Iva real */}
          <Route path="/iva" element={<Iva />} />
          <Route path="/iibb" element={<Iibb />} />
          <Route path="/bancos" element={<Bancos />} />
        </Route>

        {/* Ruta comodín: si el usuario escribe una URL que no existe, lo mandamos al Login */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;