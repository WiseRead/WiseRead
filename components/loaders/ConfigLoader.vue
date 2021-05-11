<template>
  <div class="text-center font-sans my-8">
    <div class="font-semibold opacity-75">Loading...</div>
    <IconInfinityAnimated />
  </div>
</template>

<script>
// @ts-ignore
import IconInfinityAnimated from '@/assets/icons/loaders/Infinity-animated.svg?inline'

export default {
  components: {
    IconInfinityAnimated,
  },
}
</script>
