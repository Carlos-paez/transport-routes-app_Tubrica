// ==========================================
// 1. CONFIGURACIÓN INICIAL Y MAPAS BASE
// ==========================================
const TUBRICA_LOCATION = L.latLng(10.09673945749423, -69.35846137671071);

// Paleta de colores vibrantes para las rutas
const ROUTE_COLORS = [
    "#e74c3c", // Rojo
    "#3498db", // Azul
    "#2ecc71", // Verde
    "#f39c12", // Naranja
    "#9b59b6", // Púrpura
    "#1abc9c", // Turquesa
    "#e67e22", // Naranja oscuro
    "#34495e", // Gris oscuro
    "#16a085", // Verde azulado
    "#27ae60", // Verde esmeralda
    "#2980b9", // Azul oscuro
    "#8e44ad", // Púrpura oscuro
    "#c0392b", // Rojo oscuro
    "#d35400", // Naranja quemado
    "#f1c40f", // Amarillo
    "#e91e63", // Rosa
    "#00bcd4", // Cian
    "#4caf50", // Verde claro
    "#ff9800", // Naranja brillante
    "#795548", // Marrón
];

let colorIndex = 0;
let usedColors = []; // Colores ya usados por rutas OMEGA

// Función para obtener el siguiente color único para rutas OMEGA
function getNextRouteColor() {
    // Buscar un color que no haya sido usado
    for (let i = 0; i < ROUTE_COLORS.length; i++) {
        const color = ROUTE_COLORS[(colorIndex + i) % ROUTE_COLORS.length];
        if (!usedColors.includes(color)) {
            usedColors.push(color);
            colorIndex = (colorIndex + i + 1) % ROUTE_COLORS.length;
            return color;
        }
    }
    // Si todos los colores están usados, reiniciar y usar el siguiente
    const color = ROUTE_COLORS[colorIndex % ROUTE_COLORS.length];
    colorIndex++;
    return color;
}

// Función para reiniciar los colores usados (para rutas no-OMEGA)
function resetUsedColors() {
    usedColors = [];
}

// Función para obtener un color aleatorio
function getRandomRouteColor() {
    return ROUTE_COLORS[Math.floor(Math.random() * ROUTE_COLORS.length)];
}

// Capas Base con crossOrigin para permitir captura de PDF sin distorsión
const mapaCalle = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19, crossOrigin: true, attribution: '© OpenStreetMap'
});

const satelitePuro = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19, crossOrigin: true, attribution: 'Esri'
});

const etiquetasCalles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19, crossOrigin: true, pane: 'overlayPane'
});

const mapaHibrido = L.layerGroup([satelitePuro, etiquetasCalles]);

// Inicializar el mapa (preferCanvas: true es vital para que las líneas salgan en el PDF)
const map = L.map("map", {
    preferCanvas: true,
    doubleClickZoom: false,
    zoomControl: false,
    layers: [mapaCalle]
}).setView(TUBRICA_LOCATION, 13);

const boundaryLayer = L.layerGroup().addTo(map);
const omegaLayer = L.layerGroup().addTo(map);
const drawnItems = L.featureGroup().addTo(map);
const markersLayer = L.layerGroup().addTo(map); // <--- NUEVA CAPA DE MARCADORES

// Controles de Interfaz
L.control.layers({ "Mapa de Calles": mapaCalle, "Satélite": satelitePuro, "Vista Híbrida": mapaHibrido }, { "📍 Marcadores": markersLayer }, { position: 'topright', collapsed: false }).addTo(map);
L.control.zoom({ position: "bottomright" }).addTo(map);

let currentMode = null, smartRoutePoints = [], tempMarkers = [], previewLine = null, eraserCircle = null, eraserSize = 30;

L.marker(TUBRICA_LOCATION, { interactive: false }).addTo(markersLayer).bindPopup("<b>📍 SEDE TUBRICA</b>").openPopup();

