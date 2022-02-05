<template>
  <v-navigation-drawer
    v-model="drawer"
    absolute
    bottom
    right
    temporary
    width="50%"
    @input="oncloseDrawer"
  >
    <v-toolbar  flat class="primary font-weight-bold">
      <v-toolbar-title>Numero de Factura {{ data.invoiceId }} - Mesa ({{ getTableName(data) }})</v-toolbar-title>
    </v-toolbar>
    
    <v-row>
      <v-col cols="12" sm="6">{{ data.order }}</v-col>
      <v-col cols="12" sm="6"></v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6"></v-col>
      <v-col cols="12" sm="6"></v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6"></v-col>
      <v-col cols="12" sm="6"></v-col>
    </v-row>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      require: true
    },
    data: {
      type: Object,
      require: true
    }
  },
  watch: {
    data: {
      handler() {
        this.drawer = this.isOpen;
      }
    }
  },
  data() {
    return {
      drawer: false
    };
  },
  methods: {
    oncloseDrawer() {
      this.$emit("oncloseDrawer", this.drawer);
    },
    needCloseModal(isOpen) {
      if (!isOpen) {
        this.oncloseDrawer();
      }
    },
    getTableName({table}) {
        let tableName = "";

        if (table) {
           tableName = table.table;
        }

        return tableName;        
    }
  }
};
</script>

<style></style>
