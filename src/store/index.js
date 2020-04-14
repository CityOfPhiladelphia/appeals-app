/* eslint-disable */
import Vue from 'vue';
import Vuex from 'vuex';
import rcos from '@/store/rcos';
import decisions from '@/store/decisions';
import history from '@/store/history';
import slugify from '@/assets/js/helpers';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    appealsTable: [],
    appelsTypesByID: [],
    appealsDetails: [],
  },
  getters: {
    getAppealsTableBySlug: (state) => (slug) => {
      console.log("getAppealsTableBySlug: ", state, state.appealsTable[slugify(slug)])
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
      console.log("setAppealsTable, obj.data: ", obj.data, slugify(obj.slug));
      state.appealsTable[slugify(obj.slug)] = obj.data;
      console.log("state.appealsTable: ", state.appealsTable);
    },
    setAppealTypeByID(state, appealType) {
      state.appelsTypesByID[appealType.appealnumber] = appealType.types;
    },
    setAppealDetailBySlug(state, obj) {
      state.appealsDetails[slugify(obj.slug)] = obj.data;
    }
  },
  actions: {
    renderAppealsTypesByID({ commit }, appeals) {
      for(let i = 0; i < appeals.length; i+=1) {
        commit('setAppealTypeByID', { appealnumber: appeals[i].appealnumber, types: appeals[i].appealtype });
      }
    },
    setAppealsHome({ commit, dispatch }, obj ) {
      console.log("setAppealsHome, obj: ", obj);
      commit('setAppealsTable', obj);
      // dispatch('renderAppealsTypesByID', obj.data);
    },
  },
  modules: {
    rcos,
    decisions,
    history,
  },
});

export default store;
