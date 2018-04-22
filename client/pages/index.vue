<template>

  <v-jumbotron>
    <v-container fill-height>
      <v-layout align-center>
        <v-flex>
          <h3 class="display-3">Welcome {{ me.username }}</h3>
          <span class="subheading">You have been logged in for {{ loginTime.fromNow(true) }}.</span>
        </v-flex>
      </v-layout>
    </v-container>
  </v-jumbotron>

</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  computed: {
    ...mapState(["me"]),
    ...mapGetters(["loginTime"])
  }
};
</script>
