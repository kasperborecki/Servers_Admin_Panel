<template>
  <v-dialog v-model="visible" max-width="600">
    <v-card v-if="item?.rawImportReport" class="dense-card">
      <v-card-title>
        {{ t("rawImportReport.file", { filename: item.filename }) }}
      </v-card-title>

      <v-card-text>
        <!-- SUKCES -->
        <v-alert
          v-if="item.rawImportReport.allOk"
          density="compact"
          variant="outlined"
          type="success"
          border="left"
        >
          {{ t("rawImportReport.success") }}
        </v-alert>

        <!-- OSTRZEŻENIE -->
        <v-alert
          v-else-if="!item.rawImportReport.shouldEndProcessing"
          variant="outlined"
          density="compact"
          type="warning"
          border="left"
        >
          {{ t("rawImportReport.warning") }}
        </v-alert>

        <!-- BŁĄD -->
        <v-alert
          v-else
          density="compact"
          variant="outlined"
          type="error"
          border="left"
        >
          {{ t("rawImportReport.error") }}
        </v-alert>

        <v-divider class="mb-1" />
        <h4>{{ t("rawImportReport.details") }}</h4>

        <div class="success--text">
          {{
            t("rawImportReport.totalItems", {
              count: item.rawImportReport.itemsInFile,
            })
          }}
        </div>
        <div class="success--text">
          {{
            t("rawImportReport.imported", {
              count: item.rawImportReport.itemsImported,
            })
          }}
        </div>
        <div
          v-if="
            item.rawImportReport.itemsInFile >
            item.rawImportReport.itemsImported
          "
          class="warning--text"
        >
          {{
            t("rawImportReport.rejected", {
              count:
                item.rawImportReport.itemsInFile -
                item.rawImportReport.itemsImported,
            })
          }}
        </div>
      </v-card-text>

      <v-card-text v-if="!issuesLoaded || item.rawImportReport.issues.length">
        <h4>
          {{ t("rawImportReport.errors") }}
          ({{
            issuesLoaded
              ? item.rawImportReport.issues.length
              : t("rawImportReport.loading")
          }})
        </h4>

        <v-progress-circular v-if="!issuesLoaded" indeterminate class="ma-2" />

        <v-virtual-scroll
          v-else
          :bench="0"
          :items="item.rawImportReport.issues"
          height="200"
          item-height="32"
          class="pa-2"
        >
          <template #default="{ item, index }">
            <div
              :class="[
                'problem-item text-truncate text-caption',
                item.description?.startsWith('!') ? 'critical--text' : '',
              ]"
            >
              {{ index + 1 }}.
              {{
                item.row && item.column ? `[${item.row},${item.column}]` : ""
              }}
              {{ item.description }}

              <b v-if="item.description?.startsWith('!')">
                &nbsp;&nbsp;&nbsp;&nbsp;
                {{ t("rawImportReport.rowRejected", { row: item.row }) }}
              </b>
            </div>
          </template>
        </v-virtual-scroll>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="visible = false">
          {{ t("rawImportReport.ok") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  item: { type: Object, required: true },
  modelValue: { type: Boolean, required: true },
});

const emit = defineEmits(["update:modelValue"]);
const { $importsApi } = useNuxtApp();

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const item = ref(null);
const issuesLoaded = ref(false);

watch(
  () => props.modelValue,
  async (val) => {
    if (!val) return;
    issuesLoaded.value = false;
    item.value = { ...props.item };

    try {
      const response = await $importsApi.getImportById(item.value.id);

      if (response.success) {
        item.value.rawImportReport.issues = (
          response.data.rawImportReport.issues ?? []
        ).sort((a, b) => (a.description?.startsWith("!") ? -1 : 1));
      } else {
        item.value.rawImportReport.issues = [];
      }
    } catch (err) {
      console.error("Failed to fetch report:", err);
      item.value.rawImportReport.issues = [];
    } finally {
      issuesLoaded.value = true;
    }
  },
  { immediate: true }
);
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
.critical--text {
  color: red;
  border: 1px solid red;
}
</style>