// ==========================================
// 2. DATASET OMEGA ACTUALIZADO (COORDENADAS FIJAS)
// ==========================================
const OMEGA_WAYPOINTS = [
  // --- PAGINA 1 ---
  {
    name: "OESTE (Admin)",
    points: [
      [10.036946792710989, -69.39457370120459],
      [10.032282058857287, -69.39408152059802],
      [10.031163726980445, -69.39583285176832],
      [10.028725053031852, -69.40243904859514],
      [10.02574641877343, -69.40681424505227],
      [10.025948719737052, -69.40619745864109],
      [10.028763233795685, -69.40242558800593],
      [10.02923403199984, -69.40246380948507],
      [10.032026715454714, -69.40392633651274],
      [10.032399693378599, -69.40399967911662],
      [10.045804381239233, -69.40531726754776],
      [10.046143178189599, -69.40598440978118],
      [10.04588667086682, -69.40834989287501],
      [10.04569729099272, -69.41001940974678],
      [10.045655209233393, -69.4103135123892],
      [10.045558651038721, -69.41132922038818],
      [10.045440924114077, -69.41210693969653],
      [10.021068015176473, -69.46800009861842],
      [10.020661886181786, -69.46821654637175],
      [10.019815238031994, -69.46977377563877],
      [10.020081563065773, -69.46916915194362],
      [10.02113143638665, -69.46757190248336],
      [10.022156667131751, -69.46480927458],
      [10.019235517395934, -69.46282166482864],
      [10.020402372331773, -69.45750032035023],
      [10.0247774815911, -69.45923439219241],
      [10.02542939075191, -69.45889484570729],
      [10.04293554975403, -69.41867511761735],
      [10.042336648285424, -69.41878741883518],
      [10.043076303067078, -69.41979298523161],
      [10.047282438330052, -69.41954764173494],
      [10.096739097337583, -69.35843881714668],
    ],
    desc: "Cerro Mara - La Y - Rio Linare - El Caribe - El Tostado - TUBRICA",
  },
  /*{
    name: "SUR OESTE (Admin)",
    points: [
      [10.052, -69.358],
      [10.055, -69.362],
      [10.065, -69.368],
      [10.075, -69.355],
      [10.0967, -69.3584],
    ],
    desc: "Horcones - Carucieña - Cerrajones - Ruiz Pineda - Sta Isabel - TUBRICA",
  },*/
  {
    name: "PAVIA (Admin y Rot)",
    points: [
      [10.101963955594941, -69.4369901160083],
      [10.076212201255366, -69.4002094662229],
      [10.09673919002261, -69.35846256186029],
    ],
    desc: "Punto Fe y Alegría - Altos de Pavía - TUBRICA",
  },
  /*{
    name: "SUR OESTE (Rot)",
    points: [
      [10.052, -69.358],
      [10.06, -69.365],
      [10.068, -69.36],
      [10.0967, -69.3584],
    ],
    desc: "Gimnasio Los Horcones - Carucieña - Ruiz Pineda - TUBRICA",
  },
  {
    name: "OESTE (Rot)",
    points: [
      [10.063, -69.395],
      [10.072, -69.388],
      [10.082, -69.375],
      [10.0967, -69.3584],
    ],
    desc: "Cerro Mara - La Y - Rio Linare - Nueva Paz - Valle Dorado - TUBRICA",
  },
  {
    name: "CABUDARE (Rot)",
    points: [
      [10.035, -69.268],
      [10.042, -69.285],
      [10.051, -69.282],
      [10.078, -69.335],
      [10.0967, -69.3584],
    ],
    desc: "Trigal - Plaza Bolivar - Chucho Briceño - Agua Viva - TUBRICA",
  },
  {
    name: "PAVIA (Rot)",
    points: [
      [10.102243296082907, -69.43746036939227],
      [10.076212201255366, -69.4002094662229],
      [10.09673919002261, -69.35846256186029],
    ],
    desc: "C.C. Quatro's C.A. - TUBRICA",
  },*/
  {
    name: "CABUDARE A (Admin)",
    points: [
      [10.01131109931415, -69.30110831668796],
      [10.017873706427734, -69.30305997339077],
      [10.017997233316681, -69.30300340266967],
      [10.018709328589742, -69.30208597316108],
      [10.02153886175965, -69.30034960967232],
      [10.028734264555007, -69.29420299584005],
      [10.023320265243386, -69.28222479737359],
      [10.022671656339432, -69.27764142941568],
      [10.02467851795581, -69.2724204273012],
      [10.024606215475437, -69.27237389131616],
      [10.020737765955644, -69.27216791042109],
      [10.020657836268576, -69.27207650511393],
      [10.020681195024293, -69.2693616116584],
      [10.020578813704034, -69.26892494886285],
      [10.019978226328986, -69.26665095262817],
      [10.020045579219374, -69.26600890672933],
      [10.021173905997916, -69.26643772149193],
      [10.025929996827143, -69.26530872665624],
      [10.025990745551313, -69.2650780566685],
      [10.025889057462805, -69.26465426764271],
      [10.026095524691238, -69.26458958959404],
      [10.02794495078344, -69.26419852757182],
      [10.028060744043085, -69.2644754323815],
      [10.028434270405088, -69.26556787874075],
      [10.02971172735048, -69.26597754609666],
      [10.030397652555948, -69.26599363933641],
      [10.03078889006315, -69.26599340840013],
      [10.031765165510208, -69.26601029392413],
      [10.033278145147765, -69.26611994876627],
      [10.033055513859237, -69.27417497992116],
      [10.034951473049912, -69.27752104948168],
      [10.03511115222424, -69.27803597861697],
      [10.035068218173533, -69.28130782145712],
      [10.04665015735794, -69.34793428212882],
      [10.046024662649728, -69.35212910587718],
      [10.065199775011772, -69.3565035292368],
      [10.067533307678909, -69.35902531909711],
      [10.096739205890346, -69.35844647129151],
    ],
    desc: "Loma Alta - Agua Viva - Fermin Toro - Cabudare Centro - Ribereña - TUBRICA",
  },
  {
    name: "CABUDARE B (Admin)",
    points: [
      [10.032446362056294, -69.25246424678818],
      [10.032139864373757, -69.25256729455693],
      [10.031858070133856, -69.25265314912666],
      [10.031728506548255, -69.25253513014464],
      [10.031068773947002, -69.25036222453556],
      [10.0311831240951, -69.249939578235],
      [10.031400502230678, -69.24993464460921],
      [10.031553790812234, -69.24991954040917],
      [10.031794927822842, -69.24990774155961],
      [10.03222346387236, -69.2498719833022],
      [10.034844601436548, -69.24973057447123],
      [10.03497005729312, -69.249517338843],
      [10.034860078215951, -69.24774866860425],
      [10.035012912850958, -69.24551295522929],
      [10.036650652244438, -69.2454753637257],
      [10.037990059082851, -69.24547424074834],
      [10.038068902238118, -69.24513141081806],
      [10.036761376759529, -69.24222453524874],
      [10.034661268873528, -69.23917349058716],
      [10.034430258625186, -69.23915550498923],
      [10.032239972212004, -69.24068228136251],
      [10.03198868090308, -69.24063371033294],
      [10.03139362937017, -69.23964420456214],
      [10.03011160056687, -69.23758826350112],
      [10.0298494457374, -69.2375459768308],
      [10.026439939208501, -69.2397294853325],
      [10.026102000287617, -69.23963089309176],
      [10.025712803006119, -69.23886619670286],
      [10.025387995213617, -69.23827819579141],
      [10.025002624220427, -69.23773097042029],
      [10.024766885760755, -69.23732701329273],
      [10.024631527437162, -69.23711003903124],
      [10.024355550305888, -69.23661981360564],
      [10.02409502736456, -69.2361586294435],
      [10.023807255913603, -69.23582465096152],
      [10.022224867900974, -69.23393755215838],
      [10.021898026096055, -69.23351650511901],
      [10.017740570843532, -69.2282556862387],
      [10.01718986812967, -69.22813431811856],
      [10.012534916104995, -69.22817580496577],
      [10.011073326086247, -69.22816382754846],
      [10.01105465249486, -69.22852641959958],
      [10.011365283104, -69.2288298621633],
      [10.032364223073326, -69.25644291118081],
      [10.042277813548035, -69.25995477811836],
      [10.042412760435772, -69.2573735311573],
      [10.041366990085114, -69.25665040779536],
      [10.040585864217237, -69.25731195515804],
      [10.040561857024851, -69.25764639884808],
      [10.040540213159868, -69.2578894823775],
      [10.040493290836638, -69.25859976541831],
      [10.04048014446783, -69.25907441122206],
      [10.040322894459008, -69.26203642613245],
      [10.03995588374377, -69.26810705631091],
      [10.038178943074929, -69.28175800481317],
      [10.040220358572864, -69.28312582589444],
      [10.046058286920887, -69.3518692405319],
      [10.046377117416396, -69.35221306124373],
      [10.065143297032794, -69.35647929409645],
      [10.067958612899707, -69.36057916535316],
      [10.074110207566664, -69.37868424334688],
      [10.075231007541865, -69.37860393925689],
      [10.096739951716271, -69.35844143852852],
    ],
    desc: "El Recreo - La Campiña - La Mora - El Palmar - TUBRICA",
  },
  /*{
    name: "CABUDARE B 'la Mora' (Admin)",
    points: [
      [10.032446362056294, -69.25246424678818],
      [10.032139864373757, -69.25256729455693],
      [10.031858070133856, -69.25265314912666],
      [10.031728506548255, -69.25253513014464],
      [10.031068773947002, -69.25036222453556],
      [10.0311831240951, -69.249939578235],
      [10.031400502230678, -69.24993464460921],
      [10.031553790812234, -69.24991954040917],
      [10.031794927822842, -69.24990774155961],
      [10.03222346387236, -69.2498719833022],
      [10.034844601436548, -69.24973057447123],
      [10.03497005729312, -69.249517338843],
      [10.034860078215951, -69.24774866860425],
      [10.035012912850958, -69.24551295522929],
      [10.036650652244438, -69.2454753637257],
      [10.037990059082851, -69.24547424074834],
      [10.038068902238118, -69.24513141081806],
      [10.036761376759529, -69.24222453524874],
      [10.034661268873528, -69.23917349058716],
      [10.034430258625186, -69.23915550498923],
      [10.032239972212004, -69.24068228136251],
      [10.03198868090308, -69.24063371033294],
      [10.03139362937017, -69.23964420456214],
      [10.03011160056687, -69.23758826350112],
      [10.0298494457374, -69.2375459768308],
      [10.026439939208501, -69.2397294853325],
      [10.026102000287617, -69.23963089309176],
      [10.025712803006119, -69.23886619670286],
      [10.025387995213617, -69.23827819579141],
      [10.025002624220427, -69.23773097042029],
      [10.024766885760755, -69.23732701329273],
      [10.024631527437162, -69.23711003903124],
      [10.024355550305888, -69.23661981360564],
      [10.02409502736456, -69.2361586294435],
      [10.023807255913603, -69.23582465096152],
      [10.022224867900974, -69.23393755215838],
      [10.021898026096055, -69.23351650511901],
      [10.017740570843532, -69.2282556862387],
      [10.01718986812967, -69.22813431811856],
      [10.012534916104995, -69.22817580496577],
      [10.011073326086247, -69.22816382754846],
      [10.01105465249486, -69.22852641959958],
      [10.011365283104, -69.2288298621633],
      [10.032364223073326, -69.25644291118081],
      [10.042277813548035, -69.25995477811836],
      [10.042412760435772, -69.2573735311573],
      [10.041366990085114, -69.25665040779536],
      [10.040585864217237, -69.25731195515804],
      [10.040561857024851, -69.25764639884808],
      [10.040540213159868, -69.2578894823775],
      [10.040493290836638, -69.25859976541831],
      [10.04048014446783, -69.25907441122206],
      [10.040322894459008, -69.26203642613245],
      [10.03995588374377, -69.26810705631091],
      [10.038178943074929, -69.28175800481317],
      [10.040220358572864, -69.28312582589444],
      [10.046058286920887, -69.3518692405319],
      [10.046377117416396, -69.35221306124373],
      [10.065143297032794, -69.35647929409645],
      [10.067958612899707, -69.36057916535316],
      [10.074110207566664, -69.37868424334688],
      [10.075231007541865, -69.37860393925689],
      [10.096739951716271, -69.35844143852852],
    ],
    desc: "El Recreo - La Campiña - La Mora - El Palmar - TUBRICA",
  },
  {
    name: "RUEZGA / UNION (Rot)",
    points: [
      [10.108, -69.315],
      [10.102, -69.325],
      [10.095, -69.332],
      [10.088, -69.345],
      [10.0967, -69.3584],
    ],
    desc: "Ruezga Sect 4 y 7 - Santos Luzardo - B. Union - La Peña - TUBRICA",
  },
  {
    name: "ESTE-CENTRO (Rot)",
    points: [
      [10.078, -69.295],
      [10.072, -69.305],
      [10.065, -69.312],
      [10.082, -69.338],
      [10.0967, -69.3584],
    ],
    desc: "Rio Lama - Vargas - Libertador - Metropolis - Seguro - TUBRICA",
  },
 {
    name: "NORTE (Rot)",
    points: [
      [10.155, -69.305],
      [10.132, -69.325],
      [10.125, -69.338],
      [10.108, -69.348],
      [10.0967, -69.3584],
    ],
    desc: "Ali Primera - Yucatan - Via Duaca - El Cuji - Circunvalacion - TUBRICA",
  },*/
  {
    name: "ESTE 1 (Admin)",
    points: [
      [10.117361844713395, -69.2473873897263],
      [10.109304574665842, -69.25114866052009],
      [10.101031992272528, -69.2518618711457],
      [10.096372954430365, -69.25318276093476],
      [10.087372210122021, -69.26851517087435],
      [10.082836988207603, -69.27729038003987],
      [10.082247315195527, -69.27772555595752],
      [10.081354620729462, -69.27758233426482],
      [10.075724742095515, -69.27944948764515],
      [10.07512286768675, -69.27999603334024],
      [10.072608209660185, -69.28053199288021],
      [10.072494223043686, -69.28163323730752],
      [10.072610777287629, -69.28298280225573],
      [10.072436540789559, -69.28306049082003],
      [10.068241795359032, -69.28404258886044],
      [10.068552129347431, -69.28426811036866],
      [10.072106348628644, -69.28287279850484],
      [10.072210618435367, -69.28058740579823],
      [10.072393191780927, -69.28072386333255],
      [10.073212749258877, -69.2850535149916],
      [10.073405655454001, -69.2891025880851],
      [10.074277486498127, -69.2950778875743],
      [10.074588481677281, -69.29811263437699],
      [10.079183592036626, -69.30122028395859],
      [10.081005774003122, -69.30275527823726],
      [10.081366243500955, -69.30319436428066],
      [10.081526594578465, -69.30355527471372],
      [10.08160099744808, -69.3037702574946],
      [10.081564832105428, -69.30404603146208],
      [10.081617647991687, -69.30419556459528],
      [10.084088038795532, -69.3144871252612],
      [10.084447617486775, -69.31466654601182],
      [10.101571963605817, -69.31076991314917],
      [10.107071129912201, -69.30857501727199],
      [10.109733247679532, -69.30715266123089],
      [10.110321846575928, -69.30580624332656],
      [10.109607652029554, -69.3060193427425],
      [10.109151540856933, -69.30918033750699],
      [10.107997874175926, -69.3117912379766],
      [10.107757581527318, -69.31223112027884],
      [10.096740079602432, -69.35844069767926],
    ],
    desc: "Plaza del Cercado - Brisas del Este - Los Proceres - El Jebe - TUBRICA",
  },
  /*{
    name: "ESTE 2 (Admin)",
    points: [
      [10.005, -69.242],
      [10.015, -69.265],
      [10.035, -69.295],
      [10.0967, -69.3584],
    ],
    desc: "El Recreo - Piedad Norte - La Mora - TUBRICA",
  },*/
  {
    name: "MANZANO CENTRO (Admin)",
    points: [
      [10.065754563512881, -69.30827898493779],
      [10.0610509948013, -69.31484988417411],
      [10.064430726980524, -69.32258594237176],
      [10.064114529101039, -69.32604132840817],
      [10.063898789093432, -69.32856098402472],
      [10.063714413429553, -69.33099820170119],
      [10.063575513661819, -69.33300658437625],
      [10.063385677250418, -69.33538609226295],
      [10.063200063850163, -69.33793329891041],
      [10.06301615499641, -69.34039284922306],
      [10.062882644727523, -69.3420952161619],
      [10.062738167550727, -69.34427532644503],
      [10.062671522246047, -69.34489681035761],
      [10.04716776711584, -69.3446564851368],
      [10.046713125688857, -69.34762608400435],
      [10.047091031234965, -69.34779317759242],
      [10.052331573559671, -69.34963257689029],
      [10.058178805276047, -69.35192438982845],
      [10.059031886776475, -69.35224123940145],
      [10.059664003312273, -69.35184048618025],
      [10.059702815812164, -69.35147951266697],
      [10.06023561715745, -69.35151369562907],
      [10.060397396907515, -69.35209247493961],
      [10.060362416127251, -69.35532578747251],
      [10.0605315175918, -69.35544957484454],
      [10.096740975023254, -69.35844094946187],
    ],
    desc: "Puente Macuto - Carr 18 - Calle 24, 35 y 54 - TUBRICA",
  },
  // --- PAGINA 2 ---
  {
    name: "NORTE (Admin)",
    points: [
      [10.206372210955742, -69.30584636546004],
      [10.200856688748825, -69.30466524850138],
      [10.160180927668621, -69.31536263157473],
      [10.157543563660772, -69.31991577890504],
      [10.150661968584746, -69.31536013377229],
      [10.106394505275713, -69.32653213802232],
      [10.098970543680181, -69.35439162942978],
      [10.098543698731946, -69.35458657496032],
      [10.096740149398737, -69.35844076694916],
    ],
    desc: "Yucatan - Tamaca - Sabana Grande - Macias Mujica - Zona Ind II - TUBRICA",
  },
  {
    //traza desvios erroneos cerca del callejon y la calle 11 con calle 1, son lineas rectas, sin cruces
    name: "RUEZGA / UNION (Admin)",
    points: [
      [10.102015067019032, -69.33458629573151],
      [10.098963762024699, -69.33325106601977],
      [10.097009673728325, -69.33113748525108],
      [10.089174319765958, -69.32882803130896],
      [10.088809898525101, -69.33009403400054],
      [10.087156794104592, -69.3298016731991],
      [10.08884158734706, -69.33118032864812],
      [10.090347079495286, -69.33171842129163],
      [10.09063844031557, -69.33175506366452],
      [10.090845907319052, -69.33176783295704],
      [10.09146629041387, -69.33176048572396],
      [10.093744639904859, -69.33224084725906],
      [10.093493413182822, -69.33585796949542],
      [10.093154182451908, -69.33588739755771],
      [10.09218144671909, -69.33582650247936],
      [10.091126764042178, -69.33576530554376],
      [10.090890696214263, -69.33573014381541],
      [10.09059861210338, -69.33570104485871],
      [10.089963889151008, -69.33557556123255],
      [10.087672202272339, -69.3480262031196],
      [10.086533880588435, -69.34936200723237],
      [10.085312548045113, -69.34892895889281],
      [10.081501960822061, -69.34946124740897],
      [10.083722588207095, -69.34927629968347],
      [10.086467262550498, -69.34961912958794],
      [10.086240999758296, -69.3509962782471],
      [10.085617322097857, -69.3579113117615],
      [10.083916821628973, -69.35851551832934],
      [10.079312920284323, -69.36211988169612],
      [10.074339376700701, -69.37025056938586],
      [10.07139254867341, -69.37082776826064],
      [10.074167808615709, -69.37902849266871],
      [10.074520000508565, -69.37889396338791],
      [10.07825999909279, -69.37727014344046],
      [10.085734110105724, -69.3699676251396],
      [10.089159478406902, -69.36632811172477],
      [10.090638285043777, -69.36722933400247],
      [10.092591622549229, -69.3644841578903],
      [10.088088298261177, -69.35970258275245],
      [10.091646764883889, -69.35621685518034],
      [10.092188582313796, -69.35634316094072],
      [10.09665966024831, -69.35843952529602],
    ],
    desc: "Circunvalacion - Barrio Lindo - Los Luises - Delicia - Crepusculos - TUBRICA",
  },
];

