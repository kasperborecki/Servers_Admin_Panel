<script setup>
import { ref, onMounted, watch } from "vue";
import updateTaskPopup from "../Popup/updateTaskPopup.vue";
import { TasksRepository } from "../../repository/tasksRepository";
import { CommentRepository } from "../../repository/commentRepository";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  referenceId: { type: Number, required: false },
  isDetailsOpen: { type: Boolean, default: false },
  serversList: Array,
  appsList: Array,
});

const emit = defineEmits([
  "close-content-info",
  "delete-content",
  "update-description",
  "update-task",
  "delete-task",
]);

const selectedTask = ref(null);
const error = ref("");
const formRef = ref(null);
const newCommentContent = ref("");

const repo = new TasksRepository();
const commentRepo = new CommentRepository();

const snackbar = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("green");

const inputRules = [
  (v) => (v && v.trim() !== "" ? true : "To pole jest wymagane"),
];

watch(() => [props.appsList, props.serversList], { immediate: true });

async function fetchChosenTask() {
  if (!props.referenceId) return;
  try {
    selectedTask.value = await repo.getById(props.referenceId);
    error.value = "";
  } catch (err) {
    error.value = err?.message ?? "Nie udało się pobrać zadania";
  }
}

async function addComment() {
  const content = newCommentContent.value.trim();
  if (!content) return;

  const commentToAdd = {
    content,
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    taskId: props.referenceId,
  };

  try {
    await commentRepo.addComment(commentToAdd);
    newCommentContent.value = "";
    await fetchChosenTask();
    snackbarMessage.value = t("comment_added_success");
    snackbarColor.value = "green";
    snackbar.value = true;
    error.value = "";
  } catch (err) {
    error.value = err?.message ?? "Nie udało się dodać komentarza";
    snackbarMessage.value = t("comment_added_error");
    snackbarColor.value = "red";
    snackbar.value = true;
  }
}

onMounted(fetchChosenTask);
watch(() => props.referenceId, fetchChosenTask);

function closeContentInfo() {
  emit("close-content-info");
}

function deleteTask(selectedId) {
  emit("delete-task", selectedId);
  emit("close-content-info");
}

function updateTask(updatedData) {
  emit("update-task", updatedData);
}
</script>

<template>
  <v-snackbar
    v-model="snackbar"
    :color="snackbarColor"
    top
    right
    timeout="4000"
  >
    {{ snackbarMessage }}
    <template #action>
      <v-btn text @click="snackbar = false">{{ t("btn_close") }}</v-btn>
    </template>
  </v-snackbar>
  <div v-if="isDetailsOpen">
    <v-card class="pa-4 border rounded-xl" height="100%">
      <template v-if="selectedTask?.name">
        <v-row>
          <v-col cols="6">
            <h1 class="ml-3">{{ selectedTask.name }}</h1>
          </v-col>
          <v-col cols="6" class="text-right">
            <v-btn
              @click="closeContentInfo"
              variant="outlined"
              color="blue"
              class="border rounded-xl mr-5"
            >
              <strong>{{ $t("btn_close") }}</strong>
            </v-btn>
          </v-col>
        </v-row>

        <v-divider :thickness="2" />

        <v-container>
          <v-row class="align-center">
            <v-col cols="12" md="10">
              <div>
                <h3 class="text-blue mb-2">
                  {{ $t("label_task_description") }}
                </h3>
                <p class="pa-2 mb-0">• {{ selectedTask.description }}</p>
              </div>
            </v-col>

            <v-col cols="12" md="2" class="d-flex justify-end mt-2 mt-md-0">
              <updateTaskPopup
                :task="selectedTask"
                :appsList="appsList"
                :serversList="serversList"
                @update-task="updateTask"
                class="mb-2 mb-md-0"
              />
              <v-btn
                color="error"
                variant="tonal"
                icon
                class="ml-4"
                @click="deleteTask(selectedTask.id)"
              >
                <v-icon size="default">mdi-trash-can</v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <v-container
            class="mx-auto rounded-xl border border-opacity-50 px-4 pt-6"
          >
            <div
              v-if="selectedTask?.comments && selectedTask.comments.length > 0"
            >
              <div
                v-for="(commentItem, i) in selectedTask.comments"
                :key="i"
                class="mb-5 d-flex align-center"
              >
                <v-avatar size="40" color="red" class="me-2">
                  {{ (commentItem.userName || "?").charAt(0) }}
                </v-avatar>
                <v-row>
                  <v-col cols="10">
                    <div>
                      <strong>{{ commentItem.userName }}</strong>
                      <p>{{ commentItem.content }}</p>
                    </div>
                  </v-col>
                  <v-col cols="2" class="text-right">
                    <small class="text-gray-200">
                      {{ commentItem.createdAt.split("T")[0] }}
                    </small>
                  </v-col>
                </v-row>
              </div>
            </div>

            <div v-else class="text-gray-500 text-left font-italic mb-4">
              • {{ $t("info_noComment") }}
            </div>

            <v-form ref="formRef" class="d-flex align-center ga-3">
              <v-text-field
                :label="$t('input_add_comment')"
                prepend-inner-icon="mdi-message-draw"
                variant="outlined"
                v-model="newCommentContent"
                :rules="inputRules"
                hide-details
                maxLength="255"
                class="flex-grow"
              />
              <v-btn
                @click="addComment"
                variant="outlined"
                color="blue"
                class="border rounded-xl"
              >
                {{ $t("btn_add") }}
              </v-btn>
            </v-form>
          </v-container>
        </v-container>
      </template>

      <template v-else>
        <p>{{ error || $t("info_contentNotFound") }}</p>
      </template>
    </v-card>
  </div>
</template>
