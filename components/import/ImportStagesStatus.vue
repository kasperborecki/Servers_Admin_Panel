<template>
  <div v-if="item" class="d-flex justify-start import-statuses">
    <div>
      <v-btn
        icon
        variant="text"
        size="small"
        :disabled="!stage1"
        @click.stop="stage1 && (showRawImportReport = true)"
      >
        <v-icon
          v-if="stage1"
          :color="
            !stage1.shouldEndProcessing
              ? stage1.allOk
                ? 'success'
                : 'warning'
              : 'error'
          "
        >
          {{
            !stage1.shouldEndProcessing
              ? "mdi-check-network-outline"
              : "mdi-close-network-outline"
          }}
        </v-icon>
        <v-icon v-else color="grey lighten-2" class="import-status-inactive">
          mdi-network-outline
        </v-icon>
      </v-btn>
    </div>

    <div>
      <v-btn
        icon
        variant="text"
        size="small"
        :disabled="!stage2"
        @click.stop="stage2 && (showMergingReport = true)"
      >
        <v-icon
          v-if="stage2"
          :color="
            !stage2.shouldEndProcessing
              ? stage2.allOk
                ? 'success'
                : 'warning'
              : 'error'
          "
        >
          {{
            !stage2.shouldEndProcessing
              ? "mdi-check-network-outline"
              : "mdi-close-network-outline"
          }}
        </v-icon>
        <v-icon v-else color="grey lighten-2" class="import-status-inactive">
          mdi-network-outline
        </v-icon>
      </v-btn>
    </div>

    <div>
      <v-btn
        icon
        variant="text"
        size="small"
        :disabled="!stage3"
        @click.stop="stage3 && (showApplyingReport = true)"
      >
        <v-icon
          v-if="stage3"
          :color="
            !stage3.shouldEndProcessing
              ? stage3.allOk
                ? 'success'
                : 'warning'
              : 'error'
          "
        >
          {{
            !stage3.shouldEndProcessing
              ? "mdi-check-network-outline"
              : "mdi-close-network-outline"
          }}
        </v-icon>
        <v-icon v-else color="grey lighten-2" class="import-status-inactive">
          mdi-network-outline
        </v-icon>
      </v-btn>
    </div>

    <RawImportReport v-model="showRawImportReport" :item="item" />
    <MergingReport v-model="showMergingReport" :item="item" />
    <ApplyingReport v-model="showApplyingReport" :item="item" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

import MergingReport from "./MergingReport.vue";
import RawImportReport from "./RawImportReport.vue";
import ApplyingReport from "./ApplyingReport.vue";

const props = defineProps({
  item: { type: Object, required: true },
});

onMounted(() => {
  if (!props.item) {
    throw new Error("Item prop is required for ImportStagesStatus component.");
  }
});

const showRawImportReport = ref(false);
const showMergingReport = ref(false);
const showApplyingReport = ref(false);

const stage1 = computed(() => props.item?.rawImportReport);
const stage2 = computed(() => props.item?.dictionariesMergeReport);
const stage3 = computed(() => props.item?.applyImportReport);
</script>

<style scoped>
.import-status-inactive {
  margin: 2px 0 0 0;
  padding: 0;
}
</style>
