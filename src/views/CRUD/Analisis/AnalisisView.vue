<template>
    <div class="container my-5">
      <br>
      <h2>Clientes por Plataforma</h2>
      <canvas ref="chart1" style="display: block; box-sizing: border-box; height: 300px; width: 300px;"></canvas>
      <br>
      <br>
      <h2>Número de Clientes Por País</h2>
      <canvas ref="chart2" style="display: block; box-sizing: border-box; height: 300px; width: 600px;"></canvas>
      <br>
      <br>
      <h2>Clientes con suscripción activa e inactiva</h2>
      <canvas ref="chart3" width="300" height="150"></canvas>
      <br>
      <br>
      <h2>Clientes por País y Plan</h2>
      <canvas ref="chart4" style="display: block; box-sizing: border-box; height: 300px; width: 600px;"></canvas>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { Chart, registerables } from 'chart.js';
  import { API } from '@/RutaApi';
  
  Chart.register(...registerables);
  
  export default defineComponent({
    name: 'Charts',
    setup() {
      const chart1 = ref<HTMLCanvasElement | null>(null);
      const chart2 = ref<HTMLCanvasElement | null>(null);
      const chart3 = ref<HTMLCanvasElement | null>(null);
      const chart4 = ref<HTMLCanvasElement | null>(null);
  
      const apiUrl1 = `${API}/api/SP/ListarClientesPorPlataforma`;
      const apiUrl2 = `${API}/api/SP/ListarNumeroClientesPorPais`;
      const apiUrl3 = `${API}/api/SP/ListarClientesConSuscripcionActivaInactiva`;
      const apiUrl4 = `${API}/api/SP/ListarClientesPorPaisYPlan`;
  
      const fetchData = async (url: string) => {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return await response.json();
        } catch (error) {
          console.error('Error al obtener los datos de la API:', error);
          return null;
        }
      };
  
      const renderPieChart = (canvas: HTMLCanvasElement, labels: string[], data: number[]) => {
        new Chart(canvas, {
          type: 'pie',
          data: {
            labels,
            datasets: [{
              label: 'Número de Clientes',
              data,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      };
  
      const renderBarChart = (canvas: HTMLCanvasElement, labels: string[], data: number[]) => {
        new Chart(canvas, {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Número de Clientes',
              data,
              backgroundColor: 'rgba(255, 159, 64, 0.2)',
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      };
  
      const renderHorizontalBarChart = (canvas: HTMLCanvasElement, labels: string[], data: number[]) => {
        new Chart(canvas, {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Número de Clientes',
              data,
              backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(255, 99, 132, 0.2)'
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            indexAxis: 'y',
            elements: {
              bar: {
                borderWidth: 2,
              }
            },
            responsive: true,
            plugins: {
              legend: {
                position: 'right',
              }
            }
          }
        });
      };
  
      const renderDoughnutChart = (canvas: HTMLCanvasElement, labels: string[], data: number[]) => {
        new Chart(canvas, {
          type: 'doughnut',
          data: {
            labels,
            datasets: [{
              label: 'Número de Clientes',
              data,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 0, 0, 0.2)',
                'rgba(0, 255, 0, 0.2)',
                'rgba(0, 0, 255, 0.2)',
                'rgba(255, 255, 0, 0.2)',
                'rgba(255, 0, 255, 0.2)',
                'rgba(0, 255, 255, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 0, 0, 1)',
                'rgba(0, 255, 0, 1)',
                'rgba(0, 0, 255, 1)',
                'rgba(255, 255, 0, 1)',
                'rgba(255, 0, 255, 1)',
                'rgba(0, 255, 255, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            plugins: {
              legend: {
                position: 'top'
              },
              title: {
                display: true,
                text: 'Clientes por País y Plan'
              }
            }
          }
        });
      };
  
      onMounted(async () => {
        const data1 = await fetchData(apiUrl1);
        if (data1 && chart1.value) {
          const labels = data1.map((entry: any) => entry.Plataforma);
          const values = data1.map((entry: any) => entry.NumeroClientes);
          renderPieChart(chart1.value, labels, values);
        }
  
        const data2 = await fetchData(apiUrl2);
        if (data2 && chart2.value) {
          const labels = data2.map((entry: any) => entry.Pais);
          const values = data2.map((entry: any) => entry.NumeroClientes);
          renderBarChart(chart2.value, labels, values);
        }
  
        const data3 = await fetchData(apiUrl3);
        if (data3 && chart3.value) {
          const labels = ['Con Suscripción Activa', 'Sin Suscripción Activa'];
          const values = [data3[0].ClientesConSuscripcionActiva, data3[0].ClientesSinSuscripcionActiva];
          renderHorizontalBarChart(chart3.value, labels, values);
        }
  
        const data4 = await fetchData(apiUrl4);
        if (data4 && chart4.value) {
          const labels = data4.map((entry: any) => `${entry.Pais} - ${entry.NombrePlan}`);
          const values = data4.map((entry: any) => entry.NumeroClientes);
          renderDoughnutChart(chart4.value, labels, values);
        }
      });
  
      return {
        chart1,
        chart2,
        chart3,
        chart4
      };
    }
  });
  </script>
  
  <style scoped>
  .container {
    margin: 20px;
  }
  </style>
  