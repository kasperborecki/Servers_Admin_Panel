<script setup>
import { ref } from "vue";
import { AuthorizationRepository } from "~/repository/authorizationRepository";

const { t } = useI18n();
const auth = useAuth();
const repo = new AuthorizationRepository();

const password = ref("");
const confirmPassword = ref("");
const valid = ref(false);
const form = ref();

const user = auth.data.value;

const snackbar = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("success");

const passwordRules = [
  (v) => !!v || t("password_required"),
  (v) => v.length >= 6 || t("password_min_length"),
];

const confirmPasswordRules = [
  (v) => !!v || t("confirm_password_required"),
  (v) => v === password.value || t("passwords_must_match"),
];

function showSnackbar(message, type = "success") {
  snackbarMessage.value = message;
  snackbarColor.value = type === "success" ? "success" : "error";
  snackbar.value = true;
}

const submitReset = async () => {
  if (!form.value.validate()) return;

  try {
    await repo.resetPassword({ userId: user.userId, password: password.value });
    showSnackbar(t("password_reset_success"), "success");
  } catch (err) {
    console.error(err);
    showSnackbar(t("password_reset_error"), "error");
  }
};
</script>

<template>
  <v-snackbar
    v-model="snackbar"
    :color="snackbarColor"
    top
    right
    timeout="4000"
  >
    {{ snackbarMessage }}
    <template #action>
      <v-btn text color="primary" @click="snackbar = false">
        {{ t("btn_close") }}
      </v-btn>
    </template>
  </v-snackbar>

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
        <br/>
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
      <v-btn color="primary" block @click="submitReset" :disabled="!valid">
        {{ t("change_password") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.v-card-text {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
