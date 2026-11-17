import { createApp } from 'vue'
import { createNusaAdmin } from 'nusa-admin'
import 'nusa-admin/style.css'
import './demo.css'
import App from './App.vue'
import { router } from './router'

createApp(App)
  .use(router)
  // registerComponents: false → pages import what they use, so the bundle tree-shakes.
  .use(createNusaAdmin({ registerComponents: false }))
  .mount('#app')
