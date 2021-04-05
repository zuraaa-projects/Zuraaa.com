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
        <b-nav-item class="navbar__link" to="/">
          Início
        </b-nav-item>
        <b-nav-item class="navbar__link" to="/bots">
          Bots
        </b-nav-item>
        <b-nav-item class="navbar__link" to="/discord">
          Servidor
        </b-nav-item>
        <b-nav-item class="navbar__link" href="https://github.com/zuraaa-projects/Zuraaa.com/wiki">
          Documentação
        </b-nav-item>
        <b-nav-item class="navbar__link">
          Buscar
        </b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <img
          v-if="me !== null"
          :src="me | genAvatar"
          :alt="me | altName"
          class="navbar__dropdown__image"
        >
        <b-nav-item v-if="me === null" to="/oauth2/login">
          Login
        </b-nav-item>
        <b-nav-item-dropdown v-else class="navbar__dropdown" right>
          <template #button-content>
            <span class="navbar__dropdown__name">
              {{ me.username }}
            </span>
          </template>
          <b-dropdown-item :to="me | myPage">
            Meu perfil
          </b-dropdown-item>
          <b-dropdown-item href="/bots/add">
            Adicionar bot
          </b-dropdown-item>
          <hr class="navbar__dropdown__line">
          <b-dropdown-item href="#">
            Deslogar
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { genAvatar, altName, myPage } from '~/utils/filters'
import type { User } from '~/models/users/user'

@Component({
  fetchOnServer: false,
  filters: {
    genAvatar,
    altName,
    myPage
  }
})
export default class Navbar extends Vue {
  me: User | null = null

  async fetch () {
    try {
      if (localStorage.getItem('token') != null) {
        this.me = await this.$axios.$get('/users/@me')
      }
    } catch (error) {
      if (error.response == null || error.response.status >= 500) {
        throw error
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  background-color: var(--primary-color);

  &__logo {
    display: flex;
    justify-content: center;
    align-items: center;
    outline: none;

    &__image {
      height: 1.8rem;
    }
  }

  &__link {
    .nav-link {
      color: var(--link-color);
      font-size: 0.9rem;
      outline: none;
    }

    .nav-link:hover {
      color: var(--link-color-hover);
    }

    .nuxt-link-active {
      color: var(--link-color-hover);
    }
  }

  &__dropdown {
    font-size: 0.9rem;

    &__name {
      color: var(--text-light);
    }

    &__line {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }

    &__image {
      width: 2.2rem;
      height: 2.2rem;
      border-radius: 50%;
      margin: auto 0;
      margin-right: 0.5rem;
    }
  }

  .navbar-toggler {
    border: none;
  }
}

.nav-link {
  color: aqua;
}

@media (min-width: 992px) {
  .navbar {
    padding-left: 4rem;
    padding-right: 4rem;
  }
}
</style>
