<script setup>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const password = ref("");
const confirmPassword = ref("");
const valid = ref(false);
const form = ref();

const passwordRules = [
  v => !!v || t("password_required"),
  v => v.length >= 6 || t("password_min_length"),
];

const confirmPasswordRules = [
  v => !!v || t("confirm_password_required"),
  v => v === password.value || t("passwords_must_match"),
];

const emit = defineEmits(["submit"]);

const onSubmit = () => {
  if (form.value.validate()) {
    emit("submit", password.value);
  }
};
</script>

<template>
  <v-card class="mx-auto my-12 pa-6" max-width="400">
    <v-card-title class="text-h5">{{ t("reset_password") }}</v-card-title>

    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-text-field
          v-model="password"
          :label="t('new_password')"
          :rules="passwordRules"
          type="password"
          required
          variant="solo"
          rounded="xl"
          density="comfortable"
          hide-details
        />
        <br />
        <v-text-field
          v-model="confirmPassword"
          :label="t('confirm_password')"
          :rules="confirmPasswordRules"
          type="password"
          required
          variant="solo"
          rounded="xl"
          density="comfortable"
          hide-details
        />
      </v-form>
    </v-card-text>

    <v-card-actions class="d-flex flex-column">
      <v-btn color="primary" block @click="onSubmit" :disabled="!valid">
        {{ t("change_password") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<!-- <style scoped>
.v-card-text {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style> -->
