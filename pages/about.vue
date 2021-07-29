<template>
  <div class="page doc-page">
    <h1>{{ title }}</h1>
    <p>
      WiseRead was built for the community to enjoy.
      <br />
      With WiseRead you can read your comic/manga/manhwa from any device
      in the browser.
      <br />
      It's always free and without ads.

      <span class="small-br"></span>
      Just drag files from your device and start to read,
      <br />
      or use it as an "online reader" to stream chapters from the cloud.
    </p>

    <h2>Supported files</h2>
    <p>
      ZIP, CBZ, images.
    </p>

    <h2>Local usage</h2>
    <p>
      Drag/Select one or multiple files.
      <br />
      The files can be chapter-files (ZIP/CBZ) or images.
    </p>

    <h2>Online Reader</h2>
    <p>
      Create "Online WiseRead Link" and share it with your friends.
      <br />
      1. Gather the download links you need - each link should be a direct link to one ZIP/CBZ file.
      <br />
      2. Use the <NuxtLink to="/manage-link">Manage Link</NuxtLink> page to create and configure the final WiseRead link.
      <span class="marked-block no-break">
        Example:
        <br />
        <a :href="exampleWRLink">{{ exampleWRLink }}</a>
      </span>
      There's also <NuxtLink to="/doc/config-file">advanced option with external config file</NuxtLink>.
    </p>

    <h2>Real examples</h2>
    <p>
      <span v-for="exam of realExamples" :key="exam.link">
        <a :href="exam.link">{{ exam.exampleName }}</a>
        <br />
      </span>
    </p>

    <h2>Read more</h2>
    <NuxtLink to="/doc/get-direct-download-link">How to get direct download link</NuxtLink>
    <br />
    <NuxtLink to="/doc/similar-projects">Similar projects</NuxtLink>

    <h2 class="pt-3">Contact me</h2>
    <div class="contact-list">
      <div>
        <div class="icon"><IconDiscord class="inline" style="width: 1.125rem;" /></div>
        <span><a href="https://discord.gg/cwTw8upByW">Discord server</a></span>
      </div>
      <div>
        <div class="icon"><IconMail class="inline" /></div>
        <span>noaragono15@gmail.com</span>
      </div>
    </div>
  </div>
</template>

<script>
// @ts-ignore
import IconMail from '@/assets/icons/mail.svg?inline'
// @ts-ignore
import IconDiscord from '@/assets/icons/brands/discord.svg?inline'

import { ChapterLink, ImagesModeEnum } from '~/lib/models'
import { WiseReadLink } from '~/lib/WiseReadLink'

export default {
  components: {
    IconMail,
    IconDiscord,
  },

  data () {
    return {
      title: 'About',
      exampleDirectLink: 'https://example.com/files/chapter.cbz',
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

  computed: {
    /**
     * @return {string}
     */
    exampleWRLink () {
      return new WiseReadLink({
        chapterLinks: [new ChapterLink({ link: this.exampleDirectLink, name: '' })]
      }).toLink([])
    },

    /**
     * @return {{exampleName: string, link: string}[]}
     */
    realExamples () {
      const examples = [{
        exampleName: 'Slime 1-3 (Manga, Dropbox)',
        data: {
          chapterLinks: [
            { name: 'Slime 1', link: 'https://www.dropbox.com/s/0xvml5x3blcwkek/Tensei%20Shitara%20Slime%20Datta%20Ken%20Chapter%201.cbz?dl=0' },
            { name: 'Slime 2', link: 'https://www.dropbox.com/s/0mmw8ni7ziq83v7/Tensei%20Shitara%20Slime%20Datta%20Ken%20Chapter%202.cbz?dl=0' },
            { name: 'Slime 3', link: 'https://www.dropbox.com/s/wye3g60z2pxbepy/Tensei%20Shitara%20Slime%20Datta%20Ken%20Chapter%203.cbz?dl=0' },
          ],
          imode: ImagesModeEnum.SEPARATE,
        },
      },
      {
        exampleName: 'Spy X Family - Prologue (Manga, Dropbox)',
        data: {
          chapterLinks: [
            { name: 'Spy X Family - Prologue', link: 'https://www.dropbox.com/s/j4tab4xsrd2tax6/Chapter%2000%20Prologue.cbz?dl=0' },
          ],
          imode: ImagesModeEnum.SEPARATE,
        },
      },
      {
        exampleName: 'Solo Leveling - Prologue (Webtoon, Google Drive)',
        data: {
          chapterLinks: [
            { name: 'Solo Leveling - Prologue', link: 'https://drive.google.com/file/d/1VbeoaVIGUin4ZMj4ycsI2qSMOXPXH2pW/view?usp=sharing' },
          ],
          imode: ImagesModeEnum.CONTINUOUS,
        },
      }
      ]

      const exampleLinks = []

      for (const exam of examples) {
        exampleLinks.push({
          exampleName: exam.exampleName,
          link: new WiseReadLink(exam.data).toLink([])
        })
      }

      return exampleLinks
    },
  },
}
</script>

<style lang="scss" scoped>
.contact-list {
  @apply font-medium;

  & > div {
    @apply flex;

    .icon {
      @apply w-5 mr-2 text-center;
    }
  }
}
</style>
