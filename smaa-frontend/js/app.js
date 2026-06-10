// Determine API URL dynamically
function getAPIUrl() {
  // Check if we're on localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8080/api';
  }
  // For network access, use the current host's IP and port 8080
  return `http://${window.location.hostname}:8080/api`;
}

const API = getAPIUrl();
const $ = (id) => document.getElementById(id);

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

function showSearchResultModal(data) {
  const modal = $('searchResultModal');
  const tbody = $('searchResultTable')?.querySelector('tbody');
  if (!modal || !tbody) {
    alert('No se encontró el modal de resultados');
    return;
  }

  tbody.innerHTML = Array.isArray(data) ? renderArrayTable(data) : renderKeyValueTable(data);
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
  
  if (!modal || !messageElement) {
    alert(message);
    return;
  }
  
  messageElement.textContent = message;
  
  if (folioElement && folio) {
    folioElement.textContent = folio;
    folioElement.style.display = 'block';
  } else if (folioElement) {
    folioElement.style.display = 'none';
  }
  
  modal.classList.add('active');
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

document.addEventListener('DOMContentLoaded', () => {
  ['fechaViaje', 'fechaSalida'].forEach(id => { if ($(id)) $(id).value = todayPlus(7); });
  if ($('fechaRetorno')) $('fechaRetorno').value = todayPlus(20);
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

    if (data.rol === 'VIAJERO') {
      window.location.href = 'dashboard-viajero.html';
    } else if (data.rol === 'FUNCIONARIO_ADUANAS') {
      window.location.href = 'panel-funcionario.html';
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
    
    showSuccessModal(`Declaración creada para ${data.nombreTitular || 'el titular'}`, data.folio || data.id);
  } catch (error) {
    console.error(error);
    showErrorModal(error.message || 'Error de conexión con el servidor');
  }
}

async function crearVehiculo(e) { 
  e.preventDefault();
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
        declaracionViaje: { id: Number($('declaracionId').value) }
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
  try {
    const response = await fetch(`${API}/sag`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        declaraProductos: bool('declaraProductos'),
        tipoProducto: $('tipoProducto').value,
        productoRestringido: bool('productoRestringido'),
        observacion: $('observacion').value,
        declaracionViaje: { id: Number($('declaracionId').value) }
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
  try {
    const response = await fetch(`${API}/menores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: $('nombre').value,
        documento: $('documento').value,
        viajaConAmbosPadres: bool('viajaConAmbosPadres'),
        tieneAutorizacionNotarial: bool('tieneAutorizacionNotarial'),
        declaracionViaje: { id: Number($('declaracionId').value) }
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
        declaracionViaje: { id: Number($('declaracionId').value) }
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
    const response = await fetch(`${API}/fiscalizacion/folio/${$('folio').value}`);
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