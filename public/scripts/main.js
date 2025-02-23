import { createChart } from "./grafico.js";

const uploadForm = document.getElementById("uploadForm");
const fileList = document.getElementById("fileList");
const deleteTrash = document.getElementById("deleteTrash");
const emailForm = document.getElementById("emailForm");

// Envío de resumen por correo
emailForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const emailInput = document.getElementById("email");
  const email = emailInput.value.trim();

  if (!email) {
    alert("Por favor, introduce un correo válido.");
    return;
  }

  try {
    const response = await fetch("/uploads/send-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) throw new Error("Error al enviar el resumen");

    alert("Correo enviado con éxito.");
    emailInput.value = ""; // Limpiar el input
  } catch (error) {
    console.error("Error en el envío de correo:", error);
  }
});

// Obtener estadísticas de almacenamiento
async function fetchStorageStats() {
  try {
    const response = await fetch("/uploads/size");
    if (!response.ok) throw new Error("Error al obtener el tamaño de las carpetas");

    const data = await response.json();
    createChart(data.recycleSize, data.uploadsSize);
  } catch (error) {
    console.error("Error al obtener las estadísticas de almacenamiento:", error);
  }
}

// Obtener archivos
async function fetchFiles() {
  try {
    const response = await fetch("/uploads");
    if (!response.ok) throw new Error("Error al obtener los archivos");

    const files = await response.json();
    fileList.innerHTML = ""; // Limpiar la lista antes de renderizar

    files.forEach((file) => {
      const li = document.createElement("li");
      li.className = "flex justify-between items-center bg-gray-100 p-2 rounded-lg shadow-sm";
      li.innerHTML = `
        <span>${file}</span>
        <button class="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600" data-filename="${file}">Eliminar</button>
      `;
      fileList.appendChild(li);
    });

    document.querySelectorAll("button[data-filename]").forEach((button) => {
      button.addEventListener("click", async (e) => {
        const fileName = e.target.dataset.filename;
        await deleteFile(fileName);
        fetchFiles(); // Actualizar la lista
      });
    });
  } catch (error) {
    console.error(error);
  }
}

// Eliminar un archivo
async function deleteFile(fileName) {
  try {
    const response = await fetch(`/uploads/${fileName}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`Error al eliminar el archivo: ${fileName}`);
  } catch (error) {
    console.error(error);
  }
}

// Vaciar papelera
async function deleteAllFilesRecycle() {
  try {
    const response = await fetch(`/uploads/empty`, { method: "DELETE" });
    if (!response.ok) throw new Error("Error al vaciar la papelera");

    alert("Papelera vaciada con éxito");
  } catch (error) {
    console.error(error);
  }
}

deleteTrash.addEventListener("click", async (e) => {
  e.preventDefault();
  await deleteAllFilesRecycle();
});

// Subida de archivos
uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(uploadForm);
  try {
    const response = await fetch("/uploads", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Error al subir el archivo");

    uploadForm.reset();
    fetchFiles();
  } catch (error) {
    console.error(error);
  }
});

// Cargar lista de archivos y estadísticas al iniciar
document.addEventListener("DOMContentLoaded", () => {
  fetchFiles();
  fetchStorageStats();
});
