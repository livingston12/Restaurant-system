<template>
  <v-row v-if="hasDishes" justify="center" no-gutters>
    <v-col
      cols="12"
      sm="4"
      v-for="dish in dishesItem"
      :key="dish.dishId"
      class="px-1 py-1"
    >
      <v-card class="rounded-t-xl" elevation="8" height="auto">
        <template slot="progress">
          <v-progress-linear color="deep-purple" height="10" indeterminate />
        </template>

        <v-img
          :src="getURLImage('D', dish.dish, urlPandora, typeImages)"
          min-height="200"
          max-height="200"
          position="bottom"
          @click="addDish(dish)"
        />
        <v-card-title
          class="text-center white--text font-weight-bold primary pl-1 pr-1"
          style="white-space: nowrap; overflow: hidden;"
        >
          {{ dish.dish }} <br />
          $ {{ numberFormat(dish.price, 2) }}
        </v-card-title>
      </v-card>
    </v-col>
    <Garrisons
      :dishId="currentDishId"
      :isOpen="openDialogGarrison"
      @onSave="saveGarrison"
      @onCancel="cancelGarrison"
    />
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
import { getURLImage, getStringBySeparator, numberFormat } from "@/utils/core";
import Garrisons from "../../../components/categories/Garrison";

export default {
  components: {
    Garrisons
  },
  name: "CategoryDish",
  data: () => {
    return {
      dishesItem: [],
      openDialogGarrison: false,
      currentDishId: 0,
      garrisons: [],
      dataDish: {}
    };
  },
  props: {
    categoryId: {
      type: Number,
      required: true
    },
    typeImages: {
      type: Array,
      require: true
    },
    urlPandora: {
      type: String,
      require: true
    },
    tableId: {
      type: Number,
      required: true
    },
    dishId: {
      type: Number,
      required: false,
      default: () => 0
    }
  },
  watch: {
    categoryId: {
      async handler() {
        await this.getDishesAsync();
      }
    }
  },
  computed: {
    hasDishes() {
      return this.dishesItem.length !== 0;
    },
    isFilteredDish() {
      return this.dishId !== 0;
    }
  },
  async mounted() {
    await this.getDishesAsync();
  },
  methods: {
    ...mapActions("api", ["getDishesByCategory", "setOrderItem"]),
    ...mapGetters("api", ["allDishesByCategory", "allOrderItems"]),
    getURLImage: getURLImage,
    getStringBySeparator: getStringBySeparator,
    numberFormat: numberFormat,
    async getDishesAsync() {
      this.isLoadingDishes = true;
      await this.getDishesByCategory(this.categoryId);
      const dishes = this.allDishesByCategory();
      this.dishesItem = dishes.list ? dishes.list : [];

      if (this.isFilteredDish) {
        this.dishesItem = this.dishesItem.filter(x => x.dishId == this.dishId);
      }
      this.isLoadingDishes = false;
    },
    addDish(dish) {
      this.isLoadingDishes = true;

      if (dish.needGarrison) {
        this.currentDishId = dish.dishId;
        this.dataDish = dish;
        const garrisonExist = !this.garrisonExists(dish.dishId);

        if (garrisonExist) {
          this.openDialogGarrison = garrisonExist;
        } else {
          this.setOrder(this.dataDish);
        }
      } else {
        this.setOrder(dish);
      }
    },
    saveGarrison(data) {
      this.garrisons.push(data);
      this.setOrder(this.dataDish);
      this.openDialogGarrison = false;
    },
    cancelGarrison() {
      this.openDialogGarrison = false;
    },
    garrisonExists(dishId) {
      let result = false;
      const listOrder = this.allOrderItems();
      const order = listOrder.find(x => x.dishId == dishId);
      if (order) {
        if (order.garrisons) {
          result = true;
        }
      }
      return result;
    },
    setOrder(dish) {
      let garrisons = null;
      let note = "";
      if (dish.needGarrison) {
        garrisons = this.garrisons;
        const ingredients = garrisons.map(x => x.ingredient);
        note = "Guarniciones: " + this.getStringBySeparator(ingredients, ",");
      }

      const currentDish = {
        tableId: this.tableId,
        dishId: dish.dishId,
        dish: dish.dish,
        quantity: 1,
        price: dish.price,
        total: dish.price,
        garrisons: garrisons,
        note: note
      };
      this.setOrderItem(currentDish);
    }
  }
};
</script>

<style scoped>
.v-card__title {
  font-size: 15px !important;
}
</style>
