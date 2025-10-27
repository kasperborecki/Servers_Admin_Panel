<template>
  <v-dialog v-model="visible" max-width="600">
    <v-card v-if="item.applyImportReport" class="dense-card">
      <v-card-title>
        {{ t("applyImportReport.file", { filename: item.filename }) }}
      </v-card-title>

      <v-card-text>
        <v-alert
          v-if="item.applyImportReport.allOk"
          density="compact"
          variant="outlined"
          type="success"
          border="left"
        >
          {{ t("applyImportReport.mergeSuccess") }}
        </v-alert>

        <v-alert
          v-if="
            !item.applyImportReport.allOk &&
            !item.applyImportReport.shouldEndProcessing
          "
          density="compact"
          variant="outlined"
          type="warning"
          border="left"
        >
          {{ t("applyImportReport.mergeWarning") }}
        </v-alert>

        <div
          v-if="
            !item.applyImportReport.allOk &&
            !item.applyImportReport.shouldEndProcessing
          "
        >
          <h4>{{ t("applyImportReport.details") }}</h4>

          <div class="success--text">
            {{
              t("applyImportReport.totalItems", {
                count: item.applyImportReport.totalItems,
              })
            }}
          </div>
          <div class="success--text">
            {{
              t("applyImportReport.updated", {
                count: item.applyImportReport.itemsUpdated,
              })
            }}
          </div>
          <div class="success--text">
            {{
              t("applyImportReport.inserted", {
                count: item.applyImportReport.itemsInserted,
              })
            }}
          </div>
          <div>
            {{
              t("applyImportReport.skipped", {
                count:
                  item.applyImportReport.totalItems -
                  (item.applyImportReport.itemsInserted +
                    item.applyImportReport.itemsUpdated),
              })
            }}
          </div>
          <div
            v-if="
              item.applyImportReport.itemsInFile >
              item.applyImportReport.itemsImported
            "
            class="warning--text"
          >
            {{
              t("applyImportReport.rejected", {
                count:
                  item.applyImportReport.itemsInFile -
                  item.applyImportReport.itemsImported,
              })
            }}
          </div>
        </div>

        <v-alert
          v-if="item.applyImportReport.shouldEndProcessing"
          density="compact"
          variant="outlined"
          type="error"
          border="left"
        >
          {{ t("applyImportReport.mergeError") }}
        </v-alert>

        <div
          v-if="
            item.applyImportReport.errors &&
            item.applyImportReport.errors.length > 0
          "
        >
          <v-divider class="mb-1"></v-divider>
          <h4>{{ t("applyImportReport.errors") }}</h4>
          <div v-for="(error, i) in item.applyImportReport.errors" :key="i">
            {{ error }}
          </div>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="visible = false">
          {{ t("applyImportReport.ok") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  item: { type: Object, required: true },
  modelValue: { type: Boolean, required: true },
});

const emit = defineEmits(["update:modelValue"]);
const visible = ref(false);

const { t } = useI18n();

watch(
  () => props.modelValue,
  (val) => {
    visible.value = val;
  },
  { immediate: true }
);

watch(visible, (val) => {
  emit("update:modelValue", val);
});
</script>

<style scoped>
.dense-card .v-card__text {
  padding-top: 4px !important;
  padding-bottom: 4px !important;
}
.problem-item {
  height: 24px;
  border: 1px solid #ddd;
  margin: 2px 2px 2px 0;
  padding: 2px 4px;
}
</style>
