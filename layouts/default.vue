<template>
  <div>
    <Navbar />
    <Nuxt keep-alive />
  </div>
</template>

<style>
html {
  font-family: "Times New Roman";
}

body {
  background-color: var(--page-background-color);
  color: var(--main-text-color);
  transition: background-color var(--color-mode-transition-time);
}

a {
  color: var(--link-color);
}
</style>
