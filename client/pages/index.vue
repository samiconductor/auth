<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex>
        <h3 class="display-3">Welcome {{ me.username }}</h3>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["me"])
  }
};
</script>
