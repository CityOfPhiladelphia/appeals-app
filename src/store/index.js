/* eslint-disable */
import Vue from 'vue';
import Vuex from 'vuex';
import rcos from '@/store/rcos';
import decisions from '@/store/decisions';
import history from '@/store/history';
import slugify from '@/store/helpers';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    appealsTable: [],
    appelsTypesByID: [],
    appealsDetails: [],
  },
  getters: {
    getAppealsTableBySlug: (state) => (slug) => {
      return state.appealsTable[slugify(slug)] || null;
    },

    getAppealsTypesByID: (state) => (number) => {
      return state.appelsTypesByID[number] || null;
    },

    getAppealDetailBySlug: (state) => (slug) => {
      return state.appealsDetails[slugify(slug)] || null;
    },
  },
  mutations: {
    setAppealsTable(state, obj) {
      state.appealsTable[slugify(obj.slug)] = obj.data;
    },
    setAppealTypeByID(state, appealType) {
      state.appelsTypesByID[appealType.appealNo] = appealType.types;
    },
    setAppealDetailBySlug(state, obj) {
      state.appealsDetails[slugify(obj.slug)] = obj.data;
    }
  },
  actions: {
    renderAppealsTypesByID({ commit }, appeals) {
      for(let i = 0; i < appeals.length; i+=1) {
        commit('setAppealTypeByID', { appealNo: appeals[i].appealno, types: appeals[i].appealtype });
      }
    },
    setAppealsHome({ commit, dispatch }, obj ) {
      commit('setAppealsTable', obj);
      dispatch('renderAppealsTypesByID', obj.data);
    },
  },
  modules: {
    rcos,
    decisions,
    history,
  },
});

export default store;