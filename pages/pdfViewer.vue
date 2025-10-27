<script setup>
import { ref } from 'vue'
import emailAttachmentsTable from '~/components/Table/emailAttachmentsTable.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const headers = [
  { title: t('header_select'), key: 'select', align: 'center', width: '50' },
  { title: t('header_id'), key: 'id', align: 'center', sortable: true },
  { title: t('header_name'), key: 'name', align: 'center', sortable: true },
  { title: t('header_sender'), key: 'sender', align: 'center', sortable: true },
  { title: t('header_subject'), key: 'subject', align: 'center', sortable: false },
]

const url = ref(null)

async function selectPdf(path){
  url.value = "http://localhost:5052" + path.substring(81)
  console.log(url)
}
</script>

<template>
  <v-container fluid class="pa-4">
    <v-row dense align="start" justify="space-between">
      <v-col v-if="url" cols="12" md="6">
        <v-card class="pa-2 rounded-lg elevation-3">
          <v-card-title class="text-h6 font-weight-medium">
            {{ t('header_pdf_preview') }}
          </v-card-title>
          <v-card-text>
            <iframe
              id="PDFPreview"
              title="PDF Preview"
              :src="url"
              class="w-100 rounded-lg"
              style="border: 1px solid #ccc; height: 87vh;"
            ></iframe>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col :cols="url ? 6 : 12">
        <v-card class="pa-4 rounded-lg elevation-3">
          <v-card-title class="text-h6 font-weight-medium">
            {{ t('header_email_attachments') }}
          </v-card-title>
          <v-card-text>
            <emailAttachmentsTable :headers="headers" @select-pdf="selectPdf" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
@media (max-width: 960px) {
  iframe {
    height: 70vh !important;
  }
}
</style>
