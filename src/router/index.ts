import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ContactoView from '../views/ContactoView.vue'
import ClientesView from '../views/CRUD/Clientes/ClientesView.vue'
import ClientesFormView from '../views/CRUD/Clientes/ClientesFormView.vue'
import PlanesView from '../views/CRUD/Planes/PlanesView.vue'
import PlanesFormView from '../views/CRUD/Planes/PlanesFormView.vue'
import SuscripcionesView from '@/views/CRUD/Suscripciones/SuscripcionesView.vue'
import SuscripcionesFormView from '@/views/CRUD/Suscripciones/SuscripcionesFormView.vue'
import PagosView from '@/views/CRUD/Pagos/PagosView.vue'
import PagosFormView from '@/views/CRUD/Pagos/PagosFormView.vue'
import PlanesProductView from '@/views/PlanesProductView.vue'
import CarritoView from '@/views/CarritoView.vue'
import PurchaseView from '@/views/PurchaseView.vue'
import AnalisisView from '@/views/CRUD/Analisis/AnalisisView.vue'
import SearchView from '@/views/SearchView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/Planes',
      name: 'Planes',
      component: PlanesProductView
    },
    {
      path: '/Contacto',
      name: 'Contacto',
      component: ContactoView
    },
    {
      path: '/Analisis',
      name: 'Analisis',
      component: AnalisisView
    },
    {
      path: '/Clientes',
      name: 'Clientes',
      component: ClientesView
    },
    {
      path: '/Clientes-Form/:id?',
      name: 'Clientes-Form',
      component: ClientesFormView
    },
    {
      path: '/PlanesAdmin',
      name: 'PlanesAdmin',
      component: PlanesView
    },
    {
      path: '/PlanesAdmin-Form/:id?',
      name: 'PlanesAdmin-Form',
      component: PlanesFormView
    },
    {
      path: '/Suscripciones',
      name: 'Suscripciones',
      component: SuscripcionesView
    },
    {
      path: '/Suscripciones-Form/:id?',
      name: 'Suscripciones-Form',
      component: SuscripcionesFormView
    },
    {
      path: '/Pagos',
      name: 'Pagos',
      component: PagosView
    },
    {
      path: '/Pagos-Form/:id?',
      name: 'Pagos-Form',
      component: PagosFormView
    },
    {
      path: '/Carrito',
      name: 'Carrito',
      component: CarritoView
    },
    {
      path: '/CompraFinalizada',
      name: 'CompraFinalizada',
      component: PurchaseView
    },
    {
      path: '/Buscar/:id?',
      name: 'Buscar',
      component: SearchView
    },
  ]
})

export default router
