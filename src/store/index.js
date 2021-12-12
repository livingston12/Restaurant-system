import Vue from "vue";
import Vuex from "vuex";
import tools from "./modules/tools";
import api from "./modules/api";
import VuexPersistence from "vuex-persist";

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== "production";

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
});

export default new Vuex.Store({
  modules: {
    tools,
    api
  },
  plugins: [vuexLocal.plugin],
  strict: debug
});
