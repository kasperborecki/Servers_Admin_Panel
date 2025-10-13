<script setup>
import { ref } from "vue";
import { ServerRepository } from "~/repository/serverRepository";

const props = defineProps({
  server: Object,
  serversId: Array,
  appsIds: Array,
});

const emit = defineEmits(["update-server"]);

const dialog = ref(false);
const formRef = ref(null);
const updatedServer = ref({});
const ramVolume = ref([]);
const isLoading = ref(false);

const inputRules = [
  (v) => {
    if (v === null || v === undefined) return "To pole jest wymagane";
    if (typeof v === "string" && v.trim() === "")
      return "To pole jest wymagane";
    return true;
  },
];

const date = new Date();
let day = String(date.getDate()).padStart(2, "0");
let month = String(date.getMonth() + 1).padStart(2, "0");
let year = date.getFullYear();
let currentDate = `${year}-${month}-${day}`;

const repo = new ServerRepository();

async function fetchAllRamVolume() {
  try {
    const data = await repo.getAllRamVolumes();
    ramVolume.value = data;
  } catch (err) {
    error.value = err.message;
  }
}

onMounted(fetchAllRamVolume);

watch(dialog, (val) => {
  if (val) {
    updatedServer.value = {
      id: props.server.id,
      name: props.server.name,
      modifiedAt: currentDate,
      createdAt: props.server.createdAt || currentDate,
      status: props.server.statusId === 1,
      country: props.server.country,
      ipAddress: props.server.ipAddress,
      os: props.server.os,
      cpuCores: props.server.cpuCores,
      ramVolumeId: props.server.ramVolumeId || null,
      location: props.server.location,
    };
  } else {
    updatedServer.value = {};
  }
});


async function handleSave() {
  if (isLoading.value) return;

  isLoading.value = true;
  const { valid } = await formRef.value.validate();
  if (!valid) {
    isLoading.value = false;
    return;
  }

  Object.keys(updatedServer.value).forEach((key) => {
    if (typeof updatedServer.value[key] === "string") {
      updatedServer.value[key] = updatedServer.value[key].trim();
    }
  });

  try {
    console.log("Selected RAM volume ID:", updatedServer.value.ramVolumeId);
    emit("update-server", { ...updatedServer.value, modifiedAt: currentDate });
    dialog.value = false;
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 300);
  }
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="500">
    <template #activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" variant="tonal" color="primary" class="ml-4">
        <v-icon size="x-large">mdi-pencil</v-icon>
      </v-btn>
    </template>

    <v-card class="pa-6">
      <v-card-title>{{ $t("header_edit_server") }}</v-card-title>
      <v-form ref="formRef" class="px-3">
        <div
          class="border border-gray-300 rounded-xl d-flex justify-center my-5"
        >
          <v-text-field
            :label="$t('input_name')"
            v-model="updatedServer.name"
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
            v-model="updatedServer.location"
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
            v-model="updatedServer.country"
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
            v-model="updatedServer.ipAddress"
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
            v-model="updatedServer.cpuCores"
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
            item-title="volumeGb"
            item-value="id"
            v-model="updatedServer.ramVolumeId"
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
            v-model="updatedServer.os"
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
          v-model="updatedServer.status"
        ></v-checkbox>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green"
            @click="handleSave"
            :loading="isLoading"
            :disabled="isLoading"
            class="mx-0 mt-3"
            >{{ $t("btn_saveChanges") }}</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
