// API base path.
// Docker/Nginx proxies this relative path to the backend container.
// This keeps the frontend working from localhost and from mobile devices on the same WiFi.
const API = '/api';
const $ = (id) => document.getElementById(id);
let qrScannerStream = null;
let qrScannerFrame = null;
let qrScannerDetector = null;

function normalizeBaseUrl(url) {
  return String(url || '').trim().replace(/\/+$/, '');
}

function isLocalHostName(hostname) {
  return ['localhost', '127.0.0.1', '::1'].includes(String(hostname || '').toLowerCase());
}

function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && Boolean(url.hostname);
  } catch (error) {
    return false;
  }
}

function getQrBaseUrl() {
  const configured = normalizeBaseUrl(window.SMAA_PUBLIC_BASE_URL);
  if (configured && isValidHttpUrl(configured)) return configured;

  const saved = normalizeBaseUrl(localStorage.getItem('smaa_public_base_url'));
  if (saved && isValidHttpUrl(saved)) return saved;

  const origin = normalizeBaseUrl(window.location.origin);
  if (!isLocalHostName(window.location.hostname)) return origin;

  const entered = normalizeBaseUrl(window.prompt(
    'Para que el QR funcione desde un celular, ingresa la URL del PC en la red WiFi. Ejemplo: http://192.168.1.25',
    'http://192.168.1.25'
  ));

  if (entered && isValidHttpUrl(entered)) {
    localStorage.setItem('smaa_public_base_url', entered);
    return entered;
  }

  return origin;
}

function resetQrBaseUrl() {
  localStorage.removeItem('smaa_public_base_url');
  showInfoModal('Configuración de URL pública del QR eliminada. Al generar un nuevo QR desde localhost se solicitará nuevamente la IP del PC.');
}

function getSmaaRole() {
  return localStorage.getItem('smaa_rol') || '';
}

function setSmaaRole(role) {
  if (role) localStorage.setItem('smaa_rol', role);
}

function logoutSmaa() {
  localStorage.removeItem('smaa_rol');
  localStorage.removeItem('smaa_folio_declaracion');
  window.location.href = 'login.html';
}

function getMenuItems(menuType, role) {
  if (menuType === 'viajero' || role === 'VIAJERO') {
    return [
      ['Viajero', 'dashboard-viajero.html'],
      ['Cerrar sesión', '#logout']
    ];
  }
  if (menuType === 'funcionario' || role === 'FUNCIONARIO_ADUANAS') {
    return [
      ['Funcionario', 'panel-funcionario.html'],
      ['Reportes', 'reportes.html'],
      ['Cerrar sesión', '#logout']
    ];
  }
  return [
    ['Login', 'login.html'],
    ['Registro', 'registro.html']
  ];
}

function initRoleNavigation() {
  const role = getSmaaRole();
  document.querySelectorAll('.role-nav').forEach(nav => {
    const menuType = nav.dataset.menu || 'publico';
    const items = getMenuItems(menuType, role);
    nav.innerHTML = items.map(([label, href]) => {
      if (href === '#logout') return `<button type="button" onclick="logoutSmaa()">${label}</button>`;
      const current = window.location.pathname.split('/').pop() || 'index.html';
      const active = current === href ? ' class="active"' : '';
      return `<a${active} href="${href}">${label}</a>`;
    }).join('');
  });
}

function initPortalByRole() {
  const cards = document.querySelectorAll('[data-portal-role]');
  if (!cards.length) return;

  const role = getSmaaRole();
  if (!role) {
    cards.forEach(card => card.hidden = true);
    const description = $('portalDescripcion');
    if (description) description.textContent = 'Debe iniciar sesión para ver su portal de acceso.';
    showInfoModal('Debe iniciar sesión antes de acceder al portal.');
    setTimeout(() => { window.location.href = 'login.html'; }, 1300);
    return;
  }

  cards.forEach(card => {
    card.hidden = card.dataset.portalRole !== role;
  });

  const description = $('portalDescripcion');
  if (description) {
    description.textContent = role === 'VIAJERO'
      ? 'Su cuenta tiene perfil viajero. Solo se muestran funcionalidades de viajero.'
      : 'Su cuenta tiene perfil funcionario. Solo se muestran funcionalidades de funcionario.';
  }
}

function enforceRequiredRole() {
  const requiredRole = document.body?.dataset?.requiredRole;
  if (!requiredRole) return;

  const role = getSmaaRole();
  if (!role) {
    window.location.href = 'login.html';
    return;
  }
  if (role !== requiredRole) {
    window.location.href = 'portal.html';
  }
}


function out(data) { 
  const target = $('resultado'); 
  if (target) target.textContent = JSON.stringify(data, null, 2); 
}

function escapeHTML(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatLabel(key) {
  return String(key)
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, c => c.toUpperCase());
}

