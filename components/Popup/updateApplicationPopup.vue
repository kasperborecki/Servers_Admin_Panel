<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  application: Object,
  serverIds: Array,
});

const emit = defineEmits(["update-application"]);

const dialog = ref(false);
const formRef = ref(null);
const updatedApplication = ref({});
const isLoading = ref(false);

const inputRules = [
  (v) => {
    if (v === null || v === undefined) return "To pole jest wymagane";
    if (typeof v === "string" && v.trim() === "")
      return "To pole jest wymagane";
    return true;
  },
];

watch(dialog, (val) => {
  if (val && props.application) {
    updatedApplication.value = {
      id: props.application.id,
      name: props.application.name,
      serverId: props.application.serverId,
      createdAt: props.application.createdAt,
      modifiedAt: new Date().toISOString(),
    };
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

  Object.keys(updatedApplication.value).forEach((key) => {
    if (typeof updatedApplication.value[key] === "string") {
      updatedApplication.value[key] = updatedApplication.value[key].trim();
    }
  });

  try {
    emit("update-application", updatedApplication.value);
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
        variant="tonal"
        color="primary"
        class="ml-4"
      >
        <v-icon size="x-large">mdi-pencil</v-icon>
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
              v-model="updatedApplication.name"
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
              :items="serverIds"
              v-model="updatedApplication.serverId"
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
              color="blue"
              @click="handleSave"
              :loading="isLoading"
              :disabled="isLoading"
              class="mt-3"
            >
              {{ $t("btn_saveChanges") }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
