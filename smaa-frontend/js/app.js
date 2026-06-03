const API = 'http://localhost:8080/api';
const $ = (id) => document.getElementById(id);
function out(data) { $('resultado').textContent = JSON.stringify(data, null, 2); }
async function request(url, method = 'GET', body = null) {
  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(url, options);
  const data = await res.json();
  out(data);
  return data;
}
function bool(id) { return $(id).value === 'true'; }
function todayPlus(days) { const d = new Date(); d.setDate(d.getDate() + days); return d.toISOString().slice(0, 10); }
document.addEventListener('DOMContentLoaded', () => {
  ['fechaViaje', 'fechaSalida'].forEach(id => { if ($(id)) $(id).value = todayPlus(7); });
  if ($('fechaRetorno')) $('fechaRetorno').value = todayPlus(20);
});
async function login(e) { e.preventDefault(); request(`${API}/usuarios/login`, 'POST', { correo: $('correo').value, password: $('password').value }); }
async function crearDeclaracion(e) { e.preventDefault(); request(`${API}/declaraciones`, 'POST', { nombreTitular: $('nombreTitular').value, documentoTitular: $('documentoTitular').value, fechaViaje: $('fechaViaje').value, pasoFronterizo: $('pasoFronterizo').value, sentidoCruce: $('sentidoCruce').value, medioTransporte: $('medioTransporte').value }); }
async function crearVehiculo(e) { e.preventDefault(); request(`${API}/vehiculos`, 'POST', { patente: $('patente').value, marca: $('marca').value, modelo: $('modelo').value, anio: Number($('anio').value), propietario: $('propietario').value, conductorAutorizado: $('conductorAutorizado').value, fechaSalida: $('fechaSalida').value, fechaRetorno: $('fechaRetorno').value, declaracionViaje: { id: Number($('declaracionId').value) } }); }
async function crearSag(e) { e.preventDefault(); request(`${API}/sag`, 'POST', { declaraProductos: bool('declaraProductos'), tipoProducto: $('tipoProducto').value, productoRestringido: bool('productoRestringido'), observacion: $('observacion').value, declaracionViaje: { id: Number($('declaracionId').value) } }); }
async function crearMenor(e) { e.preventDefault(); request(`${API}/menores`, 'POST', { nombre: $('nombre').value, documento: $('documento').value, viajaConAmbosPadres: bool('viajaConAmbosPadres'), tieneAutorizacionNotarial: bool('tieneAutorizacionNotarial'), declaracionViaje: { id: Number($('declaracionId').value) } }); }
async function crearMascota(e) { e.preventDefault(); request(`${API}/mascotas`, 'POST', { tipoAnimal: $('tipoAnimal').value, nombre: $('nombre').value, certificadoSanitario: bool('certificadoSanitario'), vacunaVigente: bool('vacunaVigente'), observacion: $('observacion').value, declaracionViaje: { id: Number($('declaracionId').value) } }); }
async function verComprobante(e) { e.preventDefault(); request(`${API}/comprobantes/${$('folio').value}`); }
async function buscarFolio(e) { e.preventDefault(); request(`${API}/fiscalizacion/folio/${$('folio').value}`); }
async function buscarPatente(e) { e.preventDefault(); request(`${API}/fiscalizacion/patente/${$('patente').value}`); }
async function cambiarEstado(e) { e.preventDefault(); request(`${API}/fiscalizacion/${$('declaracionId').value}/${$('accion').value}`, 'PUT'); }
async function verReportes() { request(`${API}/reportes/resumen`); }
async function verAuditoria() { request(`${API}/auditoria`); }
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

            tbody.innerHTML += `
                <tr>
                    <td>${clave}</td>
                    <td>${valor}</td>
                </tr>
            `;

        });

        document.getElementById("resultado").innerHTML = "";

    } catch (error) {

        document.getElementById("resultado").innerHTML =
            "Error al cargar el resumen.";

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

        document.getElementById("resultado").innerHTML =
            "Error al cargar la auditoría.";

        console.error(error);
    }
}