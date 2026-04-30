/* Arquivo JS principal (extraído de index.html)
   Mantém interatividade, easter-egg e realce de menu. */

/* --- Dados: fatos e frases --- */
const facts = [
  "Vacas têm três quartos de seus cérebros dedicados à visão periférica!",
  "Um rúmen saudável contém trilhões de microrganismos que ajudam a digerir celulose.",
  "Vacas podem correr a uma velocidade surpreendente quando necessário (até ~40 km/h em curtas distâncias).",
  "Elas formam laços sociais fortes — têm 'melhores amigos'.",
  "A produção de leite depende de genética, nutrição e manejo."
];

const humorRandom = [
  "E se vacas dominassem o mundo? Sinais de trânsito: 'Dê passagem ao rebanho'.",
  "Vaca gamer: Streamer pediu 1k de 'hearts' — recebeu 1k de fardos.",
  "Vaca futurista: usando óculos VR para simular pastagens infinitas.",
  "Vaca filósofa: 'Se eu rumino, logo existo.'"
];

/* --- Seletores importantes --- */
const randomFactBtn = document.getElementById('randomFactBtn');
const randomBtn = document.getElementById('randomBtn');
const randomDisplay = document.getElementById('randomDisplay');
const heroImg = document.getElementById('heroImg');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const showEaster = document.getElementById('showEaster');
const humorMsg = document.getElementById('humorMsg');

// Defensive: if any expected element is missing, log and skip attaching handlers
function safeAddEvent(el, evt, fn){ if(el) el.addEventListener(evt, fn); else console.warn('Missing element for', evt); }

/* --- Função utilitária: obter item aleatório --- */
function aleatorio(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

/* --- Exibir curiosidade aleatória (uso por botão principal) --- */
safeAddEvent(randomFactBtn,'click', ()=>{
  const f = aleatorio(facts);
  alert("Curiosidade: " + f);
});

/* --- Botão 'Aleatória' (mostra dentro da seção) --- */
safeAddEvent(randomBtn,'click', ()=>{
  const txt = "<strong>Curiosidade:</strong> " + aleatorio(facts);
  if(randomDisplay) randomDisplay.innerHTML = txt;
});

/* --- Humor: botões dentro da seção humor (event delegation) --- */
document.querySelectorAll('[data-fun]').forEach(b=>{
  b.addEventListener('click', ()=>{
    if(humorMsg) humorMsg.textContent = aleatorio(humorRandom);
  });
});

/* --- Galeria: clique em miniaturas para abrir imagem em nova aba (simples) --- */
document.querySelectorAll('.thumb img').forEach(img=>{
  img.addEventListener('click', ()=> window.open(img.src, '_blank'));
});

/* --- Modal / Easter egg: abrir e fechar --- */
function openModal(){ if(modal) modal.classList.add('open'); }
function closeModalFn(){ if(modal) modal.classList.remove('open'); }
safeAddEvent(closeModal,'click', closeModalFn);
safeAddEvent(showEaster,'click', openModal);

/* --- Easter egg oculto: clicar 7 vezes no hero ou digitar 'muu' --- */
let clickCount = 0;
if(heroImg){
  heroImg.addEventListener('click', ()=>{
    clickCount++;
    if(clickCount >= 7){
      openModal();
      clickCount = 0;
    }
    clearTimeout(window._clickReset);
    window._clickReset = setTimeout(()=>{ clickCount = 0 }, 1500);
  });
} else console.warn('heroImg not found');

let keySeq = '';
document.addEventListener('keyup', (e)=>{
  keySeq += e.key.toLowerCase();
  if(keySeq.endsWith('muu')){
    openModal();
    keySeq = '';
  }
  if(keySeq.length>10) keySeq = keySeq.slice(-10);
});

/* --- Menu ativo ao rolar (IntersectionObserver) --- */
const menuLinks = document.querySelectorAll('#menu a');
const sections = Array.from(menuLinks).map(a => document.querySelector(a.getAttribute('href'))).filter(s=>s);

const io = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    const id = entry.target.id;
    const link = document.querySelector('#menu a[href="#' + id + '"]');
    if(entry.isIntersecting){
      menuLinks.forEach(l=>l.classList.remove('active'));
      if(link) link.classList.add('active');
    }
  });
},{root:null,threshold:0.45});

sections.forEach(s=> io.observe(s));

/* --- "Reveal" animação quando se tornam visíveis --- */
const reveals = document.querySelectorAll('.reveal');
const rIO = new IntersectionObserver(entries=>{
  entries.forEach(en=>{
    if(en.isIntersecting){ en.target.classList.add('visible'); rIO.unobserve(en.target); }
  });
},{threshold:0.12});
reveals.forEach(r=> rIO.observe(r));

/* --- Smooth scroll offset fix --- */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const href = a.getAttribute('href');
    if(!href.startsWith('#')) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if(!target) return;
    const y = target.getBoundingClientRect().top + window.pageYOffset - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) + 14);
    window.scrollTo({top: y, behavior:'smooth'});
  });
});

/* --- Fechar o modal com ESC --- */
document.addEventListener('keydown', e=>{
  if(e.key === 'Escape'){ closeModalFn(); }
});

/* --- Pequena carga inicial: mostrar um fato no carregamento --- */
window.addEventListener('load', ()=>{
  randomDisplay.innerHTML = "<strong>Curiosidade:</strong> " + aleatorio(facts);
});
