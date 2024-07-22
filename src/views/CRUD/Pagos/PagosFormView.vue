<template>
    <div class="container my-5">
      <h2>{{ paymentId ? 'Actualizar' : 'Agregar' }}</h2>
      <h4>Pago</h4>
      <div class="mb-3"></div>
      <Form 
        label="Cliente" 
        inputId="inpuCliente" 
        v-model="formData.Cli_Cedula" 
        inputType="select" 
        inputClass="form-control" 
        inputWrapperClass="mb-3"
        :options="clientes.map(cliente => ({ value: cliente.Cli_Cedula, text: cliente.Cli_Nombre + ' ' + cliente.Cli_Apellido }))"
      />
      <div class="mb-3"></div>
      <Form 
        label="Suscripción" 
        inputId="inputSuscripcion" 
        v-model="formData.Sus_ID" 
        inputType="select" 
        inputClass="form-control" 
        inputWrapperClass="mb-3"
        :options="suscripciones.map(suscripcion => ({ value: suscripcion.Sus_ID, text: suscripcion.Sus_ID }))"
      />
      <div class="mb-3"></div>
      <Form 
        label="Monto" 
        inputId="inputMonto" 
        v-model="formData.Pago_Monto" 
        inputType="number" 
        inputClass="form-control" 
        inputWrapperClass="mb-3"
      />
      <div class="mb-3"></div>
      <Form 
        label="Fecha" 
        inputId="inputFecha" 
        v-model="formData.Pago_Fecha" 
        inputType="date" 
        inputClass="form-control" 
        inputWrapperClass="mb-3"
      />
      <div class="mb-3"></div>
      <Form 
        label="Estado" 
        inputId="inputEstado" 
        v-model="formData.Pago_Estado" 
        inputType="select" 
        inputClass="form-control" 
        inputWrapperClass="mb-3"
        :options="[
          { value: 'Pendiente', text: 'Pendiente' },
          { value: 'Pagado', text: 'Pagado' }
        ]"
      />
      <br>
      <div class="form-group text-center">
        <div class="col-md-offset-2 col-md-12 d-flex justify-content-center">
          <button :class="paymentId ? 'btn btn-info me-2' : 'btn btn-success me-2'" @click="procesarFormulario" :disabled="cargando">
            <i :class="paymentId ? 'bi bi-save-fill' : 'bi bi-plus-circle'"></i> {{ paymentId ? 'Guardar' : 'Crear' }}
          </button>
          <router-link to="/Pagos" class="btn btn-warning">
            <i class="bi bi-x-circle-fill"></i> Cancelar
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onBeforeMount, reactive, ref } from 'vue';
  import Form from '@/components/Form.vue';
  import { API } from '@/RutaApi';
  import type { ICliente, IPago, ISuscripcion } from '@/RutaApi';
  import Swal from 'sweetalert2';
  import { useRoute, useRouter } from 'vue-router';
  import type { PropType } from 'vue';

  
  export default defineComponent({
    name: 'CrearSuscripcion',
    components: {
      Form
    },
    props: {
      payment: {
        type: Object as PropType<IPago | null>,
        default: null
      }
    },
    setup(props) {
      const route = useRoute();
      const router = useRouter();
      const paymentId = route.params.id as string;
      const clientes = ref<ICliente[]>([]);
      const suscripciones = ref<ISuscripcion[]>([]);

      const formData = reactive<IPago>({
        Pago_ID : Number(props.payment?.Pago_ID ?? ''),
        Pago_Codigo : props.payment?.Pago_Codigo ?? '',
        Cli_Cedula : props.payment?.Cli_Cedula ?? '',
        Sus_ID : props.payment?.Sus_ID ?? '',
        Pago_Monto : Number(props.payment?.Pago_Monto ?? ''),
        Pago_Fecha : props.payment?.Pago_Fecha ?? '',
        Pago_Estado : props.payment?.Pago_Estado ?? '',
      });
  
      const cargando = ref(false);
  
      const cargarPago = async (id: string) => {
        try {
          const response = await fetch(`${API}/api/Pago/Listar/${id}`);
          const data: IPago = await response.json();
          const fecha= new Date(data.Pago_Fecha).toISOString().split('T')[0];
            formData.Pago_ID = data.Pago_ID;
            formData.Cli_Cedula = data.Cli_Cedula;
            formData.Sus_ID = data.Sus_ID;
            formData.Pago_Monto = data.Pago_Monto;
            formData.Pago_Fecha = fecha;
            formData.Pago_Estado = data.Pago_Estado;
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error...",
            text: "No se pudieron cargar los datos de las suscripciones.",
          });
        }
      };

      const procesarFormulario = async () => {
        cargando.value = true;
        try {
          const method = paymentId ? 'PUT' : 'POST';
          const endpoint = paymentId ? `${API}/api/Pago/Actualizar/${paymentId}` : `${API}/api/Pago/Insertar`;
  
          await fetch(endpoint, {
            method: method,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
          router.push('/Pagos');
          Swal.fire({
            position: "top-end",
            icon: paymentId ? "info" : "success",
            title: paymentId ? "¡Pago actualizado exitosamente!" : "¡Pago creado exitosamente!",
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
      onBeforeMount(async() => {
        if (paymentId) {
            cargarPago(paymentId);
        }
          //Lista de clientes
          const lstClientes = await fetch(`${API}/api/Cliente/Listar`);
          clientes.value = await lstClientes.json();

          //Lista de suscripciones
          const lstSuscripciones = await fetch(`${API}/api/Suscripcion/Listar`);
          suscripciones.value = await lstSuscripciones.json();
      });
  
      return {
        formData,
        cargando,
        procesarFormulario,
        paymentId,
        clientes,
        suscripciones
      };
    }
  });
  </script>
  
  <style scoped>
  
  
  </style>
  