window.CimaAPI = {
  async solicitar(accion, datos) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);
    try {
      const respuesta = await fetch(CIMA_CONFIG.api, {
        method: 'POST', headers: {'Content-Type': 'text/plain;charset=utf-8'},
        body: JSON.stringify({accion, datos}), redirect: 'follow', signal: controller.signal
      });
      if (!respuesta.ok) throw new Error('El servicio no está disponible. Vuelve a intentar.');
      const json = await respuesta.json();
      if (!json || typeof json !== 'object') throw new Error('Respuesta del servicio inválida.');
      return json;
    } catch (e) {
      if (e.name === 'AbortError') throw new Error('El servicio tardó demasiado. Vuelve a intentar.');
      throw e;
    } finally { clearTimeout(timer); }
  }
};
