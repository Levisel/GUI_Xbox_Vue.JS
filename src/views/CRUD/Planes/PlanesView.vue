<template>
    <div class="container my-5">
        <h2>Planes</h2>
        <router-link to="/PlanesAdmin-Form" class="btn btn-success">
            <i class="bi bi-bag-fill"></i> Añadir Nuevo
        </router-link>

        <div class="row align-items-center">
            <br><br><br><br><br>
            <div class="col-md-2">
                <div class="form-group mb-2">
                    <label for="searchNombre" class="col-form-label">Nombre:</label>
                    <input type="text" class="form-control" v-model="searchNombre"  @keyup.enter="buscar"/>
                </div>
            </div>
            <div class="col-md-2">
                <div class="form-group">
                    <label for="searchPlataforma" class="col-form-label">Plataforma:</label>
                    <select class="form-select" v-model="searchPlataforma" @change="buscar">
                        <option value="">Todas</option>
                        <option value="PC">PC</option>
                        <option value="Xbox Series X/S">Xbox Series X/S</option>
                    </select>
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
            :headers="['Nombre', 'Duración', 'Precio', 'Plataforma', 'Acciones']"
            :rows="searchPlan.map(plan => [
                { value: plan.Plan_Nombre.toString() },
                { value: plan.Plan_Duracion.toString() },
                { value: plan.Plan_Precio.toString() },
                { value: plan.Plan_Plataforma.toString() },
                {
                    value: [
                        { icon: 'bi bi-pencil-square', action: editar, payload: plan.Plan_ID, class: 'btn-info' },
                        { icon: 'bi bi-chat-right-dots-fill', action: visualizar, payload: plan.Plan_ID, class: 'btn-warning' },
                        { icon: 'bi bi-trash', action: eliminar, payload: plan.Plan_ID, class: 'btn-danger' },
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
    import type { IPlan } from '@/RutaApi';
    import Swal from 'sweetalert2';
    import router from '@/router';

    const planes = ref<IPlan[]>([]);
    const searchPlan = ref<IPlan[]>([]);
    const searchNombre = ref('');
    const searchPlataforma = ref('');

    onMounted(async () => {
        const data = await fetch(`${API}/api/plan/Listar`);
        planes.value = await data.json();
        searchPlan.value = planes.value;

        // Lógica para buscar el plan por ID si se proporciona en la consulta
        const idFromQuery = router.currentRoute.value.query.id;
        if (idFromQuery) {
            searchPlan.value = planes.value.filter(plan => plan.Plan_ID === Number(idFromQuery));
            if (searchPlan.value.length === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error...',
                    text: 'No se encontraron los detalles del plan.',
                });
                // Redirigir a la lista general de planes si no se encuentra el plan
                router.push({ name: 'PlanesAdmin' });
            }
        }
    });

    const buscar = () => {
        searchPlan.value = planes.value.filter(plan => {
            return (
                (searchNombre.value === '' || plan.Plan_Nombre.toString().toLowerCase().includes(searchNombre.value.toLowerCase())) 
                && (searchPlataforma.value === '' || plan.Plan_Plataforma.toString().toLowerCase().includes(searchPlataforma.value.toLowerCase()))
            );
        });
        searchNombre.value = '';
    };

    const editar = async (id: number) => {
        router.push({ name: 'PlanesAdmin-Form', params: { id } });
    };

    const visualizar = async (id: number) => {
        const plan = planes.value.find(plan => plan.Plan_ID === id);
        if (plan) {
            const planDetails = `
            <div class align="center">
                <p><strong>ID:</strong> ${plan.Plan_ID}</p>
                <p><strong>Nombre:</strong> ${plan.Plan_Nombre}</p>
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
            text: 'No se encontraron los datos del plan.',
            });
        }
    };



    const eliminar = async (id: number) => {
        const planNombre = planes.value.find(plan => plan.Plan_ID === id)?.Plan_Nombre;
        const result = await Swal.fire({
            title: `¿Estás seguro de eliminar al ${planNombre}?`,
            text: '¡No podrás revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, ¡eliminarlo!',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            const data = await fetch(`${API}/api/Plan/Eliminar/${id}`, {
                method: 'DELETE'
            });

            if (data.ok) {
                planes.value = planes.value.filter(plan => plan.Plan_ID !== id);
                searchPlan.value = planes.value; // Actualizar la lista de búsqueda
                Swal.fire('¡Eliminado!', 'El plan ha sido eliminado.', 'info');
            }
        }
  
        
    };
</script>

<style scoped>
</style>
