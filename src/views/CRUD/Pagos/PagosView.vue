<template>
    <div class="container my-5">
        <h2>Pagos</h2>
        <router-link to="/Pagos-Form" class="btn btn-success">
            <i class="bi bi-credit-card-2-front-fill"></i> Añadir Nuevo
        </router-link>

        <div class="row align-items-center">
            <br><br><br><br><br>
            <div class="col-md-2">
                <div class="form-group mb-2">
                    <label for="searchID" class="col-form-label">Cliente:</label>
                    <input type="text" class="form-control" v-model="searchCliente" @keyup.enter="buscar"/>
                </div>
            </div>
            <div class="col-md-2">
                <div class="form-group mb-2">
                    <label for="searchEstado" class="col-form-label">Estado:</label>
                    <select class="form-select" v-model="searchEstado" @change="buscar">
                        <option value="">Todos</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Pagado">Pagado</option>
                    </select>
                </div>
            </div>
            <div class="col-md-2">
                <div class="form-group mb-2">
                    <label for="searchFecha" class="col-form-label">Fecha:</label>
                    <input type="date" class="form-control" v-model="searchFecha" @change="buscar"/>
                </div>
            </div>
            <div class="col-md-2" style="margin-bottom: -30px;">
                <div class="form-group mb-lg-1">
                    <button type="button" class="btn btn-dark" @click="buscar">
                        <i class="bi bi-search"></i> Buscar
                    </button>
                </div>
            </div>
        </div>

        <Table
            :headers="['Código', 'Cliente', 'Suscripción', 'Monto', 'Fecha','Estado', 'Acciones']"
            :rows="searchPago.map(pago => [
                { value: pago.Pago_Codigo ? pago.Pago_Codigo.toString() : 'N/A' },
                { value: obtenerNombreCliente(pago.Cli_Cedula ? pago.Cli_Cedula.toString() : '') },
                { value: pago.Sus_ID ? pago.Sus_ID.toString() : 'N/A' },
                { value: pago.Pago_Monto !== undefined ? pago.Pago_Monto : 'N/A' },
                { value: pago.Pago_Fecha ? formatDate(pago.Pago_Fecha) : 'N/A' },
                { value: pago.Pago_Estado ? pago.Pago_Estado : 'N/A' },
                {
                    value: [
                        { icon: 'bi bi-pencil-square', action: editar, payload: pago.Pago_ID, class: 'btn-info' },
                        { icon: 'bi bi-chat-right-dots-fill', action: visualizar, payload: pago.Pago_ID, class: 'btn-warning' },
                        { icon: 'bi bi-trash', action: eliminar, payload: pago.Pago_ID, class: 'btn-danger' },
                    ],
                },
            ])"
        />
    </div>
</template>

<script setup lang="ts">
import Table from '@/components/Table.vue';
import { onMounted, ref } from 'vue';
import { API } from '@/RutaApi';
import type { ICliente, IPago, ISuscripcion } from '@/RutaApi';
import type { IPlan } from '@/RutaApi';
import Swal from 'sweetalert2';
import router from '@/router';
import PagosFormView from './PagosFormView.vue';

const pagos = ref<IPago[]>([]);
const clientes = ref<ICliente[]>([]);
const planes = ref<IPlan[]>([]);
const suscripciones = ref<ISuscripcion[]>([]);
const searchPago = ref<IPago[]>([]);
const searchCliente = ref('');
const searchEstado = ref('');
const searchFecha = ref('');

onMounted(async () => {
    const data = await fetch(`${API}/api/pago/Listar`);
    pagos.value = await data.json();
    searchPago.value = pagos.value;

    // Lista de clientes
    const dataClientes = await fetch(`${API}/api/cliente/Listar`); 
    clientes.value = await dataClientes.json();

    // Lista de planes
    const dataPlanes = await fetch(`${API}/api/plan/Listar`);
    planes.value = await dataPlanes.json();

    // Lista de suscripciones
    const dataSuscripciones = await fetch(`${API}/api/suscripcion/Listar`);
    suscripciones.value = await dataSuscripciones.json();
    // Lógica para buscar el pago por ID si se proporciona en la consulta
    const idFromQuery = router.currentRoute.value.query.id;
    if (idFromQuery) {
        searchPago.value = pagos.value.filter(pago => pago.Pago_ID === Number(idFromQuery));
        if (searchPago.value.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: 'No se encontraron los detalles del pago.',
            });
            // Redirigir a la lista general de pagos si no se encuentra el pago
            router.push({ name: 'Pagos' });
        }
    }
});

const buscar = () => {
    searchPago.value = pagos.value.filter(pago => {
        return (
            (searchCliente.value === '' || obtenerNombreCliente(pago.Cli_Cedula).toLowerCase().includes(searchCliente.value.toLowerCase()))
            && (searchEstado.value === '' || pago.Pago_Estado.toLowerCase().includes(searchEstado.value.toLowerCase()))
            && (searchFecha.value === '' || (new Date(pago.Pago_Fecha).toISOString().split('T')[0] === searchFecha.value))
        );
    });
};

const obtenerNombreCliente = (id: string) => {
    const cliente = clientes.value.find(cliente => cliente.Cli_Cedula === id);
    return cliente ? cliente.Cli_Nombre +" "+ cliente.Cli_Apellido : 'No encontrado';
};

const formatDate = (date: Date | string): string => {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    return parsedDate ? parsedDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-') : '';
};

const editar = async (id: number) => {
    router.push({ name: 'Pagos-Form', params: { id } });
};

const visualizar = async (id: number) => {
    const pago = pagos.value.find(pago => pago.Pago_ID === id);
    if (pago) {
        const paymentDetails = `
        <div class align="center">
            <p><strong>ID:</strong> ${pago.Pago_ID}</p>
            <p><strong>Cliente:</strong> ${obtenerNombreCliente(pago.Cli_Cedula)}</p>
            <p><strong>Suscripción:</strong> ${pago.Sus_ID}</p>
            <p><strong>Monto:</strong> ${pago.Pago_Monto}</p>
            <p><strong>Fecha:</strong> ${formatDate(pago.Pago_Fecha)}</p>
            <p><strong>Estado:</strong> ${pago.Pago_Estado}</p>
        </div>
        `;

        Swal.fire({
        title: 'Información del Pago',
        html: paymentDetails,
        confirmButtonText: 'OK',
        });
    } else {
        Swal.fire({
        icon: 'error',
        title: 'Error...',
        text: 'No se encontraron los datos del pago.',
        });
    }
};

const eliminar = async (id: number) => {
    const pagoCodigo = pagos.value.find(pago => pago.Pago_ID === id)?.Pago_Codigo;
    const result = await Swal.fire({
        title: `¿Estás seguro de eliminar al pago "${pagoCodigo}" ?`,
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, ¡eliminarlo!',
        cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
        const data = await fetch(`${API}/api/Pago/Eliminar/${id}`, {
            method: 'DELETE'
        });

        if (data.ok) {
            pagos.value = pagos.value.filter(pago => pago.Pago_ID !== id);
            searchPago.value = pagos.value; // Actualizar la lista de búsqueda
            Swal.fire('¡Eliminado!', 'El pago ha sido eliminado.', 'info');
        }
    }
};
</script>

<style scoped>
</style>