// ==========================================
// 3. INICIALIZACIÓN DE DATOS Y MENÚS
// ==========================================
async function init() {
    cargarMunicipios();
    await loadData();
    await cargarRutasOmegaInteligentes();
}
init();

async function cargarRutasOmegaInteligentes() {
    const list = document.getElementById("omega-route-list");
    list.innerHTML = "";

    // Primero cargar rutas guardadas desde la BD
    const res = await fetch('api.php');
    const savedData = await res.json();
    const savedOmegaRoutes = savedData.filter(el => el.type === 'route' && el.name && el.name.includes('(Admin)') || el.name.includes('(Rot)'));
    
    // Crear un mapa de rutas guardadas por nombre
    const savedRoutesMap = {};
    savedOmegaRoutes.forEach(route => {
        savedRoutesMap[route.name] = route;
    });

    for (let i = 0; i < OMEGA_WAYPOINTS.length; i++) {
        const routeData = OMEGA_WAYPOINTS[i];
        
        // Verificar si existe una versión guardada
        const savedRoute = savedRoutesMap[routeData.name];
        
        if (savedRoute) {
            // Usar la versión guardada (editada)
            let omegaColor = savedRoute.color;
            if (!omegaColor) {
                omegaColor = getNextRouteColor();
            } else if (!usedColors.includes(omegaColor)) {
                usedColors.push(omegaColor);
            }
            const layer = renderRoute(savedRoute.geometry, routeData.name, savedRoute.id, null, true, omegaColor);
            
            // Guardar el color en el objeto route para usar en la barra lateral
            OMEGA_WAYPOINTS[i].color = omegaColor;
            
            const item = document.createElement("div");
            item.className = "omega-item";
            item.innerHTML = `
          <input type="checkbox" checked id="chk-omega-${i}" onchange="window.toggleOmegaLayer(${i}, this.checked)">
          <span onclick="window.focusRoute(${i})">${routeData.name}</span>
        `;
            list.appendChild(item);
            OMEGA_WAYPOINTS[i].layer = layer;
        } else {
            // Generar desde coordenadas originales y guardar
            const coordsStr = routeData.points.map((p) => `${p[1]},${p[0]}`).join(";");
            const url = `https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`;

            try {
                const fetchRes = await fetch(url);
                const data = await fetchRes.json();
                if (data.routes && data.routes.length > 0) {
                    const polyCoords = data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);
                    const omegaColor = getNextRouteColor();
                    
                    // Guardar en BD la primera vez
                    const newId = await saveElement(routeData.name, 'route', polyCoords, omegaColor);
                    const layer = renderRoute(polyCoords, routeData.name, newId, null, true, omegaColor);

                    // Guardar el color en el objeto route para usar en la barra lateral
                    OMEGA_WAYPOINTS[i].color = omegaColor;
                    
                    const item = document.createElement("div");
                    item.className = "omega-item";
                    item.innerHTML = `
          <input type="checkbox" checked id="chk-omega-${i}" onchange="window.toggleOmegaLayer(${i}, this.checked)">
          <span onclick="window.focusRoute(${i})">${routeData.name}</span>
        `;
                    list.appendChild(item);
                    OMEGA_WAYPOINTS[i].layer = layer;
                }
                await new Promise(r => setTimeout(r, 100));
            } catch (e) { console.error("Error cargando:", routeData.name); }
        }
    }
}

