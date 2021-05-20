<template>
  <div>
    <nav class="nav-background nav-text">
      <div class="nav-x-padding">
        <div class="flex items-center justify-between h-15">
          <!-- Left area -->
          <div class="flex items-center">
            <!-- Logo -->
            <!-- <div class="flex-shrink-0 mr-5 hidden md:block">
              <img class="h-8 w-8" src="~/static/favicon.png" alt="Workflow" />
            </div> -->

            <div>
              <div class="hidden md:block mr-5 select-none text-base">
                WiseRead{{ $config.IS_BETA ?' Beta' : '' }}
              </div>
            </div>
            <div>
              <div class="left-links">
                <NuxtLink to="/" exact-path @click.native="onReaderClick">Reader</NuxtLink>
                <NuxtLink to="/about">About</NuxtLink>
                <NuxtLink to="/manage-link" class="hidden md:block">Manage Link</NuxtLink>
              </div>
            </div>
          </div>

          <!-- Right area -->
          <div>
            <div class="ml-1 md:ml-6 flex items-center">
              <NavModesPicker />
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  methods: {
    onReaderClick (event) {
      this.$store.commit('setShowTopBlock', { showTopBlock: true })
    },
  }
}
</script>

<style scoped>
.nav-background {
  background-color: var(--dark--page-background-color);
}

.left-links {
  @apply flex items-baseline;
}

.nav-text {
  @apply text-gray-300 font-sans text-sm font-medium;

  @screen -sm {
    @apply text-sm;
  }
}

.left-links > a {
  @apply text-gray-300 px-3 py-2 rounded-md mr-1;

  @screen -sm {
    @apply px-2;
  }

  &:hover:not(:focus) {
    background-color: rgb(80 80 80);

    @apply text-gray-100;
  }

  &.nuxt-link-active {
    background-color: rgb(84 85 88);

    @apply text-gray-100;
  }
}
</style>
