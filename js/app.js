async function init() {
  const contenedor = document.getElementById('lista-chistes');
  await renderListaChistes(contenedor);

  document.getElementById('btn-recargar').onclick = async () => {
    await renderListaChistes(contenedor);
    showToast('Chistes recargados 😄');
  };

  document.getElementById('btn-clear-favs').onclick = () => {
    Favoritos.clear();
    renderFavoritos(document.getElementById('favoritos'));
    showToast('Favoritos borrados');
  };
}

function showToast(text) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = text;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2000);
}

function renderFavoritos(container) {
  const favs = Array.from(Favoritos.get());
  container.innerHTML = '<h3>⭐ Favoritos</h3>';
  if (favs.length === 0) {
    container.innerHTML += '<p>Sin favoritos aún.</p>';
    return;
  }
  favs.forEach(id => {
    const el = document.createElement('div');
    el.textContent = `Chiste #${id}`;
    container.appendChild(el);
  });
}

init();