function flattenObject(obj, prefix = '') {
  const rows = {};
  Object.entries(obj || {}).forEach(([key, value]) => {
    if (key === 'archivoRespaldoDatos') return;
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(rows, flattenObject(value, path));
    } else if (Array.isArray(value)) {
      rows[path] = value.map(item => {
        if (item && typeof item === 'object') return JSON.stringify(flattenObject(item));
        return item;
      }).join(', ');
    } else {
      rows[path] = value;
    }
  });
  return rows;
}

function renderKeyValueTable(data) {
  const rows = flattenObject(data);
  if (!Object.keys(rows).length) {
    return '<tr><td colspan="2">No se encontraron resultados.</td></tr>';
  }
  return Object.entries(rows)
    .map(([key, value]) => `
      <tr>
        <th>${escapeHTML(formatLabel(key))}</th>
        <td>${escapeHTML(value === null || value === undefined ? '' : value)}</td>
      </tr>`)
    .join('');
}

function renderArrayTable(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return '<tr><td colspan="2">No se encontraron resultados.</td></tr>';
  }

  const flattened = data.map(item => flattenObject(item));
  const columns = [...new Set(flattened.flatMap(item => Object.keys(item)))];

  return `
    <tr>${columns.map(col => `<th>${escapeHTML(formatLabel(col))}</th>`).join('')}</tr>
    ${flattened.map(item => `
      <tr>
        ${columns.map(col => `<td>${escapeHTML(item[col] === null || item[col] === undefined ? '' : item[col])}</td>`).join('')}
      </tr>`).join('')}
  `;
}


function isExpedienteCompleto(data) {
  return data && typeof data === 'object' && data.declaracion && (
    Array.isArray(data.vehiculos) || Array.isArray(data.menores) || Array.isArray(data.mascotas) || Array.isArray(data.declaracionesSag)
  );
}

function archivoRespaldoLink(record) {
  if (!record || !record.archivoRespaldoDatos || !record.archivoRespaldoNombre) return 'Sin archivo';
  const href = String(record.archivoRespaldoDatos).startsWith('data:')
    ? record.archivoRespaldoDatos
    : `data:${record.archivoRespaldoTipo || 'application/octet-stream'};base64,${record.archivoRespaldoDatos}`;
  return `<a class="table-link" href="${escapeHTML(href)}" download="${escapeHTML(record.archivoRespaldoNombre)}">${escapeHTML(record.archivoRespaldoNombre)}</a>`;
}

