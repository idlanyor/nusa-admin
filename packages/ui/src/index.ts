import type { App, Plugin } from 'vue'
import './styles/index.css'

import NuAccordion from './components/NuAccordion.vue'
import NuAuthLayout from './components/NuAuthLayout.vue'
import NuAvatarGroup from './components/NuAvatarGroup.vue'
import NuBreadcrumb from './components/NuBreadcrumb.vue'
import NuCalendar from './components/NuCalendar.vue'
import NuCustomizer from './components/NuCustomizer.vue'
import NuDescriptions from './components/NuDescriptions.vue'
import NuDivider from './components/NuDivider.vue'
import NuDrawer from './components/NuDrawer.vue'
import NuEmpty from './components/NuEmpty.vue'
import NuErrorPage from './components/NuErrorPage.vue'
import NuFileUpload from './components/NuFileUpload.vue'
import NuInfoBox from './components/NuInfoBox.vue'
import NuList from './components/NuList.vue'
import NuListItem from './components/NuListItem.vue'
import NuProgressRing from './components/NuProgressRing.vue'
import NuRadioGroup from './components/NuRadioGroup.vue'
import NuRating from './components/NuRating.vue'
import NuSegmented from './components/NuSegmented.vue'
import NuSkeleton from './components/NuSkeleton.vue'
import NuSlider from './components/NuSlider.vue'
import NuSpinner from './components/NuSpinner.vue'
import NuSteps from './components/NuSteps.vue'
import NuTagInput from './components/NuTagInput.vue'
import NuTooltip from './components/NuTooltip.vue'
import NuCallout from './components/NuCallout.vue'
import NuCombobox from './components/NuCombobox.vue'
import NuDatePicker from './components/NuDatePicker.vue'
import NuDirectChat from './components/NuDirectChat.vue'
import NuEditor from './components/NuEditor.vue'
import NuRibbon from './components/NuRibbon.vue'
import NuRouteProgress from './components/NuRouteProgress.vue'
import NuSmallBox from './components/NuSmallBox.vue'
import NuTodoList from './components/NuTodoList.vue'
import NuTopNav from './components/NuTopNav.vue'
import NuUserCard from './components/NuUserCard.vue'
import NuCodeEditor from './components/NuCodeEditor.vue'
import NuTransfer from './components/NuTransfer.vue'
import NuGeoMap from './components/NuGeoMap.vue'
import NuCommandPalette from './components/NuCommandPalette.vue'
import NuAlert from './components/NuAlert.vue'
import NuAvatar from './components/NuAvatar.vue'
import NuBadge from './components/NuBadge.vue'
import NuButton from './components/NuButton.vue'
import NuCard from './components/NuCard.vue'
import NuChart from './components/NuChart.vue'
import NuCheckbox from './components/NuCheckbox.vue'
import NuDonut from './components/NuDonut.vue'
import NuDropdown from './components/NuDropdown.vue'
import NuDropdownItem from './components/NuDropdownItem.vue'
import NuIcon from './components/NuIcon.vue'
import NuIconButton from './components/NuIconButton.vue'
import NuInput from './components/NuInput.vue'
import NuLayout from './components/NuLayout.vue'
import NuSidebarMenuItem from './components/NuMenuItem.vue'
import NuModal from './components/NuModal.vue'
import NuNavbar from './components/NuNavbar.vue'
import NuPageHeader from './components/NuPageHeader.vue'
import NuPagination from './components/NuPagination.vue'
import NuProgress from './components/NuProgress.vue'
import NuSelect from './components/NuSelect.vue'
import NuSidebar from './components/NuSidebar.vue'
import NuSparkline from './components/NuSparkline.vue'
import NuStatCard from './components/NuStatCard.vue'
import NuSwitch from './components/NuSwitch.vue'
import NuTable from './components/NuTable.vue'
import NuTabs from './components/NuTabs.vue'
import NuTextarea from './components/NuTextarea.vue'
import NuTimeline from './components/NuTimeline.vue'
import NuToastHost from './components/NuToastHost.vue'
import { useTheme, type NuThemeMode } from './composables/useTheme'
import { useLocale } from './composables/useLocale'
import type { NuMessages } from './locales'
import { useLayout, type NuLayoutOption, type NuSidebarVariant } from './composables/useLayout'

