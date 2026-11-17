import { createApp } from 'vue'
import { createNusaAdmin } from 'nusa-admin'
import 'nusa-admin/style.css'
import App from './App.vue'
import { router } from './router'

createApp(App)
  .use(router)
  // Pages import the components they use, so the bundle tree-shakes.
  .use(createNusaAdmin({ registerComponents: false }))
  .mount('#app')
