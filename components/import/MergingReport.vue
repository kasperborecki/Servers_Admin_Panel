<template>
  <v-dialog v-model="visible" max-width="600">
    <v-card v-if="item.dictionariesMergeReport" class="dense-card">
      <v-card-title>
        {{ t("mergingReport.file", { filename: item.filename }) }}
      </v-card-title>

      <v-card-text>
        <!-- SUKCES -->
        <v-alert
          v-if="item.dictionariesMergeReport.allOk"
          density="compact"
          variant="outlined"
          type="success"
          border="left"
        >
          {{ t("mergingReport.success") }}
        </v-alert>

        <!-- OSTRZEŻENIE -->
        <v-alert
          v-if="
            !item.dictionariesMergeReport.allOk &&
            !item.dictionariesMergeReport.shouldEndProcessing
          "
          density="compact"
          variant="outlined"
          type="warning"
          border="left"
        >
          {{ t("mergingReport.warning") }}
        </v-alert>

        <!-- BŁĄD -->
        <v-alert
          v-if="item.dictionariesMergeReport.shouldEndProcessing"
          density="compact"
          variant="outlined"
          type="error"
          border="left"
        >
          {{ t("mergingReport.error") }}
        </v-alert>

        <v-divider class="mb-1" />
        <h4>{{ t("mergingReport.details") }}</h4>

        <!-- LISTA ZMIAN -->
        <ul v-if="actualMerges.length > 0">
          <li
            v-for="d in actualMerges"
            :key="d.dictionaryName"
            class="dict-item"
          >
            <div>
              <strong>{{
                t("mergingReport.dictionary", { name: d.dictionaryName })
              }}</strong
              >:
            </div>
            <div v-for="(issue, i) in d.issues" :key="i" class="ml-3">
              - {{ issue.description }}: {{ issue.value }}
            </div>
          </li>
        </ul>

        <!-- BRAK NOWYCH ELEMENTÓW -->
        <ul v-else>
          <li>{{ t("mergingReport.noNewItems") }}</li>
        </ul>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="visible = false">{{
          t("mergingReport.ok")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  item: { type: Object, required: true },
  modelValue: { type: Boolean, required: true },
});

const emit = defineEmits(["update:modelValue"]);

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const actualMerges = computed(() => {
  return (
    props.item.dictionariesMergeReport?.dictionariesMergingResults?.filter(
      (x) => x.issues && x.issues.length > 0
    ) || []
  );
});
</script>

<style scoped>
.dense-card .v-card__text {
  padding-top: 4px !important;
  padding-bottom: 4px !important;
}
.dict-item {
  margin-bottom: 10px;
}
</style>
