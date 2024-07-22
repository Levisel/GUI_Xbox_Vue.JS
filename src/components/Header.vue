<template>
  <header class="header bg-dark">
    <div class="container">
      <div class="cart-container">
        <div class="cart-icon">
          <router-link id="miCarro" to="/Carrito">
            <i class="bx bx-cart" id="logo-carro"></i>
          </router-link>
          <span id="cart-count">0</span>
        </div>
      </div>
      <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="/">
            <img src="https://fvelasco.neocities.org/images/xbox.png" alt="logo" class="logo">
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <router-link exact-active-class="activo" to="/" class="nav-link">Inicio</router-link>
              </li>
              <li class="nav-item">
                <router-link exact-active-class="activo" to="/Planes" class="nav-link">Planes</router-link>
              </li>
              <li class="nav-item">
                <router-link exact-active-class="activo" to="/Contacto" class="nav-link">Contacto</router-link>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Administración
                </a>
                <ul class="dropdown-menu text-center" aria-labelledby="navbarDropdown">
                  <li><router-link exact-active-class="activo-Z" to="/Analisis" class="dropdown-item">Análisis</router-link></li>
                  <li><router-link exact-active-class="activo-Z" to="/Clientes" class="dropdown-item">Clientes</router-link></li>
                  <li><router-link exact-active-class="activo-Z" to="/Pagos" class="dropdown-item">Pagos</router-link></li>
                  <li><router-link exact-active-class="activo-Z" to="/PlanesAdmin" class="dropdown-item">Planes</router-link></li>
                  <li><router-link exact-active-class="activo-Z" to="/Suscripciones" class="dropdown-item">Suscripciones</router-link></li>
                </ul>
              </li>
              <form class="d-flex ms-4" role="search" @submit="buscar(searchID)">
                <input class="form-control me-2" type="search" placeholder="Buscar" aria-label="Search" v-model="searchID">
                <button class="btn btn-outline-success" type="submit">Buscar</button>
              </form>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script lang="ts">
import Swal from 'sweetalert2';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'Header',
  setup() {
    onMounted(() => {
      const contadorCarro = document.getElementById('cart-count');
      if (contadorCarro) {
        contadorCarro.textContent = localStorage.getItem('contadorCarro') || '0';
      }
    });

    const searchID = ref('');
    const router = useRouter();
    const buscar = async (id: string) => {
        router.push({ name: 'Buscar', params: { id } });
    }

    return {
      searchID,
      buscar,
    };
  },
};
</script>

<style scoped>
.nav-link {
  color: #ffffff;
}

.nav-link:hover {
  color: #aaf0c9 !important;
}

.activo {
  color: #aaf0c9 !important;
}

.activo-Z {
  color: #64e3a1 !important;
}
</style>
