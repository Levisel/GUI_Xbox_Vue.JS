<template>
  <div class="container my-5">
    <h1>Carrito:</h1>
    <br>
    <br>
    <div class="carrito-items card p-4 shadow-sm" style="position: static">
      <ul id="carrito-lista" class="list-group" v-if="carrito.length > 0">
        <li v-for="item in carrito" :key="item.id" class="product-item list-group-item d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <img src="https://www.stuff.tv/wp-content/uploads/sites/2/2023/04/Game-Pass.png" alt="Imagen del producto" class="item-image me-3" />
            <div class="d-flex align-items-center">
              <span class="item-name col-md-3 fw-bold">{{ item.title }}</span>
              <span class="item-duration col-md-3 ms-5">{{ item.duration }}</span>
              <span class="item-price text-success fw-bold col-md-3 ms-5">${{ item.price }}</span>
              <span class="item-quantity col-md-3 ms-5">Cantidad: {{ item.quantity }}</span>
            </div>
          </div>
          <div class="d-flex align-items-center">
            <button class="btn btn-outline-primary me-2" @click="increaseQuantity(item)">
              <i class="bi bi-plus"></i>
            </button>
            <button class="btn btn-outline-secondary me-2" @click="decreaseQuantity(item)">
              <i class="bi bi-dash"></i>
            </button>
            <button class="btn btn-outline-danger" @click="confirmRemoveItem(item)">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </li>
      </ul>
      <p v-if="carrito.length === 0" class="text-center">Tu carrito está vacío.. 🎮</p>
      <p id="precio" class="text-end fw-bold mt-3" v-if="carrito.length > 0">Total: ${{ totalPrice }}</p>
    </div>
    <button id="openModalButton" type="button" class="btn btn-success mt-4 d-block mx-auto" data-bs-toggle="modal" data-bs-target="#vaciarCarritoModal" v-if="carrito.length > 0">
      Comprar
    </button>

    <div class="modal fade" id="vaciarCarritoModal" tabindex="-1" aria-labelledby="vaciarCarritoModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="vaciarCarritoModalLabel">Comprar Suscripción</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Por favor, ingrese su cédula de identidad (CI):</p>
            <input type="text" class="form-control" v-model="clienteId" maxlength="10" pattern="[0-9]*" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button id="vaciarCarritoButton" type="button" class="btn btn-info" @click="comprar">Aceptar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2';
import type { CarritoItem } from '@/RutaApi';
import { ref, onMounted } from 'vue';
import router from '@/router';
const carrito = ref<CarritoItem[]>([]);
const cartItemCount = ref<number>(parseInt(localStorage.getItem('contadorCarro') || '0') || 0);
const clienteId = ref('');
const totalPrice = ref(0);
import { API } from '@/RutaApi';

onMounted(() => {
  const storedCarrito = localStorage.getItem('carrito');
  if (storedCarrito) {
    carrito.value = JSON.parse(storedCarrito);
    calculateTotalPrice();
  }
});

function calculateTotalPrice() {
  totalPrice.value = carrito.value.reduce((total, item) => total + item.price * item.quantity, 0);
  totalPrice.value = Math.round(totalPrice.value * 100) / 100;
}

function increaseQuantity(item: CarritoItem) {
  item.quantity++;
  cartItemCount.value++;
  updateLocalStorage();
  calculateTotalPrice();
}

function decreaseQuantity(item: CarritoItem) {
  if (item.quantity > 1) {
    item.quantity--;
    cartItemCount.value--;
    updateLocalStorage();
    calculateTotalPrice();
  }
}

function updateLocalStorage() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    const cantidadCarro = carrito.value.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = cantidadCarro.toString();
  }
  localStorage.setItem('contadorCarro', cartItemCount.value.toString());
  localStorage.setItem('carrito', JSON.stringify(carrito.value));
}

function confirmRemoveItem(item: CarritoItem) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: '¡El plan será eliminado del carrito!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminarlo!',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      removeItem(item);
      Swal.fire('Eliminado!', 'El plan ha sido eliminado.', 'success');
    }
  });
}

