<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title class="primary">
        Adiccionales de guarnicion
      </v-card-title>
      <v-card-text class="pb-0 pt-3">
        <v-row dense>
          <v-col cols="12" sm="9">
            <v-autocomplete
              dense
              outlined
              label="Guarnicion *"
              :items="garrisons"
              :rules="[rules.required, rules.min(currentData.quantity, 1)]"
              ref="ingredientId"
              v-model.number="currentData.ingredientId"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field
              label="Cantidad *"
              outlined
              required
              dense
              ref="quantity"
              @keypress="isNumbered($event)"
              :rules="[rules.required, rules.min(currentData.quantity, 1)]"
              v-model.number="currentData.quantity"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-row dense>
          <v-col cols="12" sm="6">
            <v-btn block color="teal" @click="closeGarrison(true)" rounded>
              Agregar
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6">
            <v-btn block color="red" @click="closeGarrison(false)" rounded>
              Cancelar
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { RULES } from "../../utils/consts";
import { validateForm, resetForm, isNumbered } from "@/utils/core";
import { mapActions, mapGetters } from "vuex";

export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    dishId: {
      type: Number,
      required: true
    }
  },
  watch: {
    isOpen: {
      async handler() {
        this.dialog = this.isOpen;
        await this.getGarrisons();

        let garrisons = [];
        const list = this.allIngredients();

        if (list) {
          garrisons = list.map(g => {
            return {
              text: `${g.ingredient}`,
              value: g.ingredientId
            };
          });
        }
        this.garrisons = garrisons;
      }
    }
  },
  computed: {
    Form() {
      const form = {
        ingredientId: this.currentData.ingredientId,
        quantity: this.currentData.quantity
      };

      return form;
    }
  },
  data() {
    return {
      dialog: this.isOpen,
      currentData: {
        ingredientId: null,
        quantity: 1
      },
      garrisons: [],
      rules: RULES
    };
  },
  methods: {
    ...mapActions("api", ["getGarrisons"]),
    ...mapGetters("api", ["allIngredients"]),
    validateForm: validateForm,
    resetForm: resetForm,
    isNumbered: isNumbered,
    closeGarrison(isAdd) {
      if (isAdd) {
        const formHasErrors = this.validateForm(this.Form);
        const ingredientId = this.currentData.ingredientId;

        if (!formHasErrors && ingredientId) {
          const { text: ingredient } = this.garrisons.find(
            x => x.value === ingredientId
          );
          const data = {
            dishId: this.dishId,
            ingredientId: ingredientId,
            quantity: this.currentData.quantity,
            ingredient: ingredient
          };
          this.setGarrison(data);
        }
      } else {
        this.cancelGarrison();
      }
    },
    setGarrison(data) {
      this.$emit("onSave", data);
      this.cleanData();
    },
    cancelGarrison() {
      this.$emit("onCancel");
      this.cleanData();
    },
    cleanData() {
      this.currentData = {
        garrison: null,
        quantity: 1
      };
    }
  }
};
</script>

<style></style>
