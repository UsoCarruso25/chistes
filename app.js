
// app.js - Enhanced Jokes App
const API_BASE = "https://v2.jokeapi.dev/joke/Any";
const splash = document.getElementById('splash');
const jokesList = document.getElementById('jokes-list');
const template = document.getElementById('joke-item');
const btnRefresh = document.getElementById('btn-refresh');
const btnHome = document.getElementById('btn-home');
const btnShort = document.getElementById('btn-short');
const btnLong = document.getElementById('btn-long');
const btnInfo = document.getElementById('btn-info');
const amountSel = document.getElementById('amount');
const typeSel = document.getElementById('type');

let allJokes = [];
let favorites = JSON.parse(localStorage.getItem('jokes_favs')||"[]");

// Utility
function el(clone){
  return clone.content ? clone.content.cloneNode(true) : clone.cloneNode(true);
}
function showPanel(id){
  document.querySelectorAll('.panel').forEach(p=>p.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  if(id==='jokes-section') btnHome.classList.add('active');
  if(id==='info-section') btnInfo.classList.add('active');
  if(id==='short-section') btnShort.classList.add('active');
  if(id==='long-section') btnLong.classList.add('active');
}

// Fetch jokes
async function fetchJokes(){
  const amount = amountSel.value || 10;
  const type = typeSel.value || 'any';
  const url = `${API_BASE}?type=${type}&amount=${amount}`;
  try{
    const res = await fetch(url);
    const data = await res.json();
    let items = [];
    if(data && data.jokes) items = data.jokes;
    else if(data && data.joke) items = [data];
    allJokes = items;
    renderJokes(items);
  }catch(e){
    console.error(e);
    jokesList.innerHTML = "<li class='joke-card'>Error obteniendo chistes. Revisa la consola.</li>";
  }
}

// Render
function renderJokes(items){
  jokesList.innerHTML = '';
  if(!items || items.length===0){
    jokesList.innerHTML = "<li class='joke-card'>No hay chistes disponibles.</li>"; return;
  }
  items.forEach(j=>{
    const node = template.content.cloneNode(true);
    const li = node.querySelector('li');
    const txt = node.querySelector('.joke-text');
    let text = '';
    if(j.type === 'single') text = j.joke;
    else if(j.type === 'twopart') text = j.setup + "\n\n" + j.delivery;
    txt.textContent = text;
    // actions
    const copyBtn = node.querySelector('.copy');
    const favBtn = node.querySelector('.fav');
    const shareBtn = node.querySelector('.share');

    copyBtn.addEventListener('click', ()=>{ navigator.clipboard.writeText(text); copyBtn.textContent = 'Copiado'; setTimeout(()=>copyBtn.textContent='Copiar',1200); });
    favBtn.addEventListener('click', ()=>{
      toggleFavorite(j, text, favBtn);
    });
    shareBtn.addEventListener('click', async ()=>{
      if(navigator.share){
        try{ await navigator.share({title:'Chiste', text}); }catch(e){ console.log('share cancelled'); }
      }else{
        navigator.clipboard.writeText(text);
        shareBtn.textContent = 'Copiado';
        setTimeout(()=>shareBtn.textContent='Compartir',1200);
      }
    });

    // favorite state
    if(isFavorite(j)) favBtn.textContent='⭐';
    else favBtn.textContent='☆';

    jokesList.appendChild(node);
  });
}

function isFavorite(j){
  // use id or joke text
  const id = j.id || j.joke || (j.setup+j.delivery);
  return favorites.findIndex(f=>f.id===id)>=0;
}
function toggleFavorite(j, text, btn){
  const id = j.id || j.joke || (j.setup+j.delivery);
  const index = favorites.findIndex(f=>f.id===id);
  if(index>=0){ favorites.splice(index,1); btn.textContent='☆'; }
  else{ favorites.push({id,text}); btn.textContent='⭐'; }
  localStorage.setItem('jokes_favs', JSON.stringify(favorites));
}

// Classify by length (short/long)
function classifyAndShow(kind){
  const items = allJokes || [];
  if(kind==='short'){
    renderJokes(items.filter(j=>getLength(j)<=80));
  }else if(kind==='long'){
    renderJokes(items.filter(j=>getLength(j)>80));
  }else renderJokes(items);
}
function getLength(j){
  if(j.type==='single') return j.joke.length;
  return (j.setup + ' ' + j.delivery).length;
}

// Init
btnRefresh.addEventListener('click', fetchJokes);
btnHome.addEventListener('click', ()=>{ showPanel('jokes-section'); renderJokes(allJokes); });
btnInfo.addEventListener('click', ()=>{ showPanel('info-section'); });
btnShort.addEventListener('click', ()=>{ classifyAndShow('short'); showPanel('jokes-section'); btnShort.classList.add('active'); });
btnLong.addEventListener('click', ()=>{ classifyAndShow('long'); showPanel('jokes-section'); btnLong.classList.add('active'); });

window.addEventListener('load', async ()=>{
  // show splash for ~1.6s
  setTimeout(()=>{ splash.style.display='none'; }, 1400);
  await fetchJokes();
});
