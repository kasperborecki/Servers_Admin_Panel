<script setup>
import { ref, onMounted, watch } from "vue";
import { ServerRepository } from "~/repository/serverRepository";
import { useI18n } from "vue-i18n";
import { EmailRepository } from "~/repository/emailRepository";

const props = defineProps({
  headers: { type: Array, required: true },
});

const emit = defineEmits(["select-pdf"]);

const { t } = useI18n();

const pdfData = ref([]);
const error = ref("");
const searchQuery = ref("");
const page = ref(1);
const itemsPerPage = ref(10);
const loading = ref(false);
const sortBy = ref([]);

const repo = new EmailRepository();

async function fetchAllPdfData() {
  loading.value = true;
  try {
    const columns = sortBy.value.map((s) => s.key);
    const directions = sortBy.value.map((s) =>
      s.order === "asc" ? "false" : "true"
    );

    const response = await repo.getPagedPdfs(
      searchQuery.value,
      page.value,
      itemsPerPage.value,
      columns,
      directions,
    );

    pdfData.value = response || [];
  } catch (err) {
    error.value = err.message;
    console.error("Fetch error:", err);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchAllPdfData);

watch([page, itemsPerPage, sortBy, searchQuery], fetchAllPdfData);

function selectPdf(path) {
  emit("select-pdf", path);
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
            </div>
          </div>
          <v-data-table-server
            :headers="headers"
            :items="pdfData"
            v-model:page="page"
            v-model:items-per-page="itemsPerPage"
            class="w-100"
            :items-length="totalItems"
            :loading="loading"
            v-model:sort-by="sortBy"
            multi-sort
          >
            <template #[`item.select`]="{ item }">
                <v-btn
                  color="primary"
                  variant="tonal"
                  size="small"
                  @click="selectPdf(item.path)"
                >
                  {{ t("btn_check") }}
              </v-btn>
            </template>
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
