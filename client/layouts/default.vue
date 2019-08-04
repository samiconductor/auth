<template>
  <v-app>
    <v-app-bar app color="primary">
      <v-toolbar-title>Auth</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="logout">
        <v-icon>mdi-lock-open</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
export default {
  methods: {
    async logout() {
      await this.$store.dispatch("logout");

      this.$router.push({ name: "login" });
    }
  }
};
</script>
