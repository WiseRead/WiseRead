<template>
  <div class="page">
    <h2>Convert WiseRead link to config file</h2>
    Enter WiseRead link with chapters:
    <input
      v-model.trim="initialLink"
      type="text"
      placeholder="WiseRead link"
      style="margin-top: 0.2rem;"
      class="link-input"
    />

    <div v-if="wrLink._chapterLinks.length > 0" class="mt-8">
      What is the number of the first chapter in the list?
      <input v-model.number="firstNumber" style="margin-top: 0.2rem;" class="input w-16 block" type="number" min="0" />
    </div>

    <div class="mt-8">
      Config:
      <div class="highlight mt-2"><pre>{{ wrLinkToConfig || 'Empty' }}</pre></div>
    </div>
    <div v-if="wrLink._chapterLinks.length > 0">
      * Of course, you may want to edit the result.
    </div>
  </div>
</template>

<script>
import { WiseReadLink } from '~/lib/WiseReadLink'
import { DEFAULT_TITLE_TEMPLATE } from '~/lib/Configpath'
import { StrUtils } from '~/lib/utils/StrUtils'

import _ from 'lodash'
import stringify from 'json-stable-stringify'

export default {
  data () {
    return {
      wrLink: new WiseReadLink(),
      initialLink: '',

      /** @type {number | string} */
      firstNumber: 1,
    }
  },

  computed: {
    /**
     * Convert WiseReadLink to config.
     *
     * Config format:
     * ```
     * {
     *     "wiseread_settings": {
     *         "title_template": ""
     *     },
     *     "chapters": {
     *         "1": {
     *             "title": "",
     *             "wiseread": {
     *               "direct": ""
     *             },
     *         },
     *         "2": {
     *             ...
     *         },
     *         ...
     *     }
     * }
     * ```
     *
     * @return {string}
     */
    wrLinkToConfig () {
      if (this.wrLink._chapterLinks.length === 0) {
        return ''
      }

      const resObject = { wiseread_settings: {}, chapters: {} }
      resObject.wiseread_settings.title_template = DEFAULT_TITLE_TEMPLATE
      let currNumber = _.isString(this.firstNumber) ? 1 : this.firstNumber

      for (const cl of this.wrLink._chapterLinks) {
        resObject.chapters[currNumber] = {
          title: cl.name,
          wiseread: { direct: cl.link }
        }
        currNumber = Math.floor(currNumber + 1)
      }

      // We use 'stringify' lib instead of JSON.stringify(resObject, null, 2)
      // because with stringify we can ensure that the result is arranged in the order
      // we want, "2.2" before "3" and "wiseread_settings" before "chapters".
      const str = stringify(resObject, {
        space: 2,
        cmp: (a, b) => {
          if (b.key === 'wiseread_settings') {
            return 1
          }
          return a.key > b.key ? 1 : -1
        }
      })

      return str
    },
  },

  watch: {
    initialLink: {
      /**
       * @param {string} newInitialLink
       */
      handler (newInitialLink) {
        this.wrLink = new WiseReadLink(newInitialLink)

        // Try to init firstNumber if found in first chapter name
        const strLastNumberInFirstChapter = StrUtils.getLastNumber(this.wrLink._chapterLinks[0]?.name ?? '')
        const lastNumberInFirstChapter = _.toNumber(strLastNumberInFirstChapter)
        if (lastNumberInFirstChapter) {
          this.firstNumber = lastNumberInFirstChapter
        }
      },
    },
  },
}
</script>
