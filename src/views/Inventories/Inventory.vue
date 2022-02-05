<template>
  <v-card style="min-height: 80vh">
    <v-card-title class="primary">
      <v-row justify="space-between">
        <v-col cols="12" xs="12" md="6">
          <span class="white--text font-weight-bold"
            >Mantenimiento de inventario</span
          >
        </v-col>
        <v-col cols="12" xs="12" md="6">
          <v-btn color="green" class="mb-2 float-right" @click="addDish()">
            Agregar Nuevo plato
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="data.list"
      :items-per-page.sync="pageSize"
      :single-expand="true"
      :expanded.sync="expanded"
      item-key="dishId"
      show-expand
      class="elevation-3"
      :search="search"
      @item-expanded="actionExpand"
      no-data-text="No ahi inventarios disponible"
      no-results-text="La busqueda no encontro registros"
      fixed-header
      sort-by-text="Ordenar por"
      :loading="isLoadingTable"
      hide-default-footer
      :page.sync="page"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-toolbar>
      </template>
      <template v-slot:[`item.category.category`]="{ item }">
        <v-chip color="primary">
          {{ item.category.category }}
        </v-chip>
      </template>
      <template v-slot:[`item.price`]="{ item }">
        {{ numberFormat(item.price, 2) }}
      </template>
      <template v-slot:expanded-item="{ headers }">
        <td :colspan="headers.length" class="pl-0 pr-0">
          <div v-if="isLoading" class="text-center">
            <v-progress-circular
              indeterminate
              color="primary"
              :width="7"
              :size="70"
              class="mx-auto"
            ></v-progress-circular>
          </div>
          <v-list-item
            v-else-if="!isLoading && ingredients.length > 0"
            v-for="ingre in ingredients"
            :key="ingre.dishDetailId"
          >
            <v-list-item-avatar>
              <v-icon class="primary"> mdi-food </v-icon>
            </v-list-item-avatar>

            <v-list-item-content style="border-bottom: 1px solid white;">
              <v-list-item-title>
                <span class="font-weight-bold">{{
                  ingre.ingredient.ingredient
                }}</span></v-list-item-title
              >

              <v-list-item-subtitle>
                <span class="font-weight-light primary--text"
                  >Cantidad requerida:
                  <span class="white--text">{{ ingre.quantityRequired }}</span>
                </span>
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-icon
                color="warning"
                class="mr-2"
                @click="updateIngredient(ingre)"
                >mdi-pencil</v-icon
              >
              <v-icon color="red" class="mr-2" @click="deleteCurrentIngredient(ingre)">mdi-delete</v-icon>
            </v-list-item-action>
          </v-list-item>
          <div v-else class="text-center font-weight-bold primary--text">            
            <span>Este plato no tiene ningun detalle disponible</span>
          </div>
        </td>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon color="warning" class="mr-2" @click="updateCurrentDish(item)">
          mdi-pencil
        </v-icon>
        <v-icon color="red" @click="deleteCurrentDish(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <v-row class="text-center px-4 align-center" wrap>
      <v-col cols="12" sm="12">
        <v-pagination
          @input="paginateUpdate"
          :length="TotalPage"
          v-model="page"
        />
      </v-col>
    </v-row>
    <HeaderInventoryUpdate
      :isOpen="isUpdateHeader"
      :data="currentDish"
      :updated="updated"
      @onCloseDialog="closeDialog"
    />
    <ModalDishDetail
      :isOpen="isUpdateIngredient"
      :data="currentIngredient"
      @onCloseModal="closeModal"
    />
    <ModalAproval
      :isOpen="isApproval"
      title="Desea eliminar el registro?"
      :text="text"
      :typeApproval="typeApproval"
      @onApproval="closeApproval"
    />
    <ModalError
      :title="dataError.title"
      :isOpen="dataError.isOpen"
      :errors="dataError.errors"
      :type="dataError.modalType"
      :color="dataError.color"
      @onCloseModal="closeModalError"
    />
  </v-card>
</template>

<script>
import HeaderInventoryUpdate from "../../components/Inventory/HeaderInventoryUpdate";
import { mapGetters, mapActions } from "vuex";
import ModalDishDetail from "../../components/Inventory/ModalDishDetail";
import { isNumbered, numberFormat } from "@/utils/core";
import ModalAproval from "../../components/ModalAproval";
import axios from "axios";
import {DATA_ERROR, APPROVALS} from '../../utils/consts'
import ModalError from "../../components/Modal";

