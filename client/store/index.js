import Vuex from "vuex";
import api, { ApiError } from "../lib/api";
import log from "../lib/log";

export default () => {
  return new Vuex.Store({
    state: {
      auth: false
    },
    mutations: {
      auth(store, auth) {
        store.auth = auth;
      }
    },
    actions: {
      nuxtServerInit({ commit }, { req }) {
        commit("auth", req.hasOwnProperty("user"));
      },
      async login({ commit }, { username, password }) {
        try {
          const response = await api.post("/login", { username, password });

          commit("auth", response.ok);

          if (!response.ok) {
            const data = await response.json();

            throw new ApiError(response, data, data.message);
          }
        } catch (error) {
          log.error(error);

          throw error;
        }
      }
    }
  });
};