function renderExpedienteCompletoTable(data) {
  const declaracion = data.declaracion || {};
  const sections = [
    ['Declaración de viaje', [declaracion]],
    ['Vehículos', data.vehiculos || []],
    ['Menores', data.menores || []],
    ['Mascotas', data.mascotas || []],
    ['Declaraciones SAG', data.declaracionesSag || []]
  ];

  const rows = [];
  sections.forEach(([section, records]) => {
    if (!records.length) {
      rows.push(`
        <tr class="expediente-empty-row">
          <td class="expediente-type-cell">${escapeHTML(section)}</td>
          <td colspan="3">No registra información asociada.</td>
        </tr>`);
      return;
    }

    records.forEach((record, index) => {
      const details = Object.entries(flattenObject(record))
        .filter(([key]) => !['declaracionViaje.id', 'declaracionViaje.folio', 'archivoRespaldoNombre', 'archivoRespaldoTipo'].includes(key))
        .map(([key, value]) => `
          <div class="expediente-detail-item">
            <span class="expediente-detail-label">${escapeHTML(formatLabel(key))}</span>
            <span class="expediente-detail-value">${escapeHTML(value === null || value === undefined || value === '' ? 'Sin información' : value)}</span>
          </div>`)
        .join('');
      rows.push(`
        <tr class="expediente-record-row">
          <td class="expediente-type-cell">${escapeHTML(section)}${records.length > 1 ? ` #${index + 1}` : ''}</td>
          <td class="expediente-detail-cell"><div class="expediente-detail-grid">${details || '<span>Sin detalle</span>'}</div></td>
          <td class="expediente-folio-cell">${escapeHTML(record.declaracionViaje?.folio || declaracion.folio || '')}</td>
          <td class="expediente-file-cell">${section === 'Declaración de viaje' ? 'No aplica' : archivoRespaldoLink(record)}</td>
        </tr>`);
    });
  });

  return `
    <tr>
      <th>Tipo de registro</th>
      <th>Información del expediente</th>
      <th>Folio asociado</th>
      <th>Archivo respaldo</th>
    </tr>
    ${rows.join('')}`;
}

function showSearchResultModal(data) {
  const modal = $('searchResultModal');
  const tbody = $('searchResultTable')?.querySelector('tbody');
  if (!modal || !tbody) {
    alert('No se encontró el modal de resultados');
    return;
  }

  tbody.innerHTML = isExpedienteCompleto(data) ? renderExpedienteCompletoTable(data) : (Array.isArray(data) ? renderArrayTable(data) : renderKeyValueTable(data));
  const contenedorQR = $('qr-comprobante');
  if (contenedorQR) {
    contenedorQR.innerHTML = ""; // Limpiamos cualquier QR anterior

    // Extraemos el folio de la respuesta de la base de datos
    let folioEncontrado = null;
    if (!Array.isArray(data) && data.folio) {
      folioEncontrado = data.folio;
    } else if (Array.isArray(data) && data.length > 0 && data[0].folio) {
      folioEncontrado = data[0].folio;
    }

    // Si encontramos un folio, dibujamos el QR
    if (folioEncontrado) {
      const baseUrl = getQrBaseUrl();
      // La URL a la que irá el funcionario al escanear:
      const urlEscaneo = `${baseUrl}/panel-funcionario.html?buscarFolio=${folioEncontrado}`;

      new QRCode(contenedorQR, {
        text: urlEscaneo,
        width: 150,
        height: 150,
        colorDark: "#003366",
        colorLight: "#ffffff"
      });
    }
  }

  modal.classList.add('active');
}

function hideSearchResultModal() {
  const modal = $('searchResultModal');
  if (modal) modal.classList.remove('active');
}

async function readResponseBody(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch (error) {
    return { message: text };
  }
}

function getErrorMessage(data, fallback = 'Error en la operación') {
  if (!data) return fallback;
  if (data.mensaje) return data.mensaje;
  if (data.message) return data.message;
  if (data.error) return data.error;
  if (data.validations && typeof data.validations === 'object') {
    return Object.entries(data.validations)
      .map(([field, message]) => `${formatLabel(field)}: ${message}`)
      .join('\n');
  }
  return fallback;
}

function showErrorModal(message) {
  const modal = $('errorModal');
  const messageElement = $('errorModalMessage');
  if (!modal || !messageElement) {
    alert(message);
    return;
  }
  messageElement.textContent = message;
  modal.classList.add('active');
}

function hideErrorModal() {
  const modal = $('errorModal');
  if (modal) modal.classList.remove('active');
}

function showInfoModal(message) {
  const modal = $('infoModal');
  const messageElement = $('infoModalMessage');
  if (!modal || !messageElement) {
    alert(message);
    return;
  }
  messageElement.textContent = message;
  modal.classList.add('active');
}

function hideInfoModal() {
  const modal = $('infoModal');
  if (modal) modal.classList.remove('active');
}

function showSuccessModal(message, folio = null) {
  const modal = $('successModal');
  const messageElement = $('successModalMessage');
  const folioElement = $('successModalFolio');
  const copyButton = $('copyFolioButton');
  
  if (!modal || !messageElement) {
    alert(message);
    return;
  }
  
  messageElement.textContent = message;
  
  if (folioElement && folio) {
    folioElement.textContent = folio;
    folioElement.style.display = 'block';
    if (copyButton) {
      copyButton.style.display = 'inline-block';
      copyButton.textContent = 'Copiar folio';
    }
    generarQR(folio);

  } else {
    if (folioElement) folioElement.style.display = 'none';
    if (copyButton) copyButton.style.display = 'none';
    const contenedor = $('contenedor-qr');
    if (contenedor) contenedor.innerHTML = "";
  }
  
  modal.classList.add('active');
}
// DIBUJAR EL QR
function generarQR(folio) {
  const contenedor = $('contenedor-qr');
  if (!contenedor) return; // Si no encuentra el div en el HTML, no hace nada

  // 1. Limpiamos por si había un QR de una declaración anterior
  contenedor.innerHTML = "";

  // 2. Armamos la URL dinámica. 
  // window.location.origin pondrá "http://localhost" o "http://192.168.1.X" automáticamente
  const baseUrl = getQrBaseUrl();

  // 3. Creamos la ruta a la que irá el funcionario al escanear
  const urlEscaneo = `${baseUrl}/panel-funcionario.html?buscarFolio=${folio}`;

  // 4. Dibujamos el QR
  new QRCode(contenedor, {
    text: urlEscaneo,
    width: 150,
    height: 150,
    colorDark: "#003366",
    colorLight: "#ffffff"
  });
}
async function copyFolioFromSuccessModal() {
  const folioElement = $('successModalFolio');
  const copyButton = $('copyFolioButton');
  const folio = folioElement?.textContent?.trim();

  if (!folio) {
    showErrorModal('No hay folio disponible para copiar.');
    return;
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(folio);
    } else {
      const tempInput = document.createElement('textarea');
      tempInput.value = folio;
      tempInput.setAttribute('readonly', '');
      tempInput.style.position = 'fixed';
      tempInput.style.opacity = '0';
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
    }

    if (copyButton) {
      copyButton.textContent = 'Folio copiado';
      setTimeout(() => { copyButton.textContent = 'Copiar folio'; }, 1800);
    }
  } catch (error) {
    console.error(error);
    showErrorModal('No se pudo copiar el folio. Selecciónalo manualmente e intenta copiarlo.');
  }
}

function hideSuccessModal() {
  const modal = $('successModal');
  if (modal) modal.classList.remove('active');
}

function showLoginMessage(message) {
  const popup = $('loginPopup');
  const text = $('loginPopupText');
  if (!popup || !text) {
    alert(message);
    return;
  }
  text.textContent = message;
  popup.style.display = 'flex';
  popup.classList.add('active');
}

function hideLoginMessage() {
  const popup = $('loginPopup');
  if (!popup) return;
  popup.classList.remove('active');
  popup.style.display = 'none';
}

async function request(url, method = 'GET', body = null, options = {}) {
  try {
    const fetchOptions = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) fetchOptions.body = JSON.stringify(body);
    const res = await fetch(url, fetchOptions);
    const data = await readResponseBody(res);
    
    if (!res.ok) {
      showErrorModal(getErrorMessage(data));
      return null;
    }
    
    out(data);
    if (options.showInfo !== false) showInfoModal(options.successMessage || 'Operación realizada correctamente');
    return data;
  } catch (error) {
    console.error(error);
    showErrorModal(error.message || 'Error de conexión con el servidor');
    return null;
  }
}

function bool(id) { return $(id).value === 'true'; }

function todayPlus(days) { 
  const d = new Date(); 
  d.setDate(d.getDate() + days); 
  return d.toISOString().slice(0, 10); 
}

function normalizeFolio(folio) {
  return String(folio || '').trim().toUpperCase();
}

function getSavedFolio() {
  return normalizeFolio(localStorage.getItem('smaa_folio_declaracion'));
}

function saveFolio(folio) {
  const value = normalizeFolio(folio);
  if (value) localStorage.setItem('smaa_folio_declaracion', value);
  return value;
}

function getFolioFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return normalizeFolio(params.get('folio') || params.get('buscarFolio'));
}

function extraerFolioDesdeQr(textoQr) {
  const texto = String(textoQr || '').trim();
  if (!texto) return '';

  try {
    const url = new URL(texto, window.location.origin);
    const folioUrl = url.searchParams.get('buscarFolio') || url.searchParams.get('folio');
    if (folioUrl) return normalizeFolio(folioUrl);
  } catch (error) {
    // Si el QR no contiene una URL, se interpreta como texto plano.
  }

  const limpio = texto.replace(/^SMAA-QR-/i, '');
  const match = limpio.match(/SMAA-\d{4}-\d{4,}/i) || limpio.match(/[A-Z]{2,10}-\d{3,}/i);
  return normalizeFolio(match ? match[0] : limpio);
}

function aplicarFolioEscaneado(folio, buscarAutomaticamente = true) {
  const folioNormalizado = normalizeFolio(folio);
  if (!folioNormalizado) {
    showErrorModal('No se pudo obtener el folio desde el código QR. Intenta nuevamente o escribe el folio manualmente.');
    return;
  }

  const folioInput = $('folio');
  if (folioInput) folioInput.value = folioNormalizado;
  saveFolio(folioNormalizado);
  cerrarCamaraQr();

  if (buscarAutomaticamente && typeof buscarFolio === 'function') {
    buscarFolio({ preventDefault() {} });
  }
}

function setQrScannerStatus(message) {
  const status = $('qrScannerStatus');
  if (status) status.textContent = message;
}

function isCameraSecureContextAllowed() {
  return window.isSecureContext || ['localhost', '127.0.0.1'].includes(window.location.hostname);
}

async function abrirCamaraQr() {
  const panel = $('qrScannerPanel');
  if (panel) panel.hidden = false;

  if (!('BarcodeDetector' in window)) {
    setQrScannerStatus('Este navegador no permite lectura automática de QR. Usa “Subir imagen QR” o escribe el folio manualmente.');
    return;
  }

  if (!navigator.mediaDevices?.getUserMedia || !isCameraSecureContextAllowed()) {
    setQrScannerStatus('La cámara en vivo requiere HTTPS o localhost. En celular por WiFi usa “Subir imagen QR”.');
    return;
  }

  try {
    qrScannerDetector = new BarcodeDetector({ formats: ['qr_code'] });
    qrScannerStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } },
      audio: false
    });
    const video = $('qrScannerVideo');
    if (!video) return;
    video.srcObject = qrScannerStream;
    await video.play();
    setQrScannerStatus('Cámara activa. Apunta al código QR del comprobante.');
    escanearQrDesdeVideo();
  } catch (error) {
    console.error(error);
    setQrScannerStatus('No se pudo abrir la cámara en vivo. Usa “Subir imagen QR” para seleccionar una imagen desde archivos o galería.');
  }
}

async function escanearQrDesdeVideo() {
  const video = $('qrScannerVideo');
  if (!video || !qrScannerDetector || video.readyState < 2) {
    qrScannerFrame = requestAnimationFrame(escanearQrDesdeVideo);
    return;
  }

  try {
    const codes = await qrScannerDetector.detect(video);
    if (codes.length > 0) {
      const folio = extraerFolioDesdeQr(codes[0].rawValue);
      aplicarFolioEscaneado(folio, true);
      return;
    }
  } catch (error) {
    console.error(error);
  }

  qrScannerFrame = requestAnimationFrame(escanearQrDesdeVideo);
}

async function escanearQrDesdeImagen(event) {
  const file = event?.target?.files?.[0];
  if (!file) return;

  const extensionQr = String(file.name || '').toLowerCase().split('.').pop();
  if (!['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(extensionQr)) {
    showErrorModal('Debes seleccionar una imagen del código QR en formato PNG, JPG, JPEG, WEBP o GIF.');
    event.target.value = '';
    return;
  }

  if (!('BarcodeDetector' in window)) {
    showErrorModal('Tu navegador permite seleccionar el archivo, pero no permite leer el QR automáticamente. Escribe el folio manualmente o usa Chrome/Edge actualizado en Android.');
    event.target.value = '';
    return;
  }

  try {
    const detector = new BarcodeDetector({ formats: ['qr_code'] });
    const bitmap = await createImageBitmap(file);
    const codes = await detector.detect(bitmap);
    if (!codes.length) {
      showErrorModal('No se detectó un código QR en el archivo. Sube una imagen más clara del código o escribe el folio manualmente.');
      return;
    }
    const folio = extraerFolioDesdeQr(codes[0].rawValue);
    aplicarFolioEscaneado(folio, true);
  } catch (error) {
    console.error(error);
    showErrorModal('No se pudo leer el código QR del archivo. Intenta con otra imagen o escribe el folio manualmente.');
  } finally {
    event.target.value = '';
  }
}

function cerrarCamaraQr() {
  if (qrScannerFrame) {
    cancelAnimationFrame(qrScannerFrame);
    qrScannerFrame = null;
  }
  if (qrScannerStream) {
    qrScannerStream.getTracks().forEach(track => track.stop());
    qrScannerStream = null;
  }
  const video = $('qrScannerVideo');
  if (video) {
    video.pause();
    video.srcObject = null;
  }
  const panel = $('qrScannerPanel');
  if (panel) panel.hidden = true;
}

function getCurrentFolio() {
  const input = $('folioDeclaracion');
  return normalizeFolio(input?.value || getFolioFromUrl() || getSavedFolio());
}


function normalizarNombreArchivo(nombre, maxLength = 180) {
  const original = String(nombre || 'respaldo').trim().replace(/[\\/:*?"<>|]+/g, '_');
  if (original.length <= maxLength) return original;

  const lastDot = original.lastIndexOf('.');
  const extension = lastDot > 0 ? original.slice(lastDot) : '';
  const base = lastDot > 0 ? original.slice(0, lastDot) : original;
  const extensionLimitada = extension.length > 20 ? extension.slice(0, 20) : extension;
  const baseMax = Math.max(20, maxLength - extensionLimitada.length - 12);
  return `${base.slice(0, baseMax)}_recortado${extensionLimitada}`;
}

function readFileAsDataUrl(fileInputId = 'archivoRespaldo') {
  const input = $(fileInputId);
  const file = input?.files?.[0];
  if (!file) return Promise.resolve({});

  const maxBytes = 10 * 1024 * 1024;
  if (file.size > maxBytes) {
    showErrorModal('El archivo de respaldo no puede superar los 10 MB. Si estás desde celular, selecciona un archivo comprimido o PDF liviano.');
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({
      archivoRespaldoNombre: normalizarNombreArchivo(file.name),
      archivoRespaldoTipo: file.type || 'application/octet-stream',
      archivoRespaldoDatos: reader.result
    });
    reader.onerror = () => reject(new Error('No se pudo leer el archivo de respaldo.'));
    reader.readAsDataURL(file);
  });
}


async function resolverDeclaracionPorFolio(folio) {
  const folioNormalizado = normalizeFolio(folio);
  if (!folioNormalizado) {
    showErrorModal('Debes ingresar el folio de declaración para continuar. Primero crea una declaración y copia su folio.');
    return null;
  }

  try {
    const response = await fetch(`${API}/declaraciones/folio/${encodeURIComponent(folioNormalizado)}`);
    const data = await readResponseBody(response);

    if (!response.ok) {
      showErrorModal(getErrorMessage(data, 'No se encontró una declaración con ese folio. Revisa que esté escrito correctamente.'));
      return null;
    }

    saveFolio(data.folio || folioNormalizado);
    return data;
  } catch (error) {
    console.error(error);
    showErrorModal(error.message || 'Error de conexión al validar el folio');
    return null;
  }
}

function initFolioInputsAndDashboard() {
  const folioInicial = getFolioFromUrl() || getSavedFolio();
  const folioInput = $('folioDeclaracion');
  if (folioInput && folioInicial && !folioInput.value) folioInput.value = folioInicial;

  const dashboardFolio = $('dashboardFolio');
  if (dashboardFolio && folioInicial && !dashboardFolio.value) dashboardFolio.value = folioInicial;

  const links = document.querySelectorAll('[data-requiere-folio="true"]');
  const updateLinks = () => {
    const folio = normalizeFolio(dashboardFolio?.value || folioInput?.value || getSavedFolio());
    links.forEach(link => {
      const target = link.getAttribute('data-target');
      if (!target) return;
      link.href = folio ? `${target}?folio=${encodeURIComponent(folio)}` : target;
    });
  };

  if (dashboardFolio) {
    dashboardFolio.addEventListener('input', () => {
      saveFolio(dashboardFolio.value);
      updateLinks();
    });
  }
  if (folioInput) {
    folioInput.addEventListener('input', () => saveFolio(folioInput.value));
  }
  updateLinks();
}

async function validarFolioDashboard(e) {
  e.preventDefault();
  const declaracion = await resolverDeclaracionPorFolio($('dashboardFolio').value);
  if (!declaracion) return;

  const resumen = $('dashboardFolioResumen');
  if (resumen) {
    resumen.innerHTML = `
      <strong>Folio activo:</strong> ${escapeHTML(declaracion.folio)}<br>
      <span>Titular: ${escapeHTML(declaracion.nombreTitular || 'Sin nombre')} · Documento: ${escapeHTML(declaracion.documentoTitular || 'Sin documento')} · Estado: ${escapeHTML(declaracion.estado || 'Sin estado')}</span>
    `;
    resumen.classList.add('active');
  }

  showInfoModal('Folio validado correctamente. Ahora puedes registrar vehículo, menores, SAG o mascotas asociados a esta declaración.');
  initFolioInputsAndDashboard();
}


function initPanelFuncionarioFromQr() {
  const current = window.location.pathname.split('/').pop();
  const params = new URLSearchParams(window.location.search);
  const folioUrl = normalizeFolio(params.get('buscarFolio') || params.get('folio'));
  const folioEscaneado = folioUrl || (current === 'panel-funcionario.html' ? getSavedFolio() : '');
  const folioInput = $('folio');
  if (!folioEscaneado || !folioInput) return;
  folioInput.value = folioEscaneado;
  saveFolio(folioEscaneado);
  if (current === 'panel-funcionario.html') {
    setTimeout(() => buscarFolio({ preventDefault() {} }), 350);
  }
}

function inicializarLimpiezaCamposDemo() {
  document.querySelectorAll('[data-clear-on-first-input="true"]').forEach(input => {
    if (input.dataset.clearReady === 'true') return;
    input.dataset.clearReady = 'true';
    input.dataset.initialValue = input.value || '';

    const clearOnce = () => {
      if (input.dataset.cleared === 'true') return;
      if (input.value === input.dataset.initialValue) {
        input.value = '';
      }
      input.dataset.cleared = 'true';
    };

    input.addEventListener('focus', clearOnce);
    input.addEventListener('input', clearOnce, { once: true });
  });
}

function togglePasswordVisibility(inputId, button) {
  const input = $(inputId);
  if (!input) return;
  const mostrar = input.type === 'password';
  input.type = mostrar ? 'text' : 'password';
  if (button) button.textContent = mostrar ? 'Ocultar' : 'Mostrar';
}

document.addEventListener('DOMContentLoaded', () => {
  inicializarLimpiezaCamposDemo();
  initRoleNavigation();
  enforceRequiredRole();
  initPortalByRole();
  ['fechaViaje', 'fechaSalida'].forEach(id => { if ($(id)) $(id).value = todayPlus(7); });
  if ($('fechaRetorno')) $('fechaRetorno').value = todayPlus(20);
  initFolioInputsAndDashboard();
  initPanelFuncionarioFromQr();
});

async function login(e) {
  e.preventDefault();
  hideLoginMessage();

  const payload = {
    correo: $('correo').value,
    password: $('password').value,
  };

  try {
    const response = await fetch(`${API}/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await readResponseBody(response);

    if (!response.ok || !data.ok) {
      showLoginMessage(getErrorMessage(data, 'Usuario o contraseña incorrecto'));
      return;
    }

    setSmaaRole(data.rol);

    if (data.rol === 'VIAJERO') {
      window.location.href = 'portal.html';
    } else if (data.rol === 'FUNCIONARIO_ADUANAS') {
      window.location.href = 'portal.html';
    } else {
      showLoginMessage('Rol no reconocido para redirección');
    }
  } catch (error) {
    console.error(error);
    showLoginMessage('Error de conexión con el servidor');
  }
}

async function crearDeclaracion(e) { 
  e.preventDefault();
  try {
    const response = await fetch(`${API}/declaraciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombreTitular: $('nombreTitular').value,
        documentoTitular: $('documentoTitular').value,
        fechaViaje: $('fechaViaje').value,
        pasoFronterizo: $('pasoFronterizo').value,
        sentidoCruce: $('sentidoCruce').value,
        medioTransporte: $('medioTransporte').value
      })
    });

    const data = await readResponseBody(response);
    
    if (!response.ok) {
      showErrorModal(getErrorMessage(data, 'Error al crear declaración'));
      return;
    }
    
    saveFolio(data.folio || data.id);
    showSuccessModal(`Declaración creada para ${data.nombreTitular || 'el titular'}`, data.folio || data.id);
  } catch (error) {
    console.error(error);
    showErrorModal(error.message || 'Error de conexión con el servidor');
  }
}

async function crearVehiculo(e) { 
  e.preventDefault();
  const declaracion = await resolverDeclaracionPorFolio(getCurrentFolio());
  if (!declaracion) return;
  const archivoRespaldo = await readFileAsDataUrl();
  if (archivoRespaldo === null) return;
  try {
    const response = await fetch(`${API}/vehiculos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patente: $('patente').value,
        marca: $('marca').value,
        modelo: $('modelo').value,
        anio: Number($('anio').value),
        propietario: $('propietario').value,
        conductorAutorizado: $('conductorAutorizado').value,
        fechaSalida: $('fechaSalida').value,
        fechaRetorno: $('fechaRetorno').value,
        ...archivoRespaldo,
        declaracionViaje: { id: declaracion.id }
      })
    });

    const data = await readResponseBody(response);
    
    if (!response.ok) {
      showErrorModal(getErrorMessage(data, 'Error al registrar vehículo'));
      return;
    }
    
    showSuccessModal(`Vehículo ${data.patente || data.marca} registrado correctamente`);
  } catch (error) {
    console.error(error);
    showErrorModal(error.message || 'Error de conexión con el servidor');
  }
}

async function crearSag(e) { 
  e.preventDefault();
  const declaracion = await resolverDeclaracionPorFolio(getCurrentFolio());
  if (!declaracion) return;
  const archivoRespaldo = await readFileAsDataUrl();
  if (archivoRespaldo === null) return;
  try {
    const response = await fetch(`${API}/sag`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        declaraProductos: bool('declaraProductos'),
        tipoProducto: $('tipoProducto').value,
        productoRestringido: bool('productoRestringido'),
        observacion: $('observacion').value,
        ...archivoRespaldo,
        declaracionViaje: { id: declaracion.id }
      })
    });

    const data = await readResponseBody(response);
    
    if (!response.ok) {
      showErrorModal(getErrorMessage(data, 'Error al registrar declaración SAG'));
      return;
    }
    
    showSuccessModal('Declaración SAG registrada correctamente');
  } catch (error) {
    console.error(error);
    showErrorModal(error.message || 'Error de conexión con el servidor');
  }
}

