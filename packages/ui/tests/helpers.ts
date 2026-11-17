import { mount, type ComponentMountingOptions } from '@vue/test-utils'
import type { Component } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'

/** Mount with a router installed (components that render RouterLink need one). */
export async function mountWithRouter<C extends Component>(component: C, options: ComponentMountingOptions<C> = {}) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/users', component: { template: '<div />' } },
      { path: '/users/roles', component: { template: '<div />' } },
    ],
  })
  router.push('/')
  await router.isReady()
  const wrapper = mount(component as any, {
    ...options,
    global: { ...options.global, plugins: [...(options.global?.plugins ?? []), router] },
  } as any)
  return { wrapper, router }
}
