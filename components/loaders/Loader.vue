<!-- Loader from https://loading.io/css/ -->

<template>
  <div>
    <div class="loader lds-ellipsis"><div></div><div></div><div></div><div></div></div>
  </div>
</template>

<style scoped>
.loader {
  width: 115.5px;
}

.loader div {
  background: var(--link-button-background-color);
}

.lds-ellipsis {
  display: inline-block;
  position: relative;
}

.lds-ellipsis div {
  position: absolute;
  /* top: 49.5px; */
  width: 19.5px;
  height: 19.5px;
  border-radius: 50%;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}

.lds-ellipsis div:nth-child(1) {
  left: 12px;
  animation: lds-ellipsis1 0.6s infinite;
}

.lds-ellipsis div:nth-child(2) {
  left: 12px;
  animation: lds-ellipsis2 0.6s infinite;
}

.lds-ellipsis div:nth-child(3) {
  left: 48px;
  animation: lds-ellipsis2 0.6s infinite;
}

.lds-ellipsis div:nth-child(4) {
  left: 84px;
  animation: lds-ellipsis3 0.6s infinite;
}

@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(0);
  }
}

@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(36px, 0);
  }
}
</style>
