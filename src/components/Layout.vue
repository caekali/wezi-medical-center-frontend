<script setup>
import Navigation from './Navigation.vue'

defineProps({
  transparentHeader: {
    type: Boolean,
    default: false
  },
  showSkipLink: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Skip Navigation Link -->
    <a
      v-if="showSkipLink"
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-indigo-600 text-white px-4 py-2 rounded z-50"
    >
      Skip to main content
    </a>

    <!-- Main Content -->
    <main id="main-content">
      <slot />
    </main>

    <!-- Footer (if needed) -->
    <slot name="footer" />
  </div>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: 0.5rem 1rem;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
</style>

<!--Start of Tawk.to Script-->
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
  var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
  s1.async=true;
  s1.src='https://embed.tawk.to/68b0c10a737b241928e3a376/1j3p744qo';
  s1.charset='UTF-8';
  s1.setAttribute('crossorigin','*');
  s0.parentNode.insertBefore(s1,s0);
})();
</script>
<!--End of Tawk.to Script-->