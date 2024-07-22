<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

</script>

<template>
  <div id="app">
    <Header />
    <body>
      <RouterView />
      <Footer />
    </body>
  </div>
</template>

