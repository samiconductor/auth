<template>
  <v-card>
    <v-card-title class="title">{{ user.username }}</v-card-title>

    <v-divider v-if="user.privileges.length" />

    <v-list
      v-if="user.privileges.length"
      subheader>
      <v-subheader>Privileges</v-subheader>
      <v-list-tile
        v-for="priv in user.privileges"
        :key="priv.id">
        <v-list-tile-content>
          <v-list-tile-title>{{ priv.name }}</v-list-tile-title>
          <v-list-tile-sub-title>{{ priv.description }}</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <edit
      v-if="edit"
      :user="user" />

    <v-divider v-if="sessions" />

    <sessions
      v-if="sessions"
      :user-id="user.id" />

    <v-card-actions>
      <v-spacer />
      <v-btn
        color="grey"
        flat
        icon
        ripple
        @click="sessions = !sessions">
        <v-icon>{{ sessions ? 'close' : 'access_time' }}</v-icon>
      </v-btn>
      <v-btn
        color="primary"
        flat
        icon
        ripple
        @click="edit = !edit">
        <v-icon>{{ edit ? 'close' : 'edit' }}</v-icon>
      </v-btn>
      <v-btn
        color="red"
        flat
        icon
        ripple
        @click="remove">
        <v-icon>delete</v-icon>
      </v-btn>
    </v-card-actions>

  </v-card>
</template>

<script>
import Sessions from "./Sessions.vue";
import Edit from "./Edit.vue";

export default {
  components: {
    Sessions,
    Edit
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      edit: false,
      sessions: false
    };
  },
  methods: {
    remove() {
      console.log("remove");
    }
  }
};
</script>
