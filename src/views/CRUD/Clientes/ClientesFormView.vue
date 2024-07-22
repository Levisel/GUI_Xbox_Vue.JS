<template>
  <div class="container my-5">
    <h2>{{ clientId ? 'Actualizar' : 'Agregar' }}</h2>
    <h4>Cliente</h4>
    <Form 
      label="Cédula" 
      inputId="inputCedula" 
      v-model="formData.Cli_Cedula" 
      inputType="text" 
      inputClass="form-control" 
      inputWrapperClass="mb-2"
      :disabled="clientId ? true : false"
    />
    <div class="mb-3"></div>
    <Form 
      label="Nombre" 
      inputId="inputNombre" 
      v-model="formData.Cli_Nombre" 
      inputType="text" 
      inputClass="form-control" 
      inputWrapperClass="mb-3" 
    />
    <div class="mb-3"></div>
    <Form 
      label="Apellido" 
      inputId="inputApellido" 
      v-model="formData.Cli_Apellido" 
      inputType="text" 
      inputClass="form-control" 
      inputWrapperClass="mb-3" 
    />
    <div class="mb-3"></div>
    <Form 
      label="Fecha de Nacimiento" 
      inputId="inputFechaNacimiento" 
      v-model="formData.Cli_BirthDate"
      inputType="date" 
      inputClass="form-control" 
      inputWrapperClass="mb-3" 
    />
    <div class="mb-3"></div>
    <Form 
      label="País" 
      inputId="inputPais" 
      v-model="formData.Cli_Pais" 
      inputType="text" 
      inputClass="form-control" 
      inputWrapperClass="mb-3" 
    />
    <div class="mb-3"></div>
    <Form 
      label="Email" 
      inputId="inputEmail" 
      v-model="formData.Cli_Email" 
      inputType="email" 
      inputClass="form-control" 
      inputWrapperClass="mb-3" 
    />
    <br>
    <div class="form-group text-center">
      <div class="col-md-offset-2 col-md-12 d-flex justify-content-center">
        <button :class="clientId ? 'btn btn-info me-2' : 'btn btn-success me-2'" @click="procesarFormulario" :disabled="cargando">
          <i :class="clientId ? 'bi bi-save-fill' : 'bi bi-plus-circle'"></i> {{ clientId ? 'Guardar' : 'Crear' }}
        </button>
        <router-link to="/Clientes" class="btn btn-warning">
          <i class="bi bi-x-circle-fill"></i> Cancelar
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, reactive, ref, watch } from 'vue';
import Form from '@/components/Form.vue';
import { API } from '@/RutaApi';
import type { ICliente } from '@/RutaApi';
import Swal from 'sweetalert2';
import { useRoute, useRouter } from 'vue-router';
import type { PropType } from 'vue';

export default defineComponent({
  name: 'CrearCliente',
  components: {
    Form
  },
  props: {
    client: {
      type: Object as PropType<ICliente | null>,
      default: null
    }
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const clientId = route.params.id as string;

    const formData = reactive<ICliente>({
      Cli_Cedula: props.client?.Cli_Cedula ?? '',
      Cli_Nombre: props.client?.Cli_Nombre ?? '',
      Cli_Apellido: props.client?.Cli_Apellido ?? '',
      Cli_BirthDate: props.client?.Cli_BirthDate ?? '',
      Cli_Pais: props.client?.Cli_Pais ?? '',
      Cli_Email: props.client?.Cli_Email ?? '',
    });

    const cargando = ref(false);

    const cargarCliente = async (id: string) => {
      try {
        const response = await fetch(`${API}/api/Cliente/Listar/${id}`);
        const data: ICliente = await response.json();
        const date = new Date(data.Cli_BirthDate).toISOString().split('T')[0];
        formData.Cli_Cedula = data.Cli_Cedula;
        formData.Cli_Nombre = data.Cli_Nombre;
        formData.Cli_Apellido = data.Cli_Apellido;
        formData.Cli_BirthDate = date;
        formData.Cli_Pais = data.Cli_Pais;
        formData.Cli_Email = data.Cli_Email;
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: "No se pudieron cargar los datos del cliente.",
        });
      }
    };

    const procesarFormulario = async () => {
      cargando.value = true;
      try {
        const method = clientId ? 'PUT' : 'POST';
        const endpoint = clientId ? `${API}/api/Cliente/Actualizar/${clientId}` : `${API}/api/Cliente/Insertar`;

        await fetch(endpoint, {
          method: method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        localStorage.removeItem('formData'); // Limpiar el localStorage después de guardar
        router.push('/Clientes');
        Swal.fire({
          position: "top-end",
          icon: clientId ? "info" : "success",
          title: clientId ? "¡Cliente actualizado exitosamente!" : "¡Cliente creado exitosamente!",
          showConfirmButton: false,
          timer: 1500
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: "Ha ocurrido un error!",
        });
      } finally {
        cargando.value = false;
      }
    };

    // Guardar los datos en localStorage
    watch(formData, (newVal) => {
      localStorage.setItem('formData', JSON.stringify(newVal));
    }, { deep: true });

    // Cargar los datos desde localStorage
    const cargarDatosLocalStorage = () => {
      const savedFormData = localStorage.getItem('formData');
      if (savedFormData) {
        const parsedData = JSON.parse(savedFormData);
        Object.assign(formData, parsedData);
      }
    };

    onBeforeMount(() => {
      cargarDatosLocalStorage(); // Cargar datos del localStorage antes de montar el componente
      if (clientId) {
        cargarCliente(clientId);
      }
    });

    return {
      formData,
      cargando,
      procesarFormulario,
      clientId
    };
  }
});
</script>

<style scoped>
</style>
