<template>
  <v-card class="pa-4" dense flat>
    <v-row>
      <v-col md="3" xl="2">
        <DatePicker
          v-model="importDates"
          :label="t('documentsFilters.importPeriod')"
        />
      </v-col>

      <v-col md="3" xl="2">
        <v-select
          v-model="selectedDocType"
          :items="documentTypes"
          :label="t('documentsFilters.documentType')"
          density="compact"
          variant="outlined"
          item-title="title"
          item-value="value"
          @update:model-value="filtersHandler"
        />
      </v-col>

      <v-spacer />

      <v-col md="3" xl="2" class="align-self-end">
        <v-text-field
          v-model="phrase"
          density="compact"
          variant="outlined"
          :label="t('documentsFilters.searchDocument')"
          prepend-inner-icon="mdi-magnify"
          @input="filtersHandler"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import DatePicker from "../global/DatePicker.vue";

const { t } = useI18n();

const props = defineProps({
  fetch: Function,
});

const today = new Date();
const prevMonth = new Date(
  today.getFullYear(),
  today.getMonth() - 1,
  today.getDate()
);

const importDates = ref([prevMonth.toISOString(), today.toISOString()]);

const selectedDocType = ref("All");
const phrase = ref("");
const filter = ref({});

const documentTypes = computed(() => [
  { title: t("documentsFilters.typeAll"), value: "All" },
  { title: t("documentsFilters.typeBonus"), value: "bonus" },
]);

function filtersHandler() {
  if (!Array.isArray(importDates.value) || importDates.value.length < 2) return;

  const sorted = [...importDates.value].sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const normalizeToIso = (d) => {
    if (!d) return null;
    if (typeof d === "string") return d;
    if (d instanceof Date) return d.toISOString();
    return null;
  };

  filter.value = {
    type: selectedDocType.value,
    dateFrom: normalizeToIso(sorted[0]),
    dateTo: normalizeToIso(sorted[1]),
    phrase: phrase.value || "",
  };

  props.fetch(filter.value);
}

watch(importDates, (val) => {
  if (Array.isArray(val) && val.length >= 2) {
    filtersHandler();
  }
});
</script>
