<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const languages = [
  { code: 'pl', name: 'Polski' },
  { code: 'en', name: 'English' },
];

const { locale, setLocale } = useI18n();

const language = computed({
  get: () => locale.value,
  set: (value) => setLocale(value),
});
</script>

<template>
  <v-select
    v-model="language"
    :items="languages"
    item-title="name"
    item-value="code"
    variant="plain"
    hide-details
    density="compact"
    class="text-body-1"
    style="max-width: 120px;"
  />
</template>

<style scoped>
.v-input--plain .v-field__input {
  padding: 0;          
  min-height: auto;    
}
</style>
