<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in paginatedRows" :key="rowIndex">
          <td v-for="(cell, cellIndex) in row" :key="cellIndex" :colspan="cell.colspan">
            <span v-if="typeof cell.value !== 'object'">{{ cell.value }}</span>
            <span v-else>
              <button v-for="(button, buttonIndex) in cell.value" :key="buttonIndex" 
                      :class="[buttonClass, button.class]" 
                      class="btn btn-sm ms-1" @click="button.action(button.payload)">
                <i :class="button.icon"></i>
              </button>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination-container">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="goToPage(1)">
              Inicio
            </a> 
          </li>
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)">
              Anterior
            </a>
          </li>
          <li v-for="page in paginationRange" :key="page" class="page-item" :class="{ active: currentPage === page }">
            <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="goToPage(currentPage + 1)">
              Siguiente
            </a>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="goToPage(totalPages)">
              Final
            </a>
          </li>
        </ul>
      </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from 'vue';

interface TableCell {
  value: string | number | { icon: string, action: Function, payload?: any, class?: string }[];
  colspan?: number; // Agregamos la definición del colspan
}

const props = defineProps<{
  headers: string[];
  rows: TableCell[][];
  buttonClass?: string; // Propiedad para la clase del botón
}>();

const currentPage = ref(1);
const rowsPerPage = ref(10);
const maxPagesToShow = ref(5);

const totalPages = computed(() => {
  return Math.ceil(props.rows.length / rowsPerPage.value);
});

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  return props.rows.slice(start, end);
});

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const paginationRange = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const maxPages = maxPagesToShow.value;

  let startPage = Math.max(1, current - Math.floor(maxPages / 2));
  let endPage = Math.min(total, startPage + maxPages - 1);

  if (endPage - startPage < maxPages - 1) {
    startPage = Math.max(1, endPage - maxPages + 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});
</script>
  
  <style scoped>
    .pagination-container {
        display: flex;
        justify-content: center;
    }
    .table th {
    font-weight: bold;
    background-color: #f8f9fa;
    text-align: left;
  }
  </style>
  