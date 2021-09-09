<template>
  <div class="page doc-page">
    <h2>{{ title }}</h2>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: 'How to get direct download link',
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
