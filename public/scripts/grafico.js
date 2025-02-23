export const createChart = (recycleSize, uploadSize) => {
  let canvas = document.getElementById("miCanva");
  const div = document.getElementById("chart");

  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "miCanva";
    canvas.width = 400;
    canvas.height = 200;
    div.appendChild(canvas);
  }

  const ctx = canvas.getContext("2d");

  if (!canvas.chart) {
    canvas.chart = new Chart(ctx, {
      type: "bar", // Tipo de gráfico de barras
      data: {
        labels: ["Recycle", "Uploads"],
        datasets: [
          {
            label: "Espacio ocupado (bytes)",
            data: [recycleSize, uploadSize],
            backgroundColor: [
              "rgba(255, 7, 7, 0.21)",
              "rgba(119, 255, 0, 0.22)",
            ],
            borderColor: ["rgb(228, 0, 0)", "rgb(47, 255, 0)"],
            borderWidth: 3,
          },
        ],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        indexAxis: "y",  // Esto hace que las barras sean horizontales
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                size: 12, // Fuente más pequeña
              },
            },
          },
          x: {
            ticks: {
              font: {
                size: 12, // Fuente más pequeña
              },
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              font: {
                size: 12, // Tamaño de la leyenda más pequeño
              },
            },
          },
        },
      },
    });
  }
};
