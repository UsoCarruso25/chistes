function renderDetallePanel(chiste) {
  const panel = document.getElementById('detalle-panel');
  panel.innerHTML = '';
  if (!chiste) { panel.classList.add('hidden'); return; }
  panel.classList.remove('hidden');

  panel.innerHTML = `
    <div class="card">
      <strong>Chiste #${chiste.id}</strong>
      <p style="margin-top:10px;">${chiste.joke}</p>
      <div style="margin-top:10px;">
        <button class="btn btn-primary" id="btn-share">Compartir</button>
        <button class="btn btn-ghost" id="btn-cerrar" style="margin-left:8px">Cerrar</button>
      </div>
    </div>
  `;

  document.getElementById('btn-cerrar').onclick = () => {
    panel.classList.add('hidden');
    LogEventos.push('close_detail', { id: chiste.id });
  };

  document.getElementById('btn-share').onclick = async () => {
    const text = `😂 ${chiste.joke}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Chiste divertido', text });
        LogEventos.push('share', { id: chiste.id });
      } catch(e) { console.warn(e); }
    } else {
      await navigator.clipboard.writeText(text);
      showToast('Chiste copiado al portapapeles');
      LogEventos.push('copy_share', { id: chiste.id });
    }
  };
}