// ==========================================
// 4. RENDERIZADO Y PERSISTENCIA (PHP)
// ==========================================
function renderRoute(latlngs, name, id, dur = null, isOmega = false, savedColor = null) {
    if (!latlngs || latlngs.length < 2) return;
    
    // Asignar color: usar color guardado, naranja para OMEGA, o color único para cada ruta nueva
    const routeColor = savedColor || (isOmega ? "#e67e22" : getNextRouteColor());
    
    const poly = L.polyline(latlngs, { color: routeColor, weight: 5, smoothFactor: 1.5 });

    const start = L.circleMarker(latlngs[0], { radius: 4, color: '#2ecc71', fillColor: 'white', fillOpacity: 1 });
    const end = L.circleMarker(latlngs[latlngs.length-1], { radius: 4, color: '#e74c3c', fillColor: 'white', fillOpacity: 1 });
    // Ocultar etiquetas de texto de las rutas - solo mostrar líneas
    const label = L.marker([0,0], { interactive: false, opacity: 0, icon: L.divIcon({ className: "route-label", html: "", iconSize: null }) });

    const group = L.layerGroup([poly, label, start, end]);
    group.dbId = id; 
    group.type = 'route'; 
    group.name = name; 
    group.routeLine = poly; 
    group.routeColor = routeColor; // Guardar el color
    group.isDirty = false;

    group.routeName = name; // Guardar el nombre para la leyenda
    group.refreshStats = function () {
        const pts = poly.getLatLngs();
        if (pts.length < 2) return;
        let m = 0;
        for (let i = 1; i < pts.length; i++) m += map.distance(pts[i - 1], pts[i]);
        const dist = (m / 1000).toFixed(1);
        const time = Math.round(m / 11.11 / 60);
        group.totalDistance = m;
        group.totalTime = m / 11.11;
        label.setLatLng(pts[Math.floor(pts.length / 2)]);
        label.setIcon(L.divIcon({
            className: "route-label",
            html: `<div class="route-text"><span class="route-name">${name}</span><span class="route-stats">${dist}km | ${time}m</span></div>`,
            iconAnchor: [0, 0]
        }));
        start.setLatLng(pts[0]);
        end.setLatLng(pts[pts.length - 1]);
        updateLegend(); // Actualizar la barra de leyenda derecha
    };
    group.refreshStats();

    [poly, start, end].forEach((l) =>
        l.on("click", (e) => {
            L.DomEvent.stopPropagation(e);
            if (currentMode === "delete") handleDelete(group);
            else if (currentMode === "edit") {
                if (poly.editing.enabled()) { poly.editing.disable(); saveLayer(group); }
                else poly.editing.enable();
            }
        })
    );
    poly.on("edit", () => { group.refreshStats(); group.isDirty = true; });

    if (isOmega) group.addTo(omegaLayer);
    else group.addTo(drawnItems);
    return group;
}

