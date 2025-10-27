<script setup>
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import ServerTable from "../components/Table/serverTable.vue"

const { t } = useI18n()
const route = useRoute()

const serverId = route.query.serverId || null

const headers = [
  { title: t('header_id'), key: "id", align: "center", sortable: true },
  { title: t('header_name'), key: "name", align: "center" },
  { title: t('header_createdAt'), key: "createdAt", align: "center", sortable: true },
  { title: t('header_modifiedAt'), key: "modifiedAt", align: "center", sortable: true },
  { title: t('header_status'), key: "status", align: "center" },
  { title: t('header_details'), key: "check", align: "center" },
  { title: t('header_actions'), key: "actions", align: "center" }
]
</script>

<template>
  <v-app>
    <v-main class="container">
      <server-table :headers="headers" :server-id="serverId" />
    </v-main>
  </v-app>
</template>

<style scoped>
.container {
  background-size: cover;
  background-image: url('../assets/photo-1508739773434-c26b3d09e071.jpg');
}
</style>
