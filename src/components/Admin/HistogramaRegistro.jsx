import React, { useEffect, useRef, useState } from 'react';
import { getFirestore, collection, getDocs, Timestamp, query, where } from 'firebase/firestore';
import Chart from 'chart.js/auto';

function HistogramaRegistro() {
  const [registroData, setRegistroData] = useState([]);
  const [loginHistoryData, setLoginHistoryData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Inicializar con el mes actual
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const firestore = getFirestore();
        const usuariosRef = collection(firestore, 'usuarios');
        const usuariosSnapshot = await getDocs(usuariosRef);
        const registros = usuariosSnapshot.docs.map(doc => doc.data().registrationDate);
        setRegistroData(registros);

        // Obtener datos de inicio de sesión
        const loginHistoryRef = collection(firestore, 'loginHistory');
        const loginHistorySnapshot = await getDocs(loginHistoryRef);
        const loginHistory = loginHistorySnapshot.docs.map(doc => doc.data().timestamp);
        setLoginHistoryData(loginHistory);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy(); // Destruir el gráfico existente
      }

      const ctx = chartRef.current.getContext('2d');
      const fechasLabels = {};

      // Obtener el número de días en el mes seleccionado
      const daysInMonth = new Date(new Date().getFullYear(), selectedMonth, 0).getDate();

      // Inicializar los contadores para todos los días del mes
      for (let i = 1; i <= daysInMonth; i++) {
        fechasLabels[`${i}/${selectedMonth}/${new Date().getFullYear()}`] = { registro: 0, loginHistory: 0 };
      }

      // Contar el número de registros para cada día en registrationDate
      registroData.forEach(timestamp => {
        const date = new Date(timestamp);
        const key = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        if (fechasLabels[key]) {
          fechasLabels[key].registro++;
        }
      });

      // Contar el número de registros para cada día en loginHistoryData
      loginHistoryData.forEach(timestamp => {
        const date = new Date(timestamp);
        const key = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        if (fechasLabels[key]) {
          fechasLabels[key].loginHistory++;
        }
      });

      const fechas = Object.keys(fechasLabels);
      const registros = fechas.map((key) => fechasLabels[key].registro);
      const loginHistory = fechas.map((key) => fechasLabels[key].loginHistory);

      chartRef.current.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: fechas,
          datasets: [
            {
              label: 'Registro',
              data: registros,
              borderColor: 'rgba(65, 211, 60, 1)', // Cambiamos el color a verde
              backgroundColor: 'rgba(29, 229, 23, 0.2)', // Agregamos un color de fondo
              borderWidth: 2,
              pointRadius: 5, // Aumentamos el tamaño de los puntos marcadores
              pointBackgroundColor: 'rgba(58, 229, 52, 1)', // Color de los puntos marcadores
              fill: true, // Rellenar área bajo la línea
            },
            {
              label: 'Inicio de Sesión',
              data: loginHistory,
              borderColor: 'rgba(38, 59, 227, 1)', // Color azul para la línea de Inicio de Sesión
              backgroundColor: 'rgba(89, 102, 199, 0.2)',
              borderWidth: 2,
              pointRadius: 5,
              pointBackgroundColor: 'rgba(54, 162, 235, 1)',
              fill: true,
            }
          ]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Registro e Inicio de Sesión',
              font: {
                size: 18,
                weight: 'bold'
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += context.parsed.y;
                  }
                  return label;
                }
              }
            },
            legend: {
              labels: {
                font: {
                  size: 14
                }
              },
              position: 'bottom'
            }
          },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Día',
                  font: {
                    size: 14
                  }
                },
                ticks: {
                  callback: function(value) {
                    // Verificar si el valor es una cadena
                    if (typeof value === 'string') {
                      // Formatear el valor para mostrar solo el día
                      return value.split('/')[0];
                    } else {
                      return value;
                    }
                  }
                }
              },
            y: {
              title: {
                display: true,
                text: 'Número de Registros',
                font: {
                  size: 14
                }
              },
              beginAtZero: true
            }
          }
        }
      });
    }
  }, [registroData, loginHistoryData, selectedMonth]);

  const handleMonthChange = async (month) => {
    try {
      const firestore = getFirestore();
      const usuariosRef = collection(firestore, 'usuarios');
      const startOfMonth = new Date(new Date().getFullYear(), month - 1, 1);
      const endOfMonth = new Date(new Date().getFullYear(), month, 0);
      const q = query(
        usuariosRef,
        where('registrationDate', '>=', Timestamp.fromDate(startOfMonth)),
        where('registrationDate', '<', Timestamp.fromDate(endOfMonth))
      );
      const usuariosSnapshot = await getDocs(q);
      const newRegistros = usuariosSnapshot.docs.map((doc) => doc.data().registrationDate);
      setRegistroData((prevRegistros) => [...prevRegistros, ...newRegistros]);

      const loginHistoryRef = collection(firestore, 'loginHistory');
      const loginHistorySnapshot = await getDocs(loginHistoryRef);
      const loginHistory = loginHistorySnapshot.docs.map(doc => doc.data().timestamp);
      setLoginHistoryData(loginHistory);

      setSelectedMonth(month);
    } catch (error) {
      console.error('Error al obtener datos de registro:', error);
    }
  };

  return (
    <div>
      <div>
        <select value={selectedMonth} onChange={(e) => handleMonthChange(parseInt(e.target.value))}>
          <option value={null}>Selecciona un mes</option>
          {[...Array(12).keys()].map((month) => (
            <option key={month + 1} value={month + 1}>{new Date(0, month).toLocaleString('default', { month: 'long' }).charAt(0).toUpperCase() + new Date(0, month).toLocaleString('default', { month: 'long' }).slice(1)}</option>
          ))}
        </select>
      </div>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}


export default HistogramaRegistro;