function removeItem(item: CarritoItem) {
  carrito.value = carrito.value.filter(cartItem => cartItem.id !== item.id);
  vaciarCarrito();
}

function vaciarCarrito() {
  carrito.value = [];
  totalPrice.value = 0;
  cartItemCount.value = 0;
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.textContent = '0';
  }
  updateLocalStorage();
}

function calcularFechaFin(duracion: string): Date | null {
  const fechaFin = new Date();
  switch (duracion) {
    case '1 Mes':
      fechaFin.setMonth(fechaFin.getMonth() + 1);
      break;
    case '3 Meses':
      fechaFin.setMonth(fechaFin.getMonth() + 3);
      break;
    case '6 Meses':
      fechaFin.setMonth(fechaFin.getMonth() + 6);
      break;
    case '1 Año':
      fechaFin.setFullYear(fechaFin.getFullYear() + 1);
      break;
    case '2 Años':
      fechaFin.setFullYear(fechaFin.getFullYear() + 2);
      break;
    default:
      console.error('Duración no válida');
      return null;
  }
  return fechaFin;
}

async function comprar() {
  const cliente = clienteId.value;
  const suscripcionId = `Sus-${cliente}-${Math.floor(Math.random() * 1000)}`;
  const backdrop = document.querySelector('.modal-backdrop');
  if (carrito.value.length > 0) {
    const item = carrito.value[0];
    const fechaFin = calcularFechaFin(item.duration);
    const suscripcionData = {
      Sus_ID: suscripcionId,
      Plan_ID: item.id,
      Sus_StartDate: new Date(),
      Sus_EndDate: fechaFin,
      Sus_Estado: 'Inactivo',
      Sus_RenovacionAuto: false,
    };

    try {
      const response = await fetch(`${API}/api/suscripcion/Insertar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(suscripcionData)
      });
      if (!response.ok) throw new Error('Error al crear la suscripción');

      const cantidadCarro = carrito.value.reduce((total, item) => total + item.quantity, 0);
      const precioTotal = item.price * cantidadCarro;
      const pagoData = {
        Cli_Cedula: cliente,
        Sus_ID: suscripcionId,
        Pago_Monto: precioTotal,
        Pago_Fecha: new Date(),
        Pago_Estado: 'Pendiente'
      };

      const pagoResponse = await fetch(`${API}/api/pago/Insertar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pagoData)
      });
      if (!pagoResponse.ok) throw new Error('Error al crear el pago');
      else{
        vaciarCarrito();
        //Eliminamos el backdrop del modal (si existe)
        if (backdrop) {
         backdrop.remove();
        }
        Swal.fire({
          position: "top-end",
          icon: "info",
          title: "¡Compra realizada con éxito!",
          showConfirmButton: false,
          timer: 1500
        });
        router.push('/CompraFinalizada');
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error...",
        text: "Haz ingresado un dato incorrecto. Por favor, verifica tus datos.",
      });
    }
  } else {
    alert('Datos incompletos en el carrito. Por favor, revisa los elementos del carrito.');
  }
}
</script>

<style scoped>
.carrito-items {
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
}

#carrito-lista {
  list-style: none;
  padding: 0;
  margin: 0;
}

.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #dee2e6;
}

.product-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 80px;
  height: auto;
  margin-right: 10px;
}

.item-name {
  font-weight: bold;
  font-size: 1rem;
}

.item-duration {
  font-size: 0.9rem;
}

.item-price {
  font-weight: bold;
  color: #107c10;
  font-size: 1rem;
}

.item-quantity {
  font-size: 0.9rem;
}

.btn-outline-primary,
.btn-outline-secondary,
.btn-outline-danger {
  padding: 5px 10px;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .product-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .item-image {
    width: 100%;
    height: auto;
    margin-bottom: 10px;
  }

  .btn-outline-primary,
  .btn-outline-secondary,
  .btn-outline-danger {
    width: 100%;
    margin-bottom: 5px;
  }
}
</style>
