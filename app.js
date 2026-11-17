/* Публічний дашборд наукових журналів НУБіП. Вміст каталогу – data/journals.js */
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
    J3:'Туризм',201:'Агрономія (історичний код)',203:'Садівництво (історичний код)',204:'Тваринництво (історичний код)',211:'Ветеринарна медицина (історичний код)'
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
  function journalCard(j){
    return `<article class="journal-card">
      <div class="card-top"><div><h3>${esc(j.name)}</h3><p class="english">${esc(j.en||'')}</p></div><span class="card-icon" aria-hidden="true">▤</span></div>
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
    </div><p class="section-note">Показники відображають лише ${total} журналів, вибраних для цього застосунку. Розподіл за розділами НУБіП не є підтвердженням чинної категорії МОН.</p>
    <section class="section dashboard-columns"><div class="panel"><div class="panel-top"><h3>Структура обраних видань</h3><span class="pill">${total} журналів</span></div>
       ${chartRow('Розділ А за каталогом',a,total)}${chartRow('Розділ Б (без виключених)',b,total)}${chartRow('Виключені з Переліку',removed,total)}
       <p class="subtle" style="margin-top:14px">«Сучасне птахівництво» зберігається в каталозі, оскільки його посилання включене до вибірки, але не пропонується як чинне фахове видання.</p></div>
       <div class="panel"><div class="panel-top"><h3>Перевіряйте фаховий статус</h3><span class="pill">Важливо</span></div><div class="notice warn"><strong>Категорії можуть відрізнятися</strong><p>«Право. Людина. Довкілля» подано у розділі А університетського каталогу, а редакція зазначає категорію Б за наказом МОН № 928 від 11.06.2026.</p><a class="small-link" href="https://environmentalscience.com.ua/uk" target="_blank" rel="noopener noreferrer">Перевірити на сайті журналу ↗</a></div><p class="subtle" style="margin-top:14px">У картках ми розрізняємо розділ сайту НУБіП і окремо підтверджений статус видання.</p></div></section>
    <section class="section"><div class="section-header"><div><h2>З чого почати?</h2><p class="subtle">Два найпоширеніші маршрути пошуку</p></div></div><div class="quick-grid"><button type="button" class="quick" data-route="match"><span class="tile-icon">♧</span><strong>Я аспірант</strong><small>Знайти журнал за спеціальністю дисертації</small><span class="arrow">Перейти →</span></button><button type="button" class="quick" data-route="catalog"><span class="tile-icon">▤</span><strong>Я науковець</strong><small>Переглянути весь перелік журналів і сайти редакцій</small><span class="arrow">Перейти →</span></button></div></section>
    <section class="section notice"><strong>Джерело й дата оновлення</strong><p>Склад каталогу сформовано тільки з 16 журналів, посилання на які надано для застосунку. Останнє оновлення даних: ${esc(source.updated)}. Частина статусів потребує додаткового підтвердження.</p></section>`;
  }
  function metric(icon,value,label){return `<div class="metric"><span class="metric-icon" aria-hidden="true">${icon}</span><div class="metric-val">${value}</div><div class="metric-label">${esc(label)}</div></div>`;}
  function catalog(){return `<div class="page-intro"><span class="overline">16 ОБРАНИХ ВИДАНЬ</span><h1>Каталог наукових журналів</h1><p class="muted">Шукайте за назвою, галуззю дослідження або кодом спеціальності. Усі посилання ведуть на сторінки, які ви надали.</p></div>
  <div class="filters"><div class="field"><label for="journal-search">Пошук</label><input class="input" id="journal-search" placeholder="Наприклад: право, агрономія, D8…" autocomplete="off" value="${esc(state.search)}"></div><div class="field"><label for="journal-filter">Розділ каталогу</label><select class="select" id="journal-filter"><option value="all">Усі 16 журналів</option><option value="A">Розділ А</option><option value="B">Розділ Б</option><option value="excluded">Виключені з Переліку</option></select></div></div>
  <div class="result-meta"><span id="result-count" aria-live="polite"></span><button class="btn ghost small" type="button" data-action="reset">Очистити фільтри</button></div><div id="catalog-results" class="journal-list"></div><div id="catalog-more" style="margin-top:18px;text-align:center"></div>
  <p class="section-note">Деякі видання мають застарілі цифрові коди спеціальностей. У картках це зазначено, а відповідність чинній спеціальності слід перевіряти окремо.</p>`;}
  function filtered(){return journals.filter(j=> (state.filter==='all'||(state.filter==='excluded'?j.excluded:j.catalogGroup===state.filter)) && (j.name+' '+(j.en||'')+' '+(j.area||'')+' '+(j.codes||[]).join(' ')+' '+(j.codes||[]).map(c=>codeLabels[c]||'').join(' ')).toLocaleLowerCase('uk').includes(state.search.trim().toLocaleLowerCase('uk')));}
  function renderCatalogResults(){
    const results = document.getElementById('catalog-results'); if(!results)return;
    const matches=filtered(); document.getElementById('result-count').textContent=`Знайдено: ${matches.length} із ${journals.length}`;
    const current=state.showAll?matches:matches.slice(0,8);
    results.innerHTML=current.length?current.map(journalCard).join(''):'<div class="empty"><strong>Нічого не знайдено</strong>Спробуйте іншу назву або код спеціальності.</div>';
    document.getElementById('catalog-more').innerHTML=matches.length>8?`<button class="btn secondary" type="button" data-action="more">${state.showAll?'Показати менше':'Показати ще '+(matches.length-8)+' журналів'}</button>`:'';
  }
  function match(){const options=allCodes.map(c=>`<option value="${esc(c)}" ${state.matchCode===c?'selected':''}>${esc(c)} – ${esc(codeLabels[c]||'Спеціальність')}</option>`).join('');
    return `<div class="page-intro"><span class="overline">ДОПОМОГА ДОСЛІДНИКОВІ</span><h1>Де опублікувати статтю?</h1><p class="muted">Оберіть спеціальність, щоб побачити журнали, у яких цей код наведений на сторінці НУБіП. Пошук орієнтовний – перед поданням перевірте фаховість і тематику.</p></div>
      <section class="match-header"><div class="panel"><div class="field"><label for="code-select">Ваша наукова спеціальність</label><select class="select" id="code-select">${options}</select></div><p class="subtle" style="margin-top:13px">Історичні коди відображено окремо: вони не прирівнюються до сучасних автоматично.</p></div><div class="match-count"><strong id="match-number">0</strong><p>Видань з обраним кодом, без виключених</p></div></section>
      <section class="section"><div class="section-header"><div><h2>Рекомендації за кодом</h2><p class="subtle">Лише попередній тематичний збіг</p></div></div><div id="match-results" class="journal-list"></div></section>
      <section class="section notice warn"><strong>Перш ніж подавати статтю</strong><p>Зіставте тематику роботи з редакційною політикою, підтвердіть спеціальність і фаховий статус відповідно до чинних документів МОН та перевірте умови подання на сайті редакції.</p></section>`;}
  function renderMatchResults(){const pane=document.getElementById('match-results');if(!pane)return;const matches=journals.filter(j=>!j.excluded&&(j.codes||[]).includes(state.matchCode));
    document.getElementById('match-number').textContent=matches.length;
    pane.innerHTML=matches.length?matches.map(journalCard).join(''):'<div class="empty"><strong>Для цього коду немає збігів</strong>Можна пошукати за назвою тематики у повному каталозі. Відсутність збігів не означає, що відповідних видань немає поза цим застосунком.</div>';
  }
  function guide(){const steps=[['Оберіть журнал','Знайдіть відповідну спеціальність або скористайтеся пошуком за назвою та галуззю.'],['Перевірте фаховий статус','Звірте категорію, код спеціальності та дату чинності з актуальними наказами МОН.'],['Ознайомтеся з вимогами для авторів','Перевірте мову статті, оформлення, умови відкритого доступу, вартість і порядок рецензування.'],['Подайте рукопис','Перейдіть на офіційний сайт редакції з картки журналу та дотримуйтесь її правил подання.'],['Збережіть бібліографічні дані','Після публікації перевірте номер випуску, DOI та правильність відомостей про авторів.']];
    return `<div class="page-intro"><span class="overline">ПАМ’ЯТКА АВТОРОВІ</span><h1>Від рукопису до публікації</h1><p class="muted">П'ять кроків, які допоможуть аспірантам і науковцям підготувати статтю.</p></div><div class="guide-list">${steps.map((s,i)=>`<section class="guide-step"><span class="number">${i+1}</span><div><h3>${esc(s[0])}</h3><p>${esc(s[1])}</p></div></section>`).join('')}</div><section class="section panel"><h3>Корисні посилання</h3><p class="subtle" style="margin:9px 0 16px">Застосунок допомагає знайти журнал, але не замінює офіційні накази та повідомлення редакцій.</p><div class="actions"><a class="btn secondary" href="${esc(safeUrl(source.catalogueUrl))}" target="_blank" rel="noopener noreferrer">Сторінка НУБіП ↗</a><a class="btn secondary" href="${esc(safeUrl(source.sourceMon))}" target="_blank" rel="noopener noreferrer">МОН України ↗</a>${btn('Підібрати видання','match','primary')}</div></section>`;}
  function details(id){const j=byId(id);if(!j)return;
    const rows=[['Напрям',j.area||'Уточнюється'],['Розділ на сайті НУБіП',catNames[j.catalogGroup]||'Не вказано'],['Спеціальності',(j.codes||[]).join(', ')||'Не вказані'],['Статус за редакцією',j.excluded?'Виключено з Переліку МОН':j.verifiedCategory?`Категорія ${j.verifiedCategory}`:'Потребує окремої перевірки'],['Мова публікацій',j.language||'Перевірте на сайті редакції'],['Періодичність',j.periodicity||'Перевірте на сайті редакції'],['ISSN',j.issn||'Уточнюється'],['e-ISSN',j.eissn||'Уточнюється'],['Scopus / Web of Science','Потребує перевірки'],['Вартість публікації','Перевірте у редакції']];
    layer.innerHTML=`<div class="dialog-backdrop" data-close-modal="true"><section class="dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title"><header class="dialog-head"><div><span class="overline">КАРТКА НАУКОВОГО ЖУРНАЛУ</span><h2 id="modal-title">${esc(j.name)}</h2><p class="subtle">${esc(j.en||'')}</p></div><button class="close" type="button" data-close-modal="true" aria-label="Закрити картку">×</button></header><div class="dialog-body"><div class="tags">${journalLabel(j)}${j.legacyCodes?'<span class="tag warn">Історичні коди</span>':''}</div><dl class="details">${rows.map(r=>`<dt>${esc(r[0])}</dt><dd>${esc(r[1])}</dd>`).join('')}</dl>${j.statusNote?`<div class="notice warn detail-note"><strong>Уточнення статусу</strong><p>${esc(j.statusNote)}</p>${j.statusSource?`<a class="small-link" href="${esc(safeUrl(j.statusSource))}" target="_blank" rel="noopener noreferrer">Джерело ↗</a>`:''}</div>`:''}${j.scopeNote?`<div class="notice detail-note"><p>${esc(j.scopeNote)}</p></div>`:''}${j.indexingNote?`<div class="notice detail-note"><p>${esc(j.indexingNote)}</p>${j.indexingSource?`<a class="small-link" href="${esc(safeUrl(j.indexingSource))}" target="_blank" rel="noopener noreferrer">Інформація НУБіП ↗</a>`:''}</div>`:''}<div class="detail-actions"><a class="btn primary" href="${esc(safeUrl(j.url))}" target="_blank" rel="noopener noreferrer">Офіційний сайт журналу ↗</a><button class="btn secondary" type="button" data-close-modal="true">Закрити</button></div></div></section></div>`;
    document.body.style.overflow='hidden'; layer.querySelector('.close').focus();
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
  }
  function go(route){if(!titles[route])return;state.route=route;closeModal();render();window.history.replaceState(null,'','#'+route);window.scrollTo({top:0,behavior:'instant'});}
  document.addEventListener('click', e=>{
    const route=e.target.closest('[data-route]');if(route){go(route.dataset.route);return;}
    const detail=e.target.closest('[data-details]');if(detail){details(detail.dataset.details);return;}
    const close=e.target.closest('[data-close-modal]');if(close&&(close.classList.contains('dialog-backdrop')||close.tagName==='BUTTON')){closeModal();return;}
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
  state.route=titles[location.hash.slice(1)]?location.hash.slice(1):'overview';
  if(!allCodes.includes(state.matchCode))state.matchCode=allCodes[0]||'';
  render();
  if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost'))window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
})();
