/* Єдиний список публічного каталогу: ТІЛЬКИ 16 журналів, наданих користувачем.
   Щоб змінити посилання чи текст картки, редагуйте цей файл, не app.js.
   catalogGroup – як журнал згрупований на сторінці університету, НЕ підтверджений чинний статус.
   verifiedCategory – підтвердження з сайту редакції з посиланням statusSource.
   excluded:true – позначка виключення з Переліку МОН (журнал лишається у каталозі).
*/
window.JOURNALS_DATA = {
  updated:'2026-11-18',
  catalogueUrl:'https://nubip.edu.ua/naukovi-zhurnaly-nubip-ukrayiny-0',
  sourceMon:'https://mon.gov.ua/nauka/nauka-2/atestatsiya-kadriv-vishchoi-kvalifikatsii/naukovi-fakhovi-vidannya',
  journals:[
    {id:'law',icon:'scale',name:'Право. Людина. Довкілля',en:'Law. Human. Environment',catalogGroup:'A',codes:['D8','D9'],area:'Право',url:'https://environmentalscience.com.ua/uk',verifiedCategory:'B',statusNote:'Сайт редакції повідомляє про категорію Б за наказом МОН № 928 від 11.06.2026. У каталозі НУБіП журнал зазначений у розділі А.',statusSource:'https://environmentalscience.com.ua/uk',language:'Англійська',periodicity:'4 випуски на рік',issn:'2663-1350',eissn:'2663-1369',authorUrl:'https://environmentalscience.com.ua/uk',scopeNote:'Редакція повідомляє про звуження тематики з № 1 за 2024 рік.'},
    {id:'reports',icon:'microscope',name:'Наукові доповіді НУБіП України',fullName:'Наукові доповіді Національного університету біоресурсів і природокористування України',en:'Scientific Reports of NULES of Ukraine',catalogGroup:'B',codes:['H1','H2','H3','H4','H5','H6','H7'],area:'Аграрні науки',url:'https://scireports.com.ua/uk'},
    {id:'animals',icon:'livestock',name:'Тваринництво та технології харчових продуктів',en:'Animal Science and Food Technology',catalogGroup:'B',codes:['G13'],area:'Харчові технології',url:'https://animalscience.com.ua/uk'},
    {id:'vet',icon:'veterinary',name:'Український часопис ветеринарних наук',en:'Ukrainian Journal of Veterinary Sciences',catalogGroup:'B',codes:['H6'],area:'Ветеринарна медицина',url:'https://veterinaryscience.com.ua/uk'},
    {id:'tech',icon:'gear',name:'Техніка та енергетика',en:'Machinery & Energetics',catalogGroup:'B',codes:['G9','G11'],area:'Інженерні науки',url:'https://technicalscience.com.ua/uk',verifiedCategory:'B',statusNote:'Редакція зазначає категорію Б за наказом МОН № 928 від 11.06.2026.',statusSource:'https://technicalscience.com.ua/uk'},
    {id:'forest',icon:'pine',name:'Український журнал лісівництва та деревинознавства',en:'Ukrainian Journal of Forest and Wood Science',catalogGroup:'B',codes:['H3','H4'],area:'Лісове господарство',url:'https://forestscience.com.ua/uk'},
    {id:'health',icon:'heart',name:'Здоров’я людини і нації',en:'Human and Nation’s Health',catalogGroup:'B',codes:['G13'],area:'Харчові технології',url:'https://humanhealth.nubip.edu.ua/index.php/hnh/uk'},
    {id:'plants',icon:'sprout',name:'Рослинництво та ґрунтознавство',en:'Plant and Soil Science',catalogGroup:'B',codes:['H1'],area:'Агрономія та садівництво',url:'https://agriculturalscience.com.ua/uk'},
    {id:'land',icon:'map',name:'Землеустрій, кадастр і моніторинг земель',en:'Land Management, Cadastre and Land Monitoring',catalogGroup:'B',codes:['G18','G17','G19'],area:'Землеустрій і будівництво',url:'https://journals.nubip.edu.ua/index.php/Zemleustriy/uk'},
    {id:'econ',icon:'chart',name:'Економіка і управління бізнесом',en:'Economics and Business Management',catalogGroup:'B',codes:['C1','D1','D2','D3','D5','D7','J3'],area:'Економіка та управління',url:'https://economicscience.com.ua/uk'},
    {id:'phil',icon:'languages',name:'Міжнародний філологічний часопис',en:'International Journal of Philology',catalogGroup:'B',codes:['B10','B11'],area:'Гуманітарні науки',url:'https://philologicalscience.com.ua/uk'},
    {id:'energy',icon:'bolt',name:'Енергетика і автоматика',en:'Energy and Automation',catalogGroup:'B',codes:['G3','G4'],area:'Енергетика',url:'https://journals.nubip.edu.ua/index.php/Energiya/uk'},
    {id:'human',icon:'graduation',name:'Гуманітарні студії: педагогіка, психологія, філософія',en:'Humanitarian Studios: Pedagogics, Psychology, Philosophy',catalogGroup:'B',codes:['A1','A5','C4','I10'],area:'Освіта та гуманітарні науки',url:'https://humstudios.com.ua/uk'},
    {id:'bio',icon:'dna',name:'Біологічні системи: теорія та інновації',en:'Biological Systems: Theory and Innovation',catalogGroup:'B',codes:['E1','G21'],area:'Біологія та біотехнології',url:'https://bioscience.com.ua/uk',indexingNote:'НУБіП 26.10.2026 повідомив про включення журналу до Scopus. Формальний статус категорії потребує окремого підтвердження.',indexingSource:'https://nubip.edu.ua/news/naukovyy-zhurnal-nubip-ukrayiny-biolohichni-systemy-teoriya-ta-innovatsiyi-uviyshov-do-scopus'},
    {id:'it',icon:'chip',name:'Інформаційні технології в економіці та природокористуванні',en:'Information Technologies in Economics and Environmental Sciences',catalogGroup:'B',codes:['F3','G7'],area:'Комп’ютерні науки та автоматизація',url:'https://journals.nubip.edu.ua/index.php/Inf/uk/about'},
    {id:'poultry',icon:'bird',name:'Сучасне птахівництво',en:'Modern Poultry',catalogGroup:'B',codes:['H2','H6'],area:'Тваринництво',url:'https://journals.nubip.edu.ua/index.php/Ptakhivnytstvo/uk',excluded:true,statusNote:'У каталозі НУБіП прямо зазначено: виключений з Переліку фахових видань МОН з квітня 2025 року.',statusSource:'https://nubip.edu.ua/naukovi-zhurnaly-nubip-ukrayiny-0'}
  ]
};
