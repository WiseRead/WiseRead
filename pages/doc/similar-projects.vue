<template>
  <div class="page doc-page">
    <h2>{{ title }}</h2>
    <p>
      Projects similar to WiseRead:
    </p>
    <ul class="list-disc list-inside mt-2">
      <li><a href="https://villain.js.org">Villain</a></li>
      <li><NuxtLink to="/doc/cubari">Cubari</NuxtLink></li>
    </ul>
    <p>
      <br />
      But there are features you can only find in WiseRead (:
    </p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: 'Similar projects',
    }
  },

  /**
   * @return {any}
   */
  head () {
    return {
      title: this.title,
    }
  },
}
</script>
