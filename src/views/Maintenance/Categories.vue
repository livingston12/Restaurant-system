<template>

  <v-card style="min-height: 80vh">
    <v-card-title class="primary">
      <v-row justify="space-between">
        <v-col cols="12" xs="12" md="6">
          <span class="white--text font-weight-bold"
            >Mantenimiento de categorias</span
          >
        </v-col>
        <v-col cols="12" xs="12" md="6">
          <v-btn color="green" class="mb-2 float-right" @click="addDish()">
            Nueva categoria
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <Table
      :data="categories"
      :headers="headerCategories"
      :totalPage="categories.totalPage ? categories.totalPage : 1"
      itemKey="categoryId"
      :isExpanded="false"
      @onPaginateUpdate="tablePaginate"
      class="pt-7"
    />
  </v-card>
</template>

<script>
import Table from "../../components/Table";
export default {
  components: {
    Table
  },
  data() {
    return {
      categories: {
        list: [
          {
            categoryId: 0,
            category: "string",
            menuId: 0,
            menu: {
              menuId: 0,
              menu: "string",
              expirationDate: "2022-02-06T20:26:52.422Z",
              restaurantId: 0
            }
          }
        ],
        pageIndex: 0,
        pageSize: 0,
        totalPage: 0,
        total: 0
      },
      headerCategories: [
        { text: "Numero categoria", value: "categoryId", class: "text-center" },
        { text: "Categoria", value: "category" },
        { text: "Menu", value: "menu.menu" }
      ]
    };
  }
};
</script>
