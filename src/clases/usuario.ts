export class usuario{
    id:number;
    nombre:string;
    perfil:string;
    sexo:string;
    clave:string;
    constructor(id:number, nombre:string, perfil:string, sexo:string, clave:string){
        this.id = id;
        this.nombre = nombre;
        this.perfil = perfil;
        this.sexo = sexo;
        this.clave = clave;
    }
}