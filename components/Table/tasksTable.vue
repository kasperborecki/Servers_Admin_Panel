<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import addTaskPopup from "../Popup/addTaskPopup.vue";
import ContentDetailCard from "../Card/contentDetailCard.vue";
import { TasksRepository } from "../../repository/tasksRepository";
import { ApplicationRepository } from "~/repository/applicationRepository";
import { ServerRepository } from "~/repository/serverRepository";
import { useI18n } from "vue-i18n";


const props = defineProps({
  headers: { type: Array, required: true },
});

const { t } = useI18n();


const tasks = ref([]);
const selectedRowId = ref(null);
const error = ref("");
const searchQuery = ref("");
const dateRange = ref([]);
const appsIdsList = ref([]);
const serversIdsList = ref([]);
const isDetailsOpen = ref(false);
const page = ref(1);
const itemsPerPage = ref(10);
const loading = ref(false);
const sortBy = ref([]);
const totalItems = ref(0);

const snackbar = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("green");

const formattedDateRange = computed(() => {
  if (dateRange.value && dateRange.value.length >= 2) {
    const firstDate = new Date(dateRange.value[0]);
    const lastDate = dateRange.value[dateRange.value.length - 1];
    firstDate.setDate(firstDate.getDate() + 1);
    const fmt = (d) =>
      d instanceof Date ? d.toISOString().split("T")[0] : String(d);
    return `${fmt(firstDate)},${fmt(lastDate)}`;
  }
  return "";
});

const repo = new TasksRepository();
const appRepo = new ApplicationRepository();
const serverRepo = new ServerRepository();

async function fetchAllServersIds() {
  try {
    const data = await serverRepo.getAllServersIds();
    serversIdsList.value = data;
  } catch (err) {
    error.value = err?.message ?? "Nie udało się pobrać listy serwerów";
  }
}

async function fetchAllTasks() {
  loading.value = true;
  try {
    const columns = sortBy.value.map((s) => s.key);
    const directions = sortBy.value.map((s) =>
      s.order === "asc" ? "false" : "true"
    );

    const response = await repo.getAll(
      searchQuery.value,
      formattedDateRange.value,
      page.value,
      itemsPerPage.value,
      columns,
      directions
    );

    tasks.value = response.items || response;
    totalItems.value = response.totalCount || response.length;
  } catch (err) {
    error.value = err.message;
    console.error("Fetch error:", err);
  } finally {
    loading.value = false;
  }
}

async function fetchAllApplicationsIds() {
  try {
    const data = await appRepo.getAllApplicationsIds();
    appsIdsList.value = data;
  } catch (err) {
    error.value = err?.message ?? "Nie udało się pobrać listy aplikacji";
  }
}

async function postCreateTask(addedData) {
  try {
    await repo.addTask({
      ...addedData,
      serverId: addedData.serverId,
    });
    snackbarMessage.value = t("task_added_success");
    snackbarColor.value = "green";
    snackbar.value = true;
    fetchAllTasks();
  } catch (err) {
    error.value = err.message ?? "Nie udało się dodać zadania";
    snackbarMessage.value = t("task_added_error");
    snackbarColor.value = "red";
    snackbar.value = true;
  }
  fetchAllTasks();
}

async function updateTask(taskData) {
  try {
    await repo.updateTask(taskData);
    const currentId = selectedRowId.value;
    selectedRowId.value = null;
    await nextTick();
    selectedRowId.value = currentId;
    snackbarMessage.value = t("task_upadate_success");
    snackbarColor.value = "green";
    snackbar.value = true;
  } catch (err) {
    console.error("Błąd przy aktualizacji zadania:", err);
    snackbarMessage.value = t("task_update_error");
    snackbarColor.value = "red";
    snackbar.value = true;
  }
  fetchAllTasks();
}

async function deleteTask(selectedId) {
  try {
    await repo.deleteTask(selectedId);
    snackbarMessage.value = t("task_delete_success");
    snackbarColor.value = "green";
    snackbar.value = true;
    fetchAllTasks();
  } catch (err) {
    error.value = err.message;
    snackbarMessage.value = t("task_delete_error");
    snackbarColor.value = "red";
    snackbar.value = true;
  }
}

