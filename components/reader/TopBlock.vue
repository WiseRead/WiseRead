<template>
  <div id="topBlock">
    <h3 class="top-title">Online/Offline Comic Reader</h3>

    <div id="topDrop" class="top-width">
      <span class="mt-5 mx-2">Drop images or zip/cbz files here</span>
      <div class="files-button-area">
        <input
          id="filesUploader"
          class="files-button"
          type="file"
          accept=".zip,.cbz,image/*"
          multiple="multiple"
          @change="$emit('filesUploaderChange', $event)"
        />
        <label for="filesUploader">Choose files</label>
      </div>
    </div>

    <div class="flex flex-col my-5 top-width">
      <div class="url-input-title">
        Direct Link:
      </div>
      <form @submit.prevent="$emit('enterDownloadLink', urlInputValue)">
        <div class="url-input-area">
          <input
            v-model="urlInputValue"
            type="url"
            name="url"
            class="url-input-text"
            placeholder="https://example.com/files/chapter.cbz"
            value=""
          />
          <button type="submit" class="url-input-button url-input-button--icon">
            <RightArrow class="right-arrow" />
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      urlInputValue: ''
    }
  },
}
</script>

<style lang="scss" scoped>

#topBlock {
  @apply font-normal font-sans;
  text-align: center;
  color: var(--topblock-color);
  font-size: 21.5px;
  transition: color var(--color-mode-transition-time);

  // Set font again to update it if Arial available
  // TODO: It needs more testing
  font-family: Arial;

  @screen ph {
    font-size: 20px;
  }
}

#topDrop {
  @apply my-1 py-8 rounded;
  border: 2px dashed var(--topblock-border-color);
  opacity: 0.85;

  @screen ph {
    @apply py-6;
  }
}

.top-title {
  @apply font-bold mb-5 mt-8;
  font-size: 1.3rem;
  color: var(--topblock-title-color);
  transition: color var(--color-mode-transition-time);

  @screen sm {
    font-size: 1.42rem;
  }

  @screen sm2 {
    font-size: 1.8rem;
  }

  @screen md {
    @apply mt-12;
    font-size: 2.1rem;
  }
}

.files-button-area {
  margin-top: -1px;

  @screen ph {
    margin-top: 8px;
  }
}

.files-button {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.files-button + label {
  --active-filesinput-button-background-color: #d4d4d494;
  --active-filesinput-button-color: #848484;

  font-size: 83%;
  text-decoration: underline;
  cursor: pointer;
  border-radius: 30px;
  padding: 2.5px;

  transition: var(--color-mode-transition-time);

  @screen ph {
    margin-top: 0.3rem;
    padding: 4px;
    font-size: 90%;
    background-color: var(--active-filesinput-button-background-color);
    color: var(--active-filesinput-button-color);
  }

  &:hover {
    background-color: var(--active-filesinput-button-background-color);
    color: var(--active-filesinput-button-color);
  }
}

.dark-mode .files-button + label {
  --active-filesinput-button-background-color: rgb(115 115 115);
  --active-filesinput-button-color: rgb(195 195 195);
}

.url-input-title {
  @apply mb-2;
  font-family: Arial;
  font-size: 1.11rem;

  @screen sm2 {
    font-size: 1.137rem;
  }
}

.url-input-area {
  @apply flex-grow flex rounded-lg;
  border: 2px solid var(--topblock-border-color);
}

.url-input-text {
  @apply bg-transparent;
  margin: 0.12rem;
  flex: 1 0 0;
  outline: 0;
  padding: 0.05rem 0.25rem;
  color: var(--topblock-color);
  font-size: 71%;
  font-family: Arial;

  transition: color var(--color-mode-transition-time);

  @screen md {
    font-size: 68%;
  }

  &::placeholder {
    color: var(--topblock-color);
    opacity: 0.87;
    transition: var(--color-mode-transition-time);
  }
}

.url-input-button {
  cursor: pointer;
  border-radius: 24px;
  background: var(--link-button-background-color);
  color: var(--link-button-color);

  transition: var(--color-mode-transition-time);

  @variants focus {
    @apply outline-none;
  }
}

.url-input-button--icon {
  outline-color: transparent;
  border: 0;
  margin: 0.11rem;
  margin-right: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.right-arrow {
  vertical-align: baseline;
  width: 1rem;
  height: 1rem;
  margin: 4px;
}
</style>
