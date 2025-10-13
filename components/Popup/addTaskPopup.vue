<script setup>
import { ref, toRaw } from "vue";

const props = defineProps({
  appsIdsList: Array,
  serversIdsList: Array,
});

const emit = defineEmits(["add-content"]);
const dialog = ref(false);
const formRef = ref(null);
const isLoading = ref(false);

const date = new Date();
let day = String(date.getDate()).padStart(2, "0");
let month = String(date.getMonth() + 1).padStart(2, "0");
let year = date.getFullYear();
let currentDate = `${year}-${month}-${day}`;

const addedContent = ref({
  name: "",
  serverId: null,
  applicationId: null,
  description: "",
  modifiedAt: currentDate,
  createdAt: currentDate,
});

const inputRules = [
  (v) => {
    if (v === null || v === undefined) return "To pole jest wymagane";
    if (typeof v === "string" && v.trim() === "")
      return "To pole jest wymagane";
    return true;
  },
];

function resetForm() {
  addedContent.value = {
    name: "",
    serverId: null,
    applicationId: null,
    description: "",
    modifiedAt: currentDate,
    createdAt: currentDate,
  };
  formRef.value?.reset();
}

async function handleSave() {
  if (isLoading.value) return;

  isLoading.value = true;
  const { valid } = await formRef.value.validate();
  if (!valid) {
    isLoading.value = false;
    return;
  }

   Object.keys(addedContent.value).forEach((key) => {
    if (typeof addedContent.value[key] === "string") {
      addedContent.value[key] = addedContent.value[key].trim();
    }
  });

  try {
    emit("add-content", toRaw(addedContent.value));
    resetForm();
    dialog.value = false;
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 300);
  }
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="500" eager>
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
      <v-card-title>{{ $t("header_add_task") }}</v-card-title>
      <v-card-text>
        <v-form ref="formRef" class="px-3">
          <div
            class="border border-gray-300 rounded-xl d-flex justify-center my-5"
          >
            <v-text-field
              :label="$t('input_name')"
              v-model="addedContent.name"
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
              :label="$t('input_serverId')"
              :items="serversIdsList"
              item-title="name"
              item-value="id"
              v-model="addedContent.serverId"
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
              :label="$t('input_applicationId')"
              :items="appsIdsList"
              item-title="name"
              item-value="id"
              v-model="addedContent.applicationId"
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
            <v-textarea
              :label="$t('input_description')"
              v-model="addedContent.description"
              variant="solo"
              flat
              maxLength="255"
              rounded="xl"
              hide-details
              density="comfortable"
            />
          </div>

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
