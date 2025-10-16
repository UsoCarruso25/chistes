const LogEventos = (function(){
  const KEY = 'jokes_logs_v1';

  function push(eventName, meta = {}) {
    const entry = { ts: new Date().toISOString(), event: eventName, meta };
    const arr = JSON.parse(localStorage.getItem(KEY) || '[]');
    arr.unshift(entry);
    localStorage.setItem(KEY, JSON.stringify(arr.slice(0,200)));
    console.log('[LogEventos]', entry);
  }

  function all(){ return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  function clear(){ localStorage.removeItem(KEY); }

  return { push, all, clear };
})();