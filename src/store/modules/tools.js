//import {ToastProgrammatic as Toast} from 'vuetify';

const state = {
 
  viewFilters: {
  },
};

const getters = {};

const actions = {
  /*showErrors({commit}, e) {
    /*Toast.open({
      duration: 6000,
      message: e,
      position: 'is-bottom-right',
      type: 'is-danger',
      queue: false,
    });
  },
  showWarnings({commit}, e) {
    Toast.open({
      duration: 6000,
      message: e,
      position: 'is-bottom-right',
      type: 'is-warning',
      queue: false,
    });
  },
  showSuccess({commit}, e) {
     Toast.open({
      duration: 6000,
      message: e,
      position: 'is-bottom-right',
      type: 'is-success',
      queue: false,
    });
  },
  saveFilters({commit}, payload) {
    commit('saveFilters', payload);
  },
  clearFilters({commit}, entity) {
    commit('clearFilters', entity);
  },*/
};

const mutations = {
  saveFilters(state, payload) {
    state.viewFilters[payload.entity] = Object.assign(payload.value);
  },
  clearFilters(state, entity) {
    state.viewFilters[entity] = null;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
