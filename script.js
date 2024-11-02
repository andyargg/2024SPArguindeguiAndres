import {Cliente} from './cliente.js';
import {Empleado} from './empleado.js';

let personas = []; 

function cargarDatos() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost/PersonasEmpleadosClientes.php", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            personas = JSON.parse(xhr.responseText); 
            mostrarDatos(personas);
        } else if (xhr.readyState == 4) {
            alert("No se pudo cargar la información.");
        }
    };
    xhr.send();
}

function mostrarDatos(personas) {
    var cuerpoTabla = document.getElementById('cuerpo-tabla');
    cuerpoTabla.innerHTML = '';
    personas.forEach(function(persona) {
        var fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${persona.id}</td>
            <td>${persona.nombre}</td>
            <td>${persona.apellido}</td>
            <td>${persona.edad}</td>
            <td>${persona.ventas || 'N/A'}</td>
            <td>${persona.sueldo || 'N/A'}</td>
            <td>${persona.compras || 'N/A'}</td>
            <td>${persona.telefono || 'N/A'}</td>
            <td><button onclick="modificar(${persona.id})">Modificar</button></td>
            <td><button onclick="eliminar(${persona.id})">Eliminar</button></td>
        `;
        cuerpoTabla.appendChild(fila);
    });
}
function guardarElemento(elemento) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost/PersonasEmpleadosClientes.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert("Elemento guardado correctamente.");
            cargarDatos();
        } else if (xhr.readyState === 4) {
            alert("Error al guardar el elemento.");
        }
    };
    xhr.send(JSON.stringify(elemento));
}

function agregarElemento() {
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const edad = parseInt(document.getElementById('edad').value);
    const tipo = document.getElementById('tipo').value;

    let nuevoElemento;
    if (tipo === 'empleado') {
        const sueldo = parseFloat(document.getElementById('sueldo').value);
        const ventas = parseInt(document.getElementById('ventas').value);
        nuevoElemento = new Empleado(Date.now(), nombre, apellido, edad, sueldo, ventas);
    } else if (tipo === 'cliente') {
        const compras = parseInt(document.getElementById('compras').value);
        const telefono = document.getElementById('telefono').value;
        nuevoElemento = new Cliente(Date.now(), nombre, apellido, edad, compras, telefono);
    } else {
        alert("Seleccione un tipo válido.");
        return;
    }

    // Guardar el nuevo elemento en el servidor
    guardarElemento(nuevoElemento);
    
    // Cerrar el formulario
    cerrarFormulario();
}

// Inicializar la carga de datos al inicio
cargarDatos();



document.getElementById('tipo').addEventListener('change', function() {
    const tipo = this.value;
    document.getElementById('empleado-fields').style.display = tipo === 'empleado' ? 'block' : 'none';
    document.getElementById('cliente-fields').style.display = tipo === 'cliente' ? 'block' : 'none';
});


function abrirFormulario() {
    document.getElementById('formulario-abm').style.display = 'block';
    document.getElementById('formulario-lista').style.display = 'none';
}




function cerrarFormulario() {
    document.getElementById('formulario-abm').style.display = 'none';
    document.getElementById('formulario-lista').style.display = 'block';
    limpiarFormulario();
}

function limpiarFormulario() {
    document.getElementById('nombre').value = '';
    document.getElementById('apellido').value = '';
    document.getElementById('edad').value = '';
    document.getElementById('tipo').value = 'persona';
    document.getElementById('sueldo').value = '';
    document.getElementById('ventas').value = '';
    document.getElementById('compras').value = '';
    document.getElementById('telefono').value = '';
    document.getElementById('empleado-fields').style.display = 'none';
    document.getElementById('cliente-fields').style.display = 'none';
}

document.getElementById('tipo').addEventListener('change', function() {
    const tipo = this.value;
    document.getElementById('empleado-fields').style.display = tipo === 'empleado' ? 'block' : 'none';
    document.getElementById('cliente-fields').style.display = tipo === 'cliente' ? 'block' : 'none';
});



window.abrirFormulario = abrirFormulario;
window.cerrarFormulario = cerrarFormulario;
window.guardarElemento = guardarElemento;
