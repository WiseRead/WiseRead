<template>
  <div class="page doc-page">
    <h1>About</h1>
    <p>
      WiseRead was built for the community to enjoy.
      <br />
      Just drag your local comic/manga/manhwa files and start to read.
      <br />
      Also, you can use it as an "online reader" for your files, if you have their download link.
    </p>

    <h2>Supported files</h2>
    <p>
      ZIP, CBZ, images.
    </p>

    <h2>Local usage</h2>
    <p>
      Drag/Select one or multiple of your files.
      <br />
      The files can be chapter-files (ZIP/CBZ) or images.
    </p>

    <h2>Online Reader</h2>
    <p>
      Create Online WiseRead Link and share it with your friends.
      <br />
      Gather the download links you need, each link should be a direct link to one ZIP/CBZ file, and
      use the <NuxtLink to="/manage-link">Manage Link</NuxtLink> page to create and configure the final WiseRead link.
      <span class="marked-block">
        Example:
        <br />
        <a :href="exampleWRLink">{{ exampleWRLink }}</a>
      </span>
    </p>

    <h2>Real examples</h2>
    <p>
      <span v-for="exam of realExamples" :key="exam.link">
        <a :href="exam.link">{{ exam.exampleName }}</a>
        <br />
      </span>
    </p>

    <h2>How to get a direct download link</h2>
    <p>
      There are many ways to host chapters and get direct download links.
      <br />
      Let's review two of them:
    </p>
    <ul class="list-disc list-inside mt-2">
      <li>Dropbox</li>
      <li>Google Drive</li>
    </ul>
    <p>
      <br />
      <span class="font-medium">Dropbox:</span>
      <br />
      1. First, you need the normal sharing link from Dropbox.
      Go to dropbox.com, find your file, and click the Share button that appears when you hover over it.
      Then copy the link from the popup.
      <br />
      You'll have a link like:
      <br />
      <span class="marked-link">https://www.dropbox.com/s/0zvml5x2blbwkek/file.cbz</span>

      <br />
      <br />
      2. To get a direct download link, just replace
      the <span class="marked-link">www.dropbox.com</span> with <span class="marked-link">dl.dropboxusercontent.com</span>,
      <br />
      which will give you a link like:
      <br />
      <span class="marked-link">https://dl.dropboxusercontent.com/s/0zvml5x2blbwkek/file.cbz</span>
      <br />
      <br />
      3. UPDATE: Now WiseRead can do the conversion from 'sharing link' to 'direct link' automatically,
      so you can ignore step 2.
    </p>
    <p>
      <br />
      <span class="font-medium">Google Drive:</span>
      <br />
      Google Drive is a bit risky.
      <br />
      Due to Google Drive configuration and browser security constraints (CORS policy),
      WiseRead can't download files directly from Google Drive.
      (This problem also exists with several other hosts).
      <br />
      WiseRead uses proxy to work around the problem, but the proxy may not work in the future.
      <br />
      <br />
      Well, your decision.
      <br />
      Here's how to get a direct download link from Google Drive:
      <br />
      <br />
      1. First, you need the normal sharing link from Google Drive.
      Go to drive.google.com, find your file, right click and click 'Share'.
      Give access to everyone and copy the link.
      <br />
      See <a href="https://support.google.com/drive/answer/2494822?co=GENIE.Platform%3DDesktop&hl=en&oco=0#zippy=%2Cshare-a-link-to-the-file">Support</a>.
      <br />
      <br />
      You'll have a link like:
      <br />
      <span class="marked-link">https://drive.google.com/file/d/1A1CAZ8-RdS1zZ7j-abbgcxKe-VFJ0QgQ/view?usp=sharing</span>

      <br />
      <br />
      2. To get a direct download link, use
      <a href="https://www.wonderplugin.com/online-tools/google-drive-direct-link-generator/">Google Drive Direct Link Generator</a>,
      which will give you a link like:
      <br />
      <span class="marked-link">https://drive.google.com/uc?export=download&id=1A1CAZ8-RdS1zZ7j-abbgcxKe-VFJ0QgQ</span>
      <br />
      <br />
      3. UPDATE: Now WiseRead can do the conversion from 'sharing link' to 'direct link' automatically,
      so you can ignore step 2.
      <br />
      NOTE: Only for files smaller than 100MB.
    </p>

    <h2 class="pt-3">Contact me</h2>
    <p class="font-medium">
      <IconMail class="w-5 mr-1 inline" /> noaragono15@gmail.com
    </p>
  </div>
</template>

<script>
// @ts-ignore
import IconMail from '@/assets/icons/mail.svg?inline'

import { ChapterLink, ImagesModeEnum } from '~/lib/models'
import { WiseReadLink } from '~/lib/WiseReadLink'

export default {
  components: {
    IconMail,
  },

  data () {
    return {
      exampleDirectLink: 'https://example.com/files/chapter.cbz',
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
        exampleName: 'Manga (Dropbox, Slime 1-3)',
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
        exampleName: 'Manga (Dropbox, Spy X Family - Prologue)',
        data: {
          chapterLinks: [
            { name: 'Spy X Family - Prologue', link: 'https://www.dropbox.com/s/j4tab4xsrd2tax6/Chapter%2000%20Prologue.cbz?dl=0' },
          ],
          imode: ImagesModeEnum.SEPARATE,
        },
      },
      {
        exampleName: 'Webtoon (Google Drive, Solo Leveling - Prologue)',
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
