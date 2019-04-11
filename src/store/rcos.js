export default {
  namespaced: true,
  state: {
    rcos: [],
  },
  mutations: {
    setRcos(st, rcos) {
      const state = st;
      state.rcos = rcos;
    },
  },
};
