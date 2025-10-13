<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import LangSwitcher from "~/components/Buttons/LangSwitcher.vue";
import DarkModeSwitcher from "~/components/Buttons/DarkModeSwitcher.vue";

const drawer = ref(false);
const router = useRouter();
const { locale } = useI18n();
const defaultLang = "pl";

const navigate = (path) => {
  const prefix = locale.value === defaultLang ? "" : `/${locale.value}`;
  router.push(`${prefix}${path}`);
  drawer.value = false;
};
</script>

<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title>Vectio Server Box</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <v-list-item @click="navigate('/')">
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item @click="navigate('/applications')">
          <v-list-item-title>Applications</v-list-item-title>
        </v-list-item>
        <v-list-item @click="navigate('/tasks')">
          <v-list-item-title>Tasks</v-list-item-title>
        </v-list-item>
         <v-list-item @click="navigate('/combined')">
          <v-list-item-title>Combined</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-spacer></v-spacer>
      <div class="d-flex justify-center position-absolute bottom-0 mb-4 w-100">
        <LangSwitcher />
        <DarkModeSwitcher class="ml-2" />
      </div>
    </v-navigation-drawer>

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>
