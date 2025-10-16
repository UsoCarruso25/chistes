async function renderListaChistes(container) {
  container.innerHTML = '<div class="loader">Cargando chistes...</div>';

  try {
    const chistes = await ApiClient.fetchChistes();
    container.innerHTML = '';

    chistes.forEach(chiste => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="row" style="justify-content:space-between; align-items:center;">
          <strong>Chiste #${chiste.id}</strong>
          <button class="btn btn-ghost btn-fav">${Favoritos.isFav(chiste.id) ? '★' : '☆'}</button>
        </div>
        <p style="margin-top:8px;">${chiste.joke}</p>
      `;

      card.onclick = (e) => {
        if (e.target.classList.contains('btn-fav')) return;
        renderDetallePanel(chiste);
        LogEventos.push('open_detail', { id: chiste.id });
      };

      card.querySelector('.btn-fav').onclick = (e) => {
        e.stopPropagation();
        const isFav = Favoritos.toggle(chiste.id);
        e.target.textContent = isFav ? '★' : '☆';
        showToast(isFav ? 'Añadido a favoritos' : 'Eliminado de favoritos');
        renderFavoritos(document.getElementById('favoritos'));
      };

      container.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = '<div class="error">Error al cargar chistes 😢</div>';
  }
}