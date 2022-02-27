<template>
  <v-card elevation="14" shaped outlined class="mx-auto">
    <v-row class="pl-4">
      <v-col md="6">
        <MenuDetail :tableId="tableId" :table="table" />
      </v-col>
      <v-col md="6">
        <v-tabs
          v-model="currentTab"
          class="primary"
          centered
          background-color="primary"
        >
          <v-tab v-for="Menu in menus" :key="Menu.menuId">
            {{ Menu.menu }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="currentTab">
          <v-tab-item v-for="Menu in menus" :key="Menu.menuId">
            <v-card flat>
              <Category :menuId="Menu.menuId" :tableId="tableId" />
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import Category from "./Categories/Category";
import MenuDetail from "./MenuDetail";

export default {
  name: "Menu",
  components: {
    Category,
    MenuDetail
  },
  data() {
    return {
      isLoading: false,
      currentTab: 0,
      menus: null,
      tableId: 0,
      table: ""
    };
  },
  mounted() {
    this.getMenuData();
    let tableId = this.$route.params.tableId;
    let table = this.$route.params.table;

    if (!tableId) {
      tableId = this.getCurrentTableId();
      table = this.getCurrentTable();
    } else {
      this.setCurrentTableId(tableId);
      this.setCurrentTable(table);
    }
    this.tableId = tableId;
    this.table = table;
  },
  methods: {
    ...mapActions("api", ["getMenus", "setCurrentTableId", "setCurrentTable"]),
    ...mapGetters("api", ["allMenus", "getCurrentTableId", "getCurrentTable"]),
    getMenuData() {
      this.isLoading = true;
      this.getMenus();
      const menus = this.allMenus();
      this.menus = menus.list ? menus.list : [];
      this.isLoading = false;
    }
  }
};
</script>