// ==========================================
// 5. EXPORTACIÓN PDF (CORREGIDA Y SIN DISTORSIÓN)
// ==========================================
window.exportMapToPDF = function () {
    const mapDiv = document.getElementById("map");
    const btn = document.querySelector(".btn-pdf");
    const originalText = btn.innerHTML;

    btn.innerHTML = "⏳ Generando PDF HD...";
    btn.disabled = true;

    // Pequeño retraso para asegurar renderizado de capas satelitales/híbridas
    setTimeout(() => {
        html2canvas(mapDiv, {
            useCORS: true,
            scale: 3, // Alta definición
            logging: false,
            backgroundColor: '#ffffff'
        }).then(canvas => {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // CALCULO DE PROPORCIÓN PARA EVITAR DISTORSIÓN
            const canvasRatio = canvas.height / canvas.width;
            const imgWidth = pdfWidth - 20; // 10mm de margen a cada lado
            const imgHeight = imgWidth * canvasRatio;

            const imgData = canvas.toDataURL("image/png");

            // Título y Fecha
            pdf.setFontSize(14);
            pdf.text("REPORTE GEOGRÁFICO DE TRANSPORTE - TUBRICA", 10, 12);
            pdf.setFontSize(8);
            pdf.text(`Generado: ${new Date().toLocaleString()}`, 10, 18);

            // Insertar imagen centrada
            const yOffset = (pdfHeight - imgHeight) / 2 + 10;
            pdf.addImage(imgData, 'PNG', 10, yOffset > 25 ? yOffset : 25, imgWidth, imgHeight);

            pdf.save(`TUBRICA_LOGISTICA_${new Date().getTime()}.pdf`);

            btn.innerHTML = originalText;
            btn.disabled = false;
        });
    }, 500);
};

