<template>
  <v-list
    v-if="active"
    subheader>
    <v-subheader>Active Sessions</v-subheader>
    <v-list-tile
      v-for="session in recent"
      :key="session.id">
      <v-list-tile-content>
        <v-list-tile-title>{{ session.startTime | date }}</v-list-tile-title>
        <v-list-tile-sub-title>
          <span v-if="session.id == currentId">Your current session from</span>
          <span v-else>Started</span>
          {{ session.startTime | dateFrom }}.
        </v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-btn
          :disabled="session.id == currentId"
          icon
          ripple
          @click="end(session.id)">
          <v-icon color="red">delete</v-icon>
        </v-btn>
      </v-list-tile-action>
    </v-list-tile>
    <v-list-tile
      v-if="active.length > recent.length"
      :to="{ name: 'admin-sessions', query: { userId: userId } }"
      nuxt>
      <v-list-tile-sub-title>
        ...{{ active.length - recent.length }} more active sessions.
      </v-list-tile-sub-title>
    </v-list-tile>
  </v-list>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import moment from "moment";
import take from "lodash/take";
import find from "lodash/find";

export default {
  filters: {
    date(date) {
      return new moment(date).format("MMMM Do YYYY, h:mm:ss a");
    },
    dateFrom(date) {
      return new moment(date).fromNow();
    }
  },
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapState(["me"]),
    active() {
      return this.$store.getters["admin/userActiveSessions"](this.userId);
    },
    recent() {
      return take(this.active, 5);
    },
    current() {
      const { session: { id } } = this.me;

      return find(this.active, { id });
    },
    currentId() {
      return this.current && this.current.id;
    }
  },
  async created() {
    if (this.active) {
      this.clearUserActiveSessions(this.userId);
    }

    await this.getUserActiveSessions(this.userId);
  },
  methods: {
    ...mapMutations("admin", ["clearUserActiveSessions"]),
    ...mapActions("admin", ["getUserActiveSessions", "endUserActiveSession"]),
    async end(sessionId) {
      await this.endUserActiveSession({
        userId: this.userId,
        sessionId
      });
    }
  }
};
</script>
