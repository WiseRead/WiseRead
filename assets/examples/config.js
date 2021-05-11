/* eslint-disable no-template-curly-in-string */

import { ConfigpathType } from '~/lib/Configpath'
import { ConfigExample } from '~/lib/models'

const title_template_example1 = '${ number }. ${ title }'

export const spec_cubariWithWR =
`{
  "title": "<manga title, required, str>",
  "description": "<manga description, required, str>",
  "artist": "<manga artist, optional, str>",
  "author": "<manga author, optional, str>",
  "cover": "<mangacoverurl.jpg, optional, str>",
  "wiseread_settings": {
    "title_template": "<title template like "${title_template_example1}", optional, str>"
  },
  "chapters": {
    "1": {
      "title": "<chapter name, required (optional in wiseread), str>",
      "volume": "<volume number, optional, str>",
      "wiseread": {
        "direct": "<link to chapter file, required, str>"
      },
      "groups": {
        "<group name>": "<proxy url>",
        OR
        "<group name>": [
          "<url to page 1>",
          "<url to page 2>",
          ...
        ]
      },
      "last_updated": "<optional, unix timestamp>"
    },
    "2": {
      ...
    },
    ...
  }
}`

const title_template_example_2 = 'Chapter ${ number }'

export const example_WROnly =
`{
  "wiseread_settings": {
    "title_template": "${title_template_example_2}"
  },
  "chapters": {
    "3": {
      "wiseread": {
        "direct": "https://example.com/files/chapter3.cbz"
      }
    },
    "4": {
      "wiseread": {
        "direct": "https://example.com/files/chapter4.zip"
      }
    },
    "5": {
      "wiseread": {
        "direct": "https://example.com/files/chapter5.cbz"
      }
    }
  }
}`

/** @type {ConfigExample[]} */
export const realConfigExamples = [new ConfigExample({
  name: 'Mookhyang Dark Lady (Raw URL)',
  configFile: 'https://github.com/WiseRead/Examples/blob/main/config/Mookhyang_Dark_Lady.json',
  configpathValue: 'https://raw.githubusercontent.com/WiseRead/Examples/main/config/Mookhyang_Dark_Lady.json',
  configpathType: ConfigpathType.RAWURL,
  gitIoToRaw: 'J3XMY',
}),
new ConfigExample({
  name: 'A Capable Maid (Gist Id)',
  configFile: 'https://gist.github.com/DragonWhisperer/4604c66ac56c94a2492893b9805a3335#file-wiseread_example_a_capable_maid-json',
  configpathValue: '4604c66ac56c94a2492893b9805a3335',
  configpathType: ConfigpathType.GIST,
  gitIoToRaw: 'J31wU',
})]
