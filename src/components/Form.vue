<template>
  <div class="form-group">
    <label :for="inputId" class="form-label">{{ label }}</label>
    <div class="input-wrapper">
      <template v-if="inputType === 'select'">
        <select
          :id="inputId"
          :class="inputClass"
          class="form-control form-control-lg"
          v-model="internalValue"
        >
          <option v-for="option in options" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </template>
      <template v-else>
        <input
          :type="inputType"
          :id="inputId"
          :class="inputClass"
          class="form-control form-control-lg"
          v-model="internalValue"
          :readonly="disabled"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import type { ICliente } from '@/RutaApi';
import { defineComponent, toRefs, computed, readonly } from 'vue';
import type { PropType } from 'vue';

export default defineComponent({
  name: 'FormComponent',
  props: {
    modelValue: {
      type: String as PropType<string>,
      default: ''
    },
    label: {
      type: String as PropType<string>,
      default: 'Label'
    },
    inputId: {
      type: String as PropType<string>,
      default: 'inputId'
    },
    inputType: {
      type: String as PropType<string>,
      default: 'text'
    },
    inputClass: {
      type: String as PropType<string>,
      default: 'form-control'
    },
    options: {
      type: Array as PropType<Array<{ value: string | number, text: string }>>,
      default: () => []
    },
    disabled: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { modelValue } = toRefs(props);

    const internalValue = computed({
      get: () => modelValue.value,
      set: (value) => {
        emit('update:modelValue', value);
      }
    });

    return {
      internalValue
    };
  }
});

</script>

<style scoped>
/* Estilos personalizados aquí */
.form-group {
  margin-bottom: 1.5rem;
  max-width: 300px; /* Ajusta la anchura máxima según tus preferencias */
  margin: 0 auto; /* Centrar el formulario */
}

.form-label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
}

.input-wrapper input,
.input-wrapper select {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px 15px;
  width: 100%;
  transition: border-color 0.15s ease-in-out;
}

.input-wrapper input:focus,
.input-wrapper select:focus {
  outline: none;
  border-color: #4d6d9a;
}

/* Animación para la etiqueta */
.form-label {
  transition: transform 0.2s ease-in-out;
}

.input-wrapper input:focus + .form-label,
.input-wrapper select:focus + .form-label {
  transform: translateY(-1.2em) scale(0.8);
}

/* Animación para el input y select */
.input-wrapper input,
.input-wrapper select {
  transition: transform 0.2s ease-in-out;
}

.input-wrapper input:focus,
.input-wrapper select:focus {
  transform: scale(1.05);
}

/* Estilos para el input desactivado */
.input-wrapper input[readonly],
.input-wrapper select[readonly] {
  background-color: #e9ecef;
  opacity: 1;
}

</style>
