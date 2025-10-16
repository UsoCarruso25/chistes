const ApiClient = (function(){
  const URL = 'https://v2.jokeapi.dev/joke/Any?type=single&amount=10';

  async function fetchChistes() {
    const res = await fetch(URL);
    if (!res.ok) throw new Error('Error al obtener chistes: ' + res.status);
    const data = await res.json();
    return data.jokes || [];
  }

  return { fetchChistes };
})();