async function crearMenor(e) { 
  e.preventDefault();
  const declaracion = await resolverDeclaracionPorFolio(getCurrentFolio());
  if (!declaracion) return;
  const archivoRespaldo = await readFileAsDataUrl();
  if (archivoRespaldo === null) return;
  try {
    const response = await fetch(`${API}/menores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: $('nombre').value,
        documento: $('documento').value,
        viajaConAmbosPadres: bool('viajaConAmbosPadres'),
        tieneAutorizacionNotarial: bool('tieneAutorizacionNotarial'),
        ...archivoRespaldo,
        declaracionViaje: { id: declaracion.id }
      })
    });

    const data = await readResponseBody(response);
    
    if (!response.ok) {
      showErrorModal(getErrorMessage(data, 'Error al registrar menor'));
      return;
    }
    
    showSuccessModal(`Menor ${data.nombre || 'de edad'} registrado correctamente`);
  } catch (error) {
    console.error(error);
    showErrorModal(error.message || 'Error de conexión con el servidor');
  }
}

async function crearMascota(e) { 
  e.preventDefault();
  const declaracion = await resolverDeclaracionPorFolio(getCurrentFolio());
  if (!declaracion) return;
  const archivoRespaldo = await readFileAsDataUrl();
  if (archivoRespaldo === null) return;
  try {
    const response = await fetch(`${API}/mascotas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipoAnimal: $('tipoAnimal').value,
        nombre: $('nombre').value,
        certificadoSanitario: bool('certificadoSanitario'),
        vacunaVigente: bool('vacunaVigente'),
        observacion: $('observacion').value,
        ...archivoRespaldo,
        declaracionViaje: { id: declaracion.id }
      })
    });

    const data = await readResponseBody(response);
    
    if (!response.ok) {
      showErrorModal(getErrorMessage(data, 'Error al registrar mascota'));
      return;
    }
    
    showSuccessModal(`Mascota ${data.nombre || data.tipoAnimal} registrada correctamente`);
  } catch (error) {
    console.error(error);
    showErrorModal(error.message || 'Error de conexión con el servidor');
  }
}

