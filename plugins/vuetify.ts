import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { VFileUpload } from "vuetify/labs/VFileUpload";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
    icons: { defaultSet: "mdi" },
    components: {
    VFileUpload,
  },
    theme: {
      defaultTheme: "light",
      themes: {
        light: {
          colors: {
            primary: "#1976D2",
            secondary: "#424242",
            success: "#4CAF50",
            info: "#2196F3",
            warning: "#FB8C00",
            error: "#F44336",
          },
        },
        dark: {
          colors: {
            primary: "#90CAF9",
            secondary: "#78909C",
            success: "#66BB6A",
            info: "#29B6F6",
            warning: "#FFA726",
            error: "#EF5350",
            background: "#555555ff",
            surface: "#333333ff",
            onPrimary: "#3d3d3dff",
            onSecondary: "#FFFFFF",
          },
        },
      },
    },
  });

  app.vueApp.use(vuetify);
});
