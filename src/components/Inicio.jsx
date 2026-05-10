// src/components/Inicio.jsx
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useOutletContext } from 'react-router-dom'; // Hook para recibir datos del Layout
import { datosFiscales } from '../data/datosPrueba';

const Inicio = () => {
  // Recibimos los filtros globales
  const { anio, meses } = useOutletContext();

  // Filtramos los datos según el año y los meses seleccionados
  const datosFiltrados = datosFiscales.filter((dato) => {
    const [mesDato, anioDato] = dato.periodo.split('/');
    return anioDato === anio && meses.includes(mesDato);
  });

  // Calculamos los totales para las tarjetas sumando los meses filtrados
  const totalVentas = datosFiltrados.reduce((acc, curr) => acc + curr.ventasNetasGravadas, 0);
  
  // Para las presiones, calculamos un promedio simple de los meses seleccionados (si hay datos)
  const promedio = (clave) => {
    if (datosFiltrados.length === 0) return 0;
    const suma = datosFiltrados.reduce((acc, curr) => acc + curr[clave], 0);
    return (suma / datosFiltrados.length).toFixed(2);
  };

  // Estilo reutilizable para las tarjetas en modo oscuro
  const estiloTarjeta = { backgroundColor: '#1e1e1e', color: '#fff', borderRadius: '12px' };

  return (
    <Container className="pt-3 pb-4">
      <h5 className="mb-4" style={{ color: '#3b82f6', fontWeight: 'bold' }}>Resumen Fiscal Acumulado</h5>

      {/* Tarjetas en Grid 2x2 para evitar el scroll */}
      <Row className="g-3 mb-4">
        <Col xs={6}>
          <Card className="border-0 shadow-sm h-100" style={{ ...estiloTarjeta, borderLeft: '4px solid #3b82f6' }}>
            <Card.Body className="p-3">
              <div style={{ fontSize: '0.70rem', color: '#a0a0a0', marginBottom: '5px' }}>Ventas Netas Totales</div>
              <h6 className="mb-0 fw-bold">${totalVentas.toLocaleString('es-AR')}</h6>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6}>
          <Card className="border-0 shadow-sm h-100" style={{ ...estiloTarjeta, borderLeft: '4px solid #0dcaf0' }}>
            <Card.Body className="p-3">
              <div style={{ fontSize: '0.70rem', color: '#a0a0a0', marginBottom: '5px' }}>Presión IVA Promedio</div>
              <h6 className="mb-0 fw-bold">{promedio('presionIva')}%</h6>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6}>
          <Card className="border-0 shadow-sm h-100" style={{ ...estiloTarjeta, borderLeft: '4px solid #ffc107' }}>
            <Card.Body className="p-3">
              <div style={{ fontSize: '0.70rem', color: '#a0a0a0', marginBottom: '5px' }}>Presión IIBB Promedio</div>
              <h6 className="mb-0 fw-bold">{promedio('presionIibb')}%</h6>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6}>
          <Card className="border-0 shadow-sm h-100" style={{ ...estiloTarjeta, borderLeft: '4px solid #fd7e14' }}>
            <Card.Body className="p-3">
              <div style={{ fontSize: '0.70rem', color: '#a0a0a0', marginBottom: '5px' }}>Presión Banco Prom.</div>
              <h6 className="mb-0 fw-bold">{promedio('presionBancaria')}%</h6>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gráfico Evolutivo */}
      <Row>
        <Col xs={12}>
          <Card className="border-0 shadow-sm" style={estiloTarjeta}>
            <Card.Body className="p-3">
              <h6 className="mb-3" style={{ color: '#e0e0e0', fontSize: '0.9rem' }}>Evolución - Presión Fiscal Total (%)</h6>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  {/* Se le pasan solo los datos que superaron el filtro */}
                  <LineChart data={datosFiltrados} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                    <XAxis dataKey="periodo" tick={{fontSize: 10, fill: '#a0a0a0'}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fontSize: 10, fill: '#a0a0a0'}} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#2d2d2d', border: 'none', color: '#fff', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="presionFiscalTotal" name="Presión Total %" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Inicio;