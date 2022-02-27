<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card ref="Form">
        <v-toolbar color="primary">
          <v-btn icon @click="closeDialog()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title class="font-weight-bold">
            {{ Title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              text
              @click="changeDish(currentData)"
              :loading="isLoading"
              :disabled="isLoading"
            >
              Guardar
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-title>
          <span class="text-h5">Datos del plato</span>
        </v-card-title>
        <v-container fluid>
          <v-row dense>
            <v-col sm="5" cols="12">
              <v-text-field
                ref="dish"
                :rules="[rules.required, rules.len(currentData.dish.length, 3)]"
                v-model="currentData.dish"
                label="Plato *"
                required
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col sm="5" cols="12">
              <v-autocomplete
                ref="category"
                :rules="[rules.required]"
                :items="categories"
                v-model="currentData.categoryId"
                label="Categoria *"
                dense
                outlined
                required
              />
            </v-col>
            <v-col sm="2" cols="12">
              <v-switch                
                inset
                v-model="currentData.needGarrison"
                label="Requiere guarnicion"
                class="pt-0 mt-0  center-input"
              ></v-switch>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col md="3" sm="6" class="py-0" cols="12">
              <v-text-field
                v-model.number="currentData.quantity"
                label="Cantidad"
                outlined
                dense
                @keypress="isNumbered($event)"
              />
            </v-col>
            <v-col md="3" sm="6" class="py-0" cols="12">
              <v-text-field
                ref="price"
                :rules="[rules.min(currentData.price, 1)]"
                v-model.number="currentData.price"
                label="Precio *"
                outlined
                required
                dense
                @keypress="isNumbered($event)"
              />
            </v-col>
            <v-col md="6" sm="12" class="py-0" cols="12">
              <v-textarea
                v-model="currentData.description"
                label="Descripcion"
                rows="3"
                prepend-inner-icon="mdi-comment"
                outlined
                dense
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
        <v-card-title>
          <span class="text-h5">Ingregientes del plato</span>
          <v-btn
            color="green"
            class="mb-1 float-right"
            :disabled="currentData.needGarrison"
            @click="updateIngredient(null)"
          >
            Agregar ingrediente
          </v-btn>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="ingredients"
          hide-default-footer
          no-data-text="No ahi ingredientes disponibles"
          :loading="loading"
          loading-text="cargando... Porfavor espere"
        >
          <template v-slot:[`item.ingredient.price`]="{ item }">
            {{ numberFormat(item.ingredient.price, 2) }}
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon
              color="warning"
              class="mr-2"
              @click="updateIngredient(item.ingredient)"
              :disabled="!IsUpdated"
            >
              mdi-pencil
            </v-icon>
            <v-icon :disabled="IsUpdated" color="red" @click="deleteItem(item)">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-card>
      <ModalIngredient
        :isOpen="isUpdateIngredient"
        :data="currentIngredient"
        :updated="updated"
        :dishId="currentData.dishId"
        @onSaveModal="saveIngredient"
        @onCloseModal="closeModal"
      />
      <modalError
        :title="dataError.title"
        :isOpen="dataError.isOpen"
        :errors="dataError.errors"
        :type="dataError.modalType"
        :color="dataError.color"
        @onCloseModal="closeModalError"
      />
    </v-dialog>
  </v-row>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import {
  isNumbered,
  numberFormat,
  removeItemFromArray,
  validateForm,
  resetForm,
  returnError
} from "@/utils/core";
import { DATA_ERROR, RULES } from "../../utils/consts";
import ModalIngredient from "../../components/Inventory/ModalIngredient";
import modalError from "../../components/Modal";
import axios from "axios";

export default {
  components: {
    ModalIngredient,
    modalError
  },
  props: {
    isOpen: {
      type: Boolean,
      required: false,
      default: () => false
    },
    data: {
      type: Object,
      required: true
    },
    updated: {
      type: Boolean,
      required: false,
      default: () => true
    }
  },
  watch: {
    isOpen: {
      async handler() {
        this.dialog = this.IsOpened;
        if (this.IsUpdated) {
          await this.getDataIngredients();
          const data = this.data;
          this.currentData = {
            ...data
          };
        } else {
          this.initialData();
        }
      }
    }
  },
  computed: {
    IsOpened() {
      return this.isOpen;
    },
    IsUpdated() {
      return this.updated;
    },
    Title() {
      return this.IsUpdated
        ? `Modificar ${this.data.dish}`
        : `Insertar ${this.currentData.dish}`;
    },
    Form() {
      return {
        dish: this.currentData.dish,
        category: this.currentData.categoryId,
        price: this.currentData.price
      };
    }
  },
  async mounted() {
    let categories = this.categories;
    await this.getListCategories();

    if (categories.length === 0) {
      const { list } = this.listCategories();
      if (list) {
        categories = list.map(category => {
          return {
            text: `${category.category}`,
            value: category.categoryId
          };
        });
      }
    }
    this.categories = categories;
  },
  data() {
    return {
      rules: RULES,
      dialog: this.isOpen,
      categories: [],
      ingredients: [],
      headers: [
        {
          text: "Ingrediente",
          value: "ingredient.ingredient",
          align: "start",
          class: ["primary", "white--text"]
        },
        {
          text: "Precio",
          value: "ingredient.price",
          align: "end",
          class: ["primary", "white--text"]
        },
        {
          text: "Existencia",
          value: "ingredient.quantity",
          align: "end",
          class: ["primary", "white--text"]
        },
        {
          text: "Acciones",
          value: "actions",
          sortable: false,
          align: "center",
          class: ["primary", "white--text"]
        }
      ],
      loading: false,
      isUpdateIngredient: false,
      currentIngredient: {},
      dataError: { ...DATA_ERROR },
      isUpdate: false,
      currentData: {
        dishId: 0,
        dish: "",
        description: "",
        price: 0,
        quantity: 0,
        expirationDate: null,
        categoryId: 0,
        needGarrison: false
      },
      isLoading: false,
      formHasErrors: false
    };
  },
  methods: {
    ...mapGetters("api", [
      "listCategories",
      "currentIngredients",
      "urlPandora",
      "currentUser"
    ]),
    ...mapActions("api", [
      "getListCategories",
      "getIngredients",
      "addDishAsync"
    ]),
    isNumbered: isNumbered,
    numberFormat: numberFormat,
    removeItemFromArray: removeItemFromArray,
    validateForm: validateForm,
    resetForm: resetForm,
    returnError: returnError,
    initialData() {
      this.currentData = {};
      (this.currentData = {
        dishId: 0,
        dish: "",
        description: "",
        price: 0,
        quantity: 0,
        expirationDate: null,
        categoryId: 0,
        needGarrison: false
      }),
        (this.ingredients = []);
    },
    async getDataIngredients() {
      this.loading = true;
      const dishId = this.data.dishId;
      await this.getIngredients(dishId);
      const ingredients = this.currentIngredients();

      this.ingredients = ingredients;
      this.loading = false;
    },
    async changeDish(request) {
      this.isLoading = true;
      this.formHasErrors = this.validateForm(this.Form);

      if (!this.formHasErrors) {
        if (this.IsUpdated) {
          await this.updateDishAsync(request);
        } else {
          await this.saveDishAsync(request);
        }
      }
      this.isLoading = false;
    },
    async updateDishAsync(request) {
      let data = [];

      await axios
        .put(`${this.urlPandora()}/Dishes`, request)
        .then(response => (data = response.data))
        .catch(er => {
          this.dataError.isOpen = true;
          this.dataError.errors.push(`Error inesperado: ${er}`);
        });

      if (data.length !== 0) {
        if (data.isUpdate) {
          this.isUpdate = true;
          this.dataError.title = "";
          this.dataError.errors = ["Se actualizo correctamente"];
          this.dataError.color = "green";
        } else {
          const { errors } = data;
          const listErrors = Object.values(errors);
          if (listErrors.length > 0) {
            this.dataError.errors = listErrors;
            this.dataError.modalType = "list";
          }
        }
      }
      this.dataError.isOpen = true;
    },
    async saveDishAsync(request) {
      const requestComplete = {
        ...request,
        ingredients: this.ingredients
      };
      const {
        data: { data, message, statusCode }
      } = await this.addDishAsync(requestComplete);

      this.dataError = this.returnError(data, message, statusCode);
    },
    closeDialog() {
      this.dialog = false;
      this.$emit("onCloseDialog", this.dialog);
    },
    updateIngredient(ingredient) {
      const restaurantId = this.currentUser.restaurantId;
      let data = {
        ingredient: "",
        ingredientId: 0,
        price: 0,
        quantity: 0,
        restaurantId: restaurantId,
        quantityRequired: 0
      };
      if (ingredient) {
        data = { ...ingredient };
      }
      this.currentIngredient = data;
      this.isUpdateIngredient = !this.isUpdateIngredient;
    },
    async closeModal() {
      this.isUpdateIngredient = false;
      if (this.updated) {
        await this.getDataIngredients();
      }
      this.$emit("onCloseModal", this.isUpdateIngredient);
    },
    saveIngredient({ ...ingredient }) {
      const {
        ingredient: { ingredient: nameIngredient }
      } = ingredient;
      const searchIngredient = this.ingredients.find(
        x => x.ingredient.ingredient == nameIngredient
      );

      if (!searchIngredient) {
        this.ingredients.push(ingredient);
      }

      this.closeModal();
    },
    closeModalError(isGoingTo) {
      if (isGoingTo && this.isUpdate) {
        this.closeModal();
      }
      this.clearData();
    },
    clearData() {
      this.isUpdate = false;
      this.dataError = { ...DATA_ERROR };
    },
    deleteItem(item) {
      if (!this.updated) {
        const index = this.ingredients.findIndex(
          x => x.ingredient.ingredientId == item.ingredient.ingredientId
        );
        if (index > -1) {
          this.ingredients = this.removeItemFromArray(this.ingredients, index);
        }
      }
    }
  }
};
</script>
