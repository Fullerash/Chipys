export default async function handler(req, res) {
  // Solo permitir peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { pin, menuData } = req.body || {};

  // Validación del PIN en el servidor (nunca expuesta al cliente)
  const ADMIN_PIN_CORRECTO = process.env.ADMIN_PIN || "1234";

  if (pin !== ADMIN_PIN_CORRECTO) {
    return res.status(401).json({ error: 'PIN de administrador incorrecto o no autorizado.' });
  }

  if (!menuData || !Array.isArray(menuData)) {
    return res.status(400).json({ error: 'Estructura de datos inválida.' });
  }

  // La URL de almacenamiento vive en el servidor
  const STORAGE_URL = process.env.NPOINT_URL || "https://api.npoint.io/3b2ace171723868f5708";

  try {
    const respuestaStorage = await fetch(STORAGE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(menuData)
    });

    if (!respuestaStorage.ok) {
      const detalle = await respuestaStorage.text();
      throw new Error(`Error en el almacenamiento externo: ${detalle}`);
    }

    return res.status(200).json({ ok: true, mensaje: 'Menú actualizado con éxito.' });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Error interno al sincronizar el menú.' });
  }
}
