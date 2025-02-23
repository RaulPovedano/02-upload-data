import { Router } from "express";
import {
  upload,
  uploadFile,
  listFiles,
  deleteFile,
  getFolderSize,
  emptyRecycleBin,
  sendSummaryEmail
} from "../controllers/uploadController.js";

const router = Router();

// Ruta para subir archivo
router.post("/", upload.single("file"), uploadFile);

// Ruta para listar los archivos subidos
router.get("/", listFiles);

// Ruta para eliminar un archivo
router.delete("/:fileName", deleteFile);

// Ruta para eliminar todos los archivos (vaciado de papelera)
router.delete("/empty", async (req, res) => {
  try {
    await emptyRecycleBin();
    res.status(200).json({ message: "Papelera vaciada con éxito" });
  } catch (error) {
    console.error("Error al vaciar la papelera:", error);
    res.status(500).json({ error: "Error al vaciar la papelera" });
  }
});

// Ruta para obtener el tamaño de las carpetas
router.get("/size", getFolderSize);

// Ruta para enviar un resumen por correo
router.post("/send-summary", async (req, res) => {
  const { email } = req.body;
  console.log("Recibiendo solicitud para enviar email a:", email);

  if (!email) {
    return res.status(400).json({ error: "Se requiere un correo electrónico" });
  }

  try {
    await sendSummaryEmail(email);
    res.json({ message: "Resumen enviado con éxito" });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    res.status(500).json({ error: "Error al enviar el correo" });
  }
});

export default router;
