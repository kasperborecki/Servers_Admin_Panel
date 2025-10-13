<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  task: Object,
  appsList: Array,
  serversList: Array,
});

const emit = defineEmits(["update-task"]);

const dialog = ref(false);
const formRef = ref(null);
const updatedTask = ref({});
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
  if (val && props.task) {
    updatedTask.value = {
      id: props.task.id,
      name: props.task.name,
      serverId: props.task.serverId,
      applicationId: props.task.applicationId,
      modifiedAt: new Date().toISOString(),
      createdAt: props.task.createdAt,
      description: props.task.description || "",
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

  Object.keys(updatedTask.value).forEach((key) => {
    if (typeof updatedTask.value[key] === "string") {
      updatedTask.value[key] = updatedTask.value[key].trim();
    }
  });

  try {
    emit("update-task", updatedTask.value);
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
      <v-btn v-bind="activatorProps" variant="tonal" color="primary" icon>
        <v-icon size="small">mdi-pencil</v-icon>
      </v-btn>
    </template>

    <v-card class="pa-6">
      <v-card-title>{{ $t("header_edit_task") }}</v-card-title>
      <v-card-text>
        <v-form ref="formRef" class="px-3">
          <div class="border border-gray-300 rounded-xl my-3">
            <v-text-field
              :label="$t('input_name')"
              v-model="updatedTask.name"
              :rules="inputRules"
              variant="solo"
              maxLength="100"
              flat
              rounded="xl"
              hide-details
              density="comfortable"
            />
          </div>

          <div class="border border-gray-300 rounded-xl my-3">
            <v-select
              :label="$t('input_server')"
              :items="serversList"
              item-title="name"
              item-value="id"
              v-model="updatedTask.serverId"
              :rules="inputRules"
              variant="solo"
              flat
              rounded="xl"
              hide-details
              density="comfortable"
            />
          </div>

          <div class="border border-gray-300 rounded-xl my-3">
            <v-select
              :label="$t('header_applicationId')"
              :items="appsList"
              item-title="name"
              item-value="id"
              v-model="updatedTask.applicationId"
              :rules="inputRules"
              variant="solo"
              flat
              rounded="xl"
              hide-details
              density="comfortable"
            />
          </div>

          <div class="border border-gray-300 rounded-xl my-3">
            <v-textarea
              :label="$t('input_task_description')"
              v-model="updatedTask.description"
              variant="solo"
              flat
              maxlength="255"
              rounded="xl"
              hide-details
              density="comfortable"
            />
          </div>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="blue"
              class="mt-3"
              @click="handleSave"
              :loading="isLoading"
              :disabled="isLoading"
            >
              {{ $t("btn_saveChanges") }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
