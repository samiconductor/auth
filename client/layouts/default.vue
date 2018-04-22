<template>

  <v-app>

    <v-toolbar
      app
      dark
      clipped-left
      color="primary">
      <v-toolbar-title>Auth</v-toolbar-title>
      <v-spacer />
      <v-btn
        icon
        nuxt
        exact
        to="/">
        <v-icon>home</v-icon>
      </v-btn>
      <v-btn
        v-if="adminAccess"
        icon
        nuxt
        to="/admin">
        <v-icon>settings</v-icon>
      </v-btn>
      <v-btn
        icon
        @click="logout">
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar>

    <v-content>
      <nuxt />
    </v-content>

  </v-app>

</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["adminAccess"])
  },
  methods: {
    async logout() {
      await this.$store.dispatch("logout");

      // FIXME router push freezes????
      // this.$router.push("/login");
      window.location.reload();
    }
  }
};
</script>