async function verComprobante(e) { 
  e.preventDefault();
  try {
    const response = await fetch(`${API}/comprobantes/${$('folio').value}`);
    if (!response.ok) {
      const errorData = await readResponseBody(response);
      throw new Error(getErrorMessage(errorData, response.statusText || 'Error en la búsqueda'));
    }
    const data = await readResponseBody(response);
    showSearchResultModal(data);
  } catch (error) {
    showErrorModal(error.message);
  }
}

async function buscarFolio(e) {
  e.preventDefault();
  try {
    const folio = normalizeFolio($('folio').value);
    if (!folio) { showErrorModal('Debes ingresar o escanear un folio.'); return; }
    const response = await fetch(`${API}/fiscalizacion/folio/${encodeURIComponent(folio)}`);
    if (!response.ok) {
      const errorData = await readResponseBody(response);
      throw new Error(getErrorMessage(errorData, response.statusText || 'Error en la búsqueda'));
    }
    const data = await readResponseBody(response);
    showSearchResultModal(data);
  } catch (error) {
    showErrorModal(error.message);
  }
}

async function buscarPatente(e) {
  e.preventDefault();
  try {
    const response = await fetch(`${API}/fiscalizacion/patente/${$('patente').value}`);
    if (!response.ok) {
      const errorData = await readResponseBody(response);
      throw new Error(getErrorMessage(errorData, response.statusText || 'Error en la búsqueda'));
    }
    const data = await readResponseBody(response);
    showSearchResultModal(data);
  } catch (error) {
    showErrorModal(error.message);
  }
}

