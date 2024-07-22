<template>
  <div class="container my-5">
    <div class="container">
      <section class="products">
        <h2>Planes:</h2>
        <div class="all-products">
          <div id="items" class="items-style">
            <div v-for="product in products" :key="product.prd_Codigo" class="product">
              <div class="product-info">
                <h4>{{ product.prd_Nombre }}</h4>
                <h5>{{ product.prd_Duracion }}</h5>
                <p class="product-price">${{ product.prd_Precio }}</p>
                <a class="product-btn comprar-button" @click="addToCart(product)">Comprar</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { API, type Product } from '@/RutaApi';

const products = ref<Product[]>([]);
const cartItemCount = ref<number>(parseInt(localStorage.getItem('contadorCarro') || '0') || 0);
const itemsContainer = ref<HTMLElement | null>(null);
const tipoProductoActual = ref<string | null>(null);
const idProductoActual = ref<number | null>(null);

//Cargamos los productos desde la API
function fetchProducts() {
  fetch(`${API}/api/plan/Listar`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al obtener los productos');
      }
      return response.json();
    })
    .then(data => {
      products.value = data.map((p: any) => ({
        prd_Codigo: p.Plan_ID,
        prd_Nombre: p.Plan_Nombre,
        prd_Duracion: p.Plan_Duracion,
        prd_Precio: p.Plan_Precio,
        tipo: p.Plan_Tipo
      }));
    })
    .catch(error => console.error(error.message));
}

//Funcion para cargar contador del carrito del localstorage
function cargarContadorCarro() {
  const contadorCarro = document.getElementById('cart-count');
    if (contadorCarro) {
      contadorCarro.textContent = cartItemCount.value.toString();
    }

    // Actualiza el elemento HTML con el valor del contador del carrito
    window.dispatchEvent(new Event('cartUpdated'));
}


// Funcion para agregar un producto al carrito
function addToCart(product: Product) {
  if (cartItemCount.value < 0) {
    cartItemCount.value = 0;
    localStorage.setItem('contadorCarro', '0');
  }

  const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

  if (carrito.length > 0 && !carrito.find((item: any) => item.id === product.prd_Codigo)) {
    showAlert();
    return;
  }

  if ((tipoProductoActual.value === null && idProductoActual.value === null) ||
      (tipoProductoActual.value === product.tipo && idProductoActual.value === product.prd_Codigo)) {
    cartItemCount.value++;
    const existingItem = carrito.find((existing: any) => existing.id === product.prd_Codigo);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      carrito.push({
        id: product.prd_Codigo,
        title: product.prd_Nombre,
        price: product.prd_Precio,
        duration: product.prd_Duracion,
        quantity: 1,
        tipo: product.tipo
      });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    localStorage.setItem('contadorCarro', cartItemCount.value.toString());

    //Hacemos un aviso temporal de que se ha agregado un producto al carrito
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "¡Producto agregado al carrito!",
      showConfirmButton: false,
      timer: 1000
    });
    cargarContadorCarro();
  }
}

function showAlert() {
  Swal.fire({
    icon: 'warning',
    title: '¡Atención!',
    text: 'Ya tienes un tipo de plan en tu carrito. No puedes agregar un plan diferente.',
    confirmButtonText: 'Aceptar'
  });
}



onMounted(() => {
  itemsContainer.value = document.getElementById('items');
  if (!itemsContainer.value) {
    console.error("El contenedor de los elementos del carrito no se encontró en el DOM.");
    return;
  }

  fetchProducts();

  if (cartItemCount.value < 0) {
    cartItemCount.value = 0;
    localStorage.setItem('contadorCarro', '0');
  }

  cargarContadorCarro();

});


</script>

<style scoped>
.items-style {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.product {
  overflow: hidden;
  background-size: cover;
  color: #fff;
  text-align: center;
  width: 350px;
  height: 340px;
  padding: 4rem;
  background-image: linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.0)), url('https://fvelasco.neocities.org/images/xbox4.png');
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 1.2rem;
  margin: 2rem;
  box-shadow: 5px 15px 25px #03000057;
}

.product .product-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.product .product-price {
  font-size: 18px;
}

.products h2 {
  font-size: 2.5rem;
}

.comprar-button {
  color: #ececec;
  display: inline-block;
  text-decoration: none;
  background-color: #107c10;
  padding: 1.2rem 3rem;
  border-radius: 1rem;
  margin-top: -0.5rem;
  font-size: 14px;
  transition: all 0.2s;
}

.comprar-button:hover {
  transform: scale(1.1);
  color: #ececec;
  cursor: pointer;
}
</style>
