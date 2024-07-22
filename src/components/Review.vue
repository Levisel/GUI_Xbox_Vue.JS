<template>
    <div class="card mb-4">
      <div class="card-body p-4">
        <div class="d-flex">
          <div class="flex-shrink-0"><i class="bi bi-chat-right-quote-fill text-primary fs-1" style="color: #107c10 !important;"></i></div>
          <div class="ms-4">
            <p class="mb-1">{{ text }}</p>
            <div class="small text-muted">- {{ author }}</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      text: String,
      author: String,
    },
  }
  </script>
  