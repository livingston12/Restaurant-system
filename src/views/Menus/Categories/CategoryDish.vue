<template>
  <v-row v-if="hasDishes" no-gutters>
    <v-col md="3" v-for="dish in dishesItem" :key="dish.dishId" class="mx-auto">
      <v-card
        class="rounded-t-xl"
        max-width="200"
        elevation="8"
        max-height="100"
      >
        <template slot="progress">
          <v-progress-linear color="deep-purple" height="10" indeterminate />
        </template>

        <v-img
          :src="getURLImage('D', dish.dish, urlPandora, typeImages)"
          min-height="100"
          width="200"
          position="bottom"
          @click="addDish(dish)"
        />
        <v-card-title class="text-center white--text primary pl-0 pr-0">
          {{ dish.dish }} <br />
          ${{ dish.price }}
        </v-card-title>
      </v-card>
    </v-col>
  </v-row>
  <v-row v-else>
    <v-col sm="12" class="pt-15 pl-10 pr-10">
      <v-alert border="top" color="red" prominent type="warning">
        Esta categoria no contiene platos disponibles
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { getURLImage } from "@/utils/core";
export default {
  name: "CategoryDish",
  data: () => {
    return {
      dishesItem: [],
    };
  },
  props: {
    categoryId: {
      type: Number,
      required: true,
    },
    typeImages: {
      type: Array,
      require: true,
    },
    urlPandora: {
      type: String,
      require: true,
    },
    tableId: {
       type: Number,
      required: true,
    },
    dishId: {
      type: Number,
      required: false,
      default: () => 0,
    },
  },
  watch: {
    categoryId: {
      handler() {
        this.getDishesAsync();
      },
    },
  },
  computed: {
    hasDishes() {
      return this.dishesItem.length !== 0;
    },
    isFilteredDish() {
       return this.dishId !== 0;
    }
  },
  mounted() {
    this.getDishesAsync();
  },
  methods: {
    ...mapActions("api", ["getDishes", "setOrderItem"]),
    ...mapGetters("api", ["allDishes", "allOrderItems"]),
    getURLImage: getURLImage,
    async getDishesAsync() {
      this.isLoadingDishes = true;
      await this.getDishes(this.categoryId);
      const dishes = this.allDishes();
      this.dishesItem = dishes.list ? dishes.list : [];
      if( this.isFilteredDish) {
        this.dishesItem = this.dishesItem.filter(x => x.dishId == this.dishId);
      }
      this.isLoadingDishes = false;
    },
    addDish(dish) {
      this.isLoadingDishes = true;
      const currentDish = {
        tableId: this.tableId,
        dishId: dish.dishId,
        dish: dish.dish,
        quantity: 1,
        price: dish.price,
        total: dish.price,
      };
      this.setOrderItem(currentDish);
    },
  },
};
</script>

<style scoped>
.v-card__title {
  font-size: 15px !important;
}
</style>