export {
  NuAlert, NuAvatar, NuBadge, NuButton, NuCard, NuChart, NuCheckbox, NuDonut, NuDropdown, NuDropdownItem,
  NuIcon, NuIconButton, NuInput, NuLayout, NuModal, NuNavbar, NuPageHeader, NuPagination,
  NuProgress, NuSelect, NuSidebar, NuSidebarMenuItem, NuSparkline, NuStatCard, NuSwitch, NuTable, NuTabs, NuTextarea,
  NuTimeline, NuToastHost,
  NuAccordion, NuAuthLayout, NuAvatarGroup, NuBreadcrumb, NuCalendar, NuCustomizer, NuDescriptions, NuDivider, NuDrawer, NuEmpty, NuErrorPage, NuFileUpload, NuInfoBox, NuList, NuListItem, NuProgressRing, NuRadioGroup, NuRating, NuSegmented, NuSkeleton, NuSlider, NuSpinner, NuSteps, NuTagInput, NuTooltip,
  NuCallout, NuCombobox, NuDatePicker, NuDirectChat, NuEditor, NuRibbon, NuRouteProgress, NuSmallBox, NuTodoList, NuTopNav, NuUserCard, NuCodeEditor, NuTransfer, NuGeoMap, NuCommandPalette,
}

export { useTheme, useLayout }
export { useToast } from './composables/useToast'
export { useElementWidth } from './composables/useElementWidth'
export { useOverlay } from './composables/useOverlay'
export { useForm, rules } from './composables/useForm'
export { useLocale, t } from './composables/useLocale'
export type { NuMessages, NuMessageKey } from './locales'
export { applyMask, unmask } from './utils/mask'
export { toCsv, downloadText } from './utils/csv'
export { filterMenu } from './utils/menu'
export type { NuRule } from './composables/useForm'
export type { NuThemeMode } from './composables/useTheme'
export type { NuSidebarVariant, NuLayoutOption } from './composables/useLayout'
export type { NuToast, NuToastInput } from './composables/useToast'
export type { NuIconName } from './components/NuIcon.vue'
export type { NuAccordionItem } from './components/NuAccordion.vue'
export type { NuCalendarEvent } from './components/NuCalendar.vue'
export type { NuDescriptionItem } from './components/NuDescriptions.vue'
export type { NuStep } from './components/NuSteps.vue'
export type { NuTodo } from './components/NuTodoList.vue'
export type { NuTableSort } from './components/NuTable.vue'
export type { NuGeoFeature } from './components/NuGeoMap.vue'
export type { NuCommand } from './components/NuCommandPalette.vue'
export type { NuChatMessage } from './components/NuDirectChat.vue'
export type * from './types'

const components = {
  NuAlert, NuAvatar, NuBadge, NuButton, NuCard, NuChart, NuCheckbox, NuDonut, NuDropdown, NuDropdownItem,
  NuIcon, NuIconButton, NuInput, NuLayout, NuModal, NuNavbar, NuPageHeader, NuPagination,
  NuProgress, NuSelect, NuSidebar, NuSidebarMenuItem, NuSparkline, NuStatCard, NuSwitch, NuTable, NuTabs, NuTextarea,
  NuTimeline, NuToastHost,
  NuAccordion, NuAuthLayout, NuAvatarGroup, NuBreadcrumb, NuCalendar, NuCustomizer, NuDescriptions, NuDivider, NuDrawer, NuEmpty, NuErrorPage, NuFileUpload, NuInfoBox, NuList, NuListItem, NuProgressRing, NuRadioGroup, NuRating, NuSegmented, NuSkeleton, NuSlider, NuSpinner, NuSteps, NuTagInput, NuTooltip,
  NuCallout, NuCombobox, NuDatePicker, NuDirectChat, NuEditor, NuRibbon, NuRouteProgress, NuSmallBox, NuTodoList, NuTopNav, NuUserCard, NuCodeEditor, NuTransfer, NuGeoMap, NuCommandPalette,
}

export interface NusaAdminOptions {
  /** Theme mode used when the visitor has no saved preference. */
  theme?: NuThemeMode
  /** Brand color (any CSS color) used when the visitor has no saved preference. */
  primary?: string
  sidebarVariant?: NuSidebarVariant
  /** Language for built-in text (`en`, `id`, or one added with `messages`). */
  locale?: string
  /** Extra or overriding translations, e.g. `{ ms: { close: 'Tutup' } }`. */
  messages?: Record<string, Partial<NuMessages>>
  /** Default layout options (top nav, boxed, fixed parts…) for visitors without a saved preference. */
  layout?: Partial<Record<NuLayoutOption, boolean>>
  /** Register every Nu* component globally. Default true; set false and import per-file to tree-shake. */
  registerComponents?: boolean
}

/** `app.use(createNusaAdmin({ primary: '#0d9488' }))` */
export function createNusaAdmin(options: NusaAdminOptions = {}): Plugin {
  return {
    install(app: App) {
      useTheme().setDefaults({ mode: options.theme, primary: options.primary })
      const i18n = useLocale()
      for (const [code, msgs] of Object.entries(options.messages ?? {})) i18n.addMessages(code, msgs)
      if (options.locale) i18n.setDefaultLocale(options.locale)
      useLayout().setDefaults({ sidebarVariant: options.sidebarVariant, ...options.layout })

      if (options.registerComponents !== false) {
        for (const [name, component] of Object.entries(components)) app.component(name, component)
      }
    },
  }
}
