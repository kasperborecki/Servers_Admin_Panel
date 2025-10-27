<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { AuthorizationRepository } from "~/repository/authorizationRepository";

const repo = new AuthorizationRepository();
const router = useRouter();
const { t } = useI18n();

const username = ref("");
const email = ref("");
const valid = ref(false);
const form = ref();
const error = ref("");
const success = ref("");

const snackbar = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("success");

const usernameRules = [(v) => !!v || t("login_required")];
const emailRules = [
  (v) => !!v || t("email_required"),
  (v) => /^\S+@\S+\.\S+$/.test(v) || t("email_invalid"),
];

function showSnackbar(message, type = "success") {
  snackbarMessage.value = message;
  snackbarColor.value = type === "success" ? "success" : "error";
  snackbar.value = true;
}

const submitReset = async () => {
  try {
    await repo.forgotPassword({ email: email.value, username: username.value });
    showSnackbar(t("email_sender_success"), "success");
  } catch (err) {
    console.error(err);
    showSnackbar(t("email_sender_error"), "error");
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
          v-model="username"
          :label="t('login')"
          :rules="usernameRules"
          required
          variant="solo"
          rounded="xl"
          density="comfortable"
          hide-details
        />
        <br />
        <v-text-field
          v-model="email"
          :label="t('email')"
          :rules="emailRules"
          required
          variant="solo"
          rounded="xl"
          density="comfortable"
          hide-details
        />
      </v-form>

      <p v-if="error" class="error-message">{{ error }}</p>
      <p v-if="success" class="success-message">{{ success }}</p>
    </v-card-text>

    <v-card-actions class="d-flex flex-column">
      <v-btn color="primary" block @click="submitReset" :disabled="!valid">
        {{ t("send_reset_link") }}
      </v-btn>

      <v-btn text color="secondary" @click="router.push('/login')">
        {{ t("back_to_login") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.error-message {
  color: red;
  font-size: 14px;
  margin-top: 8px;
}

.success-message {
  color: green;
  font-size: 14px;
  margin-top: 8px;
}
</style>
