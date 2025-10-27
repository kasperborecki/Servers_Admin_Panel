<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { ServerRepository } from "~/repository/serverRepository";
import { useI18n } from "vue-i18n";
import { ExportRepository } from "~/repository/exportRepository";

const props = defineProps({
  headers: { type: Array, required: true },
});

const { t } = useI18n();
const auth = useAuth();

const user = ref(auth.data.value);
const tasks = ref([]);
const selectedServers = ref([]);
const error = ref("");
const searchQuery = ref("");
const dateRange = ref([]);
const page = ref(1);
const itemsPerPage = ref(10);
const loading = ref(false);
const sortBy = ref([]);
const totalItems = ref(0);

const formattedDateRange = computed(() => {
  if (dateRange.value && dateRange.value.length >= 2) {
    const firstDate = new Date(dateRange.value[0]);
    const lastDate = new Date(dateRange.value[dateRange.value.length - 1]);
    firstDate.setDate(firstDate.getDate() + 1);
    const fmt = (d) =>
      d instanceof Date ? d.toISOString().split("T")[0] : String(d);
    return `${fmt(firstDate)},${fmt(lastDate)}`;
  }
  return "";
});

const repo = new ServerRepository();
const repoExport = new ExportRepository();

async function fetchAllCombinedData() {
  loading.value = true;
  try {
    const columns = sortBy.value.map((s) => s.key);
    const directions = sortBy.value.map((s) =>
      s.order === "asc" ? false : true
    );

    const response = await repo.getAllCombined(
      searchQuery.value,
      formattedDateRange.value,
      page.value,
      itemsPerPage.value,
      columns,
      directions
    );

    tasks.value = response.items || [];
    totalItems.value = response.total || 0;
  } catch (err) {
    error.value = err.message;
    console.error("Fetch error:", err);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchAllCombinedData);

watch(
  [page, itemsPerPage, sortBy, searchQuery, dateRange],
  fetchAllCombinedData
);

function selectAll() {
  selectedServers.value = tasks.value.map((task) => task.serverId);
  console.log("Wybrane wszystkie serwery:", selectedServers.value);
}

function deselectAll() {
  selectedServers.value = [];
  console.log("Odznaczono wszystkie serwery");
}

function toggleSelect(item) {
  const idx = selectedServers.value.indexOf(item.serverId);
  if (idx === -1) selectedServers.value.push(item.serverId);
  else selectedServers.value.splice(idx, 1);
  console.log(selectedServers.value);
}

async function exportSelected() {
  if (!selectedServers.value.length) {
    alert("Nie wybrano żadnych serwerów!");
    return;
  }

  try {
    await repoExport.exportServersToExcel(selectedServers.value);
  } catch (err) {
    console.error(err);
    alert("Nie udało się wyeksportować pliku." + err);
  }
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="border rounded-xl">
          <div class="my-4 d-flex flex-column align-center gap-4 w-100">
            <div class="d-flex gap-3">
              <div
                class="border border-gray-300 rounded-xl d-flex justify-center mr-3"
                style="width: 250px"
              >
                <v-text-field
                  :label="$t('input_search_server_name')"
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

            <div v-if="user" class="d-flex gap-4 mt-3 justify-center flex-wrap">
              <v-btn
                color="secondary"
                class="d-flex align-center px-4 py-2 rounded-lg mr-3"
                @click="selectAll"
                elevation="2"
              >
                <span>{{ $t("select_all") || "Zaznacz wszystko" }}</span>
                <v-icon class="ml-2">mdi-check-circle</v-icon>
              </v-btn>

              <v-btn
                color="grey"
                class="d-flex align-center px-4 py-2 rounded-lg"
                @click="deselectAll"
                elevation="2"
              >
                <span>{{ $t("deselect_all")}}</span>
                <v-icon class="ml-2">mdi-circle-outline</v-icon>
              </v-btn>

              <v-btn
                color="primary"
                class="d-flex align-center px-4 py-2 rounded-lg ml-3"
                @click="exportSelected"
                elevation="2"
              >
                <span>{{ $t("export_to_excel")}}</span>
                <v-icon class="ml-2">mdi-file-excel</v-icon>
              </v-btn>
            </div>
          </div>
          <v-data-table-server
            :headers="headers"
            :items="tasks"
            v-model:page="page"
            v-model:items-per-page="itemsPerPage"
            class="w-100"
            :items-length="totalItems"
            :loading="loading"
            v-model:sort-by="sortBy"
            multi-sort
          >
            <template #[`item.select`]="{ item }">
              <v-btn icon size="large" flat @click="toggleSelect(item)">
                <v-icon
                  :color="selectedServers.includes(item.serverId) ? 'primary' : 'grey'"
                >
                  {{
                    selectedServers.includes(item.serverId)
                      ? "mdi-check-circle"
                      : "mdi-circle-outline"
                  }}
                </v-icon>
              </v-btn>
            </template>
            <template #[`item.serverCreatedAt`]="{ item }">{{
              item.serverCreatedAt ? item.serverCreatedAt.split("T")[0] : ""
            }}</template>
            <template #[`item.applicationCreatedAt`]="{ item }">{{
              item.applicationCreatedAt
                ? item.applicationCreatedAt.split("T")[0]
                : ""
            }}</template>
            <template #[`item.taskCreatedAt`]="{ item }">{{
              item.taskCreatedAt ? item.taskCreatedAt.split("T")[0] : ""
            }}</template>
          </v-data-table-server>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.bg-blue-100 {
  background-color: #e3f2fd !important;
}
</style>
