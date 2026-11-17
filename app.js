/* Публічний дашборд наукових журналів НУБіП. Вміст каталогу – journals.js */
(() => {
  'use strict';
  const source = window.JOURNALS_DATA || {journals: [], updated: ''};
  const journals = Array.isArray(source.journals) ? source.journals : [];
  const root = document.getElementById('content');
  const layer = document.getElementById('modal-layer');
  const titles = {overview:'Аналітичний огляд',catalog:'Каталог журналів',match:'Підбір видання',guide:'Інформація для автора'};
  const catNames = {A:'Розділ А за каталогом НУБіП',B:'Розділ Б за каталогом НУБіП',joint:'Спільні видання'};
  const codeLabels = {
    A1:'Освітні науки',A5:'Професійна освіта',B10:'Філософія',B11:'Філологія',C1:'Економіка',C4:'Психологія',
    D1:'Облік і оподаткування',D2:'Фінанси',D3:'Менеджмент',D5:'Маркетинг',D7:'Торгівля',D8:'Право',D9:'Міжнародне право',
    E1:'Біологія та біохімія',F3:'Комп’ютерні науки',G3:'Електрична інженерія',G4:'Енерговиробництво',G7:'Автоматизація',
    G9:'Прикладна механіка',G11:'Машинобудування',G13:'Харчові технології',G17:'Архітектура',G18:'Геодезія та землеустрій',
    G19:'Будівництво',G21:'Біотехнології',H1:'Агрономія',H2:'Тваринництво',H3:'Садово-паркове господарство',
    H4:'Лісове господарство',H5:'Водні біоресурси',H6:'Ветеринарна медицина',H7:'Агроінженерія',I10:'Соціальна робота',
    J3:'Туризм'
  };
  const state = {route:'overview',search:'',filter:'all',showAll:false,matchCode:'D8'};
  const byId = id => journals.find(j=>j.id===id);
  const esc = v => String(v??'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl = v => {try{const u=new URL(v);return u.protocol==='https:'?u.href:'#';}catch{return '#';}};
  const num = (kind) => journals.filter(j=>kind==='excluded'?j.excluded:kind==='active-b'?j.catalogGroup==='B'&&!j.excluded:j.catalogGroup===kind).length;
  const codeSorter = (a,b)=>a.localeCompare(b,'uk',{numeric:true});
  const allCodes = [...new Set(journals.flatMap(j=>j.codes||[]))].sort(codeSorter);
  const btn = (text, route, extra='')=>`<button type="button" class="btn ${extra}" data-route="${route}">${text}</button>`;
  const journalTags = j => [ ...(j.codes||[]).slice(0,5).map(c=>`<span class="tag" title="${esc(codeLabels[c]||'Код спеціальності')}">${esc(c)}</span>`),j.codes?.length>5?`<span class="tag soft">+${j.codes.length-5}</span>`:''].join('');
  function journalLabel(j){
    if(j.excluded)return '<span class="tag warn">Виключено з Переліку МОН</span>';
    if(j.verifiedCategory)return `<span class="tag ${j.catalogGroup!==j.verifiedCategory?'warn':'ok'}">За редакцією: ${esc(j.verifiedCategory)}</span>`;
    return `<span class="tag soft">Розділ ${esc(j.catalogGroup)} · статус уточнюється</span>`;
  }
  // 16 distinct, decorative SVG marks for the journals; no network-dependent icon library.
  const topicIconShapes = {
    scale: `<path d="M12 3v18M4.5 7H19.5M12 4l-2 3M7 7l-3.5 7h7L7 7ZM17 7l-3.5 7h7L17 7ZM6 21h12"/>`,
    microscope: `<path d="m9 4 4 4M10 3l5 5-3 3-5-5 3-3ZM9 13l-2 3M6 20h13M11 17h3a5 5 0 0 0 5-5v-2M13 11l-2 2M6 16a4 4 0 0 0 4 4"/>`,
    livestock: `<path d="M5 3h5M6 3v4a4 4 0 0 0-2 3.5V20a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-9.5A4 4 0 0 0 9 7V3M4 13h7M14 16l5-4 3 4v5h-8v-5Zm0 0h8M17 18.5h.01M19.5 19h.01"/>`,
    veterinary: `<path d="M6 3H4v5a5 5 0 0 0 10 0V3h-2M9 13v3a5 5 0 0 0 10 0v-2"/><circle cx="19" cy="12" r="2"/>`,
    gear: `<path d="M10 2h4l.6 2.4 1.9.8 2.1-1.2 2.8 2.8-1.2 2.1.8 1.9L23 11v4l-2.4.6-.8 1.9 1.2 2.1-2.8 2.8-2.1-1.2-1.9.8L14 23h-4l-.6-2.4-1.9-.8-2.1 1.2-2.8-2.8 1.2-2.1-.8-1.9L1 15v-4l2.4-.6.8-1.9L3 6.4l2.8-2.8 2.1 1.2 1.9-.8L10 2ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" transform="translate(0 -1) scale(1 .98)"/>`,
    pine: `<path d="m12 2-6 8h3l-5 7h16l-5-7h3l-6-8ZM12 17v5M8 22h8"/>`,
    heart: `<path d="M20.8 6.4a5.4 5.4 0 0 0-7.6 0L12 7.6l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 22l8.8-8a5.4 5.4 0 0 0 0-7.6ZM3 13h4l2-3 3 6 2-3h7"/>`,
    sprout: `<path d="M12 22V11M12 15c-6 0-9-3-9-8 5 0 9 2 9 8ZM12 12c0-5 3-8 9-8 0 5-3 8-9 8Z"/>`,
    map: `<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6ZM9 3v15M15 6v15M18 10.5a2.5 2.5 0 1 0-5 0c0 1.9 2.5 4.5 2.5 4.5s2.5-2.6 2.5-4.5Z"/>`,
    chart: `<path d="M4 20V10h4v10M10 20V4h4v16M16 20v-8h4v8M2 20h20"/>`,
    languages: `<path d="M12 11c-3-2-6-2-9-1v10c3-1 6-1 9 1 3-2 6-2 9-1v-9M12 12v9M10 4a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-3l-4 3V8a2 2 0 0 1-2-2V4Z"/>`,
    bolt: `<path d="m13 2-9 11h7l-1 9 10-12h-7l1-8Z"/>`,
    graduation: `<path d="m2 9 10-5 10 5-10 5L2 9ZM6 11.5v5c3.8 3.3 8.2 3.3 12 0v-5M22 9v7"/>`,
    dna: `<path d="M21 11c0 5.3-3.8 9.5-9 9.5-5 0-9-3.1-9-8 0-5.3 3.7-9 9-9 5.4 0 9 2.6 9 7.5Z"/><circle cx="11" cy="12" r="3.2"/><path d="M16.5 8h.01M16.5 15.8h.01M7 7.8h.01"/>`,
    chip: `<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="10" y="10" width="4" height="4" rx=".5"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>`,
    bird: `<path d="M19 10c-2-3-5-3-7-1-1 1-1 2-2 3-2 2-5 1-7 0 1 5 5 8 10 8 5 0 8-4 8-8l2-1-3-1-1-3M14 12h.01M9 19l-1 3M14 20l1 2"/>`,
  };
  const topicTone = {scale:'purple',microscope:'teal',livestock:'amber',veterinary:'rose',gear:'violet',pine:'green',heart:'rose',sprout:'green',map:'teal',chart:'amber',languages:'violet',bolt:'amber',graduation:'purple',dna:'teal',chip:'violet',bird:'green'};
  function topicIcon(j) {
    const key = Object.prototype.hasOwnProperty.call(topicIconShapes,j.icon)?j.icon:'microscope';
    const svg = `<svg class="topic-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${topicIconShapes[key]}</svg>`;
    return `<span class="card-icon topic-${topicTone[key]}" aria-hidden="true">${svg}</span>`;
  }
  function journalCard(j){
    return `<article class="journal-card">
      <div class="card-top"><div><h3>${esc(j.name)}</h3><p class="english">${esc(j.en||'')}</p></div>${topicIcon(j)}</div>
      <p class="card-area">${esc(j.area||'')}</p><div class="tags">${journalLabel(j)}</div>
      <div class="tags">${journalTags(j)}</div>
      <div class="card-bottom"><button class="btn secondary small" type="button" data-details="${esc(j.id)}">Картка журналу →</button><a class="small-link" href="${esc(safeUrl(j.url))}" target="_blank" rel="noopener noreferrer" aria-label="Сайт журналу ${esc(j.name)}">Сайт редакції ↗</a></div>
    </article>`;
  }
  function chartRow(label,n,total) {return `<div class="bar-row"><div class="bar-names"><span>${esc(label)}</span><b>${n}</b></div><div class="track"><div class="bar-fill" style="width:${Math.round(n/Math.max(total,1)*100)}%"></div></div></div>`;}
  function overview(){
    const total=journals.length,a=num('A'),b=num('active-b'),removed=num('excluded');
    return `<section class="hero"><div class="hero-text"><span class="overline">НАУКОВИЙ ПРОСТІР НУБіП</span><h1>Наукові журнали НУБіП України</h1><p>Зручний каталог видань для науковців, аспірантів і авторів. Знайдіть журнал за тематикою та спеціальністю й перейдіть на сайт редакції.</p><div class="actions">${btn('Підібрати журнал →','match','primary')}${btn('Переглянути каталог','catalog','secondary')}</div></div><div class="hero-graphic" aria-hidden="true">▤</div></section>
    <div class="metric-grid">
      ${metric('▤',total,'Видань у каталозі')}${metric('◈',a,'У розділі А НУБіП')}${metric('▧',b,'У розділі Б без виключених')}${metric('!',removed,'Позначено як виключені')}
    </div>
    <section class="section dashboard-columns"><div class="panel"><div class="panel-top"><h3>Структура обраних видань</h3><span class="pill">${total} журналів</span></div>
       ${chartRow('Розділ А за каталогом',a,total)}${chartRow('Розділ Б (без виключених)',b,total)}${chartRow('Виключені з Переліку',removed,total)}</div>
       <div class="panel"><div class="panel-top"><h3>Перевірка статусу видань</h3></div><div class="notice warn"><strong>Перед поданням статті</strong><p>Перевірте чинну категорію, наукову спеціальність і відповідний наказ МОН. Відомості можуть змінюватися, тому звіряйте їх з офіційним Переліком і правилами редакції</p><a class="small-link" href="${esc(safeUrl(source.sourceMon))}" target="_blank" rel="noopener noreferrer">Перелік фахових видань МОН ↗</a></div></div></section>
    <section class="section"><div class="section-header"><div><h2>З чого почати?</h2></div></div><div class="quick-grid"><button type="button" class="quick" data-route="match"><span class="tile-icon">♧</span><strong>Я аспірант</strong><small>Знайти журнал за спеціальністю дисертації</small><span class="arrow">Перейти →</span></button><button type="button" class="quick" data-route="catalog"><span class="tile-icon">▤</span><strong>Я науковець</strong><small>Переглянути весь перелік журналів і сайти редакцій</small><span class="arrow">Перейти →</span></button></div></section>`;
  }
  function metric(icon,value,label){return `<div class="metric"><span class="metric-icon" aria-hidden="true">${icon}</span><div class="metric-val">${value}</div><div class="metric-label">${esc(label)}</div></div>`;}
  function catalog(){return `<div class="page-intro"><span class="overline">16 ОБРАНИХ ВИДАНЬ</span><h1>Каталог наукових журналів</h1><p class="muted">Шукайте за назвою, галуззю дослідження або кодом спеціальності. Усі посилання ведуть на сторінки, які ви надали.</p></div>
  <div class="filters"><div class="field"><label for="journal-search">Пошук</label><input class="input" id="journal-search" placeholder="Наприклад: право, агрономія, D8…" autocomplete="off" value="${esc(state.search)}"></div><div class="field"><label for="journal-filter">Розділ каталогу</label><select class="select" id="journal-filter"><option value="all">Усі 16 журналів</option><option value="A">Розділ А</option><option value="B">Розділ Б</option><option value="excluded">Виключені з Переліку</option></select></div></div>
  <div class="result-meta"><span id="result-count" aria-live="polite"></span><button class="btn ghost small" type="button" data-action="reset">Очистити фільтри</button></div><div id="catalog-results" class="journal-list"></div><div id="catalog-more" style="margin-top:18px;text-align:center"></div>
  <p class="section-note">Коди спеціальностей подано за чинною буквено-цифровою класифікацією</p>`;}
  function filtered(){return journals.filter(j=> (state.filter==='all'||(state.filter==='excluded'?j.excluded:j.catalogGroup===state.filter)) && (j.name+' '+(j.en||'')+' '+(j.area||'')+' '+(j.codes||[]).join(' ')+' '+(j.codes||[]).map(c=>codeLabels[c]||'').join(' ')).toLocaleLowerCase('uk').includes(state.search.trim().toLocaleLowerCase('uk')));}
  function renderCatalogResults(){
    const results = document.getElementById('catalog-results'); if(!results)return;
    const matches=filtered(); document.getElementById('result-count').textContent=`Знайдено: ${matches.length} із ${journals.length}`;
    const current=state.showAll?matches:matches.slice(0,8);
    results.innerHTML=current.length?current.map(journalCard).join(''):'<div class="empty"><strong>Нічого не знайдено</strong>Спробуйте іншу назву або код спеціальності</div>';removeFinalPeriods(results);
    document.getElementById('catalog-more').innerHTML=matches.length>8?`<button class="btn secondary" type="button" data-action="more">${state.showAll?'Показати менше':'Показати ще '+(matches.length-8)+' журналів'}</button>`:'';
  }
  function match(){const options=allCodes.map(c=>`<option value="${esc(c)}" ${state.matchCode===c?'selected':''}>${esc(c)} – ${esc(codeLabels[c]||'Спеціальність')}</option>`).join('');
    return `<div class="page-intro"><span class="overline">ДОПОМОГА ДОСЛІДНИКОВІ</span><h1>Де опублікувати статтю?</h1><p class="muted">Оберіть спеціальність і перегляньте відповідні видання. Перед поданням статті уточніть актуальну спеціалізацію та правила публікації на сайті редакції</p></div>
      <section class="match-header"><div class="panel"><div class="field"><label for="code-select">Ваша наукова спеціальність</label><select class="select" id="code-select">${options}</select></div></div><div class="match-count"><strong id="match-number">0</strong><p>Видань з обраним кодом, без виключених</p></div></section>
      <section class="section"><div class="section-header"><div><h2>Журнали за спеціальністю</h2></div></div><div id="match-results" class="journal-list"></div></section>
      <section class="section notice warn"><strong>Перш ніж подавати статтю</strong><p>Зіставте тематику роботи з редакційною політикою, підтвердіть спеціальність і фаховий статус відповідно до чинних документів МОН та перевірте умови подання на сайті редакції.</p></section>`;}
  function renderMatchResults(){const pane=document.getElementById('match-results');if(!pane)return;const matches=journals.filter(j=>!j.excluded&&(j.codes||[]).includes(state.matchCode));
    document.getElementById('match-number').textContent=matches.length;
    pane.innerHTML=matches.length?matches.map(journalCard).join(''):'<div class="empty"><strong>Для цього коду немає збігів</strong>Можна пошукати за назвою тематики у повному каталозі. Відсутність збігів не означає, що відповідних видань немає поза цим застосунком.</div>';removeFinalPeriods(pane);
  }
  function guide(){const steps=[['Оберіть журнал','Знайдіть відповідну спеціальність або скористайтеся пошуком за назвою та галуззю.'],['Перевірте фаховий статус','Звірте категорію, код спеціальності та дату чинності з актуальними наказами МОН.'],['Ознайомтеся з вимогами для авторів','Перевірте мову статті, оформлення, умови відкритого доступу, вартість і порядок рецензування.'],['Подайте рукопис','Перейдіть на офіційний сайт редакції з картки журналу та дотримуйтесь її правил подання.'],['Збережіть бібліографічні дані','Після публікації перевірте номер випуску, DOI та правильність відомостей про авторів.']];
    return `<div class="page-intro"><span class="overline">ПАМ’ЯТКА АВТОРОВІ</span><h1>Від рукопису до публікації</h1><p class="muted">П'ять кроків, які допоможуть аспірантам і науковцям підготувати статтю.</p></div><div class="guide-list">${steps.map((s,i)=>`<section class="guide-step"><span class="number">${i+1}</span><div><h3>${esc(s[0])}</h3><p>${esc(s[1])}</p></div></section>`).join('')}</div><section class="section panel"><h3>Корисні посилання</h3><p class="subtle" style="margin:9px 0 16px">Застосунок допомагає знайти журнал, але не замінює офіційні накази та повідомлення редакцій.</p><div class="actions"><a class="btn secondary" href="${esc(safeUrl(source.catalogueUrl))}" target="_blank" rel="noopener noreferrer">Сторінка НУБіП ↗</a><a class="btn secondary" href="${esc(safeUrl(source.sourceMon))}" target="_blank" rel="noopener noreferrer">Перелік фахових видань МОН ↗</a>${btn('Підібрати видання','match','primary')}</div></section>`;}
  function details(id){const j=byId(id);if(!j)return;
    const rows=[['Напрям',j.area||'Уточнюється'],['Розділ на сайті НУБіП',catNames[j.catalogGroup]||'Не вказано'],['Спеціальності',(j.codes||[]).join(', ')||'Не вказані'],['Статус за редакцією',j.excluded?'Виключено з Переліку МОН':j.verifiedCategory?`Категорія ${j.verifiedCategory}`:'Потребує окремої перевірки'],['Мова публікацій',j.language||'Перевірте на сайті редакції'],['Періодичність',j.periodicity||'Перевірте на сайті редакції'],['ISSN',j.issn||'Уточнюється'],['e-ISSN',j.eissn||'Уточнюється'],['Scopus / Web of Science','Потребує перевірки'],['Вартість публікації','Перевірте у редакції']];
    layer.innerHTML=`<div class="dialog-backdrop" data-close-modal="true"><section class="dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title"><header class="dialog-head"><div><span class="overline">КАРТКА НАУКОВОГО ЖУРНАЛУ</span><h2 id="modal-title">${esc(j.name)}</h2><p class="subtle">${esc(j.en||'')}</p></div><button class="close" type="button" data-close-modal="true" aria-label="Закрити картку">×</button></header><div class="dialog-body"><div class="tags">${journalLabel(j)}</div><dl class="details">${rows.map(r=>`<dt>${esc(r[0])}</dt><dd>${esc(r[1])}</dd>`).join('')}</dl>${j.statusNote?`<div class="notice warn detail-note"><strong>Уточнення статусу</strong><p>${esc(j.statusNote)}</p>${j.statusSource?`<a class="small-link" href="${esc(safeUrl(j.statusSource))}" target="_blank" rel="noopener noreferrer">Джерело ↗</a>`:''}</div>`:''}${j.scopeNote?`<div class="notice detail-note"><p>${esc(j.scopeNote)}</p></div>`:''}${j.indexingNote?`<div class="notice detail-note"><p>${esc(j.indexingNote)}</p>${j.indexingSource?`<a class="small-link" href="${esc(safeUrl(j.indexingSource))}" target="_blank" rel="noopener noreferrer">Інформація НУБіП ↗</a>`:''}</div>`:''}<div class="detail-actions"><a class="btn primary" href="${esc(safeUrl(j.url))}" target="_blank" rel="noopener noreferrer">Офіційний сайт журналу ↗</a><button class="btn secondary" type="button" data-close-modal="true">Закрити</button></div></div></section></div>`;
    removeFinalPeriods(layer);document.body.style.overflow='hidden'; layer.querySelector('.close').focus();
  }
  function removeFinalPeriods(container){
    if(!container)return;
    const walker=document.createTreeWalker(container,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode())){
      const content=node.nodeValue;
      // Only the terminal full stop; internal sentence boundaries remain
      node.nodeValue=content.replace(/\.(?=\s*$)/u,'');
    }
  }
  function closeModal(){layer.innerHTML='';document.body.style.overflow='';}
  function render(){
    root.innerHTML=state.route==='catalog'?catalog():state.route==='match'?match():state.route==='guide'?guide():overview();
    document.getElementById('page-title').textContent=titles[state.route];
    document.querySelectorAll('[data-route]').forEach(el=>{const selected=el.dataset.route===state.route;el.classList.toggle('active',selected);if(el.matches('.nav-link,.mobile-tabs button')){if(selected)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');}});
    if(state.route==='catalog'){
      document.getElementById('journal-filter').value=state.filter;
      renderCatalogResults();
    }else if(state.route==='match')renderMatchResults();
    removeFinalPeriods(root);
  }
  function go(route){if(!titles[route])return;state.route=route;closeModal();render();window.history.replaceState(null,'','#'+route);window.scrollTo({top:0,behavior:'instant'});}
  document.addEventListener('click', e=>{
    const route=e.target.closest('[data-route]');if(route){go(route.dataset.route);return;}
    const detail=e.target.closest('[data-details]');if(detail){details(detail.dataset.details);return;}
    const close=e.target.closest('[data-close-modal]');if(close&&(close.classList.contains('dialog-backdrop')||close.tagName==='BUTTON')){closeModal();return;}
    const author=e.target.closest('#copy-author');
    if(author){
      const credit='© Наталія ШЕВЧЕНКО, 2026';
      if(navigator.clipboard?.writeText){navigator.clipboard.writeText(credit).then(()=>{author.textContent='Авторство скопійовано';setTimeout(()=>author.textContent=credit,1800);}).catch(()=>{author.textContent=credit;});}
      else {author.textContent=credit;}
      return;
    }
    const action=e.target.closest('[data-action]');if(!action)return;
    if(action.dataset.action==='reset'){state.search='';state.filter='all';state.showAll=false;render();}
    if(action.dataset.action==='more'){state.showAll=!state.showAll;renderCatalogResults();}
  });
  document.addEventListener('input', e=>{if(e.target.id==='journal-search'){state.search=e.target.value;state.showAll=false;renderCatalogResults();}});
  document.addEventListener('change',e=>{
    if(e.target.id==='journal-filter'){state.filter=e.target.value;state.showAll=false;renderCatalogResults();}
    if(e.target.id==='code-select'){state.matchCode=e.target.value;renderMatchResults();}
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
  window.addEventListener('hashchange',()=>{const route=location.hash.replace('#','');if(route!==state.route&&titles[route]){state.route=route;render();}});
  removeFinalPeriods(document.querySelector('.sidebar'));removeFinalPeriods(document.querySelector('.footer'));
  state.route=titles[location.hash.slice(1)]?location.hash.slice(1):'overview';
  if(!allCodes.includes(state.matchCode))state.matchCode=allCodes[0]||'';
  render();
  if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost'))window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
})();
