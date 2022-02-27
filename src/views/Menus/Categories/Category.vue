<template>
  <v-container :fluid="true" class="pa-1">
    <v-autocomplete
      v-model="currentProduct"
      :items="products"
      outlined
      dense
      label="Buscar producto"
      class="mb-n3"
      @change="getCurrentProduct"
    />
    <v-sheet class="mx-auto " elevation="8" max-width="800">
      <v-slide-group v-model="currentCategory" class="pa-1 " show-arrows>
        <v-slide-item
          v-for="category in categories"
          :key="category.categoryId"
          v-slot="{ active, toggle }"
          :value="category.categoryId"
        >
          <v-card
            v-if="
              (isFilteredDish && category.categoryId == currentCategory) ||
                !isFilteredDish
            "
            :color="active ? 'primary' : 'grey'"
            class="ma-4 rounded-b-xl"
            height="200"
            width="180"
            @click="toggle"
            elevation="8"
          >
            <v-img
              :src="getURLImage('C', category.category, urlPandora, typeImages)"
              height="150"
              width="180"
              v-bind:class="{ selectedCategory: active }"
              position="bottom"
            />
            <v-card-title class="text-center white--text">
              {{ category.category }}
            </v-card-title>
            <v-row class="fill-height" align="center" justify="center">
              <v-scale-transition>
                <v-icon
                  v-if="active"
                  color="white"
                  size="48"
                  v-text="'mdi-close-circle-outline'"
                ></v-icon>
              </v-scale-transition>
            </v-row>
          </v-card>
        </v-slide-item>
      </v-slide-group>
      <v-expand-transition>
        <v-sheet v-if="currentCategory != null">
          <CategoryDish
            :categoryId="currentCategory"
            :urlPandora="urlPandora"
            :typeImages="typeImages"
            :dishId="dishId"
            :tableId="tableId"
          />
        </v-sheet>
      </v-expand-transition>
    </v-sheet>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { getURLImage } from "@/utils/core";
import { TYPE_IMAGES } from "@/utils/consts";
import CategoryDish from "./CategoryDish.vue";
export default {
  name: "Category",
  components: { CategoryDish },
  props: {
    menuId: {
      type: Number,
      required: true,
      default: () => 1
    },
    tableId: {
      type: Number,
      required: true,
      default: () => 0
    }
  },
  computed: {
    ...mapState("api", ["urlPandora"]),
    categoryIsSelect() {
      return this.currentCategory != null;
    },
    isFilteredDish() {
      return this.dishId !== 0;
    }
  },
  data() {
    return {
      currentProduct: "0",
      currentCategory: null,
      categories: {},
      products: [],
      isLoadingDishes: false,
      dishes: {},
      typeImages: TYPE_IMAGES,
      images: {},
      dishId: 0
    };
  },
  async mounted() {
    let products = this.products;
    this.getCategoryData(this.menuId);
    await this.getDishesByMenu(this.menuId);
    if (products.length === 0) {
      const { list } = this.listDishes();
      products = list.map(product => {
        return {
          text: product.dish,
          value: `${product.categoryId},${product.dishId}`
        };
      });
    }
    products.unshift({
      text: "Todos",
      value: "0"
    });
    this.products = products;
  },
  methods: {
    ...mapActions("api", ["getCategories", "getImages", "getDishesByMenu"]),
    ...mapGetters("api", ["allCategories", "allImages", "listDishes"]),
    getURLImage: getURLImage,
    getCategoryData(menuId) {
      this.isLoading = true;
      this.getCategories(menuId);
      const categories = this.allCategories();
      this.categories = categories.list ? categories.list : [];
      this.isLoading = false;
    },
    getCurrentProduct() {
      const [category, dishId] = this.currentProduct.split(",");
      if (category === "0") {
        this.currentCategory = null;
        this.dishId = 0;
      } else {
        this.currentCategory = parseInt(category);
        this.dishId = parseInt(dishId);
      }
    }
  }
};
</script>

<style scoped>
.selectedCategory {
  border: 1px solid #1976d2;
}
.center {
  justify-content: center !important;
}
</style>