// ==========================================
// 6. UTILIDADES Y HERRAMIENTAS
// ==========================================
// toggleOmegaLayer y toggleAllOmega definidos mas abajo (con soporte de updateLegend)
window.focusRoute = (i) => map.fitBounds(OMEGA_WAYPOINTS[i].layer.getLayers().find(l => l instanceof L.Polyline).getBounds(), { padding: [50, 50] });

map.on("click", (e) => {
    if (currentMode === "marker") {
        const n = prompt("Nombre del marcador:");
        if (n) {
            saveElement(n, "marker", e.latlng).then(id => {
                renderMarker(e.latlng, n, id);
                setStatus("Marcador creado: " + n);
            });
        }
    } else if (currentMode === "smart") {
        smartRoutePoints.push(e.latlng);
        const m = L.circleMarker(e.latlng, { radius: 7, color: "#e67e22", fillColor: "white", fillOpacity: 1 }).addTo(map);
        m.on("click", (ev) => { L.DomEvent.stopPropagation(ev); if (smartRoutePoints.length >= 2) finalizeSmart(); });
        tempMarkers.push(m);
        if (smartRoutePoints.length >= 2) updatePreview();
    } else if (currentMode === "to-tubrica") {
        fetchOSRMDirect([e.latlng, TUBRICA_LOCATION]);
    }
});

map.on("mousemove", (e) => {
    if (currentMode !== "eraser" || !eraserCircle) return;
    eraserCircle.setLatLng(e.latlng);
    [drawnItems, omegaLayer].forEach((lg) =>
        lg.eachLayer((g) => {
            if (g.type !== "route") return;
            const pts = g.routeLine.getLatLngs();
            const initialCount = pts.length;
            const filt = pts.filter((p) => map.distance(p, e.latlng) > eraserSize);
            if (filt.length !== initialCount) { g.routeLine.setLatLngs(filt); g.isDirty = true; g.refreshStats(); }
        })
    );
});

map.on("mouseup", async () => {
    if (currentMode === "eraser") {
        drawnItems.eachLayer(async (g) => { if (g.isDirty && g.dbId) await saveLayer(g); });
        omegaLayer.eachLayer(async (g) => { if (g.isDirty && g.dbId) await saveLayer(g); });
    }
});

async function saveElement(n, t, g, color = null) {
    const res = await fetch('api.php', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ name: n, type: t, geometry: g, color: color }) });
    const d = await res.json(); return d.id;
}

async function saveLayer(l) {
    if (!l.dbId) return;
    // Ahora también guardamos las rutas Omega editadas
    await fetch(`api.php?id=${l.dbId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ geometry: l.routeLine.getLatLngs(), color: l.routeColor }) });
    l.isDirty = false;
}

async function loadData() {
    const res = await fetch('api.php');
    const data = await res.json();
    // Solo cargar rutas que NO sean Omega (las Omega se cargan en cargarRutasOmegaInteligentes)
    data.forEach(el => {
        const isOmegaRoute = el.type === 'route' && el.name && (el.name.includes('(Admin)') || el.name.includes('(Rot)'));
        if (!isOmegaRoute) {
            if (el.type === 'route') renderRoute(el.geometry, el.name, el.id, null, false, el.color);
            else renderMarker(el.geometry, el.name, el.id);
        }
    });
}

function renderMarker(latlng, name, id) {
    const m = L.marker(latlng).bindPopup(name); m.dbId = id;
    m.on('click', e => { L.DomEvent.stopPropagation(e); if (currentMode === "delete") handleDelete(m); });
    m.addTo(markersLayer);
}

async function handleDelete(l) { 
    if (confirm("¿Borrar elemento?")) { 
        if(l.dbId) 
            await fetch(`api.php?id=${l.dbId}`, { method: 'DELETE' }); 
        drawnItems.removeLayer(l); 
        omegaLayer.removeLayer(l); 
        markersLayer.removeLayer(l); 
    } 
}

async function cargarMunicipios() {
    const zonas = [{name:"Iribarren", id:2211603, col:"#2980b9"}, {name:"Palavecino", id:2211604, col:"#27ae60"}, {name:"Ayacucho", id:7293700, col:"#c0392b"}];
    zonas.forEach(z => {
        fetch(`https://nominatim.openstreetmap.org/details.php?osmtype=R&osmid=${z.id}&class=boundary&format=json&polygon_geojson=1`)
            .then(r => r.json()).then(data => {
            if (data.geometry) L.geoJSON(data.geometry, { interactive: false, style: { color: z.col, weight: 2, opacity: 0.5, fillColor: z.col, fillOpacity: 0.05 } }).addTo(boundaryLayer);
        });
    });
}

