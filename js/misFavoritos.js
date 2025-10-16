const Favoritos = (function(){
  const KEY = 'jokes_favs_v1';

  function get() {
    return new Set(JSON.parse(localStorage.getItem(KEY) || '[]'));
  }

  function save(set) {
    localStorage.setItem(KEY, JSON.stringify(Array.from(set)));
  }

  function toggle(id) {
    const s = get();
    if (s.has(id)) s.delete(id); else s.add(id);
    save(s);
    LogEventos.push('toggle_fav', { id, isFav: s.has(id) });
    return s.has(id);
  }

  function isFav(id){ return get().has(id); }
  function clear(){ localStorage.removeItem(KEY); }

  return { get, save, toggle, isFav, clear };
})();