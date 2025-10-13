<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { ApplicationRepository } from "~/repository/applicationRepository";
import { ServerRepository } from "~/repository/serverRepository";
import addApplicationPopup from "../Popup/addApplicationPopup.vue";
import updateApplicationPopup from "../Popup/updateApplicationPopup.vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  referenceId: Number,
  headers: Array,
});

const { t } = useI18n();

const applications = ref([]);
const error = ref("");
const searchQuery = ref("");
const serverIds = ref([]);
const dateRange = ref([]);
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
    const lastDate = new Date(dateRange.value[1]);

    const formatDate = (date) => date.toISOString().split("T")[0];
    return `${formatDate(firstDate)},${formatDate(lastDate)}`;
  }
  return "";
});

const repo = new ApplicationRepository();
const serverRepo = new ServerRepository();

async function fetchAllApplications() {
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

    applications.value = response.items || response;
    totalItems.value = response.totalCount || response.length || 0;
  } catch (err) {
    error.value = err.message;
    console.error("Fetch error:", err);
  } finally {
    loading.value = false;
  }
}

async function deleteApplication(selectedId) {
  try {
    await repo.deleteApplication(selectedId);
    snackbarMessage.value = t("application_delete_success");
    snackbarColor.value = "green";
    snackbar.value = true;
    await fetchAllApplications();
  } catch (err) {
    error.value = err.message;
    snackbarMessage.value = t("application_delete_error");
    snackbarColor.value = "red";
    snackbar.value = true;
  }
}

async function postCreateApplication(addedData) {
  try {
    await repo.addApplication(addedData);
    snackbarMessage.value = t("application_added_success");
    snackbarColor.value = "green";
    snackbar.value = true;
    await fetchAllApplications();
  } catch (err) {
    error.value = err.message;
    snackbarMessage.value = t("application_added_error");
    snackbarColor.value = "red";
    snackbar.value = true;
  }
}

async function updateApplicationFunc(updatedData) {
  try {
    await repo.updateApplication(updatedData);

    snackbarMessage.value = t("application_upadate_success");
    snackbarColor.value = "green";
    snackbar.value = true;
    await fetchAllApplications();
  } catch (err) {
    error.value = err.message;

    snackbarMessage.value = t("application_update_error");
    snackbarColor.value = "red";
    snackbar.value = true;
  }
}

async function fetchAllServersIds() {
  try {
    const data = await serverRepo.getAllServersIds();
    serverIds.value = data;
  } catch (err) {
    error.value = err.message;
  }
}

onMounted(() => {
  fetchAllApplications();
  fetchAllServersIds();
});

watch(
  [page, itemsPerPage, sortBy, searchQuery, dateRange],
  fetchAllApplications
);

function serverName(id) {
  const server = serverIds.value.find((server) => server.id === id);
  return server ? server.name : "Unknown Server";
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
      <v-col :cols="12">
        <v-card class="border rounded-xl">
          <div class="my-4 d-flex justify-center items-center flex-wrap ga-3">
            <addApplicationPopup @add-application="postCreateApplication" />

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
              <template v-slot:activator="{ props }">
                <div
                  class="border border-gray-300 rounded-xl d-flex justify-center"
                  style="width: 250px"
                >
                  <v-text-field
                    v-bind="props"
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
            :items="applications"
            v-model:page="page"
            v-model:items-per-page="itemsPerPage"
            class="w-100"
            :server-items-length="totalItems"
            :loading="loading"
            v-model:sort-by="sortBy"
            multi-sort
          >
            <template #[`item.createdAt`]="{ item }">
              {{ item.createdAt ? item.createdAt.split("T")[0] : "" }}
            </template>
            <template #[`item.modifiedAt`]="{ item }">
              {{ item.modifiedAt ? item.modifiedAt.split("T")[0] : "" }}
            </template>
            <template #[`item.serverId`]="{ item }">
              {{ serverName(item.serverId) }}
            </template>

            <template #[`item.actions`]="{ item }">
              <v-btn
                color="error"
                variant="tonal"
                @click="deleteApplication(item.id)"
              >
                <v-icon size="x-large">mdi-trash-can</v-icon>
              </v-btn>
              <updateApplicationPopup
                :application="item"
                :server-ids="serverIds"
                @update-application="updateApplicationFunc"
              />
            </template>
          </v-data-table-server>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
