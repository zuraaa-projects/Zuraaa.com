<template>
  <div class="layout">
    <header class="layout__header">
      <Navbar />
    </header>
    <main class="layout__main">
      <Nuxt />
    </main>
    <footer class="layout__footer">
      <Footer />
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  &__header {
    position: fixed;
    width: 100%;
    z-index: 1;
  }

  &__main {
    padding-top: 3.425rem;
    min-height: calc(100vh - 3.425rem);
    background-color: #f5f5f5;
  }
}
</style>
