export const API = 'https://localhost:8083' //Cambiar por la IP de la máquina donde se ejecute el backend

export interface ICliente {
    Cli_Cedula: string
    Cli_Nombre: string
    Cli_Apellido: string
    Cli_BirthDate: string | Date; // Puede ser string o Date
    Cli_Pais: string
    Cli_Email: string
}

export interface IPlan {
    Plan_ID: number
    Plan_Nombre: string
    Plan_Duracion: string
    Plan_Precio: number
    Plan_Plataforma: string
}

export interface ISuscripcion {
    Sus_ID: string
    Plan_ID: number
    Sus_StartDate: string | Date
    Sus_EndDate: string | Date
    Sus_Estado : string
    Sus_RenovacionAuto: string | boolean
}

export interface IPago {
    Pago_ID: number
    Pago_Codigo: string
    Cli_Cedula: string
    Sus_ID: string
    Pago_Monto: number
    Pago_Estado : string
    Pago_Fecha: string | Date
}

export interface Product {
    prd_Codigo: number;
    prd_Nombre: string;
    prd_Duracion: string;
    prd_Precio: number;
    tipo?: string;
  }

export interface CarritoItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
    duration: string;
    image?: string;
}

export interface IBusqueda {
    Tabla: string;
    ID: string;
}