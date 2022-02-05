<template>
  <v-card class="overflow-hidden">
    <v-app-bar color="primary" dark dense>
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)"
        ></v-img>
      </template>

      <v-app-bar-nav-icon @click.stop="closeMenuBar(true)"></v-app-bar-nav-icon>

      <v-app-bar-title>{{ Restaurant }}</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>
    <v-sheet
      id="scrolling-techniques-2"
      class="overflow-y-auto"
      max-height="700"
    >
      <MenuBar
        :isOpen="visibleMenuBar"
        @oncloseMenuBar="closeMenuBar"
      ></MenuBar>
      <v-container :fluid="true"><router-view /></v-container>
    </v-sheet>
  </v-card>
</template>

<script>
import MenuBar from "../components/MenuBar";
import { mapGetters } from "vuex";

export default {
  name: "Home",
  components: {
    MenuBar
  },
  computed: {
    Restaurant() {
      return this.currentUser().restaurant;
    }
  },
  data() {
    return {
      visibleMenuBar: false
    };
  },
  methods: {
    ...mapGetters("api", ["currentUser"]),
    closeMenuBar(isOpen) {
      this.visibleMenuBar = isOpen;
    }
  }
};
</script>
