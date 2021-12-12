import Vue from "vue";
import App from "./App.vue";
import Vuetify from "./vuetify";
import Router from "./router";
import store from "./store/index";

new Vue({
  vuetify: Vuetify,
  router: Router,
  render: h => h(App),
  store
}).$mount("#app");