watch([page, itemsPerPage, sortBy, searchQuery, dateRange], fetchAllTasks);

onMounted(() => {
  fetchAllTasks();
  fetchAllServersIds();
  fetchAllApplicationsIds();
});

watch([page, itemsPerPage, searchQuery, dateRange], fetchAllTasks);

function onRowClick(item) {
  selectedRowId.value = item.id;
  isDetailsOpen.value = true;
}

function closeContentInfo() {
  isDetailsOpen.value = false;
}

function serverName(id) {
  const server = serversIdsList.value.find((server) => server.id === id);
  return server ? server.name : "Unknown Server";
}

function applicationName(id) {
  const application = appsIdsList.value.find(
    (application) => application.id === id
  );
  return application ? application.name : "Unknown Server";
}
</script>

<template>
  <v-container>
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      top
      right
      timeout="4000"
    >
      {{ snackbarMessage }}
      <template #action>
        <v-btn text @click="snackbar = false">{{ t("btn_close") }}</v-btn>
      </template>
    </v-snackbar>
    <v-row>
      <v-col :cols="isDetailsOpen && !loading ? 6 : 12">
        <v-card class="border rounded-xl">
          <div class="my-4 d-flex justify-center items-center flex-wrap ga-3">
            <addTaskPopup
              :appsIdsList="appsIdsList"
              :serversIdsList="serversIdsList"
              @add-content="postCreateTask"
            />
            <div
              class="border border-gray-300 rounded-xl d-flex justify-center"
              style="width: 250px"
            >
              <v-text-field
                :label="$t('input_search')"
                v-model="searchQuery"
                variant="solo"
                maxLength="100"
                flat
                bg-color="transparent"
                rounded="xl"
                density="comfortable"
                hide-details
              />
            </div>

            <v-menu :close-on-content-click="false">
              <template #activator="{ props: activatorProps }">
                <div
                  class="border border-gray-300 rounded-xl d-flex justify-center"
                  style="width: 250px"
                >
                  <v-text-field
                    v-bind="activatorProps"
                    :model-value="formattedDateRange"
                    :label="$t('input_dataRage')"
                    readonly
                    variant="solo"
                    flat
                    bg-color="transparent"
                    rounded="xl"
                    density="comfortable"
                    hide-details
                    clearable
                    @click:clear="dateRange = []"
                  />
                </div>
              </template>
              <v-date-picker
                v-model="dateRange"
                multiple="range"
                show-adjacent-months
              />
            </v-menu>
          </div>

          <v-data-table-server
            :headers="headers"
            :items="tasks"
            v-model:page="page"
            v-model:items-per-page="itemsPerPage"
            class="w-100"
            @click:row="(_, ctx) => onRowClick(ctx.item)"
            :server-items-length="totalItems"
            :loading="loading"
            v-model:sort-by="sortBy"
            multi-sort
          >
            <template #[`item.createdAt`]="{ item }">
              {{ item.createdAt.split("T")[0] }}
            </template>
            <template #[`item.modifiedAt`]="{ item }">
              {{ item.modifiedAt.split("T")[0] }}
            </template>
            <template #[`item.applicationId`]="{ item }">
              {{ applicationName(item.applicationId) }}
            </template>
            <template #[`item.serverId`]="{ item }">
              {{ serverName(item.serverId) }}
            </template>
          </v-data-table-server>
        </v-card>
      </v-col>

      <v-col v-if="isDetailsOpen" cols="6">
        <ContentDetailCard
          :referenceId="selectedRowId"
          :isDetailsOpen="isDetailsOpen"
          :serversList="serversIdsList"
          :appsList="appsIdsList"
          :key="selectedRowId"
          @close-content-info="closeContentInfo"
          @delete-content="deleteContent"
          @update-task="updateTask"
          @delete-task="deleteTask"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
