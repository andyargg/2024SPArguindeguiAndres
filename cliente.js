import { Persona } from './persona.js';

export class Cliente extends Persona {
    constructor(id, nombre, apellido, edad, compras, telefono) {
        super(id, nombre, apellido, edad);
        this.compras = compras;
        this.telefono = telefono;
    }

    toString() {
        return `${super.toString()}, Compras: ${this.compras}, Teléfono: ${this.telefono}`;
    }

    toJson() {
        const personaJson = JSON.parse(super.toJson());
        personaJson.compras = this.compras;
        personaJson.telefono = this.telefono;
        return JSON.stringify(personaJson);
    }
}
