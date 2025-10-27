<script setup>
import { ref } from "vue";
import { ImportsRepository } from "~/repository/importsRepository";

const { t } = useI18n();
const emit = defineEmits(["import-finished"]);

const repo = new ImportsRepository();

const dialog = ref(false);
const isLoading = ref(false);
const fileData = ref(null);
const chosenFormat = ref(t("select_none"));

const formatsItems = [{ format: "Server", name: "Server" }];

function handleClose() {
  dialog.value = false;
  fileData.value = null;
  chosenFormat.value = t("select_none");
}

async function handleImport() {
  if (!fileData.value || chosenFormat.value === t("select_none")) {
    alert("Wybierz plik i format!");
    return;
  }

  const file = Array.isArray(fileData.value)
    ? fileData.value[0]
    : fileData.value;

  try {
    isLoading.value = true;

    const response = await repo.importDocuments(
      chosenFormat.value.toLowerCase(),
      file
    );

    if (response && response.success !== false) {
      alert("Import zakończony sukcesem!");
      emit("import-finished");
      handleClose();
    } else {
      alert("Import zakończony błędem.");
    }
  } catch (err) {
    console.error("Import error:", err);
    alert("Błąd przy imporcie danych.");
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="500" eager>
    <template #activator="{ props: activatorProps }">
      <v-btn
        color="primary"
        class="d-flex align-center px-4 py-2 rounded-lg ml-3"
        elevation="2"
        v-bind="activatorProps"
      >
        <span>{{ $t("import_from_excel") }}</span>
        <v-icon class="ml-2">mdi-file-excel</v-icon>
      </v-btn>
    </template>

    <v-card class="pa-6">
      <v-card-title>{{ $t("header_excel_import") }}</v-card-title>
      <v-card-text>
        <v-form class="px-3">
          <v-select
            v-model="chosenFormat"
            :items="formatsItems"
            item-title="name"
            item-value="format"
            variant="plain"
            hide-details
            density="compact"
            class="text-body-1 border border-gray-300 rounded-xl pl-3 pr-2 py-1 pb-2 mb-3"
            style="min-width: 200px"
            height="100"
            prepend-inner-icon="mdi-file-document"
          />
          <v-file-upload
            :divider-text="$t('dropzone_subtitle')"
            :title="$t('dropzone_title')"
            :browse-text="$t('dropzone_browse')"
            v-model="fileData"
            max-height="290px"
            clearable="true"
            multiple="false"
            showSize="true"
          />
          <v-card-actions>
            <v-row>
              <v-col cols="3">
                <v-btn
                  color="warning"
                  @click="handleClose"
                  :loading="isLoading"
                  :disabled="isLoading"
                  class="mx-0 mt-3"
                >
                  {{ $t("btn_close") }}
                </v-btn>
              </v-col>
              <v-col cols="6"></v-col>
              <v-col cols="3">
                <v-btn
                  color="green"
                  @click="handleImport"
                  :loading="isLoading"
                  :disabled="isLoading || fileData == null"
                  class="mx-0 mt-3"
                >
                  {{ $t("btn_import") }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
