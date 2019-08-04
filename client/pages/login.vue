<template>
  <v-card class="elevation-12">
    <v-toolbar dark color="primary">
      <v-toolbar-title>Login</v-toolbar-title>
    </v-toolbar>

    <v-form ref="form" v-model="valid" @submit.prevent="login">
      <v-card-text>
        <v-alert v-model="error" type="error" dismissible>
          {{ error }}
        </v-alert>

        <v-text-field
          v-model.trim="username"
          :rules="usernameRules"
          prepend-icon="mdi-account-box"
          label="Username"
          type="text"
          required
        />
        <v-text-field
          v-model="password"
          :rules="passwordRules"
          prepend-icon="mdi-lock"
          label="Password"
          type="password"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn :disabled="!valid" color="primary" type="submit">
          Login
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
export default {
  layout: "centered",
  data() {
    return {
      valid: false,
      error: null,
      username: "",
      usernameRules: [v => !!v || "Please provide a username"],
      password: "",
      passwordRules: [v => !!v || "Please provide a password"]
    };
  },
  methods: {
    async login() {
      if (!this.$refs.form.validate()) {
        return;
      }

      this.error = null;

      try {
        await this.$store.dispatch("login", {
          username: this.username,
          password: this.password
        });

        await this.$store.dispatch("me");

        this.$router.push("/");
      } catch (error) {
        this.error = error.message;
      }
    }
  }
};
</script>
