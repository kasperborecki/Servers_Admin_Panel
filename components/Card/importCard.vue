<script setup>
import { ref } from "vue";

const { t } = useI18n();

const chosenFormat = ref(t("select_none"));
const fileData = ref(null);

const formatsItems = [
  { format: t("select_none"), name: t("select_none") },
  { format: "CSV", name: ".CSV" },
  { format: "XML", name: ".XML" },
  { format: "EXCEL", name: ".EXCEL" },
];

watch(fileData, (newFile) => {
  if (!newFile) return;
  const file = Array.isArray(newFile) ? newFile[0] : newFile;

  const reader = new FileReader();

  reader.onload = (e) => {
    console.log("Zawartość pliku:");
    console.log(e.target.result);
  };

  reader.onerror = (err) => {
    console.error("Błąd przy czytaniu pliku:", err);
  };

  reader.readAsText(file);
});

function clearInput() {
  fileData.value = null;
}
</script>

<template>
  <v-card class="upload-card px-6 py-10 rounded-xl" elevation="4">
    <v-card-title class="card-title">{{ $t("file_import") }}</v-card-title>
    <v-card-subtitle class="d-flex flex-row mb-4"
      >{{ $t("before_import_info") }}
      <b class="text-primary ml-1"> {{ chosenFormat }}</b></v-card-subtitle
    >
    <v-row>
      <v-col cols="10">
        <v-file-upload
          :divider-text="$t('dropzone_subtitle')"
          :title="$t('dropzone_title')"
          :browse-text="$t('dropzone_browse')"
          v-model="fileData"
          max-height="290px"
          clearable="true"
          multiple="false"
          :disabled="chosenFormat == 'Brak' || chosenFormat == 'None'"
          showSize="true"
        />
      </v-col>
      <v-col cols="2">
        <div
          class="text-center grey d-flex flex-column align-center justify-center"
        >
          <v-row>
            <v-col>
              <v-select
                v-model="chosenFormat"
                :items="formatsItems"
                item-title="name"
                item-value="format"
                variant="plain"
                hide-details
                density="compact"
                class="text-body-1 border border-gray-300 rounded-xl pl-3 pr-2 py-1 pb-2"
                style="min-width: 200px"
                height="100"
              />
            </v-col>
            <v-col cols="12">
              <v-btn
                color="info"
                rounded
                size="large"
                style="min-width: 200px"
                >{{ $t("btn_import") }}</v-btn
              >
            </v-col>
            <v-col cols="12">
              <v-btn
                @click="clearInput"
                color="primary"
                rounded
                size="large"
                style="min-width: 200px"
                >{{ $t("btn_cancel") }}</v-btn
              >
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

