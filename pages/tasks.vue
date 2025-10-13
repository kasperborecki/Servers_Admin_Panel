<script setup >
import TasksTable from '../components/Table/tasksTable.vue'

const headers = [
  { title: $t('header_id'), key: "id", align: "center", sortable: true  },
  { title: $t('header_name'), key: "name", align: "center", sortable: true },
  { title: $t('header_createdAt'), key: "createdAt", align: "center", sortable: true },
  { title: $t('header_modifiedAt'), key: "modifiedAt", align: "center", sortable: true },
  { title: $t('header_applicationId'), key: "applicationId", align: "center", sortable: true },
  { title: $t('header_serverId'), key: "serverId", align: "center", sortable: true },
  
];

</script>


<template>
    <v-app class="app">
        <v-container>
            <TasksTable :headers="headers"/>
        </v-container>
    </v-app>
</template>

<style scoped>
.app{
  background-size: cover;
  background-image: url('../assets/photo-1508739773434-c26b3d09e071.jpg');
}
</style>