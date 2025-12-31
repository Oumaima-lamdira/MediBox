const chartData = {
  labels: ['10:00', '12:00', '14:00', '16:00', '18:00'],
  datasets: [
    {
      label: 'Tension',
      data: [105, 115, 110, 115, 105],
      borderColor: 'rgb(37, 99, 235)',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      tension: 0.4, // Courbe lisse
      pointRadius: 6,
      pointBackgroundColor: 'rgb(37, 99, 235)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2
    },
    {
      label: 'Pulsations',
      data: [82, 85, 84, 82, 85],
      borderColor: 'rgb(16, 185, 129)',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4
    }
  ]
};