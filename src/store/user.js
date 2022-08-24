const state = {
  userData: {},
};

const getters = {};

const mutations = {
  UPDATE_USER(state, user) {
    state.userData = user;
  },

  REVOKE_USER(state) {
    state.userData = {
      id: null,
      name: "",
    };
  },
};

const actions = {
  // first param is context object
  updateUser({ state, commit, rootState }, data) {
    console.log("action update");
    return new Promise((resolve) => {
      commit("UPDATE_USER", data);
      localStorage.setItem("userData", JSON.stringify(data));
      resolve();
    });
  },

  revokeUser({ commit }) {
    return new Promise((resolve) => {
      commit("REVOKE_USER");
      localStorage.removeItem("userData");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
