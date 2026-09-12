
(() => {
  "use strict";

  const config = window.INNOPAT_CONFIG || {};
  function readStored(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch { return fallback; }
  }

  const state = {
    hitos: [],
    activeIndex: 0,
    visited: new Set(readStored("innopat.visited", [])),
    prefs: readStored("innopat.prefs", {}),
    lang: ["es","en","fr"].includes(new URLSearchParams(location.search).get("lang"))
      ? new URLSearchParams(location.search).get("lang")
      : readStored("innopat.lang", "es"),
    googleMap: null,
    googleMarkers: [],
    userMarker: null,
    accuracyCircle: null,
    watchId: null,
    qrScanner: null,
    qrRunning: false,
    leafletMap: null,
    leafletUserMarker: null,
    leafletAccuracy: null
  };

  const fallbackHitos = Array.from({length: 11}, (_, idx) => {
    const n = idx + 1;
    return {
      id: `H${String(n).padStart(2,"0")}`,
      slug: `hito-${String(n).padStart(2,"0")}`,
      order: n,
      title: `Hito ${String(n).padStart(2,"0")}`,
      summary: "Contenido interpretativo pendiente de definición y validación por el equipo INNOPAT.",
      locationText: "Localización e indicaciones de acceso pendientes de validación en el recinto.",
      transcript: "La transcripción aparecerá aquí cuando se incorpore el vídeo definitivo.",
      duration: "1–2 min",
      model3d: [3,6,9].includes(n) ? {enabled:true, description:"Modelo 3D pendiente de incorporación."} : null
    };
  });

  const t = {
    es: {
      visited: (n,total)=>`${n} de ${total} hitos visitados`,
      next:"Ir al siguiente hito", list:"Lista", map:"Mapa",
      geoIdle:"La ubicación no se solicita automáticamente.",
      geoRequest:"Solicitando ubicación…",
      geoOk:(a)=>`Ubicación obtenida. Precisión aproximada: ±${Math.round(a)} m. No se guarda.`,
      geoDenied:"No se pudo usar la ubicación. Puedes completar toda la visita sin GPS.",
      surveyMissing:"El enlace de la encuesta institucional todavía no está configurado.",
      surveyTitle:"Encuesta pendiente",
      mark:"Marcar como visitado", marked:"Visitado ✓",
      transcriptShow:"Ver transcripción", transcriptHide:"Ocultar transcripción",
      modelReady:"Visor preparado. Falta incorporar el GLB definitivo.",
      listening:"Detener audio", listen:"Escuchar resumen"
    },
    en: {
      visited:(n,total)=>`${n} of ${total} stops visited`,
      next:"Go to next stop", list:"List", map:"Map",
      geoIdle:"Location is never requested automatically.",
      geoRequest:"Requesting location…",
      geoOk:(a)=>`Location received. Approximate accuracy: ±${Math.round(a)} m. It is not stored.`,
      geoDenied:"Location could not be used. The visit works fully without GPS.",
      surveyMissing:"The institutional survey link has not been configured yet.",
      surveyTitle:"Survey pending",
      mark:"Mark as visited", marked:"Visited ✓",
      transcriptShow:"Show transcript", transcriptHide:"Hide transcript",
      modelReady:"Viewer prepared. The final GLB still needs to be added.",
      listening:"Stop audio", listen:"Listen to summary"
    },
    fr: {
      visited:(n,total)=>`${n} sur ${total} étapes visitées`,
      next:"Aller à l’étape suivante", list:"Liste", map:"Plan",
      geoIdle:"La localisation n’est jamais demandée automatiquement.",
      geoRequest:"Demande de localisation…",
      geoOk:(a)=>`Localisation obtenue. Précision approximative : ±${Math.round(a)} m. Elle n’est pas enregistrée.`,
      geoDenied:"La localisation n’a pas pu être utilisée. La visite fonctionne entièrement sans GPS.",
      surveyMissing:"Le lien vers l’enquête institutionnelle n’est pas encore configuré.",
      surveyTitle:"Enquête en attente",
      mark:"Marquer comme visitée", marked:"Visitée ✓",
      transcriptShow:"Voir la transcription", transcriptHide:"Masquer la transcription",
      modelReady:"Visionneuse prête. Le GLB définitif reste à intégrer.",
      listening:"Arrêter l’audio", listen:"Écouter le résumé"
    }
  };

  const ui = {
    es: {skip:"Saltar al contenido",hero:"La Cartuja, paso a paso",lead:"Una guía web accesible para descubrir el patrimonio a tu ritmo, sin instalar ninguna aplicación.",start:"Comenzar visita →",explore:"Explorar el mapa",route:"Elige cómo continuar",routeHelp:"Mapa y listado ofrecen la misma información. El GPS es opcional y nunca bloquea la visita.",mapTitle:"Los 11 hitos de La Cartuja",mapDescription:"El mapa muestra los 11 hitos a partir de las coordenadas facilitadas por el equipo. El listado ofrece una alternativa equivalente y accesible.",mapConsent:"Al cargar el mapa, el navegador solicitará las teselas directamente a OpenStreetMap. No se enviará tu ubicación.",loadMap:"Cargar mapa",locate:"Mostrar mi ubicación",finish:"Cuando termines, cuéntanos tu experiencia",survey:"Abrir encuesta",online:"Con conexión",offline:"Sin conexión · modo básico"},
    en: {skip:"Skip to content",hero:"La Cartuja, step by step",lead:"An accessible web guide to discover the site at your own pace, without installing an app.",start:"Start visit →",explore:"Explore the map",route:"Choose how to continue",routeHelp:"Map and list provide the same information. GPS is optional and never blocks the visit.",mapTitle:"The 11 stops at La Cartuja",mapDescription:"The map shows all 11 stops using coordinates supplied by the team. The list is an equivalent accessible alternative.",mapConsent:"When you load the map, your browser requests tiles directly from OpenStreetMap. Your location is not sent.",loadMap:"Load map",locate:"Show my location",finish:"When you finish, tell us about your experience",survey:"Open survey",online:"Online",offline:"Offline · basic mode"},
    fr: {skip:"Aller au contenu",hero:"La Cartuja, pas à pas",lead:"Un guide web accessible pour découvrir le patrimoine à votre rythme, sans installer d’application.",start:"Commencer la visite →",explore:"Explorer la carte",route:"Choisissez comment continuer",routeHelp:"La carte et la liste fournissent les mêmes informations. Le GPS est facultatif et ne bloque jamais la visite.",mapTitle:"Les 11 étapes de La Cartuja",mapDescription:"La carte affiche les 11 étapes à partir des coordonnées fournies par l’équipe. La liste constitue une alternative accessible équivalente.",mapConsent:"Au chargement, le navigateur demande les tuiles directement à OpenStreetMap. Votre position n’est pas envoyée.",loadMap:"Charger la carte",locate:"Afficher ma position",finish:"À la fin, partagez votre expérience",survey:"Ouvrir l’enquête",online:"En ligne",offline:"Hors ligne · mode de base"}
  };

  const uiNodes = [
    [".project-intro-copy strong","Conoce INNOPAT","Discover INNOPAT","Découvrir INNOPAT"],
    [".project-intro-copy h2","Investigar, conservar y hacer comprensible el patrimonio","Researching, conserving and making heritage understandable","Étudier, conserver et rendre le patrimoine compréhensible"],
    [".project-intro-copy p","INNOPAT utiliza el Monasterio de Santa María de las Cuevas como laboratorio de innovación patrimonial y mediación cultural inclusiva. Esta web es un prototipo de la experiencia digital de visita.","INNOPAT uses the Monastery of Santa María de las Cuevas as a laboratory for heritage innovation and inclusive cultural interpretation. This website is a prototype of the digital visitor experience.","INNOPAT utilise le monastère de Santa María de las Cuevas comme laboratoire d’innovation patrimoniale et de médiation culturelle inclusive. Ce site est un prototype de l’expérience numérique de visite."],
    [".btn-project","Conocer el proyecto ↗","About the project ↗","Découvrir le projet ↗"],
    ["#visitStatusTitle","Tu recorrido","Your route","Votre parcours"],
    [".feature-grid article:nth-child(1) h2","Accesibilidad desde el diseño","Accessibility by design","L’accessibilité dès la conception"],
    [".feature-grid article:nth-child(1) p","Teclado, lectores de pantalla, contraste, reflow y alternativas al mapa, vídeo y 3D forman parte de la experiencia base.","Keyboard access, screen readers, contrast, reflow and alternatives to maps, video and 3D are part of the core experience.","Clavier, lecteurs d’écran, contraste, réagencement et alternatives à la carte, à la vidéo et à la 3D font partie de l’expérience de base."],
    [".feature-grid article:nth-child(2) h2","Ligera y preparada para PWA","Lightweight and PWA-ready","Légère et prête pour la PWA"],
    [".feature-grid article:nth-child(3) h2","Privacidad por defecto","Privacy by default","Confidentialité par défaut"],
    [".finish-card > p:not(.eyebrow)","La encuesta definitiva se conectará a la herramienta institucional aprobada para el proyecto.","The final survey will be connected to the institutional tool approved for the project.","L’enquête définitive sera reliée à l’outil institutionnel approuvé pour le projet."],
    ["#videoTitle","Vídeo de la parada","Stop video","Vidéo de l’étape"],
    ["#loadVideoBtn","Cargar vídeo de YouTube","Load YouTube video","Charger la vidéo YouTube"],
    ["#transcriptPanel h3","Transcripción","Transcript","Transcription"],
    [".detail-main h3","Contenido principal","Main content","Contenu principal"],
    [".detail-science h3","Una mirada técnica","A technical perspective","Un regard technique"],
    [".detail-anecdote h3","Historias para interpretar","Stories to interpret","Histoires à interpréter"],
    [".detail-extra h3","Explora más","Explore more","En savoir plus"],
    [".detail-block:not(.detail-main):not(.detail-science):not(.detail-anecdote):not(.detail-extra) h3","Cómo encontrar este lugar","How to find this place","Comment trouver ce lieu"],
    ["#prevHitoBtn","← Anterior","← Previous","← Précédente"],
    ["#nextHitoBtn","Siguiente →","Next →","Suivante →"],
    ["#a11yPanel h2","Accesibilidad","Accessibility","Accessibilité"],
    ["#resetPrefs","Restablecer preferencias","Reset preferences","Réinitialiser les préférences"],
    ["#qrDialog h2","Escanear código QR","Scan QR code","Scanner un code QR"],
    ["#startQrBtn","Abrir cámara","Open camera","Ouvrir la caméra"],
    ["#stopQrBtn","Detener cámara","Stop camera","Arrêter la caméra"]
  ];

  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];

  function setRemoteAssets() {
    const hero = $("#heroImage");
    if (hero && config.monasteryImage) hero.src = config.monasteryImage;
  }

  async function loadContent() {
    try {
      const endpoint = state.lang === "es" ? (config.contentEndpoint || "./content/hitos.json") : `./content/hitos.${state.lang}.json`;
      const response = await fetch(endpoint, {cache:"no-store"});
      if (!response.ok) throw new Error("content");
      const data = await response.json();
      state.hitos = Array.isArray(data) && data.length ? data : fallbackHitos;
    } catch {
      state.hitos = fallbackHitos;
    }
    renderAll();
  }

  function renderAll() {
    renderCards();
    updateProgress();
    applyPrefs();
    applyLanguage();
  }

  function renderCards() {
    const grid = $("#hitosGrid");
    grid.innerHTML = "";
    state.hitos.forEach((hito, idx) => {
      const li = document.createElement("li");
      li.className = "hito-card";
      const button = document.createElement("button");
      button.type = "button";
      button.className = "hito-btn";
      button.dataset.index = idx;
      button.setAttribute("aria-label", `Abrir ${hito.title}, hito ${hito.order} de ${state.hitos.length}`);
      button.innerHTML = `
        <span class="hito-number">${String(hito.order).padStart(2,"0")}</span>
        <h3>${escapeHtml(hito.title)}</h3>
        ${hito.subtitle ? `<span class="hito-subtitle">${escapeHtml(hito.subtitle)}</span>` : ""}
        <p>${escapeHtml(hito.summary)}</p>
        <span class="hito-meta"><span>${escapeHtml(hito.duration || "1–2 min")}</span><span class="visited-badge">Visitado ✓</span></span>
      `;
      if (state.visited.has(hito.id)) button.classList.add("is-visited");
      button.addEventListener("click", () => openHito(idx));
      li.append(button);
      grid.append(li);
    });
  }

  function renderMapMarkers() {
    const group = $("#mapMarkers");
    group.innerHTML = "";
    const coords = [
      [120,115],[230,150],[335,200],[455,155],[550,170],[650,245],
      [590,330],[480,390],[360,410],[245,365],[120,320]
    ];
    state.hitos.forEach((hito, idx) => {
      const [x,y] = coords[idx] || [100 + idx*50, 250];
      const g = document.createElementNS("http://www.w3.org/2000/svg","g");
      g.classList.add("map-marker");
      if (state.visited.has(hito.id)) g.classList.add("is-visited");
      g.setAttribute("tabindex","0");
      g.setAttribute("role","button");
      g.setAttribute("aria-label",`Abrir ${hito.title}`);
      g.innerHTML = `<circle cx="${x}" cy="${y}" r="24"></circle><text x="${x}" y="${y}">${hito.order}</text>`;
      g.addEventListener("click", () => openHito(idx));
      g.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openHito(idx); }
      });
      group.append(g);
    });
  }

  function updateProgress() {
    const total = state.hitos.length || 11;
    const done = state.hitos.filter(h => state.visited.has(h.id)).length;
    $("#progressText").textContent = t[state.lang].visited(done,total);
    const progress = $("#progressBar");
    progress.max = total;
    progress.value = done;
    progress.textContent = `${done} de ${total}`;
    renderCardsVisitedOnly();
  }

  function renderCardsVisitedOnly() {
    $$(".hito-btn").forEach((btn, idx) => btn.classList.toggle("is-visited", state.visited.has(state.hitos[idx]?.id)));
  }

  function openHito(index) {
    state.activeIndex = Math.max(0, Math.min(index, state.hitos.length - 1));
    const h = state.hitos[state.activeIndex];
    $("#dialogPosition").textContent = `HITO ${h.order} DE ${state.hitos.length}`;
    $("#dialogTitle").textContent = h.title;
    $("#dialogSubtitle").textContent = h.subtitle || "";
    $("#dialogSummary").textContent = h.summary;
    $("#dialogLocation").textContent = h.locationText;
    $("#dialogTranscript").textContent = h.transcript || "Transcripción pendiente.";

    const main = $("#dialogMainContent");
    main.innerHTML = "";
    const mainItems = Array.isArray(h.mainContent) ? h.mainContent : (h.mainContent ? [h.mainContent] : []);
    if (mainItems.length) {
      const ul = document.createElement("ul");
      ul.className = "detail-list";
      mainItems.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        ul.append(li);
      });
      main.append(ul);
    } else {
      main.textContent = "Contenido pendiente de completar.";
    }

    $("#dialogScience").textContent = h.science || "Pendiente de definir.";
    $("#dialogAnecdote").textContent = h.anecdote || "Pendiente de definir.";

    const extra = $("#dialogExtra");
    extra.innerHTML = "";
    const extraItems = Array.isArray(h.extra) ? h.extra : (h.extra ? [h.extra] : []);
    if (extraItems.length) {
      const ul = document.createElement("ul");
      ul.className = "detail-list";
      extraItems.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        ul.append(li);
      });
      extra.append(ul);
    } else {
      extra.textContent = "Sin recursos adicionales definidos todavía.";
    }
    $("#modelBlock").hidden = !(h.model3d && h.model3d.enabled);
    $("#modelPlaceholder").hidden = true;
    $("#transcriptPanel").hidden = true;
    $("#transcriptBtn").setAttribute("aria-expanded","false");
    $("#transcriptBtn").textContent = t[state.lang].transcriptShow;
    $("#visitedBtn").textContent = state.visited.has(h.id) ? t[state.lang].marked : t[state.lang].mark;
    $("#prevHitoBtn").disabled = state.activeIndex === 0;
    $("#nextHitoBtn").disabled = state.activeIndex === state.hitos.length - 1;
    resetVideo();
    history.replaceState(null, "", `#${h.slug || h.id.toLowerCase()}`);
    const dialog = $("#hitoDialog");
    if (!dialog.open) dialog.showModal();
  }

  function closeDialog(dialog) {
    if (dialog?.open) dialog.close();
    stopSpeech();
    if (dialog?.id === "hitoDialog") history.replaceState(null, "", "#recorrido");
  }

  function markVisited() {
    const h = state.hitos[state.activeIndex];
    state.visited.add(h.id);
    localStorage.setItem("innopat.visited", JSON.stringify([...state.visited]));
    $("#visitedBtn").textContent = t[state.lang].marked;
    updateProgress();
  }

  function continueVisit() {
    const idx = state.hitos.findIndex(h => !state.visited.has(h.id));
    openHito(idx === -1 ? state.hitos.length - 1 : idx);
  }

  function toggleViews(view) {
    const selected = view || "list";
    $("#listView").hidden = selected !== "list";
    $("#leafletView").hidden = selected !== "leaflet";
    const pairs = [
      ["#listViewBtn", selected === "list"],
      ["#leafletViewBtn", selected === "leaflet"]
    ];
    pairs.forEach(([sel,on]) => {
      $(sel).classList.toggle("is-active", on);
      $(sel).setAttribute("aria-pressed", String(on));
    });
    if (selected === "leaflet") {
      history.replaceState(null,"","#mapa-contexto");
      if (state.leafletMap) setTimeout(() => state.leafletMap.invalidateSize(), 0);
    }
  }

  function loadLeafletLibrary() {
    if (window.L) return Promise.resolve(window.L);
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => resolve(window.L);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async function initLeafletMap() {
    if (state.leafletMap) return state.leafletMap;
    const status = $("#leafletStatus");
    status.textContent = "Cargando el mapa…";
    try {
      const L = await loadLeafletLibrary();
      const center = config.siteCenter || {lat:37.397293019706,lng:-6.0076663474479};
      state.leafletMap = L.map("leafletMap", {scrollWheelZoom:false}).setView([center.lat, center.lng], 17);
      L.tileLayer(config.leaflet?.tileUrl || "https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: config.leaflet?.maxZoom || 19,
        attribution: config.leaflet?.attribution || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(state.leafletMap);
      const siteIcon = L.divIcon({className:"map-site-marker", html:"<span aria-hidden=\"true\">IAPH</span>", iconSize:[52,36], iconAnchor:[26,18]});
      L.marker([center.lat, center.lng], {title:"Monasterio de Santa María de las Cuevas", icon:siteIcon})
        .addTo(state.leafletMap)
        .bindPopup("Monasterio de Santa María de las Cuevas · sede del IAPH");
      state.hitos.filter(h => h.coordinates?.lat && h.coordinates?.lng).forEach(h => {
        const icon = L.divIcon({className:"map-stop-marker", html:`<span aria-hidden=\"true\">${h.order}</span>`, iconSize:[38,38], iconAnchor:[19,19]});
        L.marker([h.coordinates.lat, h.coordinates.lng], {title:`${h.order}. ${h.title}`, icon})
          .addTo(state.leafletMap)
          .bindPopup(`${h.order}. ${h.title}`);
      });
      $("#leafletConsent").hidden = true;
      $("#leafletMap").hidden = false;
      $("#leafletLocationBtn").disabled = false;
      const bounds = state.hitos.filter(h => h.coordinates).map(h => [h.coordinates.lat,h.coordinates.lng]);
      if (bounds.length) state.leafletMap.fitBounds(bounds, {padding:[34,34], maxZoom:18});
      status.textContent = state.lang === "es" ? "Mapa cargado con los 11 hitos." : state.lang === "en" ? "Map loaded with all 11 stops." : "Carte chargée avec les 11 étapes.";
      setTimeout(() => state.leafletMap.invalidateSize(), 0);
      return state.leafletMap;
    } catch {
      status.textContent = "No se pudo cargar el mapa. La lista y el plano siguen disponibles.";
      return null;
    }
  }

  async function showLeafletLocation() {
    const map = await initLeafletMap();
    const status = $("#leafletStatus");
    if (!map || !navigator.geolocation) {
      status.textContent = "La ubicación no está disponible. Puedes completar la visita sin GPS.";
      return;
    }
    status.textContent = "Solicitando tu ubicación…";
    navigator.geolocation.getCurrentPosition(position => {
      const point = [position.coords.latitude, position.coords.longitude];
      if (state.leafletUserMarker) {
        state.leafletUserMarker.setLatLng(point);
        state.leafletAccuracy.setLatLng(point).setRadius(position.coords.accuracy || 0);
      } else {
        const userIcon = L.divIcon({className:"map-user-marker", html:"<span aria-hidden=\"true\"></span>", iconSize:[24,24], iconAnchor:[12,12]});
        state.leafletUserMarker = L.marker(point, {title:"Tu ubicación aproximada", icon:userIcon}).addTo(map).bindPopup("Tu ubicación aproximada");
        state.leafletAccuracy = L.circle(point, {radius:position.coords.accuracy || 0, weight:1, fillOpacity:.08}).addTo(map);
      }
      map.setView(point, Math.max(map.getZoom(), 18));
      status.textContent = `Ubicación obtenida, con precisión aproximada de ±${Math.round(position.coords.accuracy || 0)} m. No se almacena.`;
    }, () => {
      status.textContent = "No se pudo obtener la ubicación. Puedes completar la visita sin GPS.";
    }, {enableHighAccuracy:false, timeout:10000, maximumAge:60000});
  }

  function requestGeo() {
    const status = $("#geoStatus");
    if (!navigator.geolocation) {
      status.textContent = t[state.lang].geoDenied;
      return;
    }
    status.textContent = t[state.lang].geoRequest;
    navigator.geolocation.getCurrentPosition(
      pos => { status.textContent = t[state.lang].geoOk(pos.coords.accuracy || 0); },
      () => { status.textContent = t[state.lang].geoDenied; },
      {enableHighAccuracy:false, timeout:10000, maximumAge:60000}
    );
  }


  let googleMapsPromise = null;

  function loadGoogleMapsApi() {
    if (window.google?.maps) return Promise.resolve(window.google.maps);
    if (googleMapsPromise) return googleMapsPromise;
    const key = config.googleMapsApiKey || "";
    if (!key) return Promise.reject(new Error("missing-key"));
    googleMapsPromise = new Promise((resolve, reject) => {
      const callbackName = "__innopatGoogleMapsReady";
      window[callbackName] = () => { resolve(window.google.maps); delete window[callbackName]; };
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly&libraries=marker&callback=${callbackName}`;
      script.async = true;
      script.defer = true;
      script.onerror = () => reject(new Error("maps-load-failed"));
      document.head.appendChild(script);
    });
    return googleMapsPromise;
  }

  async function initGoogleMap() {
    if (state.googleMap) return state.googleMap;
    const host = $("#googleMap");
    const fallback = $("#googleMapFallback");
    try {
      await loadGoogleMapsApi();
      const { Map } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
      const center = config.siteCenter || {lat:37.397293019706,lng:-6.0076663474479};
      state.googleMap = new Map(host, {
        center,
        zoom: 18,
        mapId: config.googleMapsMapId || "DEMO_MAP_ID",
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        gestureHandling: "greedy"
      });
      state.googleMarkers = state.hitos.filter(h => h.coordinates).map((hito, idx) => {
        const label = document.createElement("button");
        label.type = "button";
        label.className = "map-poi-label";
        label.textContent = hito.order;
        label.setAttribute("aria-label", `Abrir ${hito.title}`);
        const m = new AdvancedMarkerElement({
          map: state.googleMap,
          position: hito.coordinates,
          title: `${hito.order}. ${hito.title}`,
          content: label,
          gmpClickable: true
        });
        m.addEventListener("gmp-click", () => openHito(state.hitos.indexOf(hito)));
        return m;
      });
      if (fallback) fallback.remove();
      return state.googleMap;
    } catch (err) {
      if (fallback) {
        fallback.innerHTML = err?.message === "missing-key"
          ? '<strong>Falta la API key de Google Maps</strong><p>La integración está terminada. Añade <code>googleMapsApiKey</code> en <code>config.js</code> para activar el mapa real y los 11 marcadores.</p>'
          : '<strong>No se pudo cargar Google Maps</strong><p>Comprueba la conexión y la configuración de la API. El listado y el plano siguen disponibles.</p>';
      }
      return null;
    }
  }

  async function toggleLocationTracking() {
    const btn = $("#trackLocationBtn");
    const status = $("#trackStatus");
    if (state.watchId !== null) {
      navigator.geolocation.clearWatch(state.watchId);
      state.watchId = null;
      btn.textContent = "Mostrar mi ubicación";
      status.textContent = "Seguimiento detenido. La última posición no se almacena.";
      if (state.userMarker) { state.userMarker.map = null; state.userMarker = null; }
      if (state.accuracyCircle) { state.accuracyCircle.setMap(null); state.accuracyCircle = null; }
      return;
    }
    if (!navigator.geolocation) {
      status.textContent = "Este navegador no permite obtener la ubicación.";
      return;
    }
    const map = await initGoogleMap();
    if (!map) {
      status.textContent = "Configura Google Maps antes de mostrar tu posición sobre el mapa.";
      return;
    }
    status.textContent = "Solicitando permiso de ubicación…";
    btn.disabled = true;
    state.watchId = navigator.geolocation.watchPosition(async pos => {
      btn.disabled = false;
      btn.textContent = "Ocultar mi ubicación";
      const point = {lat: pos.coords.latitude, lng: pos.coords.longitude};
      status.textContent = `Posición actual · precisión aproximada ±${Math.round(pos.coords.accuracy || 0)} m. No se almacena.`;
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
      if (!state.userMarker) {
        const dot = document.createElement("div");
        dot.className = "user-location-dot";
        dot.setAttribute("aria-label","Tu ubicación aproximada");
        state.userMarker = new AdvancedMarkerElement({map, position: point, title:"Tu ubicación", content:dot});
        state.accuracyCircle = new google.maps.Circle({map, center:point, radius:pos.coords.accuracy || 0, strokeOpacity:.35, strokeWeight:1, fillOpacity:.08});
      } else {
        state.userMarker.position = point;
        state.accuracyCircle.setCenter(point);
        state.accuracyCircle.setRadius(pos.coords.accuracy || 0);
      }
      map.panTo(point);
    }, err => {
      btn.disabled = false;
      btn.textContent = "Mostrar mi ubicación";
      state.watchId = null;
      status.textContent = err.code === 1 ? "Permiso de ubicación denegado. Puedes usar toda la visita sin GPS." : "No se pudo obtener la ubicación en este momento.";
    }, {enableHighAccuracy:true, timeout:12000, maximumAge:5000});
  }

  function resolveQrToHito(value) {
    let raw = String(value || "").trim();
    if (!raw) return null;
    try {
      const u = new URL(raw, location.href);
      const q = u.searchParams.get("hito");
      if (q) raw = q;
      else if (u.hash) raw = u.hash.replace(/^#/,"");
    } catch {}
    raw = raw.trim().toLowerCase();
    const match = raw.match(/(?:hito[-_ ]?)?(?:h)?(0?[1-9]|1[01])$/i) || raw.match(/\b(h(?:0?[1-9]|1[01]))\b/i);
    if (!match) return null;
    const num = Number((match[1] || match[0]).replace(/\D/g,""));
    if (!num || num > 11) return null;
    return state.hitos.findIndex(h => Number(h.order) === num);
  }

  async function stopQrScanner() {
    if (state.qrScanner && state.qrRunning) {
      try { await state.qrScanner.stop(); } catch {}
      try { state.qrScanner.clear(); } catch {}
    }
    state.qrRunning = false;
    $("#startQrBtn").disabled = false;
    $("#stopQrBtn").disabled = true;
    $("#qrStatus").textContent = "La cámara está apagada.";
  }

  async function handleQrDecoded(decodedText) {
    const idx = resolveQrToHito(decodedText);
    if (idx < 0 || idx === null) {
      $("#qrStatus").textContent = `QR leído, pero no corresponde a una parada de esta guía: ${decodedText}`;
      return;
    }
    $("#qrStatus").textContent = `QR reconocido: ${state.hitos[idx].title}`;
    await stopQrScanner();
    closeDialog($("#qrDialog"));
    openHito(idx);
  }

  async function startQrScanner() {
    const status = $("#qrStatus");
    if (!window.isSecureContext && location.hostname !== "localhost") {
      status.textContent = "La cámara necesita HTTPS. Publica la web en un dominio seguro para usar el lector.";
      return;
    }
    try { await loadQrLibrary(); }
    catch { status.textContent = "No se pudo cargar el lector QR. Puedes abrir los hitos desde la lista."; return; }
    try {
      state.qrScanner = state.qrScanner || new Html5Qrcode("qrReader", {formatsToSupport:[Html5QrcodeSupportedFormats.QR_CODE]});
      status.textContent = "Solicitando permiso de cámara…";
      $("#startQrBtn").disabled = true;
      await state.qrScanner.start(
        {facingMode:"environment"},
        {fps:10, qrbox:{width:250,height:250}, aspectRatio:1.0},
        handleQrDecoded,
        () => {}
      );
      state.qrRunning = true;
      $("#stopQrBtn").disabled = false;
      status.textContent = "Cámara activa. Centra un código QR dentro del recuadro.";
    } catch (err) {
      $("#startQrBtn").disabled = false;
      $("#stopQrBtn").disabled = true;
      status.textContent = "No se pudo abrir la cámara. Revisa el permiso o utiliza una imagen con QR.";
    }
  }

  async function scanQrFile(file) {
    if (!file) return;
    try { await loadQrLibrary(); }
    catch { $("#qrStatus").textContent = "No se pudo cargar el lector QR."; return; }
    try {
      if (state.qrRunning) await stopQrScanner();
      state.qrScanner = state.qrScanner || new Html5Qrcode("qrReader", {formatsToSupport:[Html5QrcodeSupportedFormats.QR_CODE]});
      $("#qrStatus").textContent = "Analizando imagen…";
      const decoded = await state.qrScanner.scanFile(file, true);
      await handleQrDecoded(decoded);
    } catch {
      $("#qrStatus").textContent = "No se encontró un QR válido en esa imagen.";
    }
  }

  let speaking = false;
  function toggleSpeech() {
    if (!("speechSynthesis" in window)) return;
    if (speaking) { stopSpeech(); return; }
    const h = state.hitos[state.activeIndex];
    const u = new SpeechSynthesisUtterance(`${h.title}. ${h.summary}`);
    u.lang = state.lang === "es" ? "es-ES" : state.lang === "en" ? "en-GB" : "fr-FR";
    u.onend = () => { speaking = false; $("#listenBtn").textContent = t[state.lang].listen; };
    speaking = true;
    $("#listenBtn").textContent = t[state.lang].listening;
    speechSynthesis.speak(u);
  }
  function stopSpeech() {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    speaking = false;
    if ($("#listenBtn")) $("#listenBtn").textContent = t[state.lang].listen;
  }

  function openNotice(title,text) {
    $("#noticeTitle").textContent = title;
    $("#noticeText").textContent = text;
    $("#noticeDialog").showModal();
  }

  function resetVideo() {
    const container = $("#videoContainer");
    container.replaceChildren();
    container.hidden = true;
    $("#videoConsent").hidden = false;
  }

  function loadVideo() {
    const h = state.hitos[state.activeIndex];
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(config.youtubeVideoId || "WslOHO2Gbzg")}`;
    iframe.title = `Vídeo provisional de ${h.title}`;
    iframe.allow = "accelerometer; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    const container = $("#videoContainer");
    container.append(iframe);
    container.hidden = false;
    $("#videoConsent").hidden = true;
  }

  function openInfo(kind) {
    const title = kind === "privacy" ? "Privacidad" : "Declaración de accesibilidad del prototipo";
    const paragraphs = kind === "privacy" ? [
      "Este prototipo no requiere registro ni guarda un historial de ubicación.",
      "La geolocalización y la cámara solo se activan tras una acción explícita. Los vídeos externos solo se cargan cuando la persona pulsa el botón correspondiente.",
      "Antes de producción deberán identificarse el responsable del tratamiento, los almacenamientos utilizados y el canal de ejercicio de derechos."
    ] : [
      "Objetivo técnico: conformidad con WCAG 2.2 nivel AA y con los requisitos aplicables al sector público. Este prototipo no debe declararse conforme hasta superar una auditoría experta y pruebas con personas usuarias.",
      "La declaración definitiva deberá indicar el método de evaluación, contenidos no accesibles, mecanismo de comunicación y procedimiento de reclamación.",
      "Contacto provisional: pendiente de designación por el IAPH."
    ];
    $("#infoTitle").textContent = title;
    const host = $("#infoContent");
    host.replaceChildren(...paragraphs.map(value => { const p = document.createElement("p"); p.textContent = value; return p; }));
    $("#infoDialog").showModal();
  }

  function loadQrLibrary() {
    if (typeof Html5Qrcode !== "undefined") return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.8/html5-qrcode.min.js";
      script.crossOrigin = "anonymous";
      script.referrerPolicy = "no-referrer";
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    });
  }

  function openSurvey() {
    if (config.surveyUrl) {
      window.open(config.surveyUrl, "_blank", "noopener");
    } else {
      openNotice(t[state.lang].surveyTitle, t[state.lang].surveyMissing);
    }
  }

  function setPref(name, value) {
    state.prefs[name] = value;
    localStorage.setItem("innopat.prefs", JSON.stringify(state.prefs));
    applyPrefs();
  }
  function applyPrefs() {
    document.body.classList.toggle("large-text", !!state.prefs.largeText);
    document.body.classList.toggle("high-contrast", !!state.prefs.contrast);
    document.body.classList.toggle("underline-links", !!state.prefs.underline);
    document.body.classList.toggle("reduce-motion", !!state.prefs.motion);
    $("#prefLargeText").checked = !!state.prefs.largeText;
    $("#prefContrast").checked = !!state.prefs.contrast;
    $("#prefUnderline").checked = !!state.prefs.underline;
    $("#prefMotion").checked = !!state.prefs.motion;
  }

  function resetPrefs() {
    state.prefs = {};
    localStorage.removeItem("innopat.prefs");
    applyPrefs();
  }

  function applyLanguage() {
    document.documentElement.lang = state.lang;
    $("#languageSelect").value = state.lang;
    $("#continueBtn").textContent = t[state.lang].next;
    $("#listViewBtn").textContent = t[state.lang].list;
    $("#leafletViewBtn").textContent = t[state.lang].map;
    $("#listenBtn").textContent = t[state.lang].listen;
    const v = ui[state.lang];
    $(".skip-link").textContent = v.skip;
    $("#heroTitle").textContent = v.hero;
    $(".hero-lead").textContent = v.lead;
    $(".hero-actions .btn-primary").textContent = v.start;
    $("#exploreMapLink").textContent = v.explore;
    $("#routeTitle").textContent = v.route;
    $(".section-head > div:first-child > p:last-child").textContent = v.routeHelp;
    $("#leafletView .map-copy h3").textContent = v.mapTitle;
    $("#leafletDescription").textContent = v.mapDescription;
    $("#leafletConsent p").textContent = v.mapConsent;
    $("#loadLeafletBtn").textContent = v.loadMap;
    $("#leafletLocationBtn").textContent = v.locate;
    $("#finishTitle").textContent = v.finish;
    $("#surveyBtn").textContent = v.survey;
    const langIndex = state.lang === "es" ? 1 : state.lang === "en" ? 2 : 3;
    uiNodes.forEach(([selector,...values]) => {
      const node = $(selector);
      if (node) node.textContent = values[langIndex - 1];
    });
    updateProgress();
  }

  function updateOnline() {
    const online = navigator.onLine;
    $("#onlineDot").classList.toggle("is-offline", !online);
    $("#onlineText").textContent = online ? ui[state.lang].online : ui[state.lang].offline;
  }

  function escapeHtml(value="") {
    return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  }

  function bind() {
    setRemoteAssets();

    $("#continueBtn").addEventListener("click", continueVisit);
    $("#listViewBtn").addEventListener("click", () => toggleViews("list"));
    $("#leafletViewBtn").addEventListener("click", () => toggleViews("leaflet"));
    $("#exploreMapLink").addEventListener("click", () => toggleViews("leaflet"));
    $("#footerMapLink").addEventListener("click", () => toggleViews("leaflet"));
    $("#languageSelect").addEventListener("change", async e => {
      state.lang = e.target.value;
      localStorage.setItem("innopat.lang", JSON.stringify(state.lang));
      const url = new URL(location.href);
      url.searchParams.set("lang", state.lang);
      history.replaceState(null, "", url);
      await loadContent();
    });
    $("#loadLeafletBtn").addEventListener("click", initLeafletMap);
    $("#leafletLocationBtn").addEventListener("click", showLeafletLocation);

    $$("[data-close-dialog]").forEach(b => b.addEventListener("click", () => closeDialog($("#hitoDialog"))));
    $$("[data-close-a11y]").forEach(b => b.addEventListener("click", () => closeDialog($("#a11yPanel"))));
    $$("[data-close-notice]").forEach(b => b.addEventListener("click", () => closeDialog($("#noticeDialog"))));
    $$("[data-close-info]").forEach(b => b.addEventListener("click", () => closeDialog($("#infoDialog"))));

    $("#prevHitoBtn").addEventListener("click", () => openHito(state.activeIndex - 1));
    $("#nextHitoBtn").addEventListener("click", () => openHito(state.activeIndex + 1));
    $("#visitedBtn").addEventListener("click", markVisited);

    $("#transcriptBtn").addEventListener("click", () => {
      const panel = $("#transcriptPanel");
      panel.hidden = !panel.hidden;
      $("#transcriptBtn").setAttribute("aria-expanded", String(!panel.hidden));
      $("#transcriptBtn").textContent = panel.hidden ? t[state.lang].transcriptShow : t[state.lang].transcriptHide;
    });
    $("#listenBtn").addEventListener("click", toggleSpeech);
    $("#modelBtn").addEventListener("click", () => {
      $("#modelPlaceholder").hidden = false;
      $("#modelPlaceholder").textContent = t[state.lang].modelReady;
    });
    $("#loadVideoBtn").addEventListener("click", loadVideo);

    $("#qrOpen").addEventListener("click", () => $("#qrDialog").showModal());
    $("#startQrBtn").addEventListener("click", startQrScanner);
    $("#stopQrBtn").addEventListener("click", stopQrScanner);
    $("#qrFile").addEventListener("change", e => scanQrFile(e.target.files?.[0]));
    $$('[data-close-qr]').forEach(b => b.addEventListener("click", async () => { await stopQrScanner(); closeDialog($("#qrDialog")); }));
    $("#a11yOpen").addEventListener("click", () => $("#a11yPanel").showModal());
    $("#a11yOpenFooter").addEventListener("click", () => $("#a11yPanel").showModal());
    $("#prefLargeText").addEventListener("change", e => setPref("largeText", e.target.checked));
    $("#prefContrast").addEventListener("change", e => setPref("contrast", e.target.checked));
    $("#prefUnderline").addEventListener("change", e => setPref("underline", e.target.checked));
    $("#prefMotion").addEventListener("change", e => setPref("motion", e.target.checked));
    $("#resetPrefs").addEventListener("click", resetPrefs);

    $("#statementOpen").addEventListener("click", () => openInfo("statement"));
    $("#privacyOpen").addEventListener("click", () => openInfo("privacy"));

    $("#surveyBtn").addEventListener("click", openSurvey);
    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);
    updateOnline();

    [$("#hitoDialog"),$("#a11yPanel"),$("#noticeDialog"),$("#qrDialog"),$("#infoDialog")].forEach(dialog => {
      dialog.addEventListener("click", e => {
        const r = dialog.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) { if (dialog.id === "qrDialog") stopQrScanner(); closeDialog(dialog); }
      });
    });
  }

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(()=>{}));
  }

  bind();
  loadContent().then(() => {
    const token = location.hash.slice(1).toLowerCase();
    const idx = state.hitos.findIndex(h => h.slug === token || h.id.toLowerCase() === token);
    if (idx >= 0) openHito(idx);
  });
})();
