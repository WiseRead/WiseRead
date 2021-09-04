/* eslint-disable no-template-curly-in-string */

import { ChapterLink } from '~/lib/models'
import { Octokit } from '@octokit/core'
import _ from 'lodash'

/**
 * @readonly @enum {string}
 */
export const ConfigpathType = {
  GIST: 'gist',
  GITIO: 'gitio',
  RAWURL: 'rawurl',
}

export const DEFAULT_TITLE_TEMPLATE = '${ number }. ${ title }'

/**
 * @typedef {Object} ConfigpathDataArgs
 * @property {string=} titleTemplate
 * @property {ChapterLink[]=} chapterLinks
 */

export class ConfigpathData {
  /**
   * @param {ConfigpathDataArgs=} args
   */
  constructor (args) {
    /** @type {string} */
    this.titleTemplate = args?.titleTemplate || ''

    /** @type {ChapterLink[]} */
    this.chapterLinks = args?.chapterLinks || []
  }
}

export const RawJsonSource = {
  /**
   * Get Json from url.
   *
   * @param {string} url
   * @return {Promise<any | undefined>}
   */
  async getJSON (url) {
    const jsonData = await fetch(url).then((response) => response.json())
    return jsonData
  }
}

export const GistSource = {
  /**
   * Get json from GitHub gist.
   * See https://docs.github.com/en/rest/reference/gists#get-a-gist
   *
   * @param {string} gistId
   * @return {Promise<any | undefined>}
   */
  async getJSON (gistId) {
    let jsonData

    const octokit = new Octokit()
    const response = await octokit.request('GET /gists/{gist_id}', {
      gist_id: gistId
    })

    const firstGistFile = Object.values(response.data.files ?? {})[0]
    const jsonString = firstGistFile?.content
    if (jsonString && _.isString(jsonString)) {
      jsonData = JSON.parse(jsonString)
    }

    return jsonData
  }
}

/**
 * Convert Json to ChapterLink array.
 *  * Expected format of the config json should be:
```
{
    "wiseread_settings": {
        "title_template": "<optional, str>"
    },
    "chapters": {
        "1": {
            "title": "<required, str>",
            "wiseread": {
              "direct": "<required, str>"
            },
        },
        "2": {
            ...
        },
        ...
    }
}
```

 * This format is an extension of the CUBARI format.
 * See the CUBARI format: https://github.com/appu1232/guyamoe/blob/master/proxy/sources/gist.py
 *
 * Combined CUBARI + WiseRead json should be:
```
{
    "title": "<required, str>",
    "description": "<required, str>",
    "artist": "<optional, str>",
    "author": "<optional, str>",
    "cover": "<optional, str>",
    "wiseread_settings": {
        "title_template": "<optional, str>"
    },
    "chapters": {
        "1": {
            "title": "<required, str>",
            "volume": "<optional, str>",
            "groups": {
                "<group name>": "<proxy url>",
                OR
                "<group name>": [
                    "<url to page 1>",
                    "<url to page 2>",
                    ...
                ]
            },
            "wiseread": {
              "direct": "<required, str>"
            },
            "last_updated": "<optional, unix timestamp>",
        },
        "2": {
            ...
        },
        ...
    }
}
```
 * @param {any | undefined} json
 * @param {String=} titleTemplate
 * @return {ConfigpathData}
 */
export function parseConfigJson (json, titleTemplate = DEFAULT_TITLE_TEMPLATE) {
  if (!json) {
    throw new Error("Can't read JSON")
  }

  const finalTitleTemplate = json?.wiseread_settings?.title_template || titleTemplate
  const compiledTitleTemplate = _.template(finalTitleTemplate)

  /** @type {ChapterLink[]} */
  const cLinks = []

  if (json?.chapters) {
    for (const [strNumber, chapter] of Object.entries(json.chapters)) {
      if (chapter.wiseread) {
        const link = chapter.wiseread?.direct
        const name = compiledTitleTemplate({
          number: strNumber,
          title: chapter?.title ?? '',
          volume: chapter?.volume ?? ''
        })
        cLinks.push(new ChapterLink({ name, link }))
      }
    }
  }

  if (cLinks.length === 0) {
    throw new Error('No chapters in JSON')
  }

  return new ConfigpathData({
    titleTemplate: finalTitleTemplate,
    chapterLinks: cLinks
  })
}
