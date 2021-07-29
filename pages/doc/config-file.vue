<template>
  <div class="page doc-page">
    <h1>{{ title }}</h1>
    <p>
      You can create Online WiseRead Link with external config file.
      <br />
      This config file contains the chapter list and some settings, so when you want to
      update the WiseRead Link you already shared and add new chapters, you just need to change the
      config file and can leave the link unchanged.
      <span class="marked-block no-break">
        Example:
        <br />
        <a :href="exampleConfigpathWRLink">{{ exampleConfigpathWRLink }}</a>
      </span>
    </p>

    <h2>Config file format</h2>
    <p>
      The config file is a JSON file that extend the <a
        href="https://www.reddit.com/r/manga/comments/mcicbp/sl_how_to_host_a_series_on_imgur_with_guyamoe/"
      >Cubari format</a>. (<NuxtLink to="/doc/cubari">What is Cubari?</NuxtLink>)
    </p>
    <div class="highlight mt-5"><pre>{{ spec_cubariWithWR }}</pre></div>
    <p>
      This format allows you to use the same file with WiseRead and Cubari!
      <br />
      You can remove Cubari fields if you only need it for WiseRead:
    </p>
    <div class="highlight mt-5"><pre>{{ example_WROnly }}</pre></div>

    <h2>Host</h2>
    <p>
      WiseRead supports two types of hosts:
      <br />
      <br />
      <span class="font-medium">Raw URL:</span>
      <br />
      Host the config file anywhere, you just need a direct link to it.
      <br />
      For example, you can create a <a href="https://github.com">GitHub Repository</a>, upload the
      JSON file, click on the file, click 'Raw' and copy the page's URL.
      The Raw URL should look like:
      <br />
      <span class="marked-link">https://raw.githubusercontent.com/user/repo/main/config.json</span> - Keep it.
      <span class="blockquote mt-4">
        To use this file with Cubari, copy the URL to <a href="https://git.io">git.io</a>.
      </span>

      <br />
      <span class="font-medium">Gist id:</span>
      <br />
      Gist id is shorter and cleaner.
      <br />
      <span class="small-br"></span>
      Create new <a href="https://gist.github.com">GitHub Gist</a>, upload the JSON file,
      click 'Create public gist', click on the file and copy the last part from the
      page's URL (The text after the last slash). This text is the gist id.
      <br />
      <span class="marked-link">https://gist.github.com/user/gist_id</span> - Keep the gist_id.
      <span class="block mt-2">
        You can't change the file name without changing the gist id, so
        think carefully about the file name before sharing it.
      </span>
      <span class="blockquote my-4">
        To use this gist with Cubari, open the gist, click 'Raw' and copy the page's URL.
        <br />
        Now you need to <a href="https://stackoverflow.com/a/47175630">remove the [gist commit ID] from the URL</a>
        and copy the URL to <a href="https://git.io">git.io</a>.
      </span>

      <span class="block mt-6"></span>
      <span class="marked-block mt-8">
        In GitHub you can create repos under 'organization', which is very convenient for groups,
        <br />
        but organization account can't create gists. Only personal accounts can create gists.
      </span>
    </p>

    <h2>Create the WiseRead Link</h2>
    <p>
      Enter the RawURL/GistId in the <NuxtLink to="/manage-link">Manage Link</NuxtLink> page
      under 'Config File', and copy the final link.
      <br />
      Note that unlike Cubari, WiseRead does not use <a href="https://git.io">git.io</a>.
    </p>

    <h2>Create config file from WiseRead link</h2>
    <p>
      You can easily convert from normal 'Chapter List' WiseRead link to config file,
      <br />
      with the <NuxtLink to="/convert-link-to-config">Convert WiseRead Link To Config File</NuxtLink> page.
    </p>

    <h2>Real examples</h2>
    <p>
      <ul class="lg:list-disc list-outside">
        <li v-for="(example, index) in realConfigExamples" :key="index" class="mb-2">
          <span>{{ example.name }}</span>
          <br />
          <a :href="example.configFile">Config file</a><span> | </span>
          <a :href="example.toWRLink()">WiseRead link</a><span> | </span>
          <a :href="example.toCubariLink()">Cubari link</a>
        </li>
      </ul>
    </p>
  </div>
</template>

<script>
import { WiseReadLink } from '~/lib/WiseReadLink'
import { spec_cubariWithWR, example_WROnly, realConfigExamples } from '~/assets/examples/config'

export default {
  data () {
    return {
      title: 'The config file',
      exampleConfigpath: 'rawurl:https://example.com/files/myconfig.json',
      spec_cubariWithWR: spec_cubariWithWR,
      example_WROnly: example_WROnly,
      realConfigExamples: realConfigExamples,
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
    exampleConfigpathWRLink () {
      return new WiseReadLink({ configpath: this.exampleConfigpath }).toLink([])
    }
  },
}
</script>
