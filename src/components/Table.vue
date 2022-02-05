<template>
  <div>
    <v-toolbar v-if="title" flat class="primary">
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-toolbar>
    <v-data-table
      class="elevation-3"
      expand-icon="mdi-eye"
      fixed-header
      :headers="headers"
      hide-default-footer
      :item-key="itemKey"
      :items-per-page.sync="pageSize"
      :items="data.list"
      no-data-text="No ahi datos disponibles"
      no-results-text="La busqueda no encontro resultados"
      :page.sync="page"
      :search="search"
      single-expand
      :show-expand="isExpanded"
      @update:expanded="onExpanded"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-text-field
            append-icon="mdi-magnify"
            hide-details
            label="Buscar"
            single-line
            v-model="search"
          />
        </v-toolbar>
      </template>
    </v-data-table>
    <v-row class="text-center px-4 align-center" wrap>
      <v-col cols="12" sm="12">
        <v-pagination
          @input="paginateUpdate"
          :length="totalPage"
          v-model="page"
        />
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    headers: {
      type: Array,
      required: true
    },
    itemKey: {
      type: String,
      required: true
    },
    totalPage: {
      type: Number,
      required: true
    },
    isExpanded: {
      type: Boolean,
      required: false,
      default: () => false
    },
    title: {
      type: String,
      required: false,
      default: () => ""
    },
    pageSize: {
      type: Number,
      required: false,
      default: () => 10
    }
  },
  data() {
    return {
      expanded: [],
      page: 1,
      search: ""
    };
  },
  methods: {
    paginateUpdate(page) {
      this.$emit("onPaginateUpdate", page);
    },
    onExpanded(payload) {
        this.$emit("onExpanded", payload);
    }
  }
};
</script>
