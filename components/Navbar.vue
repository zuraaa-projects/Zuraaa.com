<template>
  <b-navbar toggleable="lg" type="dark">
    <b-navbar-brand href="/">
      <img
        class="navbar__logo"
        src="~/static/images/logo.png"
        alt="logo"
      >
    </b-navbar-brand>

    <b-navbar-toggle target="navbar--collapse" />

    <b-collapse id="navbar--collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item>Início</b-nav-item>
        <b-nav-item>Bots</b-nav-item>
        <b-nav-item>Servidor</b-nav-item>
        <b-nav-item>Documentação</b-nav-item>
        <b-nav-item>Buscar</b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-item href="/login">
          Login
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class Navbar extends Vue {

}
</script>

<style lang="scss" scoped>
.navbar {
  background-color: var(--primary-color);

  &__logo {
    height: 2rem;
  }

  .nav-link {
    color: var(--text-color)
  }

  .navbar-toggler {
    border: none;
  }
}
</style>
