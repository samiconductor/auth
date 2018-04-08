import Vuex from "vuex";
import get from "lodash/get";
import moment from "moment";

export default () => {
  return new Vuex.Store({
    state: {
      auth: false,
      me: {}
    },
    getters: {
      adminAccess(state) {
        return get(state, "me.access.admin", false);
      },
      loginTime(state) {
        const loginTime = get(state, "me.session.startTime");

        return loginTime && new moment(loginTime);
      }
    },
    mutations: {
      auth(store, auth) {
        store.auth = auth;
      },
      me(store, me) {
        store.me = me;
      }
    },
    actions: {
      nuxtServerInit({ commit }, { req }) {
        commit("auth", req.hasOwnProperty("user"));
      },
      async login({ commit }, { username, password }) {
        await this.$axios.$post("/login", {
          username,
          password
        });

        commit("auth", true);
      },
      async logout({ commit }) {
        await this.$axios.$post("/logout");

        commit("auth", false);
      },
      async me({ commit }) {
        const me = await this.$axios.$get("/me");

        commit("me", me);
      }
    }
  });
};
