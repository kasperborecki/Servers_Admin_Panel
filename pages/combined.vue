<script setup>
import CombinedTable from '~/components/Table/combinedTable.vue';

const headers = [
  { title: $t('header_select'), key: 'select', align: 'center', width: '50' },
  { title: $t('header_serverName'), key: 'serverName', align: 'center', sortable: true },
  { title: $t('header_country'), key: 'country', align: 'center', sortable: true },
  { title: $t('header_ipAddress'), key: 'ipAddress', align: 'center', sortable: true },
  { title: $t('header_os'), key: 'os', align: 'center', sortable: true },
  { title: $t('header_serverCreatedAt'), key: 'serverCreatedAt', align: 'center', sortable: true },
  { title: $t('header_applicationName'), key: 'applicationName', align: 'center', sortable: true },
  { title: $t('header_applicationCreatedAt'), key: 'applicationCreatedAt', align: 'center', sortable: true },
  { title: $t('header_taskName'), key: 'taskName', align: 'center', sortable: true },
  { title: $t('header_task_description'), key: 'taskDescription', align: 'center', sortable: true,  class: 'task-description-column', width: '300px' },
  { title: $t('header_taskCreatedAt'), key: 'taskCreatedAt', align: 'center', sortable: true },
]
</script>

<template>
  <v-app class="app">
    <v-container>
      <CombinedTable :headers="headers" />
    </v-container>
  </v-app>
</template>

<style scoped>
.app {
  background-size: cover;
  background-image: url('../assets/photo-1508739773434-c26b3d09e071.jpg');
}
</style>
