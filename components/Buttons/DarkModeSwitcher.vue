<script setup>
import { ref } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();

// Lista motywów z kodami i nazwami do wyświetlania
const themes = ref([
  { value: 'light', title: 'Light Mode' },
  { value: 'dark', title: 'Dark Mode' },
]);

const selectedTheme = ref(theme.global.name.value);

const changeTheme = (value) => {
  theme.global.name.value = value;
};
</script>

<template>
  <v-select
    v-model="selectedTheme"
    :items="themes"
    item-title="title"
    item-value="value"
    variant="plain"
    hide-details
    density="compact"
    class="text-body-1"
    style="max-width: 120px;"
    @update:model-value="changeTheme"
  />
</template>

<style scoped>
.v-input--plain .v-field__input {
  padding: 0;
  min-height: auto;
}
</style>
