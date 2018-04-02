<template>

  <el-main>

    <el-alert
      v-if="errors.message"
      :title="errors.message"
      type="warning"
      show-icon />

    <el-form
      ref="loginForm"
      :model="credentials"
      :rules="rules"
      @submit.native.prevent="submitLogin">

      <el-form-item
        label="Username"
        prop="username">
        <el-input
          v-model.trim="credentials.username"
          placeholder="Username" />
      </el-form-item>

      <el-form-item
        label="Password"
        prop="password">
        <el-input
          v-model="credentials.password"
          type="password"
          placeholder="password" />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          native-type="submit">
          Login
        </el-button>
      </el-form-item>

    </el-form>

  </el-main>

</template>

<script>
import { ApiError } from "../../lib/api";

export default {
  data() {
    return {
      errors: {},
      credentials: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: "Please provide a username",
            trigger: "change"
          }
        ],
        password: [
          {
            required: true,
            message: "Please provide a password",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    submitLogin() {
      this.$refs.loginForm.validate(valid => {
        if (!valid) {
          return false;
        }

        this.login();
      });
    },
    async login() {
      this.errors = {};

      try {
        await this.$store.dispatch("login", this.credentials);

        this.$router.push("/");
      } catch (error) {
        if (error instanceof ApiError) {
          this.errors = error.errors;
        } else {
          this.$set(this.errors, "message", error.message);
        }
      }
    }
  }
};
</script>
