<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'

/** Thin loading bar at the top of the page during route changes (like AdminLTE's Pace). Mount once, e.g. in App.vue. */
const props = withDefaults(defineProps<{ /** ms before the bar appears, so instant navigations don't flash. */ delay?: number }>(), { delay: 120 })

const router = useRouter()
const width = ref(0)
const visible = ref(false)
let showTimer: ReturnType<typeof setTimeout> | undefined
let trickle: ReturnType<typeof setInterval> | undefined
let hideTimer: ReturnType<typeof setTimeout> | undefined

function start() {
  clearTimeout(hideTimer)
  clearTimeout(showTimer)
  showTimer = setTimeout(() => {
    visible.value = true
    width.value = 12
    clearInterval(trickle)
    trickle = setInterval(() => (width.value += (90 - width.value) * 0.12), 200)
  }, props.delay)
}
function done() {
  clearTimeout(showTimer)
  clearInterval(trickle)
  if (!visible.value) return
  width.value = 100
  hideTimer = setTimeout(() => {
    visible.value = false
    width.value = 0
  }, 250)
}

const offBefore = router.beforeEach(() => start())
const offAfter = router.afterEach(() => done())
const offError = router.onError(() => done())
onBeforeUnmount(() => {
  offBefore()
  offAfter()
  offError()
  clearTimeout(showTimer)
  clearTimeout(hideTimer)
  clearInterval(trickle)
})
</script>

<template>
  <div class="nu-route-progress" :class="{ 'is-visible': visible }" aria-hidden="true">
    <span :style="{ width: `${width}%` }" />
  </div>
</template>

<style>
.nu-route-progress { position: fixed; inset: 0 0 auto; z-index: 300; height: 2px; pointer-events: none; opacity: 0; transition: opacity 0.2s ease; }
.nu-route-progress.is-visible { opacity: 1; }
.nu-route-progress span { display: block; height: 100%; background: var(--nu-primary); box-shadow: 0 0 6px var(--nu-primary); transition: width 0.2s ease; }
</style>
