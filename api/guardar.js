export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { pin, menuData } = req.body || {};

  // PIN de administrador
  const ADMIN_PIN_CORRECTO = process.env.ADMIN_PIN || "231721";

  if (String(pin).trim() !== String(ADMIN_PIN_CORRECTO).trim()) {
    return res.status(401).json({ error: 'PIN de administrador incorrecto.' });
  }

  if (!menuData || !Array.isArray(menuData)) {
    return res.status(400).json({ error: 'Estructura de datos inválida.' });
  }

  // URL directa de tu bin público
  const STORAGE_URL = (process.env.NPOINT_URL || "https://api.npoint.io/3b2ace171723868f5708").trim();

  try {
    const respuestaStorage = await fetch(STORAGE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(menuData)
    });

    const textoRespuesta = await respuestaStorage.text();

    if (!respuestaStorage.ok) {
      console.error("Error npoint:", respuestaStorage.status, textoRespuesta);
      return res.status(respuestaStorage.status).json({ 
        error: `npoint rechazó el guardado (${respuestaStorage.status}): ${textoRespuesta}` 
      });
    }

    return res.status(200).json({ ok: true, mensaje: 'Menú actualizado con éxito.' });
  } catch (err) {
    console.error("Fallo interno en api/guardar:", err);
    return res.status(500).json({ error: err.message || 'Error interno al sincronizar el menú.' });
  }
}
