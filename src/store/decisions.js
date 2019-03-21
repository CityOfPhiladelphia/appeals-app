/* eslint-disable */
import slugify from '@/assets/js/helpers';

export default {
  namespaced: true,
  state: {
    decisions: [],
  },
  getters: {
    getDecisionBySlug: (state) => (slug) => {
      return state.decisions[slugify(slug)] || null;
    },
  },
  mutations: {
    setDecisionBySlug(state, obj) {
      state.decisions[slugify(obj.slug)] = obj.data;
    }
  },
};
