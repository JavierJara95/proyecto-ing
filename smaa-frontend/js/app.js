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

function showSearchResultModal(data) {
  const modal = $('searchResultModal');
  const tbody = $('searchResultTable')?.querySelector('tbody');
  if (!modal || !tbody) {
    alert('No se encontró el modal de resultados');
    return;
  }
  if (!data || Object.keys(data).length === 0) {
    tbody.innerHTML = '<tr><td colspan="2">No se encontraron resultados.</td></tr>';
  } else {
    tbody.innerHTML = Object.entries(data)
      .map(([key, value]) => `
        <tr>
          <th>${key}</th>
          <td>${value === null ? '' : value}</td>
        </tr>`)
      .join('');
  }
  modal.classList.add('active');
}

function hideSearchResultModal() {
  const modal = $('searchResultModal');
  if (modal) modal.classList.remove('active');
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

async function request(url, method = 'GET', body = null) {
  try {
    const options = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) options.body = JSON.stringify(body);
    const res = await fetch(url, options);
    const data = await res.json();
    
    if (!res.ok) {
      showErrorModal(data?.mensaje || data?.message || 'Error en la operación');
      return data;
    }
    
    out(data);
    showInfoModal('Operación realizada correctamente');
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

    const data = await response.json();

    if (!response.ok || !data.ok) {
      showLoginMessage(data?.mensaje || 'Usuario o contraseña incorrecto');
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

    const data = await response.json();
    
    if (!response.ok) {
      showErrorModal(data?.mensaje || data?.message || 'Error al crear declaración');
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

    const data = await response.json();
    
    if (!response.ok) {
      showErrorModal(data?.mensaje || data?.message || 'Error al registrar vehículo');
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

    const data = await response.json();
    
    if (!response.ok) {
      showErrorModal(data?.mensaje || data?.message || 'Error al registrar declaración SAG');
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

    const data = await response.json();
    
    if (!response.ok) {
      showErrorModal(data?.mensaje || data?.message || 'Error al registrar menor');
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

    const data = await response.json();
    
    if (!response.ok) {
      showErrorModal(data?.mensaje || data?.message || 'Error al registrar mascota');
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.mensaje || response.statusText || 'Error en la búsqueda');
    }
    const data = await response.json();
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.mensaje || response.statusText || 'Error en la búsqueda');
    }
    const data = await response.json();
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.mensaje || response.statusText || 'Error en la búsqueda');
    }
    const data = await response.json();
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.mensaje || response.statusText || 'Error al actualizar el estado');
    }
    const data = await response.json();
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

    const data = await response.json();

    document.getElementById("contenedorAuditoria").style.display = "none";
    document.getElementById("contenedorResumen").style.display = "block";

    const tbody = document.getElementById("tbodyResumen");

    tbody.innerHTML = "";

    Object.entries(data).forEach(([clave, valor]) => {
      if (clave === 'cantidadPorPasoFronterizo' && valor && typeof valor === 'object') {
        const detalles = Object.entries(valor)
          .map(([paso, cantidad]) => `${paso}: ${cantidad}`)
          .join('\n');

        tbody.innerHTML += `
          <tr>
            <td>${clave}</td>
            <td style="white-space: pre-line">${detalles}</td>
          </tr>
        `;
      } else {
        tbody.innerHTML += `
          <tr>
            <td>${clave}</td>
            <td>${valor}</td>
          </tr>
        `;
      }
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

    const data = await response.json();

    document.getElementById("contenedorResumen").style.display = "none";
    document.getElementById("contenedorAuditoria").style.display = "block";

    const tbody = document.getElementById("tbodyAuditoria");

    tbody.innerHTML = "";

    data.forEach(registro => {
      tbody.innerHTML += `
        <tr>
          <td>${registro.id}</td>
          <td>${registro.usuario}</td>
          <td>${registro.accion}</td>
          <td>${registro.fecha}</td>
        </tr>
      `;
    });

    document.getElementById("resultado").innerHTML = "";

  } catch (error) {
    showErrorModal("Error al cargar la auditoría: " + error.message);
    console.error(error);
  }
}