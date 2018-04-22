import Vue from "vue";

export const state = () => ({
  collapsed: true,
  users: [],
  userActiveSessions: {}
});

export const getters = {
  userActiveSessions(state) {
    return id => state.userActiveSessions[id];
  }
};

export const mutations = {
  toggle(state) {
    state.collapsed = !state.collapsed;
  },
  users(state, users) {
    state.users = users;
  },
  addUserActiveSessions(state, { id, userActiveSessions }) {
    Vue.set(state.userActiveSessions, id, userActiveSessions);
  },
  clearUserActiveSessions(state, id) {
    Vue.set(state.userActiveSessions, id, null);
  }
};

export const actions = {
  async getUsers({ commit }) {
    const users = await this.$axios.$get("/users");

    commit("users", users);
  },
  async getUserActiveSessions({ commit }, id) {
    const userActiveSessions = await this.$axios.$get(`/users/${id}/sessions`, {
      params: {
        active: true
      }
    });

    commit("addUserActiveSessions", { id, userActiveSessions });
  },
  async endUserActiveSession({ dispatch }, { userId, sessionId }) {
    await this.$axios.$delete(`/sessions/${sessionId}`);

    await dispatch("getUserActiveSessions", userId);
  }
};
