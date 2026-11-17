import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import NuDrawer from '../src/components/NuDrawer.vue'
import NuDropdown from '../src/components/NuDropdown.vue'
import NuModal from '../src/components/NuModal.vue'

const press = (key: string, target: EventTarget = document, init: KeyboardEventInit = {}) =>
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init }))
const settle = async () => {
  await nextTick()
  await nextTick()
}

// Unmount first so overlays release their scroll lock and key listeners.
enableAutoUnmount(afterEach)
afterEach(() => {
  document.body.innerHTML = ''
  document.body.removeAttribute('style')
})

describe('NuModal', () => {
  const Host = {
    components: { NuModal },
    props: { persistent: Boolean },
    data: () => ({ open: false }),
    template: `
      <button id="opener" @click="open = true">Open</button>
      <NuModal v-model="open" title="Invite" :persistent="persistent">
        <input id="first" /><button id="last">Send</button>
      </NuModal>`,
  }
  const openModal = async (props = {}) => {
    const w = mount(Host, { props, attachTo: document.body })
    const opener = w.find('#opener').element as HTMLElement
    opener.focus()
    await w.find('#opener').trigger('click')
    await settle()
    return { w, opener }
  }

  it('teleports to body, locks page scroll and moves focus into the dialog', async () => {
    await openModal()
    expect(document.querySelector('[role="dialog"]')).not.toBeNull()
    expect(document.body.style.overflow).toBe('hidden')
    expect(document.activeElement?.id).toBe('first')
  })

  it('closes on Escape, unlocks scroll and returns focus to the opener', async () => {
    const { opener } = await openModal()
    press('Escape')
    await settle()
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    expect(document.body.style.overflow).toBe('')
    expect(document.activeElement).toBe(opener)
  })

  it('ignores Escape when persistent', async () => {
    await openModal({ persistent: true })
    press('Escape')
    await settle()
    expect(document.querySelector('[role="dialog"]')).not.toBeNull()
  })

  it('wraps Tab from the last control back to the first, and Shift+Tab the other way', async () => {
    await openModal()
    const dialog = document.querySelector<HTMLElement>('[role="dialog"]')!
    const controls = dialog.querySelectorAll<HTMLElement>('button, input')
    const lastControl = controls[controls.length - 1]!
    const firstControl = controls[0]!
    lastControl.focus()
    press('Tab')
    expect(document.activeElement).toBe(firstControl)
    press('Tab', document, { shiftKey: true })
    expect(document.activeElement).toBe(lastControl)
  })

  it('closes on backdrop click but not on a click inside the dialog', async () => {
    await openModal()
    document.querySelector<HTMLElement>('.nu-modal__body')!.click()
    await settle()
    expect(document.querySelector('[role="dialog"]')).not.toBeNull()
    document.querySelector<HTMLElement>('.nu-modal')!.click()
    await settle()
    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })
})

describe('stacked overlays', () => {
  it('Escape closes only the topmost, and scroll stays locked until the last closes', async () => {
    const w = mount(
      {
        components: { NuModal, NuDrawer },
        data: () => ({ drawer: true, modal: true }),
        template: `<NuDrawer v-model="drawer" title="Filters">d</NuDrawer><NuModal v-model="modal" title="Confirm">m</NuModal>`,
      },
      { attachTo: document.body },
    )
    await settle()
    press('Escape')
    await settle()
    expect((w.vm as any).modal).toBe(false)
    expect((w.vm as any).drawer).toBe(true)
    expect(document.body.style.overflow).toBe('hidden')
    press('Escape')
    await settle()
    expect((w.vm as any).drawer).toBe(false)
    expect(document.body.style.overflow).toBe('')
  })
})

describe('NuDropdown', () => {
  const mountMenu = () =>
    mount(NuDropdown, {
      attachTo: document.body,
      slots: {
        trigger: '<button id="trigger">Actions</button>',
        default: '<button role="menuitem">One</button><button role="menuitem">Two</button><button role="menuitem" disabled>Off</button>',
      },
    })
  const focused = () => document.activeElement?.textContent

  it('opens on click and closes when an item is chosen', async () => {
    const w = mountMenu()
    await w.find('#trigger').trigger('click')
    expect(w.find('[role="menu"]').exists()).toBe(true)
    await w.findAll('[role="menuitem"]')[0]!.trigger('click')
    expect(w.find('[role="menu"]').exists()).toBe(false)
  })

  it('opens with ArrowDown and moves through enabled items, wrapping at the ends', async () => {
    const w = mountMenu()
    ;(w.find('#trigger').element as HTMLElement).focus()
    await w.find('#trigger').trigger('keydown', { key: 'ArrowDown' })
    await settle()
    expect(focused()).toBe('One')
    await w.find('[role="menu"]').trigger('keydown', { key: 'ArrowDown' })
    expect(focused()).toBe('Two')
    await w.find('[role="menu"]').trigger('keydown', { key: 'ArrowDown' })
    expect(focused()).toBe('One')
    await w.find('[role="menu"]').trigger('keydown', { key: 'ArrowUp' })
    expect(focused()).toBe('Two')
  })

  it('closes on Escape and returns focus to the trigger', async () => {
    const w = mountMenu()
    await w.find('#trigger').trigger('click')
    press('Escape')
    await settle()
    expect(w.find('[role="menu"]').exists()).toBe(false)
    expect(document.activeElement?.id).toBe('trigger')
  })

  it('closes on an outside pointer press', async () => {
    const w = mountMenu()
    await w.find('#trigger').trigger('click')
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    await settle()
    expect(w.find('[role="menu"]').exists()).toBe(false)
  })
})
