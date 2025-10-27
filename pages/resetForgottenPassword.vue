<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { AuthorizationRepository } from "~/repository/authorizationRepository";
import resetForgottenPasswordForm from '~/components/forms/resetForgottenPasswordForm.vue';

const route = useRoute();
const router = useRouter();
const repo = new AuthorizationRepository();

const userId = ref("");
const token = ref("");

onMounted(() => {
  userId.value = route.query.u || "";
  token.value = route.query.token || "";
});

const snackbar = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("success");

function showSnackbar(message, type = "success") {
  snackbarMessage.value = message;
  snackbarColor.value = type === "success" ? "success" : "error";
  snackbar.value = true;
}

const submitReset = async (password) => {
  if (!userId.value || !token.value) {
    showSnackbar("Invalid reset link", "error");
    return;
  }

  try {
    await repo.resetForgottenPassword({
      userId: userId.value,
      token: token.value,
      password
    });
    showSnackbar("Password changed successfully", "success");
    router.push("/login");
  } catch (err) {
    console.error(err);
    showSnackbar("Password reset failed", "error");
  }
};
</script>

<template>
  <v-snackbar v-model="snackbar" :color="snackbarColor" top right timeout="4000">
    {{ snackbarMessage }}
    <template #action>
      <v-btn text color="primary" @click="snackbar = false">Close</v-btn>
    </template>
  </v-snackbar>

  <resetForgottenPasswordForm @submit="submitReset" />
</template>
