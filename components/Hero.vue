<template>
  <div class="hero">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.hero {
  background-color: var(--primary-color);
  color: var(--text-light);
  width: 100%;
  padding: 1rem;
}
</style>
