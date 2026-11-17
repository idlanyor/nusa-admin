# Forms and validation

Inputs: `NuInput` (with `mask`), `NuTextarea`, `NuSelect`, `NuCombobox` (searchable, multiple), `NuDatePicker` (single or `range`), `NuEditor` (rich text), `NuCodeEditor`, `NuCheckbox`, `NuSwitch`, `NuRadioGroup`, `NuSlider`, `NuTagInput`, `NuTransfer`, `NuFileUpload`, `NuRating`. All take `label`, `hint` and `error`.

## useForm

```ts
import { rules, useForm } from 'nusa-admin'

const form = useForm(
  { name: '', email: '', password: '', confirm: '' },
  {
    name: [rules.required()],
    email: [rules.required(), rules.email()],
    password: [rules.required(), rules.minLength(8)],
    confirm: [rules.sameAs('password', 'Passwords do not match.')],
  },
)
const save = form.handleSubmit(async (values) => api.createUser(values))
```

```vue
<form novalidate @submit.prevent="save">
  <NuInput v-bind="form.field('name')" label="Name" />
  <NuInput v-bind="form.field('email')" label="Email" type="email" />
  <NuButton type="submit" :loading="form.submitting.value">Save</NuButton>
</form>
```

- Fields validate on blur, then live once touched. Fields that compare with another (like `sameAs`) re-check when it changes.
- Submitting validates everything and focuses the first invalid control; the handler only runs when valid.
- Rules: `required`, `email`, `minLength`, `maxLength`, `min`, `max`, `pattern`, `sameAs`, or any `(value, values) => true | 'message'`. Messages follow the active language.
- `form.values`, `form.errors`, `form.reset()`, `form.validate()`, `form.isValid`.

## Masks

`<NuInput v-model="card" mask="9999 9999 9999 9999" />` — `9` digit, `a` letter, `*` either; everything else is a literal.
