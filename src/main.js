import Vue from 'vue'
import Game from './Game.vue'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('../service-worker.js')
  .then( (registration)=> {
    console.log('[Serviceworker] Registered')
  })
  .catch((error)=> {
    console.log('[Serviceworker] Did Not Register', error)
  })
}

new Vue({
  el: 'body',
  components: { Game }
})
