<script setup>
import { ref, onMounted } from "vue";
import { ServerRepository } from "~/repository/serverRepository";

const emit = defineEmits(["add-application"]);

const formRef = ref(null);
const dialog = ref(false);
const serverIds = ref([]);
const repo = new ServerRepository();
const error = ref("");
const isLoading = ref(false);


const date = new Date();
const currentDate = date.toISOString().split("T")[0];

const addedApplication = ref({
  name: "",
  modifiedAt: currentDate,
  createdAt: currentDate,
  serverId: null,
});

const inputRules = [
  (v) => {
    if (v === null || v === undefined) return "To pole jest wymagane";
    if (typeof v === "string" && v.trim() === "")
      return "To pole jest wymagane";
    return true;
  },
];

async function handleSave() {
  if (isLoading.value) return;

  isLoading.value = true;
  const { valid } = await formRef.value.validate();
  if (!valid) {
    isLoading.value = false;
    return;
  }

  Object.keys(addedApplication.value).forEach((key) => {
    if (typeof addedApplication.value[key] === "string") {
      addedApplication.value[key] = addedApplication.value[key].trim();
    }
  });

  try {
    emit("add-application", addedApplication.value);
        resetForm();
    dialog.value = false;
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 300);
  }
}


function resetForm() {
  addedApplication.value = {
    name: "",
    modifiedAt: currentDate,
    createdAt: currentDate,
    serverId: null,
  };
}

async function fetchAllServersIds() {
  try {
    serverIds.value = await repo.getAllServersIds();
  } catch (err) {
    error.value = err.message;
  }
}

onMounted(fetchAllServersIds);
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
      >
        {{ $t("btn_add") }}
      </v-btn>
    </template>

    <v-card class="pa-6">
      <v-card-title>{{ $t("header_add_application") }}</v-card-title>
      <v-card-text>
        <v-form ref="formRef" class="px-3">
          <div
            class="border border-gray-300 rounded-xl d-flex justify-center my-5"
          >
            <v-text-field
              :label="$t('input_name')"
              v-model="addedApplication.name"
              :rules="inputRules"
              variant="solo"
              flat
              maxLength="100"
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
              :label="$t('input_serverId')"
              :items="serverIds"
              v-model="addedApplication.serverId"
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
          <v-card-actions>
            <v-spacer />
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
