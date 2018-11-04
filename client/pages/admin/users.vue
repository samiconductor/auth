<template>

  <v-data-table
    :headers="headers"
    :items="users"
    hide-actions
    class="elevation-1">
    <template
      slot="items"
      slot-scope="props">
      <td>{{ props.item.username }}</td>
      <td>{{ props.item.role.name }}</td>
    </template>
  </v-data-table>

</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      headers: [
        { text: "Username", value: "username" },
        { text: "Role", value: "role" }
      ]
    };
  },
  computed: {
    ...mapState("admin", ["users"])
  },
  async fetch({ store }) {
    return await store.dispatch("admin/getUsers");
  }
};
</script>
