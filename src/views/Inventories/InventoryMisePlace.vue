<template>
  <v-row v-if="hasDishes" justify="center">
    <v-col
      cols="12"
      sm="3"
      v-for="ingredient in ingredientsItem"
      :key="ingredient.ingredientId"
      class="py-100"
    >
      <v-card class="rounded-t-xl " height="auto" elevation="8">
        <template slot="progress">
          <v-progress-linear color="deep-purple" height="10" indeterminate />
        </template>

        <v-img
          :src="getURLImage('I', ingredient.ingredient, urlPandora, typeImages)"
          position="bottom"
          max-height="250"
          min-height="250"
          @click="
            updateQuantity(1, ingredient.ingredientId, inventoryType.increase)
          "
        />
        <v-card-title class="text-center white--text primary pl-0 pr-0">
          {{ ingredient.ingredient }} <br />
          $ {{ numberFormat(ingredient.price, 2) }}
        </v-card-title>
        <hr />
        <v-card-text icon class="white--text primary pl-0 pr-0">
          <v-row justify="center">
            <v-col cols="12" sm="3">
              <v-btn
                class="mx-1"
                fab
                color="teal"
                @click="
                  updateQuantity(
                    -1,
                    ingredient.ingredientId,
                    inventoryType.decrease
                  )
                "
                :loading="loading"
              >
                <v-icon>
                  mdi-minus
                </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Quantity"
                solo
                :value="ingredient.quantity"
                @change="
                  updateQuantity(
                    $event,
                    ingredient.ingredientId,
                    inventoryType.current
                  )
                "
                @keypress="isNumbered($event)"
              />
            </v-col>
            <v-col cols="12" sm="3">
              <v-btn
                fab
                color="teal"
                class="mb-1"
                @click="
                  updateQuantity(
                    1,
                    ingredient.ingredientId,
                    inventoryType.increase
                  )
                "
                :loading="loading"
              >
                <v-icon>
                  mdi-plus
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <v-row v-else>
    <v-col sm="12" class="pt-15 pl-10 pr-10">
      <v-alert border="top" color="red" prominent type="warning">
        No existen ingredientes en Mise Place
      </v-alert>
    </v-col>
  </v-row>
</template>
<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { getURLImage, isNumbered, numberFormat } from "@/utils/core";
import { TYPE_IMAGES, INVENTORY_TYPE } from "@/utils/consts";

export default {
  name: "InventoryMisePlace",
  data: () => {
    return {
      ingredientsItem: [],
      typeImages: TYPE_IMAGES,
      inventoryType: INVENTORY_TYPE,
      loading: false
    };
  },
  async mounted() {
    await this.getData();
  },
  computed: {
    ...mapState("api", ["urlPandora"]),
    hasDishes() {
      const ingredients = this.ingredientsItem
        ? this.ingredientsItem.length
        : 0;
      return ingredients !== 0;
    }
  },
  methods: {
    ...mapActions("api", ["getAllIngredients", "updateInventoryIngredient"]),
    ...mapGetters("api", ["allIngredients"]),
    getURLImage: getURLImage,
    isNumbered: isNumbered,
    numberFormat: numberFormat,
    async getData() {
      await this.getAllIngredients();
      let listIngredients = this.allIngredients();
      this.ingredientsItem = listIngredients.filter(
        x => x.isMisePlace === true
      );
    },
    async updateQuantity(quantity, ingredientId, type) {
      this.loading = true;
      const item = {
        ingredientId,
        quantity,
        type
      };
      await this.updateInventoryIngredient(item);
      this.loading = false;
    }
  }
};
</script>
