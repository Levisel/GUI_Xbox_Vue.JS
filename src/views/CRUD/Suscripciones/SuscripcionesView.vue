<template>
    <div class="container my-5">
        <h2>Suscripciones</h2>
        <router-link to="/Suscripciones-Form" class="btn btn-success">
            <i class="bi bi-calendar-date"></i> Añadir Nuevo
        </router-link>

        <div class="row align-items-center">
            <br><br><br><br><br>
            <div class="col-md-2">
                <div class="form-group mb-2">
                    <label for="searchID" class="col-form-label">ID:</label>
                    <input type="text" class="form-control" v-model="searchID"  @keyup.enter="buscar"/>
                </div>
            </div>
            <div class="col-md-2">
                <div class="form-group mb-2">
                    <label for="searchNombre" class="col-form-label">Nombre Plan:</label>
                    <input type="text" class="form-control" v-model="searchNombrePlan" @keyup.enter="buscar"/>
                </div>
            </div>
            <div class="col-md-2">
                <div class="form-group mb-2">
                    <label for="searchEstado" class="col-form-label">Estado:</label>
                    <select class="form-select" v-model="searchEstado" @change="buscar">
                        <option value="">Todos</option>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                </div>
            </div>
            <div class="col-md-2">
                <div class="form-group mb-2">
                    <label for="searchFecha" class="col-form-label">Fecha de Inicio:</label>
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
            :headers="['Plan', 'Fecha de Inicio', 'Fecha de Finalización', 'Estado', 'Renovación Automatica','Acciones']"
            :rows="searchSuscripcion.map(suscripcion => [
                { value: obtenerNombrePlan(suscripcion.Plan_ID) },
                { value: formatDate(suscripcion.Sus_StartDate) },
                { value: formatDate(suscripcion.Sus_EndDate) },
                { value: suscripcion.Sus_Estado.toString() },
                { value: suscripcion.Sus_RenovacionAuto ? 'Sí' : 'No'},
                {
                    value: [
                        { icon: 'bi bi-pencil-square', action: editar, payload: suscripcion.Sus_ID, class: 'btn-info' },
                        { icon: 'bi bi-chat-right-dots-fill', action: visualizar, payload: suscripcion.Sus_ID, class: 'btn-warning' },
                        { icon: 'bi bi-trash', action: eliminar, payload: suscripcion.Sus_ID, class: 'btn-danger' },
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
    import type { ISuscripcion } from '@/RutaApi';
    import type { IPlan } from '@/RutaApi';
    import Swal from 'sweetalert2';
    import router from '@/router';

    const planes = ref<IPlan[]>([]);
    const suscripciones = ref<ISuscripcion[]>([]);
    const searchSuscripcion = ref<ISuscripcion[]>([]);
    const searchID = ref('');
    const searchNombrePlan = ref('');
    const searchEstado = ref('');
    const searchFecha = ref('');

    onMounted(async () => {
        const data = await fetch(`${API}/api/suscripcion/Listar`);
        suscripciones.value = await data.json();
        searchSuscripcion.value = suscripciones.value;

        // Lista de planes
        const dataPlanes = await fetch(`${API}/api/plan/Listar`); 
        planes.value = await dataPlanes.json();

        // Lógica para buscar la suscripción por ID si se proporciona en la consulta
        const idFromQuery = router.currentRoute.value.query.id;
        if (idFromQuery) {
            searchSuscripcion.value = suscripciones.value.filter(suscripcion => suscripcion.Sus_ID === idFromQuery);
            if (searchSuscripcion.value.length === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error...',
                    text: 'No se encontraron los detalles de la suscripción.',
                });
                // Redirigir a la lista general de suscripciones si no se encuentra la suscripción
                router.push({ name: 'Suscripciones' });
            }
        }
    });

    const buscar = () => {
        searchSuscripcion.value = suscripciones.value.filter(suscripcion => {
            return (
                (searchID.value === '' || suscripcion.Sus_ID.toString().toLowerCase().includes(searchID.value.toLowerCase())) 
                && (searchNombrePlan.value === '' || obtenerNombrePlan(suscripcion.Plan_ID).toLowerCase().includes(searchNombrePlan.value.toLowerCase()))
                && (searchEstado.value === '' || suscripcion.Sus_Estado.toLowerCase().includes(searchEstado.value.toLowerCase()))
                &&  (searchFecha.value === '' || (new Date(suscripcion.Sus_StartDate).toISOString().split('T')[0] === searchFecha.value))
            );
        });
    };

    const obtenerNombrePlan = (id: number) => {
        const plan = planes.value.find(plan => plan.Plan_ID === id);
        return plan ? plan.Plan_Nombre : 'No encontrado';
    };


    const formatDate = (date: Date | string): string => {
        const parsedDate = typeof date === 'string' ? new Date(date) : date;
        return parsedDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
    };

    const editar = async (id: string) => {
        router.push({ name: 'Suscripciones-Form', params: { id } });
    };

    const visualizar = async (id: string) => {
        const suscripcion = suscripciones.value.find(suscripcion => suscripcion.Sus_ID === id);
        if (suscripcion) {
            const subscriptionDetails = `
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
            html: subscriptionDetails,
            confirmButtonText: 'OK',
            });
        } else {
            Swal.fire({
            icon: 'error',
            title: 'Error...',
            text: 'No se encontraron los datos de la suscripción.',
            });
        }
    };



    const eliminar = async (id: string) => {
        // const planNombre = obtenerNombrePlan(suscripciones.value.find(suscripcion => suscripcion.Sus_ID === id)?.Plan_ID || 0);
        const result = await Swal.fire({
            title: `¿Estás seguro de eliminar a la suscripción con ID: ${id}?`,
            text: '¡No podrás revertir esto!',  
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, ¡eliminarlo!',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            const data = await fetch(`${API}/api/Suscripcion/Eliminar/${id}`, {
                method: 'DELETE'
            });

            if (data.ok) {
                suscripciones.value = suscripciones.value.filter(suscripcion => suscripcion.Sus_ID !== id);
                searchSuscripcion.value = suscripciones.value; // Actualizar la lista de búsqueda
                Swal.fire('¡Eliminado!', 'El suscripcion ha sido eliminado.', 'info');
            }
        }
  
        
    };
</script>

<style scoped>

</style>

