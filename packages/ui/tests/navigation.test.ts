import { describe, expect, it } from 'vitest'
import NuButton from '../src/components/NuButton.vue'
import NuSidebar from '../src/components/NuSidebar.vue'
import { mountWithRouter } from './helpers'

describe('NuButton', () => {
  it('renders a button, a link or a router link depending on props', async () => {
    const plain = (await mountWithRouter(NuButton, { slots: { default: 'Save' } })).wrapper
    expect(plain.element.tagName).toBe('BUTTON')
    expect(plain.attributes('type')).toBe('button')

    const link = (await mountWithRouter(NuButton, { props: { href: 'https://example.com' }, slots: { default: 'Docs' } })).wrapper
    expect(link.element.tagName).toBe('A')

    const route = (await mountWithRouter(NuButton, { props: { to: '/users' }, slots: { default: 'Users' } })).wrapper
    expect(route.attributes('href')).toBe('/users')
  })

  it('is disabled and busy while loading', async () => {
    const { wrapper } = await mountWithRouter(NuButton, { props: { loading: true }, slots: { default: 'Save' } })
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.find('.nu-btn__spinner').exists()).toBe(true)
  })
})

describe('NuSidebar menu', () => {
  const menu = [
    { label: 'Home', to: '/' },
    { label: 'Management', header: true },
    { label: 'Users', badge: 3, children: [{ label: 'All users', to: '/users' }, { label: 'Roles', to: '/users/roles' }] },
  ]

  it('renders headers, badges and marks the current route', async () => {
    const { wrapper } = await mountWithRouter(NuSidebar, { props: { menu } })
    expect(wrapper.find('.nu-menu__header').text()).toBe('Management')
    expect(wrapper.find('.nu-menu__badge').text()).toBe('3')
    expect(wrapper.find('[aria-current="page"]').text()).toBe('Home')
  })

  it('opens a group when one of its children becomes the active route', async () => {
    const { wrapper, router } = await mountWithRouter(NuSidebar, { props: { menu } })
    const group = wrapper.findAll('.nu-menu__item')[1]!
    expect(group.classes()).not.toContain('is-open')
    await router.push('/users/roles')
    await wrapper.vm.$nextTick()
    expect(group.classes()).toContain('is-open')
    expect(wrapper.find('[aria-current="page"]').text()).toBe('Roles')
  })

  it('toggles a group on click', async () => {
    const { wrapper } = await mountWithRouter(NuSidebar, { props: { menu } })
    const toggle = wrapper.find('button.nu-menu__link')
    await toggle.trigger('click')
    expect(toggle.attributes('aria-expanded')).toBe('true')
    await toggle.trigger('click')
    expect(toggle.attributes('aria-expanded')).toBe('false')
  })
})
