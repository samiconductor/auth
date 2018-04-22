<template>

  <v-container grid-list-md>
    <v-layout
      row
      wrap>
      <v-flex
        xs12
        md6
        lg4
        xl3>

        <user
          v-for="user in users"
          :key="user.id"
          :user="user" />

      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
import { mapState } from "vuex";
import User from "@/components/admin/users/User.vue";

export default {
  components: {
    User
  },
  computed: {
    ...mapState("admin", ["users"])
  },
  async fetch({ store }) {
    return await store.dispatch("admin/getUsers");
  }
};
</script>
