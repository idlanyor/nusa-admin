import { createApp } from 'vue'
import { createNusaAdmin } from 'nusa-admin'
import 'nusa-admin/style.css'
import './docs.css'
import App from './App.vue'
import { router } from './router'

createApp(App).use(router).use(createNusaAdmin({ registerComponents: false })).mount('#app')
