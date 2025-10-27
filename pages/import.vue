<script setup>
import importPopup from "~/components/Popup/importPopup.vue";
import { ImportsRepository } from "~/repository/importsRepository";
import ImportStagesStatus from "~/components/import/ImportStagesStatus.vue";
const { t } = useI18n();

import { ref, computed, watch, onMounted } from "vue";

const headers = computed(() => [
  { value: "download", align: "left", key: "download" },
  {
    title: t("imports.filename"),
    value: "filename",
    align: "left",
    key: "filename",
  },
  { title: t("imports.source"), value: "source", align: "left", key: "source" },
  { title: t("imports.type"), value: "type", align: "left", key: "type" },
  {
    title: t("imports.createdAt"),
    value: "createdAt",
    align: "left",
    key: "createdAt",
  },
  {
    value: "outcome",
    title: t("imports.steps"),
    width: "10em",
    key: "outcome",
    align: "center",
  },
]);

const dateRange = ref([]);
const chosenFormat = ref(t("select_none"));
const searchQuery = ref("");
const ImportsData = ref([]);
const error = ref("");
const loading = ref(false);
const page = ref(1);
const itemsPerPage = ref(10);
const sortBy = ref([]);
const totalItems = ref(0);

const formatsItems = [{ format: "Server", name: "Server" }];

const formattedDateRange = computed(() => {
  if (dateRange.value && dateRange.value.length >= 2) {
    const formatDate = (date) => new Date(date).toISOString().split("T")[0];
    return `${formatDate(dateRange.value[0])} - ${formatDate(dateRange.value[1])}`;
  }
  return "";
});

const repo = new ImportsRepository();

async function fetchImports() {
  loading.value = true;
  try {
    const columns = sortBy.value.map((s) => s.key);
    const directions = sortBy.value.map((s) =>
      s.order === "asc" ? false : true
    );

    const response = await repo.getPagedImports(
      searchQuery.value,
      page.value,
      itemsPerPage.value,
      columns,
      directions,
      chosenFormat.value !== t("select_none") ? chosenFormat.value : null,
      dateRange.value[1],
      dateRange.value[0]
    );

    ImportsData.value = response.items || [];
    totalItems.value = response.total || 0;
  } catch (err) {
    error.value = err.message;
    console.error("Fetch error:", err);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchImports);

watch([page, itemsPerPage, sortBy, searchQuery, dateRange], fetchImports);


async function downloadFile(item) {
  try {
    await repo.downloadFile(item);
  } catch (err) {
    console.error("Download error:", err);
  }
}

async function reImport(id) {
  try {
    await repo.restartImport(id);
    await fetchImports();
  } catch (err) {
    console.error("Reimport error:", err);
  }
}


</script>


<template>
  <v-app class="app">
    <v-container fluid class="pa-10">
      <v-card class="pa-10">
        <v-card-title class="text-h6 font-weight-medium">
          <div class="d-flex flex-row mb-4">
            <v-icon icon="mdi-format-list-bulleted" color="primary" />
            <p class="mx-3">{{ t("header_excel_import") }}</p>
            <importPopup @import-finished="fetchImports" />
          </div>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="3">
              <v-menu :close-on-content-click="false">
                <template #activator="{ props: activatorProps }">
                  <div
                    class="border border-gray-300 rounded-xl d-flex justify-center"
                  >
                    <v-text-field
                      v-bind="activatorProps"
                      :model-value="formattedDateRange"
                      :label="$t('input_dataRage')"
                      readonly
                      variant="solo"
                      color="primary"
                      flat
                      bg-color="surface"
                      rounded="xl"
                      density="comfortable"
                      hide-details
                      clearable
                      @click:clear="dateRange = []"
                      prepend-inner-icon="mdi-calendar"
                    />
                  </div>
                </template>
                <v-date-picker
                  v-model="dateRange"
                  multiple="range"
                  show-adjacent-months
                />
              </v-menu>
            </v-col>
            <v-col cols="3">
              <v-select
                v-model="chosenFormat"
                :items="formatsItems"
                item-title="name"
                item-value="format"
                variant="plain"
                hide-details
                density="compact"
                class="text-body-1 border border-gray-300 rounded-xl pl-3 pr-2 py-1 pb-2"
                style="min-width: 200px"
                height="100"
                prepend-inner-icon="mdi-file-document"
              />
            </v-col>
            <v-col cols="3"></v-col>
            <v-col cols="3">
              <div
                class="border border-gray-300 rounded-xl w-1/2 d-flex justify-center p-2"
              >
                <v-text-field
                  v-model="searchQuery"
                  :label="$t('input_document_type')"
                  variant="solo"
                  color="primary"
                  maxlength="100"
                  flat
                  bg-color="surface"
                  rounded="xl"
                  density="comfortable"
                  hide-details
                  prepend-inner-icon="mdi-magnify"
                />
              </div>
            </v-col>
          </v-row>

          <v-data-table-server
            class="mx-4"
            :headers="headers"
            :items="ImportsData"
            v-model:page="page"
            v-model:items-per-page="itemsPerPage"
            :items-length="totalItems"
            :loading="loading"
            v-model:sort-by="sortBy"
            multi-sort
            :items-per-page="itemsPerPage"
          >
            <template #item.type="{ item }">
              {{ item.type }}
            </template>

            <template #item.download="{ item }">
              <v-tooltip bottom open-delay="300">
                <template #activator="{ on, attrs }">
                  <v-btn
                    icon
                    small
                    variant="text"
                    v-on="on"
                    v-bind="attrs"
                    @click="downloadFile(item)"
                  >
                    <v-icon>mdi-download</v-icon>
                  </v-btn>
                </template>
                <span>Download File</span>
              </v-tooltip>
            </template>

            <template #item.createdAt="{ item }">
              {{ new Date(item.createdAt).toLocaleString() }}
            </template>

            <template #item.outcome="{ item }">
              <div class="d-flex justify-center align-center">
                <template v-if="item.type === 'Pdf'">
                  <v-icon color="success">mdi-check-circle-outline</v-icon>
                </template>
                <template v-else>
                  <ImportStagesStatus :item="item" />
                </template>
              </div>
            </template>
          </v-data-table-server>
        </v-card-text>
      </v-card>
    </v-container>
  </v-app>
</template>

<style scoped>
.app {
  background-size: cover;
  background-image: url("../assets/photo-1508739773434-c26b3d09e071.jpg");
}
</style>
