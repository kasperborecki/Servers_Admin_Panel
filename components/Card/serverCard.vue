<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { ServerRepository } from '~/repository/serverRepository'

const props = defineProps({
  referenceId: Number,
})

function statusDotColor(status) {
  return status === 'Online' ? 'green' : 'red'
}

const server = ref({})
const error = ref('')
const repo = new ServerRepository()

async function fetchChosenServer() {
  try {
    const data = await repo.getById(props.referenceId)
    server.value = data
  } catch (err) {
    error.value = err.message
  }
}

onMounted(fetchChosenServer)

watch(
  () => props.referenceId,
  (newId, oldId) => {
    if (newId !== oldId) {
      fetchChosenServer()
    }
  }
)

const formattedCreatedAt = computed(() => {
  return server.value?.createdAt ? server.value.createdAt.split('T')[0] : ''
})

const formattedModifiedAt = computed(() => {
  return server.value?.modifiedAt ? server.value.modifiedAt.split('T')[0] : ''
})

const ramVolumeGb = computed(() => {
  return server.value?.ramVolume?.volumeGb ?? '—'
})

</script>


<template>
  <v-container>
    <v-row>
      <v-col
        :key="server.id"
        cols="12"
      >
        <v-card class="pa-4 card border rounded-xl">
          <div class="d-flex justify-space-between align-center mb-2">
            <div class="d-flex align-center">
              <v-avatar
                :color="statusDotColor(server.status)"
                size="15"
                class="mr-2"
              ></v-avatar>
              <p class="text-h5 mb-0 font-weight-black">{{ server.name }}</p>
            </div>
            <div class="text-right">
              <p class="text-subtitle-2 mb-0 font-weight-black">IP: {{ server.ipAddress }}</p>
              <p class="text-subtitle-2 mb-0 font-weight-black">OS: {{ server.os }}</p>
            </div>
          </div>

          <div class="d-flex justify-space-between mb-2">
            <p class="text-subtitle-1 mb-0 font-weight-black">{{ server.country }}</p>
            <p class="text-subtitle-1 mb-0 font-weight-black">{{ server.location }}</p>
          </div>

          <p class="text-subtitle-2 mb-1 font-weight-black">
            {{ $t('header_createdAt') }}: {{ formattedCreatedAt }}
          </p>
          <p class="text-subtitle-2 mb-3 font-weight-black">
            {{ $t('header_modifiedAt') }}: {{ formattedModifiedAt }}
          </p>

          <div class="d-flex justify-space-between">
            <p class="text-subtitle-1 mb-0 font-weight-black">
              {{ $t('header_cores') }}: {{ server.cpuCores }}
            </p>
            <p class="text-subtitle-1 mb-0 font-weight-black">
              RAM: {{ ramVolumeGb }} GB
            </p>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<style scoped>
.card{
  background: url('../../assets/172040938-white-and-light-grey-warsaw-city-area-vector-background-map-streets-and-water-cartography.jpg');
  background-size: cover;
}
</style>