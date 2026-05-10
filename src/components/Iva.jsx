// src/components/Iva.jsx
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useOutletContext } from 'react-router-dom';
import { datosIva } from '../data/datosPrueba';

const Iva = () => {
  const { anio, meses } = useOutletContext();

  const datosFiltrados = datosIva.filter((dato) => {
    const [mesDato, anioDato] = dato.periodo.split('/');
    return anioDato === anio && meses.includes(mesDato);
  });

  const totalDebito = datosFiltrados.reduce((acc, curr) => acc + curr.ivaDebito, 0);
  const totalCredito = datosFiltrados.reduce((acc, curr) => acc + curr.ivaCredito, 0);
  const totalPagado = datosFiltrados.reduce((acc, curr) => acc + curr.ivaPagado, 0);

  const estiloTarjeta = { backgroundColor: '#1e1e1e', color: '#fff', borderRadius: '12px' };

  return (
    <Container className="pt-3 pb-4">
      <h5 className="mb-4" style={{ color: '#3b82f6', fontWeight: 'bold' }}>Detalle de IVA Acumulado</h5>

      <Row className="g-3 mb-4">
        <Col xs={12}>
          <Card className="border-0 shadow-sm" style={{ ...estiloTarjeta, borderLeft: '4px solid #3b82f6' }}>
            <Card.Body className="p-3 d-flex justify-content-between align-items-center">
              <div>
                <div style={{ fontSize: '0.75rem', color: '#a0a0a0' }}>IVA Final Pagado</div>
                <h5 className="mb-0 fw-bold">${totalPagado.toLocaleString('es-AR')}</h5>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6}>
          <Card className="border-0 shadow-sm h-100" style={{ ...estiloTarjeta, borderLeft: '4px solid #dc3545' }}>
            <Card.Body className="p-3">
              <div style={{ fontSize: '0.70rem', color: '#a0a0a0' }}>Débito (Ventas)</div>
              <h6 className="mb-0 fw-bold">${totalDebito.toLocaleString('es-AR')}</h6>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6}>
          <Card className="border-0 shadow-sm h-100" style={{ ...estiloTarjeta, borderLeft: '4px solid #198754' }}>
            <Card.Body className="p-3">
              <div style={{ fontSize: '0.70rem', color: '#a0a0a0' }}>Crédito (Compras)</div>
              <h6 className="mb-0 fw-bold">${totalCredito.toLocaleString('es-AR')}</h6>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gráfico 1: Débito vs Crédito (Barras) */}
      <Row className="mb-4">
        <Col xs={12}>
          <Card className="border-0 shadow-sm" style={estiloTarjeta}>
            <Card.Body className="p-3">
              <h6 className="mb-3" style={{ color: '#e0e0e0', fontSize: '0.9rem' }}>Relación - Débito vs Crédito</h6>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <BarChart data={datosFiltrados} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                    <XAxis dataKey="periodo" tick={{fontSize: 10, fill: '#a0a0a0'}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fontSize: 10, fill: '#a0a0a0'}} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000000}M`} />
                    <Tooltip 
                    contentStyle={{ backgroundColor: '#2d2d2d', border: 'none', color: '#fff', borderRadius: '8px' }}
                    formatter={(value) => value.toLocaleString('es-AR')}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', color: '#a0a0a0' }} />
                    <Bar dataKey="ivaDebito" name="IVA Débito" fill="#dc3545" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="ivaCredito" name="IVA Crédito" fill="#198754" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gráfico 2: Ventas vs Compras (Líneas) */}
      <Row>
        <Col xs={12}>
          <Card className="border-0 shadow-sm" style={estiloTarjeta}>
            <Card.Body className="p-3">
              <h6 className="mb-3" style={{ color: '#e0e0e0', fontSize: '0.9rem' }}>Evolución - Ventas vs Compras</h6>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <LineChart data={datosFiltrados} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                    <XAxis dataKey="periodo" tick={{fontSize: 10, fill: '#a0a0a0'}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fontSize: 10, fill: '#a0a0a0'}} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000000}M`} />
                    <Tooltip
                     contentStyle={{ backgroundColor: '#2d2d2d', border: 'none', color: '#fff', borderRadius: '8px' }}
                     formatter={(value) => value.toLocaleString('es-AR')}
                     />
                    <Legend wrapperStyle={{ fontSize: '12px', color: '#a0a0a0' }} />
                    <Line type="monotone" dataKey="ventasNetas" name="Ventas Netas" stroke="#dc3545" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="comprasNetas" name="Compras Netas" stroke="#198754" strokeWidth={3} dot={false} />
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

export default Iva;