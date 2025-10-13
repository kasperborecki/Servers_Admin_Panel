<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { ServerRepository } from "~/repository/serverRepository";
import { useI18n } from "vue-i18n";

const props = defineProps({
  headers: { type: Array, required: true },
});

const { t } = useI18n();

const tasks = ref([]);
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

async function fetchAllCombinedData() {
  loading.value = true;
  try {
    const columns = sortBy.value.map((s) => s.key);
    const directions = sortBy.value.map((s) =>
      s.order === "asc" ? "false" : "true"
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
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="border rounded-xl">
          <div class="my-4 d-flex justify-center items-center flex-wrap gap-3">
            <div
              class="border border-gray-300 rounded-xl d-flex justify-center mr-4"
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
            <template #[`item.serverCreatedAt`]="{ item }">
              {{
                item.serverCreatedAt ? item.serverCreatedAt.split("T")[0] : "-"
              }}
            </template>

            <template #[`item.applicationCreatedAt`]="{ item }">
              {{
                item.applicationCreatedAt
                  ? item.applicationCreatedAt.split("T")[0]
                  : "-"
              }}
            </template>

            <template #[`item.taskCreatedAt`]="{ item }">
              {{ item.taskCreatedAt ? item.taskCreatedAt.split("T")[0] : "-" }}
            </template>

            <template #[`item.taskDescription`]="{ item }">
              <div class="text-truncate" style="max-width: 300px">
                {{
                  item.taskDescription
                    ? item.taskDescription.length > 50
                      ? item.taskDescription.slice(0, 50) + "..."
                      : item.taskDescription
                    : "-"
                }}
              </div>
            </template>
          </v-data-table-server>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
