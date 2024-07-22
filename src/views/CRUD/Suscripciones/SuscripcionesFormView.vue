<template>
    <div class="container my-5">
      <h2>{{ subscriptionId ? 'Actualizar' : 'Agregar' }}</h2>
      <h4>Suscripción</h4>
      <Form 
        label="ID" 
        inputId="inputSuscripcionID" 
        v-model="formData.Sus_ID" 
        inputType="text" 
        inputClass="form-control" 
        inputWrapperClass="mb-2"
        :disabled="subscriptionId ? true : false"
      />
      <div class="mb-3"></div>
      <Form 
        label="Plan" 
        inputId="inputPlan" 
        v-model="formData.Plan_ID" 
        inputType="select" 
        inputClass="form-control" 
        inputWrapperClass="mb-3"
        :options="planes.map(plan => ({ value: plan.Plan_ID, text: plan.Plan_Nombre }))"
      />
      <div class="mb-3"></div>
      <Form 
        label="Fecha de Inicio" 
        inputId="inputFechaInicio" 
        v-model="formData.Sus_StartDate" 
        inputType="date" 
        inputClass="form-control" 
        inputWrapperClass="mb-3"
      />
      <div class="mb-3"></div>
      <Form 
        label="Fecha de Finalización" 
        inputId="inputFechaFinalizacion" 
        v-model="formData.Sus_EndDate" 
        inputType="date" 
        inputClass="form-control" 
        inputWrapperClass="mb-3"
      />
      <div class="mb-3"></div>
      <Form 
        label="Estado" 
        inputId="inputEstado" 
        v-model="formData.Sus_Estado" 
        inputType="select" 
        inputClass="form-control" 
        inputWrapperClass="mb-3"
        :options="[
          { value: 'Activo', text: 'Activo' },
          { value: 'Inactivo', text: 'Inactivo' }
        ]"
      />
      <div class="mb-3"></div>
      <Form 
        label="Renovación Automática" 
        inputId="inputRenovacionAuto" 
        v-model="formData.Sus_RenovacionAuto" 
        inputType="select" 
        inputClass="form-control" 
        inputWrapperClass="mb-3"
        :options="[
          { value: 'true', text: 'Sí' },
          { value: 'false', text: 'No' }
        ]"
      />
      <br>
      <div class="form-group text-center">
        <div class="col-md-offset-2 col-md-12 d-flex justify-content-center">
          <button :class="subscriptionId ? 'btn btn-info me-2' : 'btn btn-success me-2'" @click="procesarFormulario" :disabled="cargando">
            <i :class="subscriptionId ? 'bi bi-save-fill' : 'bi bi-plus-circle'"></i> {{ subscriptionId ? 'Guardar' : 'Crear' }}
          </button>
          <router-link to="/Suscripciones" class="btn btn-warning">
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
  import type { ISuscripcion } from '@/RutaApi';
  import type { IPlan } from '@/RutaApi';
  import Swal from 'sweetalert2';
  import { useRoute, useRouter } from 'vue-router';
  import type { PropType } from 'vue';
  import { displayPartsToString } from 'typescript';
  
  export default defineComponent({
    name: 'CrearSuscripcion',
    components: {
      Form
    },
    props: {
      subscription: {
        type: Object as PropType<ISuscripcion | null>,
        default: null
      }
    },
    setup(props) {
      const route = useRoute();
      const router = useRouter();
      const subscriptionId = route.params.id as string;
      const planes = ref<IPlan[]>([]);
      const formData = reactive<ISuscripcion>({
        Sus_ID : props.subscription?.Sus_ID ?? '',
        Plan_ID : Number(props.subscription?.Plan_ID ?? ''),
        Sus_StartDate : props.subscription?.Sus_StartDate ?? '',
        Sus_EndDate : props.subscription?.Sus_EndDate ?? '',
        Sus_Estado : props.subscription?.Sus_Estado ?? '',
        Sus_RenovacionAuto : props.subscription?.Sus_RenovacionAuto ?? '',
      });
  
      const cargando = ref(false);
  
      const cargarSuscripcion = async (id: string) => {
        try {
          const response = await fetch(`${API}/api/Suscripcion/Listar/${id}`);
          const data: ISuscripcion = await response.json();
          const startDate = new Date(data.Sus_StartDate).toISOString().split('T')[0]
          const endDate = new Date(data.Sus_EndDate).toISOString().split('T')[0]
            formData.Sus_ID = data.Sus_ID;
            formData.Plan_ID = data.Plan_ID;
            formData.Sus_StartDate = startDate;
            formData.Sus_EndDate = endDate;
            formData.Sus_Estado = data.Sus_Estado;
            formData.Sus_RenovacionAuto = data.Sus_RenovacionAuto;
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
          const method = subscriptionId ? 'PUT' : 'POST';
          const endpoint = subscriptionId ? `${API}/api/Suscripcion/Actualizar/${subscriptionId}` : `${API}/api/Suscripcion/Insertar`;
  
          await fetch(endpoint, {
            method: method,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
          router.push('/Suscripciones');
          Swal.fire({
            position: "top-end",
            icon: subscriptionId ? "info" : "success",
            title: subscriptionId ? "¡Suscripción actualizada exitosamente!" : "¡Suscripción creada exitosamente!",
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
        if (subscriptionId) {
            cargarSuscripcion(subscriptionId);
        }
            // Lista de planes
            const dataPlanes = await fetch(`${API}/api/plan/Listar`); 
            planes.value = await dataPlanes.json();
      });
  
      return {
        formData,
        cargando,
        procesarFormulario,
        subscriptionId,
        planes
      };
    }
  });
  </script>
  
  <style scoped>
  
  
  </style>
  