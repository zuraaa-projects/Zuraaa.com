<template>
  <b-navbar toggleable="lg" type="dark">
    <b-navbar-brand class="navbar__logo" to="/">
      <img
        class="navbar__logo__image"
        src="~/assets/images/logo.png"
        alt="Logo"
      >
    </b-navbar-brand>

    <b-navbar-toggle target="navbar--collapse" />

    <b-collapse id="navbar--collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="/">
          Início
        </b-nav-item>
        <b-nav-item to="/bots">
          Bots
        </b-nav-item>
        <b-nav-item to="/discord">
          Servidor
        </b-nav-item>
        <b-nav-item>Documentação</b-nav-item>
        <b-nav-item>Buscar</b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-item href="oauth/login">
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
    display: flex;
    justify-content: center;
    align-items: center;

    &__image {
      height: 1.8rem;
    }
  }

  .nav-link {
    color: var(--link-color);
    font-size: 0.9rem;
  }

  .nav-link:hover {
      color: var(--link-color-hover);

  }

  .navbar-toggler {
    border: none;
  }

  .nuxt-link-exact-active.nuxt-link-active {
      color: var(--link-color-hover);
  }
}

@media (min-width: 992px) {
  .navbar {
    padding-left: 4rem;
    padding-right: 4rem;
  }
}
</style>
