<template>
  <div class="page doc-page">
    <h2>{{ title }}</h2>
    <p>
      Cubari is another web comic reader.
      <br />
      It takes images from other websites and displays them in a manga-oriented reader.
      <br />
      Like WiseRead, Cubari does not host any of the content.
      <br />

      <span class="small-br"></span>

      Try <a :href="cubariLinkExample">Cubari example</a>.
      <br />
      <br />
      <span class="font-semibold">Note:</span>
      <ul class="list-disc -lg:ml-2 md:max-w-2xl">
        <li>
          WiseRead is not inspired by Cubari, and unlike Cubari WiseRead uses direct links to zip/cbz files,
          and supports offline usage.
        </li>
        <li>
          You can use the same config file with WiseRead and Cubari.
          <NuxtLink to="/doc/config-file">Read more</NuxtLink>.
        </li>
      </ul>
    </p>
  </div>
</template>

<script>
import { realConfigExamples } from '~/assets/examples/config'

export default {
  data () {
    return {
      title: 'What is Cubari?',
      cubariLinkExample: realConfigExamples[1].toCubariLink(),
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
