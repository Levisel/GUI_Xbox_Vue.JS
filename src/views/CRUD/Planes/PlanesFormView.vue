<template>
    <div class="container my-5">
      <h2>{{ planID ? 'Actualizar' : 'Agregar' }}</h2>
      <h4>Plan</h4>
      <div class="mb-3"></div>
      <Form 
        label="Nombre" 
        inputId="inputNombre" 
        v-model="formData.Plan_Nombre" 
        inputType="text" 
        inputClass="form-control" 
        inputWrapperClass="mb-3" 
      />
      <div class="mb-3"></div>
      <Form 
        label="Duración" 
        inputId="inputDuracion" 
        v-model="formData.Plan_Duracion" 
        inputType="select"
        inputClass="form-control" 
        inputWrapperClass="mb-3"
        :options="[
          { value: '1 Mes', text: '1 Mes' },
          { value: '3 Meses', text: '3 Meses' },
          { value: '6 Meses', text: '6 Meses' },
          { value: '1 Año', text: '1 Año' },
          { value: '2 Años', text: '2 Años' }
        ]"
      />
      <div class="mb-3"></div>
      <Form 
        label="Precio" 
        inputId="inputPrecio" 
        v-model="formData.Plan_Precio" 
        inputType="number" 
        inputClass="form-control" 
        inputWrapperClass="mb-3"

      />
      <div class="mb-3"></div>
      <Form 
        label="Plataforma" 
        inputId="inputPlataforma" 
        v-model="formData.Plan_Plataforma" 
        inputType="select" 
        inputClass="form-control" 
        inputWrapperClass="mb-3"
        :options="[
          { value: 'PC', text: 'PC' },
          { value: 'Xbox Series X/S', text: 'Xbox Series X/S' }
        ]"
      />
      <br>
      <div class="form-group text-center">
        <div class="col-md-offset-2 col-md-12 d-flex justify-content-center">
          <button :class="planID ? 'btn btn-info me-2' : 'btn btn-success me-2'" @click="procesarFormulario" :disabled="cargando">
            <i :class="planID ? 'bi bi-save-fill' : 'bi bi-plus-circle'"></i> {{ planID ? 'Guardar' : 'Crear' }}
          </button>
          <router-link to="/PlanesAdmin" class="btn btn-warning">
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
  import type { IPlan } from '@/RutaApi';
  import Swal from 'sweetalert2';
  import { useRoute, useRouter } from 'vue-router';
  import type { PropType } from 'vue';
  import { displayPartsToString } from 'typescript';
  
  export default defineComponent({
    name: 'CrearPlan',
    components: {
      Form
    },
    props: {
      plan: {
        type: Object as PropType<IPlan | null>,
        default: null
      }
    },
    setup(props) {
      const route = useRoute();
      const router = useRouter();
      const planID = route.params.id as string;
      
      const formData = reactive<IPlan>({
        Plan_ID: Number(props.plan?.Plan_ID ?? ''),
        Plan_Nombre: props.plan?.Plan_Nombre ?? '',
        Plan_Duracion: props.plan?.Plan_Duracion ?? '',
        Plan_Precio: Number(props.plan?.Plan_Precio ?? ''),
        Plan_Plataforma: props.plan?.Plan_Plataforma ?? '',
      });
  
      const cargando = ref(false);
  
      const cargarPlan = async (id: string) => {
        try {
          const response = await fetch(`${API}/api/Plan/Listar/${id}`);
          const data: IPlan = await response.json();
          formData.Plan_ID = data.Plan_ID;
          formData.Plan_Nombre = data.Plan_Nombre;
          formData.Plan_Duracion = data.Plan_Duracion;
          formData.Plan_Precio = data.Plan_Precio;
          formData.Plan_Plataforma = data.Plan_Plataforma;

        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error...",
            text: "No se pudieron cargar los datos del plan.",
          });
        }
      };
  
      const procesarFormulario = async () => {
        cargando.value = true;
        try {
          const method = planID ? 'PUT' : 'POST';
          const endpoint = planID ? `${API}/api/Plan/Actualizar/${planID}` : `${API}/api/Plan/Insertar`;
  
          await fetch(endpoint, {
            method: method,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
          router.push('/PlanesAdmin');
          Swal.fire({
            position: "top-end",
            icon: planID ? "info" : "success",
            title: planID ? "¡Plan actualizado exitosamente!" : "¡Plan creado exitosamente!",
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
      onBeforeMount(() => {
        if (planID) {
        cargarPlan(planID);
        }
      });
  
      return {
        formData,
        cargando,
        procesarFormulario,
        planID
      };
    }
  });
  </script>
  
  <style scoped>
  
  
  </style>
  