import { computed, nextTick, reactive, ref } from 'vue'

/** A rule returns `true` when the value is valid, otherwise the error message. */
export type NuRule = (value: any, values: Record<string, any>) => true | string

const isEmpty = (v: unknown) => v === undefined || v === null || v === '' || v === false || (Array.isArray(v) && v.length === 0)

/** Built-in rules. Every one except `required` passes on empty values, so combine with `required()` when needed. */
export const rules = {
  required: (msg = 'This field is required.'): NuRule => (v) => (isEmpty(v) ? msg : true),
  email: (msg = 'Enter a valid email address.'): NuRule => (v) => (isEmpty(v) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)) ? true : msg),
  minLength: (n: number, msg = `Use at least ${n} characters.`): NuRule => (v) => (isEmpty(v) || String(v).length >= n ? true : msg),
  maxLength: (n: number, msg = `Use at most ${n} characters.`): NuRule => (v) => (isEmpty(v) || String(v).length <= n ? true : msg),
  min: (n: number, msg = `Must be at least ${n}.`): NuRule => (v) => (isEmpty(v) || Number(v) >= n ? true : msg),
  max: (n: number, msg = `Must be at most ${n}.`): NuRule => (v) => (isEmpty(v) || Number(v) <= n ? true : msg),
  pattern: (re: RegExp, msg = 'The format is not valid.'): NuRule => (v) => (isEmpty(v) || re.test(String(v)) ? true : msg),
  sameAs: (field: string, msg = 'The values do not match.'): NuRule => (v, values) => (v === values[field] ? true : msg),
}

/**
 * Form state + validation.
 *
 *   const form = useForm({ email: '' }, { email: [rules.required(), rules.email()] })
 *   <form @submit.prevent="form.handleSubmit(save)">
 *     <NuInput v-bind="form.field('email')" label="Email" />
 *
 * Fields validate on blur, then live once touched; submitting validates everything and
 * focuses the first invalid control.
 */
export function useForm<T extends Record<string, any>>(initial: T, schema: Partial<Record<keyof T, NuRule[]>> = {}) {
  type Key = keyof T & string
  const clone = (v: T): T => JSON.parse(JSON.stringify(v))

  const values = reactive(clone(initial)) as T
  const errors = reactive({}) as Partial<Record<Key, string>>
  const touched = reactive({}) as Partial<Record<Key, boolean>>
  const submitting = ref(false)

  function validateField(name: Key): boolean {
    for (const rule of schema[name] ?? []) {
      const result = rule(values[name], values)
      if (result !== true) {
        errors[name] = result
        return false
      }
    }
    delete errors[name]
    return true
  }

  function validate(): boolean {
    let ok = true
    for (const name of Object.keys(schema) as Key[]) {
      touched[name] = true
      ok = validateField(name) && ok
    }
    return ok
  }

  function reset(next: T = initial) {
    Object.assign(values, clone(next))
    for (const k of Object.keys(errors)) delete errors[k as Key]
    for (const k of Object.keys(touched)) delete touched[k as Key]
  }

  /** Props for a Nu* input: value, update handler, blur validation and error. */
  function field<K extends Key>(name: K) {
    return {
      modelValue: values[name] as T[K],
      // `any`: each Nu* input emits its own value type; the form keeps whatever it receives.
      'onUpdate:modelValue': (v: any) => {
        ;(values as Record<string, unknown>)[name] = v
        if (touched[name]) validateField(name)
        // Re-check fields that compare against this one (e.g. "confirm password").
        for (const other of Object.keys(schema) as Key[]) if (other !== name && touched[other]) validateField(other)
      },
      onBlur: () => {
        touched[name] = true
        validateField(name)
      },
      error: errors[name],
    }
  }

  function handleSubmit(fn: (values: T) => unknown | Promise<unknown>) {
    return async () => {
      if (!validate()) {
        await nextTick()
        document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
        return
      }
      submitting.value = true
      try {
        await fn(values)
      } finally {
        submitting.value = false
      }
    }
  }

  const isValid = computed(() => Object.keys(errors).length === 0)

  return { values, errors, touched, submitting, isValid, validate, validateField, reset, field, handleSubmit }
}