function resetModes() {
    currentMode = null; smartRoutePoints = [];
    [drawnItems, omegaLayer].forEach(lg => lg.eachLayer(g => { if(g.routeLine?.editing) g.routeLine.editing.disable(); }));
    tempMarkers.forEach(m => map.removeLayer(m)); tempMarkers = [];
    if (previewLine) map.removeLayer(previewLine);
    if (eraserCircle) { map.removeLayer(eraserCircle); eraserCircle = null; }
    // Desactivar cualquier herramienta de dibujo activa
    if (map._drawControl) {
        try {
            map._drawControl.disable();
            map._drawControl = null;
        } catch (e) {
            // Ignorar errores si ya está desactivado
        }
    }
    map.getContainer().style.cursor = "";
    document.getElementById("status").innerText = "Modo: Inactivo";
}

window.toggleSidebar = () => { document.getElementById("sidebar").classList.toggle("collapsed"); setTimeout(() => map.invalidateSize(), 300); };

// ==========================================
// BARRA LATERAL DERECHA - INFORMACIÓN DE RUTAS
// ==========================================
window.toggleRoutesSidebar = () => {
  const sidebar = document.getElementById("routes-sidebar");
  const btn = document.getElementById("routes-toggle-btn");
  sidebar.classList.toggle("collapsed");
  if (sidebar.classList.contains("collapsed")) {
    btn.textContent = "▶";
  } else {
    btn.textContent = "◀";
  }
  setTimeout(() => map.invalidateSize(), 300);
};

window.updateRoutesList = () => {
  const list = document.getElementById("routes-list");
  list.innerHTML = "";
  
  // Agregar rutas OMEGA
  OMEGA_WAYPOINTS.forEach((route, i) => {
    if (route.layer) {
      const card = document.createElement("div");
      card.className = "route-info-card";
      card.style.borderLeftColor = route.color || "#3498db";
      
      // Calcular distancia y tiempo si está disponible
      const distance = route.layer.totalDistance || 0;
      const time = route.layer.totalTime || 0;
      const distanciaKm = (distance / 1000).toFixed(1);
      const tiempoMin = Math.round(time / 60);
      
      card.innerHTML = `
        <div class="route-title">${route.name}</div>
        <div class="route-stats">
          <span>📏 ${distanciaKm} km</span>
          <span>⏱ ${tiempoMin} min</span>
          <span>👥 ${route.passengers || "?"} pers</span>
        </div>
        <div class="route-actions">
          <button onclick="focusRoute(${i})">👁 Ver</button>
        </div>
      `;
      list.appendChild(card);
    }
  });
  
  // Agregar rutas dibujadas por el usuario
  if (drawnItems && drawnItems.getLayers) {
    drawnItems.getLayers().forEach((layer, i) => {
      if (layer instanceof L.Polyline) {
        const card = document.createElement("div");
        card.className = "route-info-card";
        const routeName = layer.routeName || `Ruta ${i + 1}`;
        const distance = layer.routeDistance || 0;
        const time = layer.routeTime || 0;
        const distanciaKm = (distance / 1000).toFixed(1);
        const tiempoMin = Math.round(time / 60);
        
        card.innerHTML = `
          <div class="route-title">${routeName}</div>
          <div class="route-stats">
            <span>📏 ${distanciaKm} km</span>
            <span>⏱ ${tiempoMin} min</span>
          </div>
          <div class="route-actions">
            <button onclick="focusDrawnRoute(${i})">👁 Ver</button>
            <button onclick="deleteDrawnRoute(${i})">🗑</button>
          </div>
        `;
        list.appendChild(card);
      }
    });
  }
};

window.focusDrawnRoute = (i) => {
  if (drawnItems && drawnItems.getLayers) {
    const layers = drawnItems.getLayers();
    if (layers[i]) {
      map.fitBounds(layers[i].getBounds());
    }
  }
};

window.deleteDrawnRoute = (i) => {
  if (drawnItems && drawnItems.getLayers) {
    const layers = drawnItems.getLayers();
    if (layers[i]) {
      drawnItems.removeLayer(layers[i]);
      updateRoutesList();
    }
  }
};

// Actualizar la lista cuando se cargan las rutas omega
const originalCargarRutasOmegaInteligentes = cargarRutasOmegaInteligentes;
cargarRutasOmegaInteligentes = async function() {
  await originalCargarRutasOmegaInteligentes();
  updateRoutesList();
};

window.enableManualDraw = () => { resetModes(); currentMode = 'manual'; setStatus("Trazado Manual"); new L.Draw.Polyline(map, { shapeOptions: { color: '#3498db', weight: 5 } }).enable(); };
window.toggleSmartRoute = () => { resetModes(); currentMode = 'smart'; setStatus("Ruta Inteligente: Haga clic en puntos"); };
window.toggleGoToTubrica = () => { resetModes(); currentMode = 'to-tubrica'; setStatus("Ruta a TUBRICA"); };
window.enableMarker = () => { resetModes(); currentMode = 'marker'; setStatus("Marcador: Haga clic en el mapa"); };
window.enableEditMode = () => { resetModes(); currentMode = 'edit'; setStatus("Editar Ruta: Haga clic en una ruta"); };
window.enableDelete = () => { resetModes(); currentMode = "delete"; setStatus("Eliminar: Haga clic en elemento"); };
window.toggleEraser = () => { resetModes(); currentMode = "eraser"; setStatus("Borrador Activo"); eraserCircle = L.circle([0, 0], { radius: eraserSize, color: "red", fillOpacity: 0.1 }).addTo(map); };

