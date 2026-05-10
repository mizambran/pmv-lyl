// src/components/Login.jsx
import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
// Importamos los íconos del ojo para la contraseña
import { FiUser, FiLock, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  // Estado para controlar si la contraseña se ve como texto o con asteriscos
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const navegar = useNavigate();

  const manejarLogin = (e) => {
    e.preventDefault();
    if (usuario === import.meta.env.VITE_USER && password === import.meta.env.VITE_PASS) {
      navegar('/inicio');
    } else {
      // Alerta adaptada al modo oscuro
      Swal.fire({
        icon: 'error',
        title: 'Acceso Denegado',
        text: 'Usuario o contraseña incorrectos.',
        confirmButtonColor: '#3b82f6',
        background: '#1e1e1e',
        color: '#e0e0e0'
      });
    }
  };

  return (
    // Fondo general con el degradado y la imagen de gráficos
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundImage: `linear-gradient(rgba(4, 5, 5, 0.96), rgba(12, 11, 51, 0.8))`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <Container className="d-flex justify-content-center">
        {/* Tarjeta oscura con efecto Glassmorphism manteniendo tu tono azulado (#326f91 -> rgba(50, 111, 145, 0.6)) */}
        <Card style={{ 
          width: '100%', 
          maxWidth: '400px', 
          borderRadius: '20px', 
          border: '1px solid rgba(255, 255, 255, 0.15)', 
          backgroundColor: 'transparent', 
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 15px 35px rgba(0,0,0,0.5)' 
        }}>
          <Card.Body className="p-4 p-sm-5">
            <div className="text-center mb-4">
              {/* Tu logo */}
              <img src="/logo-lopez.png" alt="Lopez & Lopez Logo" style={{ maxWidth: '180px' }} />
            </div>

            <Form onSubmit={manejarLogin}>
              <Form.Group className="mb-3 position-relative">
                <FiUser className="position-absolute" style={{ top: '12px', left: '15px', color: '#a0a0a0', zIndex: 10 }} size={20} />
                {/* Input estilizado para modo oscuro con tus colores */}
                <Form.Control 
                  type="text" 
                  placeholder="Usuario" 
                  style={{ paddingLeft: '45px', borderRadius: '8px', backgroundColor: '#e1dbdb', color: '#111010', border: '1px solid #444' }}
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-4 position-relative">
                <FiLock className="position-absolute" style={{ top: '12px', left: '15px', color: '#a0a0a0', zIndex: 10 }} size={20} />
                <Form.Control 
                  // Alternamos el tipo de input según el estado
                  type={mostrarPassword ? "text" : "password"} 
                  placeholder="Contraseña" 
                  style={{ paddingLeft: '45px', paddingRight: '45px', borderRadius: '8px', backgroundColor: '#e1dbdb', color: '#111010', border: '1px solid #444444' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* Botón para alternar visibilidad de contraseña */}
                <div 
                  className="position-absolute" 
                  style={{ top: '8px', right: '15px', color: '#051b26', cursor: 'pointer', zIndex: 10 }} 
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                >
                  {mostrarPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </div>
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 d-flex justify-content-center align-items-center" style={{ borderRadius: '8px', padding: '10px', backgroundColor: '#11305f', border: 'none', fontWeight: 'bold' }}>
                <FiLogIn className="me-2" size={20} /> Ingresar
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Login;