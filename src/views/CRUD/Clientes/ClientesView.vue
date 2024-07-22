<template>
    <div class="container my-5">
        <h2>Clientes</h2>
        <router-link to="/Clientes-Form" class="btn btn-success">
            <i class="fa fa-user"></i> Añadir Nuevo
        </router-link>

        <div class="row align-items-center">
            <br><br><br><br><br>
            <div class="col-md-2">
                <div class="form-group mb-2">
                    <label for="searchID" class="col-form-label">Cédula:</label>
                    <input type="text" class="form-control" v-model="searchID"  @keyup.enter="buscar"/>
                </div>
            </div>
            <div class="col-md-2">
                <div class="form-group mb-2">
                    <label for="searchNombre" class="col-form-label">Nombre:</label>
                    <input type="text" class="form-control" v-model="searchNombre"  @keyup.enter="buscar"/>
                </div>
            </div>
            <div class="col-md-2">
                <div class="form-group mb-2">
                    <label for="searchApellido" class="col-form-label">Apellido:</label>
                    <input type="text" class="form-control" v-model="searchApellido" @keyup.enter="buscar"/>
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
            :headers="['Cédula', 'Nombre', 'Apellido', 'Fecha de Nacimiento', 'País', 'Email', 'Acciones']"
            :rows="searchCliente.map(cliente => [
                { value: cliente.Cli_Cedula.toString() },
                { value: cliente.Cli_Nombre.toString() },
                { value: cliente.Cli_Apellido.toString() },
                { value: formatDate(cliente.Cli_BirthDate).toString() },
                { value: cliente.Cli_Pais.toString() },
                { value: cliente.Cli_Email.toString() },
                {
                    value: [
                        { icon: 'bi bi-pencil-square', action: editar, payload: cliente.Cli_Cedula, class: 'btn-info' },
                        { icon: 'bi bi-chat-right-dots-fill', action: visualizar, payload: cliente.Cli_Cedula, class: 'btn-warning' },
                        { icon: 'bi bi-trash', action: eliminar, payload: cliente.Cli_Cedula, class: 'btn-danger' },
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
    import type { ICliente } from '@/RutaApi';
    import Swal from 'sweetalert2';
    import router from '@/router';

    const clientes = ref<ICliente[]>([]);
    const searchCliente = ref<ICliente[]>([]);
    const searchID = ref('');
    const searchNombre = ref('');
    const searchApellido = ref('');

    onMounted(async () => {
        const data = await fetch(`${API}/api/cliente/Listar`);
        clientes.value = await data.json();
        searchCliente.value = clientes.value;
        // Lógica para buscar el cliente por ID si se proporciona en la consulta
        const idFromQuery = router.currentRoute.value.query.id;
        if (idFromQuery) {
            searchCliente.value = clientes.value.filter(cliente => cliente.Cli_Cedula === idFromQuery);
            if (searchCliente.value.length === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error...',
                    text: 'No se encontraron los datos del cliente.',
                });
                // Redirigir a la lista general de clientes si no se encuentra el cliente
                router.push({ name: 'Clientes' });
            }
        }
    });

    const buscar = () => {
        searchCliente.value = clientes.value.filter(cliente => {
            return (
                (searchID.value === '' || cliente.Cli_Cedula.toString().includes(searchID.value)) &&
                (searchNombre.value === '' || cliente.Cli_Nombre.toString().toLowerCase().includes(searchNombre.value.toLowerCase())) &&
                (searchApellido.value === '' || cliente.Cli_Apellido.toString().toLowerCase().includes(searchApellido.value.toLowerCase()))
            );
        });

        searchID.value = '';
        searchNombre.value = '';
        searchApellido.value = '';
    };

    const formatDate = (date: Date | string): string => {
        const parsedDate = typeof date === 'string' ? new Date(date) : date;
        return parsedDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
    };

    const editar = async (id: string) => {
        router.push({ name: 'Clientes-Form', params: { id } });
    };

    const visualizar = async (id: string) => {
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
    };



    const eliminar = async (id: string) => {
        const clienteNombre = clientes.value.find(cliente => cliente.Cli_Cedula === id)?.Cli_Nombre;
        const clienteApellido = clientes.value.find(cliente => cliente.Cli_Cedula === id)?.Cli_Apellido;
        const result = await Swal.fire({
            title: `¿Estás seguro de eliminar a ${clienteNombre} ${clienteApellido}?`,
            text: '¡No podrás revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, ¡eliminarlo!',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            const data = await fetch(`${API}/api/Cliente/Eliminar/${id}`, {
                method: 'DELETE'
            });

            if (data.ok) {
                clientes.value = clientes.value.filter(cliente => cliente.Cli_Cedula !== id);
                searchCliente.value = clientes.value; // Actualizar la lista de búsqueda
                Swal.fire('¡Eliminado!', 'El cliente ha sido eliminado.', 'info');
            }
        }
  
        
    };
</script>

<style scoped>
</style>
