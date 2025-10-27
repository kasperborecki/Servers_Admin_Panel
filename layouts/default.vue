<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import LangSwitcher from "~/components/Buttons/LangSwitcher.vue";
import DarkModeSwitcher from "~/components/Buttons/DarkModeSwitcher.vue";

const router = useRouter();
const auth = useAuth();
const drawer = ref(false);
const { locale } = useI18n();
const defaultLang = "pl";

const user = ref(auth.data.value);

watch(
  () => auth.data.value,
  (newVal) => {
    user.value = newVal;
  }
);

const logout = async () => {
  try {
    await auth.signOut({ redirect: false });
    navigate("/login");
    
  } catch (err) {
    console.error(err);
  }
};

const goToResetPassword = async () => {
    router.push("/resetPassword");

};



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
      <LangSwitcher />

      <v-btn
        v-if="!user"
        icon
        color="primary"
        class="ml-4"
        @click="navigate('/login')"
      >
        <v-icon size="x-large">mdi-account-circle</v-icon>
      </v-btn>

      <div v-else class="d-flex align-center gap-3 ml-6">
        <v-menu offset-y>
          <template #activator="{ props }">
            <v-avatar
              v-bind="props"
              size="40"
              color="red"
              class="cursor-pointer"
            >
              {{ (user.firstname || "?").charAt(0).toUpperCase() }}
            </v-avatar>
          </template>
          <v-list>
            <v-list-item @click="logout" color="primary">
              <template v-slot:prepend>
                <v-icon>mdi-logout</v-icon>
              </template>
              <v-list-item-title>Wyloguj</v-list-item-title>
            </v-list-item>
             <v-list-item @click="goToResetPassword" color="primary">
              <template v-slot:prepend>
                <v-icon>mdi-lock</v-icon>
              </template>
              <v-list-item-title>Zmień hasło</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <DarkModeSwitcher class="ml-2" />
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
        <v-list-item @click="navigate('/import')">
          <v-list-item-title>Import</v-list-item-title>
        </v-list-item>
        <v-list-item @click="navigate('/pdfViewer')">
          <v-list-item-title>PDF Viewer</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>
