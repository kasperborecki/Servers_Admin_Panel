<script setup>
import { computed } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();

const isDark = computed(() => theme.global.name.value === 'dark');

const toggleTheme = () => {
  theme.global.name.value = isDark.value ? 'light' : 'dark';
};

const icon = computed(() => (isDark.value ? 'mdi-brightness-2' : 'mdi-brightness-5'));
</script>

<template>
  <v-btn icon color="warning" @click="toggleTheme">
    <v-icon :icon="icon" />
  </v-btn>
</template>
