<template>
    <div class="container my-5">
        <h2>Búsqueda General 🔍</h2>
        <br>
        <Table
            :headers="['Tabla', 'ID', 'Nombre','Detalles','Acciones']"
            :rows="lstBusqueda.map(busqueda => [
                { value: busqueda.Tabla.toString() },
                { value: busqueda.ID.toString() },
                { value: obtenerNombre(busqueda.Tabla, busqueda.ID) },
                { value: obtenerDetalle(busqueda.Tabla, busqueda.ID) },
                {
                    value: [
                    { icon: 'bi bi-pencil-square', action: () => editar(busqueda.ID, busqueda.Tabla), payload: busqueda.ID, class: 'btn-info' },    
                    { icon: 'bi bi-chat-right-dots-fill', action: () => visualizar(busqueda.ID, busqueda.Tabla), payload: busqueda.ID, class: 'btn-warning' },
                    { icon: 'bi bi-box-arrow-up-right', action: () => redirect(busqueda.ID, busqueda.Tabla), payload: busqueda.ID, class: 'btn-dark' }
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
    import type { IBusqueda } from '@/RutaApi';
    import type { ICliente } from '@/RutaApi';
    import type { IPlan} from '@/RutaApi';
    import type { ISuscripcion } from '@/RutaApi';
    import type { IPago } from '@/RutaApi';
    import Swal from 'sweetalert2';
    import router from '@/router';

    const lstBusqueda = ref<IBusqueda[]>([]);
    const url = window.location.href;
    const search = url.split("/").slice(-1)[0];
    const clientes = ref<ICliente[]>([]);
    const planes = ref<IPlan[]>([]);
    const suscripciones = ref<ISuscripcion[]>([]);
    const pagos = ref<IPago[]>([]);
    const searchCliente = ref<ICliente[]>([]);
    onMounted(async () => {
        const data = await fetch(`${API}/api/SP/SearchEverythingBD/${search}`);
        const dataClient = await fetch(`${API}/api/cliente/Listar`);
        const dataPlan = await fetch(`${API}/api/plan/Listar`);
        const dataSuscripcion = await fetch(`${API}/api/suscripcion/Listar`);
        const dataPago = await fetch(`${API}/api/pago/Listar`);
        lstBusqueda.value = await data.json();
        clientes.value = await dataClient.json();
        planes.value = await dataPlan.json();
        suscripciones.value = await dataSuscripcion.json();
        pagos.value = await dataPago.json();
        searchCliente.value = clientes.value;
    });

    const obtenerNombre = (tabla: string, id: string): string => {
        switch (tabla) {
            case 'Cliente':
                const cliente = clientes.value.find(cliente => cliente.Cli_Cedula === id);
                return cliente ? cliente.Cli_Nombre + " "+ cliente.Cli_Apellido: '';
            case 'Plan':
                const plan = planes.value.find(plan => plan.Plan_ID === Number(id));
                return plan ? plan.Plan_Nombre : '';
            case 'Suscripcion':
                const suscripcion = suscripciones.value.find(suscripcion => suscripcion.Sus_ID === id);
                return suscripcion ? obtenerNombrePlan(suscripcion.Plan_ID) : '';
            case 'Pago':
                const pago = pagos.value.find(pago => pago.Pago_ID === parseInt(id));
                return pago ? obtenerNombreCliente(pago.Cli_Cedula.toString()) : '';
            default:
                return '';
        }
    };

    const obtenerDetalle = (tabla: string, id: string): string => {
        switch (tabla) {
            case 'Cliente':
                const cliente = clientes.value.find(cliente => cliente.Cli_Cedula === id);
                return cliente ? cliente.Cli_Pais : '';
            case 'Plan':
                const plan = planes.value.find(plan => plan.Plan_ID === Number(id));
                return plan ? plan.Plan_Duracion : '';
            case 'Suscripcion':
                const suscripcion = suscripciones.value.find(suscripcion => suscripcion.Sus_ID === id);
                return suscripcion ? suscripcion.Sus_Estado : '';
            case 'Pago':
                const pago = pagos.value.find(pago => pago.Pago_ID === parseInt(id));
                return pago ? pago.Pago_Estado : '';
            default:
                return '';
        }
    };

    const visualizar = async (id: string, tabla: string) => {
    switch (tabla) {
        case 'Cliente':
            const cliente = clientes.value.find(cliente => cliente.Cli_Cedula === id);
            if (cliente) {
                const clientDetails = `
                <div class align="center">
                    <p><strong>Cédula:</strong> ${cliente.Cli_Cedula}</p>
                    <p><strong>Nombre:</strong> ${cliente.Cli_Nombre}</p>
                    <p><strong>Apellido:</strong> ${cliente.Cli_Apellido}</p>
                    <p><strong>Fecha de Nacimiento:</strong> ${formatDate(cliente.Cli_BirthDate)}</p>
                    <p><strong>País:</strong> ${cliente.Cli_Pais}</p>
                    <p><strong>Email:</strong> ${cliente.Cli_Email}</p>
                </div>
                `;

                Swal.fire({
                    title: 'Información del Cliente',
                    html: clientDetails,
                    confirmButtonText: 'OK',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error...',
                    text: 'No se encontraron los datos del cliente.',
                });
            }
            break;
        case 'Plan':
            const plan = planes.value.find(plan => plan.Plan_ID === Number(id));
            if (plan) {
                const planDetails = `
                <div class align="center">
                    <p><strong>Nombre del Plan:</strong> ${plan.Plan_Nombre}</p>
                    <p><strong>Duración:</strong> ${plan.Plan_Duracion}</p>
                    <p><strong>Precio:</strong> ${plan.Plan_Precio}</p>
                    <p><strong>Plataforma:</strong> ${plan.Plan_Plataforma}</p>
                </div>
                `;

                Swal.fire({
                    title: 'Información del Plan',
                    html: planDetails,
                    confirmButtonText: 'OK',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error...',
                    text: 'No se encontraron los detalles del plan.',
                });
            }
            break;
        case 'Suscripcion':
            const suscripcion = suscripciones.value.find(suscripcion => suscripcion.Sus_ID === id);
            if (suscripcion) {
                const suscripcionDetails = `
                <div class align="center">
                    <p><strong>ID:</strong> ${suscripcion.Sus_ID}</p>
                    <p><strong>Plan:</strong> ${obtenerNombrePlan(suscripcion.Plan_ID)}</p>
                    <p><strong>Fecha de Inicio:</strong> ${formatDate(suscripcion.Sus_StartDate)}</p>
                    <p><strong>Fecha de Finalización:</strong> ${formatDate(suscripcion.Sus_EndDate)}</p>
                    <p><strong>Estado:</strong> ${suscripcion.Sus_Estado}</p>
                    <p><strong>Renovación Automática:</strong> ${suscripcion.Sus_RenovacionAuto ? 'Sí' : 'No'}</p>
                </div>
                `;

                Swal.fire({
                    title: 'Información de la Suscripción',
                    html: suscripcionDetails,
                    confirmButtonText: 'OK',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error...',
                    text: 'No se encontraron los detalles de la suscripción.',
                });
            }
            break;
        case 'Pago':
            const pago = pagos.value.find(pago => pago.Pago_ID === parseInt(id));
            if (pago) {
                const pagoDetails = `
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
                    html: pagoDetails,
                    confirmButtonText: 'OK',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error...',
                    text: 'No se encontraron los detalles del pago.',
                });
            }
            break;
        default:
            break;
    }
    };

    const editar = async (id: string, tabla: string) => {
        switch (tabla) {
            case 'Cliente':
                router.push({ name: 'Clientes-Form', params: { id } });
                break;
            case 'Plan':
                router.push({ name: 'PlanesAdmin-Form', params: { id } });
                break;
            case 'Suscripcion':
                router.push({ name: 'Suscripciones-Form', params: { id } });
                break;
            case 'Pago':
                router.push({ name: 'Pagos-Form', params: { id } });
                break;
            default:
                break;
        }
    };

    
    const redirect = async (id: string, tabla: string) => {
    switch (tabla) {
        case 'Cliente':
            router.push({ name: 'Clientes', query: { id } });
            break;
        case 'Plan':
            router.push({ name: 'PlanesAdmin', query: { id } });
            break;
        case 'Suscripcion':
            router.push({ name: 'Suscripciones', query: { id } });
            break;
        case 'Pago':
            router.push({ name: 'Pagos', query: { id } });
            break;
        default:
            break;
         }
   };



    const formatDate = (date: Date | string): string => {
        const parsedDate = typeof date === 'string' ? new Date(date) : date;
        return parsedDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
    };

    const obtenerNombreCliente = (id: string) => {
    const cliente = clientes.value.find(cliente => cliente.Cli_Cedula === id);
    return cliente ? cliente.Cli_Nombre +" "+ cliente.Cli_Apellido : 'No encontrado';
    };
    const obtenerNombrePlan = (id: number) => {
        const plan = planes.value.find(plan => plan.Plan_ID === id);
        return plan ? plan.Plan_Nombre : 'No encontrado';
    };
</script>

<style scoped>
</style>
