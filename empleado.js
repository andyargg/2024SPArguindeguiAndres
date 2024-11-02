import { Persona } from './persona.js';



export class Empleado extends Persona {
    constructor(id, nombre, apellido, edad, sueldo, ventas) {
        super(id, nombre, apellido, edad);
        this.sueldo = sueldo;
        this.ventas = ventas;
    }

    toString() {
        return `${super.toString()}, Sueldo: ${this.sueldo}, Ventas: ${this.ventas}`;
    }

    toJson() {
        const personaJson = JSON.parse(super.toJson());
        personaJson.sueldo = this.sueldo;
        personaJson.ventas = this.ventas;
        return JSON.stringify(personaJson);
    }
}
