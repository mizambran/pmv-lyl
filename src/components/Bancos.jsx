// src/components/Bancos.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Modal, Button } from 'react-bootstrap';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useOutletContext } from 'react-router-dom';
import { datosBancos } from '../data/datosPrueba';

// Función personalizada para dibujar el porcentaje dentro de las porciones del gráfico
const renderizarPorcentaje = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  // Si el banco tiene 0%, no mostramos la etiqueta para que no se superpongan
  if (percent === 0) return null;

  const RADIAN = Math.PI / 180;
  // Calculamos la posición exacta en el medio del grosor de la "dona"
  const radio = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radio * Math.cos(-midAngle * RADIAN);
  const y = cy + radio * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="#ffffff" // Texto blanco para que resalte sobre el color
      textAnchor="middle" 
      dominantBaseline="central" 
      fontSize="12px" 
      fontWeight="bold"
    >
      {/* Multiplicamos por 100 y le quitamos los decimales */}
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Bancos = () => {
  // Recibimos los filtros globales (Año y Meses) del Layout
  const { anio, meses } = useOutletContext();
  
  // Estado para el modal de Carga Banco
  const [mostrarModal, setMostrarModal] = useState(false);

  // Filtramos los datos igual que en las otras vistas
  const datosFiltrados = datosBancos.filter((dato) => {
    const [mesDato, anioDato] = dato.periodo.split('/');
    return anioDato === anio && meses.includes(mesDato);
  });

  // Sumatorias para las tarjetas según el filtro
  const totalMovimientos = datosFiltrados.reduce((acc, curr) => acc + (curr.movimientos || 0), 0);
  const totalImpDebCre = datosFiltrados.reduce((acc, curr) => acc + (curr.impDebCre || 0), 0);
  const totalRetArba = datosFiltrados.reduce((acc, curr) => acc + (curr.retArba || 0), 0);
  
  // Carga Banco es la suma de los impuestos y retenciones
  const totalCargaBanco = totalImpDebCre + totalRetArba;

  // Sumatorias por banco para alimentar el gráfico de torta
  const totalPatagonia = datosFiltrados.reduce((acc, curr) => acc + (curr.patagonia || 0), 0);
  const totalGalicia = datosFiltrados.reduce((acc, curr) => acc + (curr.galicia || 0), 0);

  // Armamos el array dinámico para Recharts en base a lo filtrado
  const datosParaGraficoTorta = [
    { nombre: 'Banco Patagonia', valor: totalPatagonia },
    { nombre: 'Banco Galicia', valor: totalGalicia }
  ];

  const COLORES = ['#3b82f6', '#fd7e14']; // Azul y Naranja
  const estiloTarjeta = { backgroundColor: '#1e1e1e', color: '#fff', borderRadius: '12px' };

  return (
    <Container className="pt-3 pb-4">
      <h5 className="mb-4" style={{ color: '#3b82f6', fontWeight: 'bold' }}>Carga Bancaria Acumulada</h5>

      {/* Grid con 2 Tarjetas */}
      <Row className="g-3 mb-4">
        {/* Tarjeta 1: Movimientos */}
        <Col xs={6}>
          <Card className="border-0 shadow-sm h-100" style={{ ...estiloTarjeta, borderLeft: '4px solid #6c757d' }}>
            <Card.Body className="p-3">
              <div style={{ fontSize: '0.70rem', color: '#a0a0a0' }}>Movimientos</div>
              <h6 className="mb-0 fw-bold">${totalMovimientos.toLocaleString('es-AR')}</h6>
            </Card.Body>
          </Card>
        </Col>

        {/* Tarjeta 2: Carga Banco (Abre Modal) */}
        <Col xs={6}>
          <Card 
            className="border-0 shadow-sm h-100" 
            style={{ ...estiloTarjeta, borderLeft: '4px solid #dc3545', cursor: 'pointer' }}
            onClick={() => setMostrarModal(true)}
          >
            <Card.Body className="p-3">
              <div style={{ fontSize: '0.70rem', color: '#a0a0a0' }}>Carga Bancos (Ver detalle) <span style={{fontSize:'0.6rem'}}>👆</span></div>
              <h6 className="mb-0 fw-bold">${totalCargaBanco.toLocaleString('es-AR')}</h6>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gráfico de Torta: Distribución de la Carga por Banco */}
      <Row className="mt-2">
        <Col xs={12}>
          <Card className="border-0 shadow-sm" style={estiloTarjeta}>
            <Card.Body className="p-3">
              <h6 className="mb-3" style={{ color: '#e0e0e0', textAlign: 'center', fontSize: '0.9rem' }}>
                Distribución de Carga por Banco
              </h6>
              
              {/* Añadimos minHeight para evitar el warning de Recharts en consola */}
              <div style={{ width: '100%', height: 300, minHeight: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={datosParaGraficoTorta}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="valor"
                      nameKey="nombre" // <-- Esto arregla la leyenda para que diga el nombre del banco
                      labelLine={false} // Oculta la línea gris exterior
                      label={renderizarPorcentaje} // <-- Llama a nuestra función matemática para los %
                    >
                      {datosParaGraficoTorta.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORES[index % COLORES.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(valor) => `$${valor.toLocaleString('es-AR')}`}
                      contentStyle={{ backgroundColor: '#2d2d2d', border: 'none', color: '#fff', borderRadius: '8px' }}
                    />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: '#a0a0a0' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal Oscuro para el Detalle de Carga Banco */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
        <Modal.Header closeButton closeVariant="white" style={{ backgroundColor: '#1e1e1e', color: '#fff', borderBottom: '1px solid #333' }}>
          <Modal.Title style={{ fontSize: '1.1rem' }}>Detalle de Carga Bancaria</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#1e1e1e', color: '#e0e0e0' }}>
          <div className="d-flex justify-content-between mb-2">
            <span>Impuesto Déb/Créd:</span>
            <strong>${totalImpDebCre.toLocaleString('es-AR')}</strong>
          </div>
          <div className="d-flex justify-content-between mb-3">
            <span>Retenciones ARBA:</span>
            <strong>${totalRetArba.toLocaleString('es-AR')}</strong>
          </div>
          <hr style={{ borderColor: '#333' }} />
          <div className="d-flex justify-content-between text-danger">
            <span><strong>Carga Total:</strong></span>
            <strong>${totalCargaBanco.toLocaleString('es-AR')}</strong>
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

export default Bancos;