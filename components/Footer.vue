<template>
  <div class="footer">
    <nuxt-link class="footer__link" to="/discord">
      <div class="footer__link__icon">
        <font-awesome-icon :icon="['fab', 'discord']" />
      </div>
      <div class="footer__link__name">
        Discord
      </div>
    </nuxt-link>
    <nuxt-link class="footer__link" to="/#">
      Privacidade
    </nuxt-link>
  </div>
</template>

<style lang="scss" scoped>
.footer {
  background-color: var(--primary-color);
  min-height: 3.5rem;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--link-color);

  &__link {
    display: flex;
    color: var(--link-color);
    text-decoration: none;

    &__name {
      padding-left: 0.5rem;
    }
  }

  &__link:hover {
    color: var(--link-color-hover);
  }
}

@media (min-width: 992px) {
  .footer {
    padding-left: 4rem;
    padding-right: 4rem;
  }
}
</style>
