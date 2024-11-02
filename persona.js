export class Persona {
    constructor(id, nombre, apellido, edad) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
    }

    toString() {
        return `${this.nombre} ${this.apellido}, ${this.edad} años`;
    }

    toJson() {
        return JSON.stringify(this);
    }
}

