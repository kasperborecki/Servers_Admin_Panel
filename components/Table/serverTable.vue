<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { ServerRepository } from "~/repository/serverRepository";
import AddServerPopup from "../Popup/addServerPopup.vue";
import UpdateServerPopup from "../Popup/updateServerPopup.vue";
import ServerCard from "../Card/serverCard.vue";

const props = defineProps({
  headers: Array,
  serverId: { type: String, default: null }, // <--- nowy prop
});

const { t } = useI18n();
const auth = useAuth();
const user = ref(auth.data.value);

const servers = ref([]);
const totalItems = ref(0);
const loading = ref(false);
const error = ref("");
const searchQuery = ref("");
const dateRange = ref([]);
const page = ref(1);
const itemsPerPage = ref(10);
const sortBy = ref([]);
const referenceId = ref(null);

const snackbar = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("success");

const repo = new ServerRepository();
const token = auth.token.value;

const formattedDateRange = computed(() => {
  if (dateRange.value && dateRange.value.length >= 2) {
    let firstDate = new Date(dateRange.value[0]);
    const lastDate = new Date(dateRange.value[dateRange.value.length - 1]);
    firstDate.setDate(firstDate.getDate() + 1);

    const formatDate = (date) => date.toISOString().split("T")[0];
    return `${formatDate(firstDate)},${formatDate(lastDate)}`;
  }
  return "";
});

const isTokenMissing = computed(() => !token);

async function fetchAllServers() {
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
      directions,
      token
    );

    servers.value = response.items || response;
    totalItems.value = response.totalCount || response.length;
  } catch (err) {
    error.value = err.message;
    console.error("Fetch error:", err);
  } finally {
    loading.value = false;
  }
}

async function fetchServerById(id) {
  loading.value = true;
  try {
    const response = await repo.getById(id);
    servers.value = [response];
    totalItems.value = 1;
  } catch (err) {
    error.value = err.message;
    console.error("Fetch by ID error:", err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (props.serverId) {
    fetchServerById(props.serverId);
  } else {
    fetchAllServers();
  }
});

watch([page, itemsPerPage, sortBy, searchQuery, dateRange, user], () => {
  if (!props.serverId) fetchAllServers();
});

function checkServerDetails(serverId) {
  referenceId.value = serverId;
}

function showSnackbar(message, type = "success") {
  snackbarMessage.value = message;
  snackbarColor.value = type === "success" ? "success" : "error";
  snackbar.value = true;
}

async function postCreateServer(addedData) {
  try {
    await repo.addServer({
      ...addedData._rawValue,
      status: addedData._rawValue.status ? 1 : 2,
    });
    showSnackbar(t("server_added_success"), "success");
  } catch (err) {
    error.value = err.message;
    showSnackbar(t("server_added_error"), "error");
  }
  fetchAllServers();
}

async function updateServer(updated) {
  const statusId = updated.status ? 1 : 2;
  try {
    await repo.updateServer({ ...updated, status: statusId });
    showSnackbar(t("server_upadate_success"), "success");
  } catch (err) {
    error.value = err.message;
    showSnackbar(t("server_update_error"), "error");
  }
  fetchAllServers();
}

async function deleteServer(id) {
  try {
    await repo.deleteServer(id);
    showSnackbar(t("server_delete_success"), "success");
  } catch (err) {
    error.value = err.message;
    showSnackbar(t("server_delete_error"), "error");
  }
  fetchAllServers();
}
</script>

<template>
  <v-container
    v-if="referenceId"
    style="background-color: var(--v-theme-background)"
    class="pa-4"
  >
    <ServerCard :referenceId="referenceId" />
  </v-container>

  <v-container style="background-color: var(--v-theme-background)" class="pa-4">
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      top
      right
      timeout="4000"
    >
      {{ snackbarMessage }}
      <template #action>
        <v-btn text color="primary" @click="snackbar = false">
          {{ t("btn_close") }}
        </v-btn>
      </template>
    </v-snackbar>

    <v-card color="surface" class="border rounded-xl" elevation="2">
      <div class="my-4 d-flex justify-center items-center flex-wrap ga-3">
        <add-server-popup
          @post-create-server="postCreateServer"
          :disabled="isTokenMissing"
        />

        <div
          class="border border-gray-300 rounded-xl d-flex justify-center"
          style="width: 250px"
        >
          <v-text-field
            :label="$t('input_search')"
            v-model="searchQuery"
            variant="solo"
            color="primary"
            maxLength="100"
            flat
            bg-color="surface"
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
                color="primary"
                flat
                bg-color="surface"
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
        :items="servers"
        :server-items-length="totalItems"
        :loading="loading"
        v-model:page="page"
        v-model:items-per-page="itemsPerPage"
        v-model:sort-by="sortBy"
        multi-sort
      >
        <template #[`item.createdAt`]="{ item }">{{
          item.createdAt.split("T")[0]
        }}</template>
        <template #[`item.modifiedAt`]="{ item }">{{
          item.modifiedAt.split("T")[0]
        }}</template>
        <template #[`item.status`]="{ item }">
          <v-chip
            :color="item.status.status === 'Online' ? 'success' : 'error'"
            text-color="white"
          >
            {{ item.status.status }}
          </v-chip>
        </template>
        <template #[`item.check`]="{ item }">
          <v-btn
            color="primary"
            variant="tonal"
            @click="checkServerDetails(item.id)"
          >
            {{ t("btn_check") }}
          </v-btn>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-btn
            color="error"
            variant="tonal"
            @click="deleteServer(item.id)"
            :disabled="isTokenMissing"
          >
            <v-icon size="x-large">mdi-trash-can</v-icon>
          </v-btn>

          <update-server-popup
            :server="item"
            @update-server="updateServer"
            :disabled="isTokenMissing"
          />
        </template>
      </v-data-table-server>
    </v-card>
  </v-container>
</template>
