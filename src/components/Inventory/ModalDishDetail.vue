<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card shaped elevation="6">
        <v-card-title class="primary">
          <span class="text-h5">Editar detalle de plato</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Plato"
                  disabled
                  outlined
                  color="primary"
                  v-model="data.dish"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Ingrediente"
                  disabled
                  outlined
                  v-model="CurrentIngredient.ingredient"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12">
                <v-text-field
                  label="Cantidad requerida"
                  hint="Cantidad del ingrediente que se requiere para hacer el plato"
                  persistent-hint
                  required
                  outlined
                  v-model.number="data.quantityRequired"
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
          <v-btn color="green" @click="saveDish()" 
              :loading="isLoading"
              :disabled="isLoading" 
              class="float-right">
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
import { isNumbered } from "@/utils/core";
import axios from "axios";
import modalError from "../../components/Modal";
import { mapGetters } from 'vuex';
import { DATA_ERROR } from "../../utils/consts";

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
    }
  },
  watch: {
    isOpen: {
      handler() {
        this.dialog = this.IsOpened;
      }
    }
  },
  computed: {
    IsOpened() {
      return this.isOpen;
    },
    CurrentIngredient() {
      let { ingredient } = this.data;
      if (!ingredient) {
        ingredient = {
          ingredient: ""
        };
      }
      return ingredient;
    }
  },
  data() {
    return {
      dialog: false,
      dataError: {...DATA_ERROR},
      isLoading: false,
      isUpdate: false,
    };
  },
  methods: {
    ...mapGetters("api", ["urlPandora"]),    
    isNumbered: isNumbered,
    closeModal() {
      this.dialog = !this.dialog;
      this.$emit("onCloseModal", this.dialog);
    },
    async saveDish() {
      this.isLoading = true;
      const request = {
        dishDetailId: this.data.dishDetailId,
        QuantityRequired: this.data.quantityRequired
      };
      let data = [];

      await axios
        .put(`${this.urlPandora()}/Dishes/details`, request)
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
    closeModalError(isGoingTo) {
      if (isGoingTo && this.isUpdate) {
       this.closeModal();
      }
      this.clearData();
    },
    clearData() {
      this.isUpdate = false;
      this.dataError = {...DATA_ERROR};
    },
  }
};
</script>