async function cambiarEstado(e) {
  e.preventDefault();
  const id = $('declaracionId').value;
  const accion = $('accion').value;
  try {
    const response = await fetch(`${API}/fiscalizacion/${id}/${accion}`, { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' } 
    });
    if (!response.ok) {
      const errorData = await readResponseBody(response);
      throw new Error(getErrorMessage(errorData, response.statusText || 'Error al actualizar el estado'));
    }
    const data = await readResponseBody(response);
    const estado = data.estado || accion;
    showInfoModal(`Cambio de estado a '${estado}' realizado correctamente para ID ${data.id || id}.`);
  } catch (error) {
    showErrorModal(error.message);
  }
}

async function verReportes() {
  try {
    const response = await fetch(`${API}/reportes/resumen`);

    if (!response.ok) {
      throw new Error("Error obteniendo resumen");
    }

    const data = await readResponseBody(response);

    document.getElementById("contenedorAuditoria").style.display = "none";
    document.getElementById("contenedorResumen").style.display = "block";

    const tbody = document.getElementById("tbodyResumen");

    tbody.innerHTML = "";

    Object.entries(flattenObject(data)).forEach(([clave, valor]) => {
      tbody.innerHTML += `
        <tr>
          <td>${escapeHTML(formatLabel(clave))}</td>
          <td>${escapeHTML(valor)}</td>
        </tr>
      `;
    });

    document.getElementById("resultado").innerHTML = "";

  } catch (error) {
    showErrorModal("Error al cargar el resumen: " + error.message);
    console.error(error);
  }
}

async function verAuditoria() {
  try {
    const response = await fetch(`${API}/auditoria`);

    if (!response.ok) {
      throw new Error("Error obteniendo auditoría");
    }

    const data = await readResponseBody(response);

    document.getElementById("contenedorResumen").style.display = "none";
    document.getElementById("contenedorAuditoria").style.display = "block";

    const tbody = document.getElementById("tbodyAuditoria");

    tbody.innerHTML = "";

    data.forEach(registro => {
      tbody.innerHTML += `
        <tr>
          <td>${escapeHTML(registro.id)}</td>
          <td>${escapeHTML(registro.usuario)}</td>
          <td>${escapeHTML(registro.accion)}</td>
          <td>${escapeHTML(registro.modulo)}</td>
          <td>${escapeHTML(registro.detalle)}</td>
          <td>${escapeHTML(registro.fechaHora)}</td>
        </tr>
      `;
    });

    document.getElementById("resultado").innerHTML = "";

  } catch (error) {
    showErrorModal("Error al cargar la auditoría: " + error.message);
    console.error(error);
  }
}