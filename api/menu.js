export default async function handler(req, res) {
  // Configurar encabezados para que nunca guarde en caché datos viejos
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const STORAGE_URL = (process.env.NPOINT_URL || "https://api.npoint.io/3b2ace171723868f5708").trim();

  try {
    const respuesta = await fetch(`${STORAGE_URL}?t=${Date.now()}`, {
      cache: 'no-store'
    });

    if (!respuesta.ok) {
      throw new Error('Error al consultar almacenamiento');
    }

    const datos = await respuesta.json();
    return res.status(200).json(datos);
  } catch (error) {
    return res.status(500).json({ error: 'No se pudo cargar el menú' });
  }
}