map.on(L.Draw.Event.CREATED, e => { 
    const n = prompt("Nombre de la ruta:"); 
    if (n) {
        const color = getNextRouteColor();
        const latlngs = e.layer.getLatLngs();
        saveElement(n, 'route', latlngs, color).then(id => {
            renderRoute(latlngs, n, id, null, false, color);
            resetModes();
            updateRoutesList();
            setStatus("Ruta creada: " + n);
        });
    }
});
document.getElementById("eraserSlider").oninput = e => { eraserSize = parseInt(e.target.value); if (eraserCircle) eraserCircle.setRadius(eraserSize); };

async function fetchOSRMDirect(points) {
    const coords = points.map(p => `${p.lng},${p.lat}`).join(';');
    const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`);
    const data = await res.json();
    if (data.routes && data.routes.length > 0) {
        const full = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
        const name = prompt("Nombre ruta a Sede:");
        if (name) {
            const color = getNextRouteColor();
            const id = await saveElement(name, 'route', full, color);
            renderRoute(full, name, id, null, false, color);
        }
    }
    resetModes();
}

async function finalizeSmart() {
    const coords = smartRoutePoints.map(p => `${p.lng},${p.lat}`).join(';');
    const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`);
    const data = await res.json();
    if (data.routes) {
        const pts = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
        const n = prompt("Nombre:");
        if (n) {
            const color = getNextRouteColor();
            const id = await saveElement(n, 'route', pts, color);
            renderRoute(pts, n, id, null, false, color);
        }
    }
    resetModes();
}

async function updatePreview() {
    const coords = smartRoutePoints.map(p => `${p.lng},${p.lat}`).join(';');
    fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`)
        .then(r => r.json()).then(data => {
        if (previewLine) map.removeLayer(previewLine);
        if (data.routes) previewLine = L.polyline(data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]), { color: '#e67e22', weight: 3, dashArray: '5,10' }).addTo(map);
    });
}

function setStatus(msg) {
    document.getElementById("status").innerText = `Modo: ${msg}`;
}

window.saveAllChanges = async function() {
    let count = 0;
    // Guardar cambios en rutas normales
    for (const layer of drawnItems.getLayers()) {
        if (layer.isDirty && layer.dbId) {
            await saveLayer(layer);
            count++;
        }
    }
    // Guardar cambios en rutas Omega
    omegaLayer.eachLayer(async (layer) => {
        if (layer.isDirty && layer.dbId) {
            await saveLayer(layer);
            count++;
        }
    });
    alert(count > 0 ? `✅ ${count} cambio(s) guardado(s)` : "No hay cambios pendientes");
};


window.exportMapToPDF = function () {
    const btn = document.querySelector(".btn-pdf");
    const originalText = btn.innerHTML;
    btn.innerHTML = "⏳ Generando...";
    btn.disabled = true;
    
    setTimeout(() => {
        html2canvas(document.getElementById("map"), {
            useCORS: true,
            scale: 3,
            logging: false,
            backgroundColor: '#ffffff'
        }).then((canvas) => {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF("l", "mm", "a4");
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            // CALCULO DE PROPORCIÓN PARA EVITAR DISTORSIÓN
            const canvasRatio = canvas.height / canvas.width;
            const imgWidth = pdfWidth - 20;
            const imgHeight = imgWidth * canvasRatio;
            
            const imgData = canvas.toDataURL("image/png");
            
            // Título y Fecha
            pdf.setFontSize(14);
            pdf.text("REPORTE LOGÍSTICO - TUBRICA", 10, 12);
            pdf.setFontSize(8);
            pdf.text(`Generado: ${new Date().toLocaleString()}`, 10, 18);
            
            // Insertar imagen centrada
            const yOffset = (pdfHeight - imgHeight) / 2 + 10;
            pdf.addImage(imgData, 'PNG', 10, yOffset > 25 ? yOffset : 25, imgWidth, imgHeight);
            
            pdf.save(`Planificacion_Tubrica_${new Date().getTime()}.pdf`);
            
            btn.innerHTML = originalText;
            btn.disabled = false;
        });
    }, 500);
};

// ==========================================
// BARRA DE LEYENDA - PANEL DERECHO
// ==========================================
function updateLegend() {
    const container = document.getElementById("legend-content");
    if (!container) return;
    container.innerHTML = "";

    const allLayers = [];
    omegaLayer.eachLayer(l => { if (l.routeLine) allLayers.push(l); });
    drawnItems.eachLayer(l => { if (l.routeLine) allLayers.push(l); });

    if (allLayers.length === 0) {
        container.innerHTML = '<p style="color:#aaa;font-size:12px;padding:8px;">Sin rutas activas</p>';
        return;
    }

    allLayers.forEach(group => {
        const name = group.routeName || "Ruta sin nombre";
        const color = group.routeColor || "#3498db";
        const dist = group.totalDistance ? (group.totalDistance / 1000).toFixed(2) + " km" : "—";
        const time = group.totalTime ? Math.round(group.totalTime / 60) + " min" : "—";
        const pax = group.passengers !== undefined ? group.passengers : "N/D";
        const card = document.createElement("div");
        card.className = "legend-card";
        card.style.borderLeft = `4px solid ${color}`;
        card.innerHTML = `<div class="legend-card-name" style="color:${color};">${name}</div><div class="legend-card-stats"><span>📎 ${dist}</span><span>⏱ ${time}</span><span>👥 ${pax}</span></div>`;
        container.appendChild(card);
    });
}

window.toggleRightSidebar = function () {
    const sidebar = document.getElementById("right-sidebar");
    const btn = document.getElementById("toggle-right-sidebar");
    sidebar.classList.toggle("collapsed");
    btn.textContent = sidebar.classList.contains("collapsed") ? "◄" : "►";
};

function refreshStats(group) {
    if (group) {
        const lls = group.routeLine.getLatLngs();
        let dist = 0;
        for (let i = 1; i < lls.length; i++) dist += lls[i-1].distanceTo(lls[i]);
        group.totalDistance = dist;
        group.totalTime = (dist / 1000 / 40) * 3600;
    }
    updateLegend();
}
