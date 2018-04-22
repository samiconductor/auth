import get from "lodash/get";
import moment from "moment";

export const state = () => ({
  auth: false,
  me: {}
});

export const getters = {
  adminAccess(state) {
    return get(state, "me.access.admin", false);
  },
  loginTime(state) {
    const loginTime = get(state, "me.session.startTime");

    return loginTime && new moment(loginTime);
  }
};

export const mutations = {
  auth(store, auth) {
    store.auth = auth;
  },
  me(store, me) {
    store.me = me;
  }
};

export const actions = {
  async nuxtServerInit({ commit, dispatch }, { req }) {
    const auth = req.hasOwnProperty("user");

    commit("auth", auth);

    if (auth) {
      await dispatch("me");
    }
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
};
