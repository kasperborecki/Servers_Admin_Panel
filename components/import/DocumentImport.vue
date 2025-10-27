<template>
  <v-card class="pb-2" max-width="550">
    <v-card-title>{{ t("documentImport.title") }}</v-card-title>

    <v-select
      v-model="selectedOption"
      :items="options"
      :label="t('documentImport.selectDataType')"
      variant="outlined"
      density="compact"
      item-title="title"
      item-value="value"
      class="ml-5 mr-5"
    />

    <!-- Rok i miesiąc dla structure oraz payroll -->
    <div v-if="needsPeriod" class="ml-5 mr-5 d-flex gap-3">
      <v-select
        v-model="year"
        :items="years"
        :label="t('documentImport.year')"
        variant="outlined"
        density="compact"
        class="flex-1"
      />
      <v-select
        v-model="month"
        :items="months"
        item-title="title"
        item-value="value"
        :label="t('documentImport.month')"
        variant="outlined"
        density="compact"
        class="flex-1"
      />
    </div>

    <div
      class="drag-and-drop-container ml-5 mr-5 mb-5"
      @dragover="handleDragOver"
      @drop="handleDrop"
      @click="browseFiles"
    >
      <span v-if="uploadedDocuments.length === 0">
        {{ t("documentImport.clickOrDrag") }}
      </span>
      <span v-else>{{ uploadedDocuments.map((f) => f.name).join(", ") }}</span>
    </div>

    <v-card-text>
      <ul>
        <li v-for="(document, index) in uploadedDocuments" :key="index">
          {{ document.name }}
          <v-btn @click="removeDocument(index)" icon>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </li>
      </ul>
    </v-card-text>

    <v-card-actions>
      <v-btn @click="close" text>{{ t("documentImport.close") }}</v-btn>
      <v-spacer />
      <v-btn
        @click="importDocuments"
        :disabled="
          uploadedDocuments.length === 0 ||
          !selectedOption ||
          (needsPeriod && (!year || !month))
        "
        class="primary"
      >
        {{ t("documentImport.import") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps({ defaultType: String });
const emit = defineEmits(["import", "close"]);

const snack = useSnack();

const selectedOption = ref(null);
const uploadedDocuments = ref([]);

// Rok i miesiąc
const now = new Date();
const year = ref(now.getFullYear());
const month = ref(now.getMonth() + 1); // 1-12
const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);
const months = Array.from({ length: 12 }, (_, i) => ({
  title: new Date(2000, i, 1).toLocaleString("default", { month: "long" }),
  value: i + 1,
}));

watch(
  () => props.defaultType,
  (val) => {
    selectedOption.value = val;
  },
  { immediate: true }
);

const options = [
  { title: "bonus", value: "bonus" },
  { title: "payroll", value: "payroll" },
  { title: "structure", value: "structure" },
];

// tylko logika: structure/payroll wymagają okresu
const needsPeriod = computed(() =>
  ["structure", "payroll"].includes(selectedOption.value)
);

function close() {
  uploadedDocuments.value = [];
  emit("close", "fetch");
}

function handleDragOver(event) {
  event.preventDefault();
}

function handleDrop(event) {
  event.preventDefault();
  const files = Array.from(event.dataTransfer.files);
  files.forEach((file) => {
    if (isExcelFile(file)) addFileToList(file);
    else snack.error(t("documentImport.errorNotExcel"));
  });
}

function browseFiles() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".xls, .xlsx, .csv";
  input.multiple = true;
  input.style.display = "none";
  input.addEventListener("change", (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      if (isExcelFile(file)) addFileToList(file);
      else snack.error(t("documentImport.errorNotExcel"));
    });
  });
  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
}

function isExcelFile(file) {
  const validExtensions = [".xls", ".xlsx", ".csv"];
  const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
  return validExtensions.includes(ext);
}

function addFileToList(file) {
  uploadedDocuments.value.push(file);
}

function removeDocument(index) {
  uploadedDocuments.value.splice(index, 1);
}

const { $importsApi } = useNuxtApp();

async function importDocuments() {
  const meta = needsPeriod.value
    ? { year: Number(year.value), month: Number(month.value) }
    : null;

  const res = await $importsApi.importDocuments(
    selectedOption.value,
    uploadedDocuments.value,
    meta
  );

  uploadedDocuments.value = [];

  if (!res.success) {
    snack.error(
      t("documentImport.importError", {
        files: res.wrongDocs?.join(", ") || "",
      })
    );
    close();
  } else {
    snack.success(t("documentImport.importSuccess"));
    emit("close");
  }

  emit("import");
}
</script>

<style scoped>
.drag-and-drop-container {
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  cursor: pointer;
}
</style>
