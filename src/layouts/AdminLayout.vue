<template>
  <div class="admin-layout">
    <!-- Admin content only - no main navigation or footer -->
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'AdminLayout',
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
}
</style>