export default {
  name: "Inventory",
  components: {
    HeaderInventoryUpdate,
    ModalDishDetail,
    ModalAproval,
    ModalError
  },
  data() {
    return {
      expanded: [],
      singleExpand: true,
      data: [],
      headers: [
        { text: "Plato", value: "dish", align: "start" },
        { text: "Descripcion", value: "description" },
        { text: "Categoria", value: "category.category", align: "center" },
        { text: "Precio", value: "price", align: "end" },
        { text: "Existencia", value: "quantity", align: "end" },
        { text: "Acciones", value: "actions", sortable: false, align: "center" }
      ],
      search: "",
      isUpdateHeader: false,
      currentDish: {},
      ingredients: [],
      isLoading: false,
      isUpdateIngredient: false,
      currentIngredient: {},
      updated: true,
      isApproval: false,
      text: "",
      currentDishId: 0,
      isLoadingTable: false,
      isUpdate: false,
      dataError: {...DATA_ERROR},
      currentDetailId: 0,
      typeApproval: APPROVALS.DISH,
      pageSize: 10,
      page: 1,
    };
  },
  computed: {
    TotalPage() {
      const data = this.data;

      return data ? data.totalPage : 10;
    },
  },
  async mounted() {
    await this.getAllDishes();
    this.data = this.listDishes();    
  },
  methods: {
    ...mapGetters("api", ["currentIngredients", "listDishes", "urlPandora"]),
    ...mapActions("api", ["getIngredients", "getAllDishes"]),
    isNumbered: isNumbered,
    numberFormat: numberFormat,
    async actionExpand(data) {
      if (data.value) {
        await this.getDataIngredients(data.item.dishId);
      }
    },
    updateCurrentDish(item) {
      this.updated = true;
      this.currentDish = item;
      this.isUpdateHeader = !this.isUpdateHeader;
    },
    async closeDialog(open) {
      this.isUpdateHeader = open;
      await this.getAllDishes();
      this.data = this.listDishes();
    },
    closeModal(open) {
      this.expanded = [];
      this.isUpdateIngredient = open;
    },
    async getDataIngredients(dishId) {
      this.isLoading = true;
      await this.getIngredients(dishId);
      this.ingredients = this.currentIngredients();
      this.isLoading = false;
    },
    updateIngredient(data) {
      const [currentDish] = this.expanded;
      this.currentIngredient = {
        ...data,
        dish: currentDish.dish
      };
      this.isUpdateIngredient = !this.isUpdateIngredient;
    },
    addDish() {
      this.updated = false;
      this.isUpdateHeader = !this.isUpdateHeader;
    },
    deleteCurrentDish({ dish, dishId }) {
      this.text = `Esta seguro que desea eliminar el plato <b>(${dish})</b>?`;
      this.currentDishId = dishId;
      this.typeApproval = APPROVALS.DISH;
      this.isApproval = true;
    },
    deleteCurrentIngredient({dishDetailId, ingredient: {ingredient}}) {
       this.text = `Esta seguro que desea eliminar el ingrediente <b>(${ingredient})</b>?`;
       this.currentDetailId = dishDetailId;
       this.typeApproval = APPROVALS.INGREDIENTS;
       this.isApproval = true;
    },
    async closeApproval({isApproval, typeApproval}) {
      this.isApproval = !this.isApproval;

      if (isApproval) {
        this.isLoadingTable = true;
        if (typeApproval == APPROVALS.DISH) {
          await this.deleteDish();
        }
        else if (typeApproval == APPROVALS.INGREDIENTS) {
          await this.deleteIngredient();
        }
      }
      this.currentDishId = 0;
      this.currentDetailId = 0;
      this.isLoadingTable = false;
    },
    async deleteDish() {
      let data = [];

      await axios
        .delete(`${this.urlPandora()}/Dishes?dishId=${this.currentDishId}`)
        .then(response => (data = response.data))
        .catch(er => {
          this.dataError.isOpen = true;
          this.dataError.errors =[`Error inesperado: ${er}`];
        })
        .finally(() => (this.isLoadingTable = false));

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
    async deleteIngredient(){
       let data = [];

      await axios
        .delete(`${this.urlPandora()}/Dishes/details?dishDetailId=${this.currentDetailId}`)
        .then(response => (data = response.data))
        .catch(er => {
          this.dataError.isOpen = true;
          this.dataError.errors =[`Error inesperado: ${er}`];
        })
        .finally(() => (this.isLoadingTable = false));

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
    async closeModalError(isGoingTo) {
      if (isGoingTo && this.isUpdate) {
        await this.getAllDishes();
        this.data = this.listDishes();
      }
      this.clearData();
    },
    clearData() {
      this.isUpdate = false;
      this.dataError = {...DATA_ERROR};
      this.expanded = [];
    },
    async paginateUpdate(page) {
      await this.getAllDishes(page);
      this.data = this.listDishes();
    },
  }
};
</script>
