import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import NuAccordion from '../src/components/NuAccordion.vue'
import NuCalendar from '../src/components/NuCalendar.vue'
import NuRating from '../src/components/NuRating.vue'
import NuSteps from '../src/components/NuSteps.vue'
import NuTagInput from '../src/components/NuTagInput.vue'

describe('NuTagInput', () => {
  const type = async (w: ReturnType<typeof mount>, text: string, key = 'Enter') => {
    const input = w.find('input')
    await input.setValue(text)
    await input.trigger('keydown', { key })
  }

  it('adds a trimmed tag on Enter and on comma', async () => {
    const w = mount(NuTagInput, { props: { modelValue: ['vue'] } })
    await type(w, '  vite ')
    expect(w.emitted('update:modelValue')![0]).toEqual([['vue', 'vite']])
    await type(w, 'bun', ',')
    expect(w.emitted('update:modelValue')![1]).toEqual([['vue', 'vite', 'bun']])
  })

  it('ignores duplicates and blank input', async () => {
    const w = mount(NuTagInput, { props: { modelValue: ['vue'] } })
    await type(w, 'vue')
    await type(w, '   ')
    expect(w.emitted('update:modelValue')).toBeUndefined()
  })

  it('removes the last tag on Backspace in an empty field, and a tag via its button', async () => {
    const w = mount(NuTagInput, { props: { modelValue: ['vue', 'vite'] } })
    await w.find('input').trigger('keydown', { key: 'Backspace' })
    expect(w.emitted('update:modelValue')![0]).toEqual([['vue']])
    await w.find('[aria-label="Remove vue"]').trigger('click')
    expect(w.emitted('update:modelValue')![1]).toEqual([[]])
  })
})

describe('NuCalendar', () => {
  it('renders six weeks starting on the configured weekday', () => {
    const w = mount(NuCalendar, { props: { modelValue: '2026-11-16', weekStart: 1 } })
    const days = w.findAll('.nu-calendar__day')
    expect(days).toHaveLength(42)
    // November 2026 starts on a Sunday, so a Monday-first grid opens on 26 Oct.
    expect(days[0]!.attributes('aria-label')).toBe('2026-10-26')
    expect(w.find('.nu-calendar__title').text()).toBe('November 2026')
  })

  it('starts on Sunday when weekStart is 0', () => {
    const w = mount(NuCalendar, { props: { modelValue: '2026-11-16', weekStart: 0 } })
    expect(w.findAll('.nu-calendar__day')[0]!.attributes('aria-label')).toBe('2026-11-01')
  })

  it('places events on their day and emits them on click', async () => {
    const event = { date: '2026-11-19', title: 'Release' }
    const w = mount(NuCalendar, { props: { modelValue: '2026-11-16', events: [event] } })
    const day = w.find('[aria-label="2026-11-19"]')
    expect(day.find('.nu-calendar__event').text()).toBe('Release')
    await day.find('.nu-calendar__event').trigger('click')
    expect(w.emitted('event-click')).toEqual([[event]])
    expect(w.emitted('update:modelValue')).toBeUndefined()
  })

  it('selects a day and moves between months', async () => {
    const w = mount(NuCalendar, { props: { modelValue: '2026-11-16' } })
    await w.find('[aria-label="2026-11-20"]').trigger('click')
    expect(w.emitted('update:modelValue')).toEqual([['2026-11-20']])
    expect(w.emitted('select')).toEqual([['2026-11-20']])
    await w.find('[aria-label="Next month"]').trigger('click')
    expect(w.find('.nu-calendar__title').text()).toBe('December 2026')
    await w.find('[aria-label="Previous month"]').trigger('click')
    await w.find('[aria-label="Previous month"]').trigger('click')
    expect(w.find('.nu-calendar__title').text()).toBe('October 2026')
  })
})

describe('NuAccordion', () => {
  const items = [
    { key: 'a', title: 'A', content: 'First' },
    { key: 'b', title: 'B', content: 'Second' },
  ]
  const openKeys = (w: ReturnType<typeof mount>) => w.findAll('.nu-accordion__item.is-open').map((n) => n.find('button').text())

  it('keeps one panel open at a time by default', async () => {
    const w = mount(NuAccordion, { props: { items, defaultOpen: ['a'] } })
    expect(openKeys(w)).toEqual(['A'])
    await w.findAll('button')[1]!.trigger('click')
    expect(openKeys(w)).toEqual(['B'])
    await w.findAll('button')[1]!.trigger('click')
    expect(openKeys(w)).toEqual([])
  })

  it('allows several open panels with `multiple`', async () => {
    const w = mount(NuAccordion, { props: { items, multiple: true } })
    await w.findAll('button')[0]!.trigger('click')
    await w.findAll('button')[1]!.trigger('click')
    expect(openKeys(w)).toEqual(['A', 'B'])
    expect(w.findAll('button')[0]!.attributes('aria-expanded')).toBe('true')
  })
})

describe('NuSteps / NuRating', () => {
  it('marks earlier steps done and only moves when clickable', async () => {
    const steps = [{ title: 'One' }, { title: 'Two' }, { title: 'Three' }]
    const w = mount(NuSteps, { props: { steps, modelValue: 1 } })
    const classes = w.findAll('.nu-steps__step').map((s) => s.classes().filter((c) => c.startsWith('is-')))
    expect(classes).toEqual([['is-done'], ['is-current'], []])
    await w.findAll('.nu-steps__btn')[2]!.trigger('click')
    expect(w.emitted('update:modelValue')).toBeUndefined()
    await w.setProps({ clickable: true })
    await w.findAll('.nu-steps__btn')[2]!.trigger('click')
    expect(w.emitted('update:modelValue')).toEqual([[2]])
  })

  it('sets a rating, and clears it when the same star is clicked again', async () => {
    const w = mount(NuRating, { props: { modelValue: 2 } })
    expect(w.findAll('.nu-rating__star.is-on')).toHaveLength(2)
    await w.findAll('.nu-rating__star')[3]!.trigger('click')
    expect(w.emitted('update:modelValue')![0]).toEqual([4])
    await w.findAll('.nu-rating__star')[3]!.trigger('click')
    expect(w.emitted('update:modelValue')![1]).toEqual([0])
  })
})
