<template>
    <div class="col-lg-4 mb-5 mb-lg-0">
      <div class="feature bg-primary bg-gradient text-white rounded-3 mb-3" :style="{ backgroundColor: '#107c10 !important' }"> <i :class="`bi ${icon}`"></i></div>
      <h2 class="h4 fw-bolder">{{ title }}</h2>
      <p>{{ description }}</p>
      <a class="text-decoration-none" href="#!">
        {{ linkText }}
        <i class="bi bi-arrow-right"></i>
      </a>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      icon: String,
      title: String,
      description: String,
      linkText: String,
    },
  }
  </script>
  