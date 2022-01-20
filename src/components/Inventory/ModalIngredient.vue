<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card ref="form" shaped elevation="6">
        <v-card-title class="primary">
          <span class="text-h5">{{TitleUpdated}}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" class="pb-0">
                <v-text-field
                  v-if="CurrentUpdated"
                  :disabled="CurrentUpdated"
                  ref="ingredient"
                  label="Ingrediente *"
                  :rules="[rules.required, rules.len(currentData.ingredient.length, 3)]"
                  required
                  v-model="currentData.ingredient"
                ></v-text-field>
                <v-autocomplete
                  v-else
                  :items="ingredients"
                  ref="ingredient"
                  :rules="[rules.required]"
                  v-model="currentData.ingredientId"
                  label="Ingrediente *"                
                  outlined
                  class="pb-0"
                  required
                  @change="getDetailIngredient()"
              />
              </v-col>
              <v-col cols="12" :sm="CurrentUpdated ? 6 : 4" class="pt-0">
                <v-text-field
                  :disabled="!CurrentUpdated"
                  ref="price"
                  label="Precio"
                  hint="Precio del ingrediente opcional"
                  persistent-hint
                  v-model.number="currentData.price"
                  @keypress="isNumbered($event)"                  
                ></v-text-field>
              </v-col>
              <v-col cols="12" :sm="CurrentUpdated ? 6 : 4" class="pt-0">
                <v-text-field
                  :disabled="!CurrentUpdated"
                  ref="quantity"
                  :rules="[rules.required, rules.min(currentData.quantity, 1)]"
                  label="Existencia*"
                  hint="Existencia de ingrediente es obligatorio"
                  persistent-hint
                  required
                  v-model.number="currentData.quantity"
                  @keypress="isNumbered($event)"
                ></v-text-field>
              </v-col>
              <v-col cols="12" v-if="!CurrentUpdated" sm="4" class="pt-0">
                <v-text-field
                  ref="quantityRequired"
                  :rules="[rules.required]"
                  label="Cantidad requerida*"
                  hint="Cantidad de ingredientes que se requiere para el plato"
                  required
                  v-model.number="currentData.quantityRequired"
                  @keypress="isNumbered($event)"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" @click="closeModal">
            Cerrar
          </v-btn>
          <v-btn
            color="green"
            :loading="isLoading"
            :disabled="isLoading"
            @click="saveIngredient(currentData)"
            class="float-right"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <modalError
      :title="dataError.title"
      :isOpen="dataError.isOpen"
      :errors="dataError.errors"
      :type="dataError.modalType"
      :color="dataError.color"
      @onCloseModal="closeModalError"
    />
  </v-row>
</template>

<script>
import { isNumbered, validateForm, resetForm, returnError } from "@/utils/core";
import axios from "axios";
import { mapGetters, mapActions } from "vuex";
import modalError from "../../components/Modal";
import { DATA_ERROR, RULES } from "../../utils/consts";

export default {
  components: {
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
      default: () => false
    },
    dishId: {
      type: Number,
      required: false,
      default: () => 0
    },
  },
  watch: {
    isOpen: {
      handler() {
         this.currentData = {
          ...this.data
        };
        this.dialog = this.IsOpened;       
      }
    }
  },
  async mounted() {
    let ingredients = this.ingredients;    
    await this.getAllIngredients();

    if (ingredients.length === 0) {
      const list  = this.allIngredients();
      if (list) {
        ingredients = list.map(ingre => {
          return {
            text: `${ingre.ingredient}`,
            value: ingre.ingredientId
          };
        });
      }
    }
    this.ingredients = ingredients;
  },
  computed: {
    IsOpened() {
      return this.isOpen;
    },
    Form() {
      let form = {
        ingredient: this.currentData.ingredient,
        price: this.currentData.price,
        quantity: this.currentData.quantity,
      }
      if (!this.CurrentUpdated) 
      {
        form = {...form, quantityRequired: this.currentData.quantityRequired,}
      }
      return form;
    },
    TitleUpdated() {
      const title = "Ingrediente";
      return this.CurrentUpdated ? `Editar ${title}` : `Insertar ${title}`;
    },
    CurrentUpdated() {
      return this.data.ingredientId !== 0;
    }
  },
  data() {
    return {
      dialog: false,
      currentData: {
        ingredient: "",
        ingredientId: 0,
        price: 0,
        quantity: 0,
        restaurantId: 0,
      },
      isUpdate: false,
      dataError: { ...DATA_ERROR },
      isLoading: false,
      rules: RULES,
      formHasErrors: false,
      ingredients: [],
    };
  },
  methods: {
    ...mapGetters("api", ["urlPandora", "allIngredients"]),
    ...mapActions("api", ["getAllIngredients", "addDishDetailAsync"]),
    isNumbered: isNumbered,
    validateForm: validateForm,
    resetForm: resetForm,
    returnError: returnError,

    async saveIngredient(request)
    {
      this.formHasErrors = this.validateForm(this.Form);

      if (!this.formHasErrors)
      {
        this.isLoading = true;
        // Si el plato existe
        if (this.updated)
        {
          // Validar si se va a actualizar o insertar un nuevo ingrediente en el plato existente
          if (this.CurrentUpdated) 
          {
            await this.updateIngredientAsync(request);            
          }
          else {
            await this.addIngredientToDishAsync(request);
          }
        }
        else
        {
          this.onSaveIngredient();
        }
      }
    },
    async updateIngredientAsync(request) {
      let data = [];
      await axios
        .put(`${this.urlPandora()}/Ingredients`, request)
        .then(response => (data = response.data))
        .catch(er => {
          this.dataError.isOpen = true;
          this.dataError.errors.push(`Error inesperado: ${er}`);
        })
        .finally(() => (this.isLoading = false));

      if (data.length !== 0) {
        if (data.isUpdate) {
          this.isUpdate = true;

          this.dataError.errors = ["Se actualizado correctamente"];
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
    async addIngredientToDishAsync({ingredientId, quantityRequired })
    {
      const newRequest = {
        dishId: this.dishId,
        ingredientId: ingredientId,
        quantityRequired: quantityRequired,
      }
      const {
        data: { data, message, statusCode }
      } = await this.addDishDetailAsync(newRequest);
      this.dataError = this.returnError(data, message, statusCode); 
      this.isLoading = false;
    },
    onSaveIngredient() {
      const data = {
        dishDetailId: 0,
        ingredient: { ...this.currentData },
        quantityRequired: 1
      };
      this.isLoading = false;
      this.$emit("onSaveModal", data);
    },   
    closeModalError(isGoingTo) {
      if (isGoingTo && !this.dataError.isError) {
        this.closeModal();
      }
      this.clearData();
    },
    closeModal() {
      this.dialog = !this.dialog;
      //this.resetForm(this.Form);
      this.$emit("onCloseModal", this.dialog);
    },
    clearData() {
      this.isUpdate = false;
      this.dataError = { ...DATA_ERROR };
    },
    getDetailIngredient() {
      const currentIngredient = this.allIngredients()
        .find(x => x.ingredientId == this.currentData.ingredientId);
      this.currentData.price = currentIngredient.price;
      this.currentData.quantity = currentIngredient.quantity;
      this.currentData.ingredient = currentIngredient.ingredient;
    },
  }
};
</script>
