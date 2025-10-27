<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const auth = useAuth();
const router = useRouter();
const { t } = useI18n();

const login = ref("");
const password = ref("");
const valid = ref(false);
const form = ref();
const error = ref("");

const loginRules = [(v) => !!v || t("email_required")];
const passwordRules = [(v) => !!v || t("password_required")];

const submit = async () => {
  if (!form.value.validate()) return;

  try {
    await auth.signIn({ username: login.value, password: password.value });
  } catch (err) {
    console.error(err);
    error.value = t("login_failed");
  }
};

const goToResetPassword = () => {
  router.push("/forgotPassword");
};
</script>

<template>
  <v-card class="mx-auto my-12 pa-6" max-width="400">
    <v-card-title class="text-h5">{{ t("login_title") }}</v-card-title>

    <v-card-text>
      <v-form ref="form" v-model="valid">
        <div class="border border-gray-300 rounded-xl d-flex justify-center">
          <v-text-field
            v-model="login"
            :label="t('login')"
            :rules="loginRules"
            required
            variant="solo"
            maxLength="100"
            flat
            bg-color="transparent"
            rounded="xl"
            density="comfortable"
            hide-details
          />
        </div>
        <br />
        <div class="border border-gray-300 rounded-xl d-flex justify-center">
          <v-text-field
            v-model="password"
            :label="t('password')"
            :rules="passwordRules"
            type="password"
            required
            variant="solo"
            maxLength="100"
            flat
            bg-color="transparent"
            rounded="xl"
            density="comfortable"
            hide-details
          />
        </div>
      </v-form>

      <p v-if="error" class="error-message">{{ error }}</p>
    </v-card-text>

    <v-card-actions class="d-flex flex-column">
      <v-btn color="primary" class="mb-8" block @click="submit" :disabled="!valid">
        {{ t("sign_in") }}
      </v-btn>

      <div class="forgot-password">
        <p>{{ t("forgot_password_text") }}</p>
        <v-btn text color="primary" @click="goToResetPassword">
          {{ t("reset_password_btn") }}
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.forgot-password {
  text-align: center;
  margin-top: 16px;
}

.forgot-password p {
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
}

.forgot-password .v-btn {
  text-transform: none;
  font-weight: 500;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 8px;
}
</style>
