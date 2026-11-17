<script setup lang="ts">
import { Github, Plus, Trash2, Twitter, Facebook } from 'lucide-vue-next'
import {
  NuAvatar, NuAvatarGroup, NuBadge, NuButton, NuCard, NuDivider, NuPageHeader, NuProgress, NuProgressRing, NuSpinner,
  type NuColor,
} from 'nusa-admin'

const colors: NuColor[] = ['primary', 'secondary', 'success', 'warning', 'danger', 'info']
const variants = ['solid', 'soft', 'outline', 'ghost'] as const
</script>

<template>
  <NuPageHeader
    title="General"
    subtitle="Buttons, badges, avatars, progress and typography."
    :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'UI Elements' }, { label: 'General' }]"
  />

  <div class="nu-row">
    <div class="nu-col-lg-6 nu-stack">
      <NuCard title="Buttons">
        <div class="nu-stack" style="--nu-gap: 8px">
          <div v-for="v in variants" :key="v" class="nu-cluster">
            <NuButton v-for="c in colors" :key="c" :color="c" :variant="v">{{ c }}</NuButton>
          </div>
          <NuDivider label="Sizes &amp; states" />
          <div class="nu-cluster">
            <NuButton size="sm">Small</NuButton>
            <NuButton>Medium</NuButton>
            <NuButton size="lg">Large</NuButton>
            <NuButton :icon="Plus">With icon</NuButton>
            <NuButton :icon="Trash2" color="danger" variant="soft" square aria-label="Delete" />
            <NuButton loading>Saving</NuButton>
            <NuButton disabled>Disabled</NuButton>
          </div>
          <NuDivider label="Social" />
          <div class="nu-cluster">
            <NuButton :icon="Github" color="secondary">GitHub</NuButton>
            <NuButton :icon="Twitter" color="info">Twitter</NuButton>
            <NuButton :icon="Facebook" variant="outline">Facebook</NuButton>
          </div>
          <NuButton block variant="soft">Block button</NuButton>
        </div>
      </NuCard>

      <NuCard title="Badges">
        <div class="nu-stack" style="--nu-gap: 8px">
          <div class="nu-cluster"><NuBadge v-for="c in colors" :key="c" :color="c">{{ c }}</NuBadge></div>
          <div class="nu-cluster"><NuBadge v-for="c in colors" :key="c" :color="c" variant="solid">{{ c }}</NuBadge></div>
          <div class="nu-cluster"><NuBadge v-for="c in colors" :key="c" :color="c" variant="outline" dot>{{ c }}</NuBadge></div>
          <div class="nu-cluster"><NuBadge v-for="c in colors" :key="c" :color="c" variant="solid" pill>{{ c }}</NuBadge></div>
        </div>
      </NuCard>

      <NuCard title="Avatars">
        <div class="nu-stack" style="--nu-gap: 10px">
          <div class="nu-cluster">
            <NuAvatar name="Ayu Lestari" :size="24" />
            <NuAvatar name="Budi Santoso" color="success" status="online" />
            <NuAvatar name="Citra Dewi" color="warning" :size="44" status="away" />
            <NuAvatar name="Dimas Pratama" color="danger" :size="52" status="busy" />
            <NuAvatar name="Eka Putri" color="info" :size="44" square />
          </div>
          <NuAvatarGroup :names="['Ayu Lestari', 'Budi Santoso', 'Citra Dewi', 'Dimas Pratama', 'Eka Putri', 'Fajar Nugroho']" />
        </div>
      </NuCard>
    </div>

    <div class="nu-col-lg-6 nu-stack">
      <NuCard title="Typography">
        <div class="nu-stack" style="--nu-gap: 6px">
          <h1>Heading 1</h1>
          <h2>Heading 2</h2>
          <h3>Heading 3</h3>
          <h4>Heading 4</h4>
          <p>Body text. Nusa Admin uses the system font stack by default; set <code>--nu-font</code> to change it.</p>
          <p class="nu-text-muted">Muted text for secondary information.</p>
          <p class="nu-text-sm">Small text · <a href="#">a link</a> · <kbd>Ctrl</kbd> + <kbd>K</kbd></p>
        </div>
      </NuCard>

      <NuCard title="Progress">
        <div class="nu-stack" style="--nu-gap: 10px">
          <NuProgress label="Primary" :value="72" show-value />
          <NuProgress label="Success" :value="48" color="success" show-value />
          <NuProgress label="Danger, thin" :value="90" color="danger" :height="4" show-value />
          <div class="nu-cluster" style="--nu-gap: 16px">
            <NuProgressRing :value="72" label="Primary" />
            <NuProgressRing :value="48" color="success" label="Success" />
            <NuProgressRing :value="90" color="danger" :size="48" :thickness="5" label="Danger" />
            <NuProgressRing :value="30" color="warning" :size="80" :thickness="8" label="Warning" />
          </div>
        </div>
      </NuCard>

      <NuCard title="Spinners">
        <div class="nu-cluster" style="--nu-gap: 14px">
          <NuSpinner :size="14" />
          <NuSpinner />
          <NuSpinner :size="28" color="success" />
          <NuSpinner :size="36" color="danger" />
        </div>
      </NuCard>
    </div>
  </div>
</template>
