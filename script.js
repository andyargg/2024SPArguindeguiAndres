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
            <td><button onclick="iniciarEliminacion(${persona.id})">Eliminar</button></td>
        `;
        cuerpoTabla.appendChild(fila);
    });
}
cargarDatos();


function abrirFormulario() {
    document.getElementById("formulario-lista").style.display = "none";  
    document.getElementById("formulario-abm").style.display = "block";   
    document.getElementById("accion-titulo").innerText = "Alta";        

    document.getElementById('nombre').value = '';
    document.getElementById('apellido').value = '';
    document.getElementById('edad').value = '';
    document.getElementById('sueldo').value = '';
    document.getElementById('ventas').value = '';
    document.getElementById('compras').value = '';
    document.getElementById('telefono').value = '';

    document.getElementById("empleado-fields").style.display = "none";
    document.getElementById("cliente-fields").style.display = "none";
    document.getElementById('aceptar').onclick = () => guardarElemento();

  
}

function cerrarFormulario() {
    document.getElementById("formulario-abm").style.display = "none"; 
    document.getElementById("formulario-lista").style.display = "block"; 
    console.log("uso");
}


function mostrarCamposSegunTipo() {
    const tipo = document.getElementById("tipo").value; 
    document.getElementById("empleado-fields").style.display = "none";
    document.getElementById("cliente-fields").style.display = "none";

    if (tipo === "empleado") {
        document.getElementById("empleado-fields").style.display = "block";
    } else if (tipo === "cliente") {
        document.getElementById("cliente-fields").style.display = "block";
    }
}

function guardarElemento() {
    document.getElementById("spinner").style.display = "block";

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const edad = parseInt(document.getElementById('edad').value);
    const tipo = document.getElementById('tipo').value;

    let nuevoElemento = {
        nombre: nombre,
        apellido: apellido,
        edad: edad
    };

    if (tipo === 'empleado') {
        nuevoElemento.sueldo = parseFloat(document.getElementById('sueldo').value);
        nuevoElemento.ventas = parseInt(document.getElementById('ventas').value);
    } else if (tipo === 'cliente') {
        nuevoElemento.compras = parseInt(document.getElementById('compras').value);
        nuevoElemento.telefono = document.getElementById('telefono').value;
    }

    fetch("http://localhost/PersonasEmpleadosClientes.php", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoElemento)
    })
    .then(response => {
        if (response.ok) {
            return response.json();  
        } else {
            throw new Error("No se pudo realizar la operación");
        }
    })
    .then(data => {
        nuevoElemento.id = data.id; 
        personas.push(nuevoElemento); 
        mostrarDatos(personas);     

        document.getElementById("spinner").style.display = "none";
        document.getElementById("formulario-abm").style.display = "none";
        document.getElementById("formulario-lista").style.display = "block";
    })
    .catch(error => {
        alert(error.message);
        
        document.getElementById("spinner").style.display = "none";
        document.getElementById("formulario-abm").style.display = "none";
        document.getElementById("formulario-lista").style.display = "block";
    });
}

function modificar(id) {
    document.getElementById('formulario-lista').style.display = 'none';
    document.getElementById('formulario-abm').style.display = 'block';

    document.getElementById('accion-titulo').textContent = 'Modificar';

    const persona = personas.find(p => p.id === id);

    if (persona) {
        document.getElementById('nombre').value = persona.nombre;
        document.getElementById('apellido').value = persona.apellido;
        document.getElementById('edad').value = persona.edad;
        
        
        const ventas = persona.ventas
        const sueldo = persona.sueldo
        const compras = persona.compras
        const telefono = persona.compras
        if (ventas && sueldo) {
            document.getElementById('tipo').value = "empleado";
            document.getElementById("empleado-fields").style.display = "block";
            document.getElementById('ventas').value = persona.ventas;
            document.getElementById('sueldo').value = persona.sueldo;
        } else if (compras && telefono) {
            document.getElementById('tipo').value = "cliente";
            document.getElementById("cliente-fields").style.display = "block";
            document.getElementById('compras').value = persona.compras;
            document.getElementById('telefono').value = persona.telefono;
        }


        document.getElementById('aceptar').onclick = () => guardarModificacion(persona.id);
    }
}

async function guardarModificacion(id) {
    document.getElementById('spinner').style.display = 'block';

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const edad = parseInt(document.getElementById('edad').value);
    const tipo = document.getElementById('tipo').value;

    let personaModificada = { id, nombre, apellido, edad, tipo };

    if (tipo === 'empleado') {
        personaModificada.sueldo = parseFloat(document.getElementById('sueldo').value);
        personaModificada.ventas = parseInt(document.getElementById('ventas').value);
    } else if (tipo === 'cliente') {
        personaModificada.compras = parseInt(document.getElementById('compras').value);
        personaModificada.telefono = document.getElementById('telefono').value;
    }

    try {
        const response = await fetch('http://localhost/PersonasEmpleadosClientes.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(personaModificada)
        });

        if (response.status === 200) {
            const index = personas.findIndex(p => p.id === id);
            personas[index] = personaModificada;

            mostrarDatos(personas);
            cerrarFormulario();

            document.getElementById('spinner').style.display = 'none';
        } else {
            alert("No se pudo realizar la modificación.");
            cerrarFormulario();
            document.getElementById('spinner').style.display = 'none';
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Ocurrió un error al realizar la modificación.");
        cerrarFormulario();
        document.getElementById('spinner').style.display = 'none';
    }
}

function iniciarEliminacion(id) {
    document.getElementById("formulario-lista").style.display = "none";
    
    const formularioABM = document.getElementById("formulario-abm");
    formularioABM.style.display = "block";
    formularioABM.style.margin = "auto";  
    
    document.getElementById("accion-titulo").innerText = "Eliminar";
    document.getElementById("btnConfirmarEliminacion").style.display = "inline";
    
    const persona = personas.find(p => p.id === id);

    if (persona) {
        document.getElementById('nombre').value = persona.nombre;
        document.getElementById('apellido').value = persona.apellido;
        document.getElementById('edad').value = persona.edad;
        document.getElementById('btnConfirmarEliminacion').onclick = () => confirmarEliminacion(persona.id);
        
        const ventas = persona.ventas
        const sueldo = persona.sueldo
        const compras = persona.compras
        const telefono = persona.compras
        if (ventas && sueldo) {
            document.getElementById('tipo').value = "empleado";
            document.getElementById("empleado-fields").style.display = "block";
            document.getElementById('ventas').value = persona.ventas;
            document.getElementById('sueldo').value = persona.sueldo;
        } else if (compras && telefono) {
            document.getElementById('tipo').value = "cliente";
            document.getElementById("cliente-fields").style.display = "block";
            document.getElementById('compras').value = persona.compras;
            document.getElementById('telefono').value = persona.telefono;
        }
    }
}

async function confirmarEliminacion(id) {
    document.getElementById("spinner").style.display = "block";

    try {
        const respuesta = await fetch('http://localhost/PersonasEmpleadosClientes.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        });

        if (respuesta.ok) {
            // Eliminar de la lista de `personas`
            personas = personas.filter(p => p.id !== id); // Actualizar la lista de personas

            // Actualizar la tabla con los registros restantes
            mostrarDatos(personas);

            // Cerrar el formulario de eliminación
            cerrarFormulario();

            alert("Registro eliminado con éxito.");
        } else {
            alert("No se pudo realizar la operación.");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Error en la solicitud. Por favor, intente de nuevo.");
    } finally {
        document.getElementById("spinner").style.display = "none";
    }
}




window.abrirFormulario = abrirFormulario;
window.cerrarFormulario = cerrarFormulario;
window.guardarElemento = guardarElemento;
window.modificar = modificar;
window.abrirFormulario = abrirFormulario;
window.cerrarFormulario = cerrarFormulario;
window.guardarModificacion = guardarModificacion;
window.mostrarCamposSegunTipo = mostrarCamposSegunTipo;
window.iniciarEliminacion = iniciarEliminacion;
window.confirmarEliminacion = confirmarEliminacion;






