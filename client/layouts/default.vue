<template>

  <v-app>

    <v-toolbar
      app
      dark
      color="primary">
      <v-toolbar-title>Auth</v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-btn
          flat
          nuxt
          exact
          to="/">
          Home
        </v-btn>
        <v-btn
          v-if="adminAccess"
          flat
          nuxt
          to="/admin">
          Admin
        </v-btn>
        <v-btn
          flat
          @click="logout">
          Logout
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <nuxt />
    </v-content>

  </v-app>

</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: mapGetters(["adminAccess"]),
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
