export const state = () => ({
  auth: false,
  me: {}
});

export const getters = {};

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
    const auth = !!req.authenticated;

    commit("auth", auth);

    if (auth) {
      await dispatch("me");
    }
  },
  async me({ commit }) {
    const me = await this.$axios.$get("/me");

    commit("me", me);
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
  }
};
