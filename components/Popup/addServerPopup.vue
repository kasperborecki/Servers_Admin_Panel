<script setup>
import { ref, onMounted } from "vue";
import { ServerRepository } from "~/repository/serverRepository";

const emit = defineEmits(["post-create-server"]);

const props = defineProps({
  disabled: Boolean,
});

const formRef = ref(null);
const isLoading = ref(false);

const date = new Date();
let day = String(date.getDate()).padStart(2, "0");
let month = String(date.getMonth() + 1).padStart(2, "0");
let year = date.getFullYear();
let currentDate = `${year}-${month}-${day}`;
const ramVolume = ref([]);
const dialog = ref(false);

const repo = new ServerRepository();

const inputRules = [
  (v) => {
    if (v === null || v === undefined) return "To pole jest wymagane";
    if (typeof v === "string" && v.trim() === "")
      return "To pole jest wymagane";
    return true;
  },
];

const addedServer = ref({
  name: "",
  modifiedAt: currentDate,
  createdAt: currentDate,
  status: "",
  country: "",
  ipAddress: "",
  os: "",
  cpuCores: null,
  ramGB: null,
  location: "",
});

function resetForm() {
  addedServer.value = {
    name: "",
    modifiedAt: currentDate,
    createdAt: currentDate,
    status: false,
    country: "",
    ipAddress: "",
    os: "",
    cpuCores: null,
    ramGB: null,
    location: "",
  };
}

async function handleSave() {
  if (isLoading.value) return;

  isLoading.value = true;
  const { valid } = await formRef.value.validate();
  if (!valid) {
    isLoading.value = false;
    return;
  }

  Object.keys(addedServer.value).forEach((key) => {
    if (typeof addedServer.value[key] === "string") {
      addedServer.value[key] = addedServer.value[key].trim();
    }
  });

  try {
    emit("post-create-server", toRaw(addedServer));
    resetForm();
    dialog.value = false;
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 300);
  }
}

async function fetchAllRamVolume() {
  try {
    const data = await repo.getAllRamVolumes();
    ramVolume.value = data;
  } catch (err) {
    console.error(err);
  }
}


onMounted(fetchAllRamVolume);
</script>

<template>
  <v-dialog v-model="dialog" max-width="500">
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        class="border rounded-xl"
        variant="outlined"
        color="green"
        size="x-large"
        :disabled="props.disabled"
        >{{ $t("btn_add") }}</v-btn
      >
    </template>

    <v-card class="pa-6">
      <v-card-title>{{ $t("header_add_server") }}</v-card-title>
      <v-card-text>
        <v-form ref="formRef" class="px-3">
          <div
            class="border border-gray-300 rounded-xl d-flex justify-center my-5"
          >
            <v-text-field
              :label="$t('input_name')"
              v-model="addedServer.name"
              :rules="inputRules"
              variant="solo"
              maxLength="100"
              flat
              bg-color="transparent"
              rounded="xl"
              density="comfortable"
              hide-details
            />
          </div>
          <div
            class="border border-gray-300 rounded-xl d-flex justify-center my-5"
          >
            <v-text-field
              :label="$t('input_localization')"
              v-model="addedServer.location"
              :rules="inputRules"
              variant="solo"
              maxLength="100"
              flat
              bg-color="transparent"
              rounded="xl"
              density="comfortable"
              hide-details
            />
          </div>
          <div
            class="border border-gray-300 rounded-xl d-flex justify-center my-5"
          >
            <v-text-field
              :label="$t('input_country')"
              v-model="addedServer.country"
              :rules="inputRules"
              variant="solo"
              maxLength="100"
              flat
              bg-color="transparent"
              rounded="xl"
              density="comfortable"
              hide-details
            />
          </div>
          <div
            class="border border-gray-300 rounded-xl d-flex justify-center my-5"
          >
            <v-text-field
              :label="$t('input_ipAddress')"
              v-model="addedServer.ipAddress"
              :rules="inputRules"
              variant="solo"
              maxLength="100"
              flat
              bg-color="transparent"
              rounded="xl"
              density="comfortable"
              hide-details
            />
          </div>
          <div
            class="border border-gray-300 rounded-xl d-flex justify-center my-5"
          >
            <v-select
              :label="$t('input_cpuCores')"
              :items="['4', '8', '16', '32', '64']"
              v-model="addedServer.cpuCores"
              item-title="name"
              item-value="id"
              :rules="inputRules"
              variant="solo"
              flat
              bg-color="transparent"
              rounded="xl"
              density="comfortable"
              hide-details
            />
          </div>
          <div
            class="border border-gray-300 rounded-xl d-flex justify-center my-5"
          >
            <v-select
              :label="$t('input_ramMemory')"
              :items="ramVolume"
              v-model="addedServer.ramGB"
              item-title="volumeGb"
              item-value="id"
              :rules="inputRules"
              variant="solo"
              flat
              bg-color="transparent"
              rounded="xl"
              density="comfortable"
              hide-details
            />
          </div>
          <div
            class="border border-gray-300 rounded-xl d-flex justify-center my-5"
          >
            <v-select
              :label="$t('input_operationSystem')"
              :items="['Windows 10', 'Windows 11', 'MacOS', 'Linux']"
              v-model="addedServer.os"
              item-title="name"
              item-value="id"
              :rules="inputRules"
              variant="solo"
              flat
              bg-color="transparent"
              rounded="xl"
              density="comfortable"
              hide-details
            />
          </div>
          <v-checkbox
            :label="$t('input_startOnSave')"
            v-model="addedServer.status"
          ></v-checkbox>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green"
              @click="handleSave"
              :loading="isLoading"
              :disabled="isLoading"
              class="mx-0 mt-3"
            >
              {{ $t("btn_saveChanges") }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
