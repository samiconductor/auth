<template>

  <div>

    <v-navigation-drawer
      :mini-variant="collapsed"
      app
      permanent
      clipped>
      <v-toolbar flat>
        <v-list>
          <v-list-tile @click="toggle">
            <v-list-tile-action>
              <v-icon>chevron_{{ collapsed ? 'right' : 'left' }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Admin</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-divider />
      <v-list>
        <v-list-tile
          v-for="(item, index) in nav"
          :key="index"
          :to="item.to">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-container fluid>
      <v-layout>
        <v-flex>
          <nuxt-child />
        </v-flex>
      </v-layout>
    </v-container>

  </div>

</template>

<script>
import { mapState, mapMutations } from "vuex";
import head from "lodash/head";

export default {
  data: function() {
    return {
      nav: [
        {
          to: "/admin/users",
          icon: "person",
          title: "Users"
        },
        {
          to: "/admin/sessions",
          icon: "access_time",
          title: "Sessions"
        },
        {
          to: "/admin/sites",
          icon: "cloud",
          title: "Sites"
        }
      ]
    };
  },
  computed: {
    ...mapState("admin", ["collapsed"])
  },
  created() {
    if (this.$route.name === "admin") {
      this.$router.replace(head(this.nav).to);
    }
  },
  methods: {
    ...mapMutations("admin", ["toggle"])
  }
};
</script>
