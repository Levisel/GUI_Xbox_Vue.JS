<!-- SubscriptionCard.vue -->
<template>
  <div class="col-lg-6 col-xl-4 mb-4">
    <div class="card h-100">
      <div class="card-body p-5 d-flex flex-column">
        <div  class="small text-uppercase fw-bold text-muted"><i :class="`bi ${icon}`"></i>   {{ title }}</div>
        <div class="mb-3">
          <span class="display-4 fw-bold">{{ price }}</span>
          <span class="text-muted">/ mes.</span>
        </div>
        <ul class="list-unstyled mb-4">
          <li v-for="(item, index) in items" :key="index" class="mb-2">
            <i class="bi bi-check text-primary" style="color: #107c10 !important;"></i>
            <strong v-if="index === 0">{{ item }}</strong>
            <span v-else>{{ item }}</span>
          </li>
        </ul>
        <div class="mt-auto">
          <div class="d-grid"><a class="btn btn-primary" :href="link" style="background-color: #107c10 !important; border-color: #107c10 !important;">Ver Ahora</a></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    icon: String,
    title: String,
    price: String,
    items: Array,
    link: String
  }
}
</script>
