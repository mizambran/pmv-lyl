// src/components/Iibb.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Modal, Button } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useOutletContext } from 'react-router-dom';
import { datosIibb } from '../data/datosPrueba';

const Iibb = () => {
  const { anio, meses } = useOutletContext();
  
  // Estado para controlar si el modal está abierto o cerrado
  const [mostrarModal, setMostrarModal] = useState(false);

  const datosFiltrados = datosIibb.filter((dato) => {
    const [mesDato, anioDato] = dato.periodo.split('/');
    return anioDato === anio && meses.includes(mesDato);
  });

  // Cálculos Acumulados
  const totalBase = datosFiltrados.reduce((acc, curr) => acc + (curr.baseGravada || 0), 0);
  const totalImpuesto = datosFiltrados.reduce((acc, curr) => acc + curr.iibbDeterminado, 0);
  
  // Detalle del Crédito
  const totalRetenciones = datosFiltrados.reduce((acc, curr) => acc + curr.retenciones, 0);
  const totalPercepciones = datosFiltrados.reduce((acc, curr) => acc + curr.percepciones, 0);
  const totalSircreb = datosFiltrados.reduce((acc, curr) => acc + curr.sircreb, 0);
  
  // Crédito Total = Retenciones + Percepciones + Sircreb
  const totalCredito = totalRetenciones + totalPercepciones + totalSircreb;
  
  // Saldo Estimado = Impuesto Determinado - Crédito Total
  const saldoEstimado = totalImpuesto - totalCredito;

  const estiloTarjeta = { backgroundColor: '#1e1e1e', color: '#fff', borderRadius: '12px' };

  return (
    <Container className="pt-3 pb-4">
      <h5 className="mb-4" style={{ color: '#3b82f6', fontWeight: 'bold' }}>Detalle de Ingresos Brutos</h5>

      {/* Grid 2x2 para las 4 tarjetas solicitadas */}
      <Row className="g-3 mb-4">
        <Col xs={6}>
          <Card className="border-0 shadow-sm h-100" style={{ ...estiloTarjeta, borderLeft: '4px solid #6c757d' }}>
            <Card.Body className="p-3">
              <div style={{ fontSize: '0.70rem', color: '#a0a0a0' }}>Base Gravada</div>
              <h6 className="mb-0 fw-bold">${totalBase.toLocaleString('es-AR')}</h6>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6}>
          <Card className="border-0 shadow-sm h-100" style={{ ...estiloTarjeta, borderLeft: '4px solid #dc3545' }}>
            <Card.Body className="p-3">
              <div style={{ fontSize: '0.70rem', color: '#a0a0a0' }}>Impuesto Determinado</div>
              <h6 className="mb-0 fw-bold">${totalImpuesto.toLocaleString('es-AR')}</h6>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Tarjeta de Crédito (Clickeable) */}
        <Col xs={6}>
          <Card 
            className="border-0 shadow-sm h-100" 
            style={{ ...estiloTarjeta, borderLeft: '4px solid #198754', cursor: 'pointer' }}
            onClick={() => setMostrarModal(true)} // Abre el modal al hacer clic
          >
            <Card.Body className="p-3">
              <div style={{ fontSize: '0.70rem', color: '#a0a0a0' }}>Crédito (Ver detalle) <span style={{fontSize:'0.6rem'}}>👆</span></div>
              <h6 className="mb-0 fw-bold">${totalCredito.toLocaleString('es-AR')}</h6>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={6}>
          <Card className="border-0 shadow-sm h-100" style={{ ...estiloTarjeta, borderLeft: '4px solid #3b82f6' }}>
            <Card.Body className="p-3">
              <div style={{ fontSize: '0.70rem', color: '#a0a0a0' }}>Saldo Estimado</div>
              <h6 className="mb-0 fw-bold">${saldoEstimado.toLocaleString('es-AR')}</h6>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gráfico de Líneas de IIBB Pagado */}
      <Row>
        <Col xs={12}>
          <Card className="border-0 shadow-sm" style={estiloTarjeta}>
            <Card.Body className="p-3">
              <h6 className="mb-3" style={{ color: '#e0e0e0', fontSize: '0.9rem' }}>Evolución - IIBB Pagado</h6>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <LineChart data={datosFiltrados} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                    <XAxis dataKey="periodo" tick={{fontSize: 10, fill: '#a0a0a0'}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fontSize: 10, fill: '#a0a0a0'}} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000000}M`} />
                    <Tooltip contentStyle={{ backgroundColor: '#2d2d2d', border: 'none', color: '#fff', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="iibbPagado" name="Pagado" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal para el Detalle del Crédito (Estilo Oscuro) */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
        <Modal.Header closeButton closeVariant="white" style={{ backgroundColor: '#1e1e1e', color: '#fff', borderBottom: '1px solid #333' }}>
          <Modal.Title style={{ fontSize: '1.1rem' }}>Composición del Crédito</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#1e1e1e', color: '#e0e0e0' }}>
          <div className="d-flex justify-content-between mb-2">
            <span>Retenciones:</span>
            <strong>${totalRetenciones.toLocaleString('es-AR')}</strong>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Percepciones:</span>
            <strong>${totalPercepciones.toLocaleString('es-AR')}</strong>
          </div>
          <div className="d-flex justify-content-between mb-3">
            <span>SIRCREB:</span>
            <strong>${totalSircreb.toLocaleString('es-AR')}</strong>
          </div>
          <hr style={{ borderColor: '#333' }} />
          <div className="d-flex justify-content-between text-success">
            <span><strong>Total:</strong></span>
            <strong>${totalCredito.toLocaleString('es-AR')}</strong>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#1e1e1e', borderTop: '1px solid #333' }}>
          <Button variant="danger" size="sm" onClick={() => setMostrarModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default Iibb;