// src/components/Layout.jsx
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiFileText, FiTrendingUp, FiCreditCard, FiLogOut } from 'react-icons/fi';
import { FaBalanceScale} from 'react-icons/fa';
import { BsBank } from 'react-icons/bs';
import { TbReceiptTax } from 'react-icons/tb';
import { Navbar, Container, Nav, Form, Dropdown, Button } from 'react-bootstrap';

const Layout = () => {
  const navegar = useNavigate();
  // Estado para el año
  const [anio, setAnio] = useState("2025");
  // Estado para los meses (por defecto todos seleccionados)
  const todosLosMeses = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const [meses, setMeses] = useState(todosLosMeses);

  const nombresMeses = {
    "01": "Enero", "02": "Febrero", "03": "Marzo", "04": "Abril",
    "05": "Mayo", "06": "Junio", "07": "Julio", "08": "Agosto",
    "09": "Septiembre", "10": "Octubre", "11": "Noviembre", "12": "Diciembre"
  };
  // Maneja el clic en "Cerrar sesión"
  const manejarCierreSesion = () => {
    navegar('/');
  };

  // Maneja la selección de un mes individual
  const manejarCambioMes = (mes) => {
    if (meses.includes(mes)) {
      setMeses(meses.filter(m => m !== mes)); // Lo quita si ya estaba
    } else {
      setMeses([...meses, mes]); // Lo agrega si no estaba
    }
  };

  // Maneja el checkbox de "Todos"
  const manejarTodosLosMeses = () => {
    if (meses.length === 12) {
      setMeses([]); // Desmarca todos
    } else {
      setMeses(todosLosMeses); // Marca todos
    }
  };

  return (
    // Fondo oscuro general
    <div style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#e0e0e0', paddingBottom: '70px', paddingTop: '60px' }}>
      
      {/* TopBar: Contiene el título, filtros y botón de salida */}
      <Navbar fixed="top" style={{ backgroundColor: '#1e1e1e', borderBottom: '1px solid #333' }} className="shadow-sm">
        <Container fluid className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            {/* Filtro de Año */}
            <Form.Select 
              size="sm"
              value={anio} 
              onChange={(e) => setAnio(e.target.value)}
              style={{ backgroundColor: '#2d2d2d', color: '#fff', border: 'none', width: 'auto' }}
            >
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </Form.Select>

            {/* Filtro Múltiple de Meses usando un Dropdown */}
            <Dropdown>
              <Dropdown.Toggle size="sm" variant="dark" style={{ backgroundColor: '#2d2d2d', border: 'none' }}>
                Meses ({meses.length})
              </Dropdown.Toggle>
              <Dropdown.Menu variant="dark" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <div className="px-3 py-1">
                  <Form.Check 
                    type="checkbox" 
                    label="Seleccionar Todos" 
                    checked={meses.length === 12} 
                    onChange={manejarTodosLosMeses} 
                  />
                  <hr className="my-2" />
                  {todosLosMeses.map((m) => (
                    <Form.Check 
                      key={m}
                      type="checkbox" 
                      label={nombresMeses[m]} 
                      checked={meses.includes(m)} 
                      onChange={() => manejarCambioMes(m)} 
                    />
                  ))}
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {/* Botón Cerrar Sesión */}
          <Button variant="link" onClick={manejarCierreSesion} style={{ color: '#dc3545', padding: 0 }}>
            <FiLogOut size={22} />
          </Button>
        </Container>
      </Navbar>

      <div className="contenido-principal">
        {/* Pasamos los filtros a las vistas hijas a través del context */}
        <Outlet context={{ anio, meses }} />
      </div>

      {/* NavBar Inferior (Modo Oscuro) */}
      <Navbar fixed="bottom" style={{ backgroundColor: '#1e1e1e', borderTop: '1px solid #333' }} className="shadow-lg">
        <Container fluid className="d-flex justify-content-around px-0">
          <Nav.Link as={NavLink} to="/inicio" className="text-center d-flex flex-column align-items-center" style={({isActive}) => ({ color: isActive ? '#3b82f6' : '#6c757d', textDecoration: 'none' })}>
            <FiHome size={24} />
            <span style={{ fontSize: '0.75rem', marginTop: '2px' }}>Inicio</span>
          </Nav.Link>
          <Nav.Link as={NavLink} to="/iva" className="text-center d-flex flex-column align-items-center" style={({isActive}) => ({ color: isActive ? '#3b82f6' : '#6c757d', textDecoration: 'none' })}>
            <FaBalanceScale size={24} />
            <span style={{ fontSize: '0.75rem', marginTop: '2px' }}>IVA</span>
          </Nav.Link>
          <Nav.Link as={NavLink} to="/iibb" className="text-center d-flex flex-column align-items-center" style={({isActive}) => ({ color: isActive ? '#3b82f6' : '#6c757d', textDecoration: 'none' })}>
            <TbReceiptTax size={24} />
            <span style={{ fontSize: '0.75rem', marginTop: '2px' }}>IIBB</span>
          </Nav.Link>
          <Nav.Link as={NavLink} to="/bancos" className="text-center d-flex flex-column align-items-center" style={({isActive}) => ({ color: isActive ? '#3b82f6' : '#6c757d', textDecoration: 'none' })}>
            <BsBank size={24} />
            <span style={{ fontSize: '0.75rem', marginTop: '2px' }}>Bancos</span>
          </Nav.Link>
        </Container>
      </Navbar>
    </div>
  );
};

export default Layout;