/* eslint-disable */
import slugify from '@/assets/js/helpers';

export default {
  namespaced: true,
  state: {
    history: [],
  },
  getters: {
    getHistoryBySlug: (state) => (slug) => {
      return state.history[slugify(slug)] || null;
    },
  },
  mutations: {
    setHistoryBySlug(state, obj) {
      state.history[slugify(obj.slug)] = obj.data;
    }
  },
};