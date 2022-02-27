<template>
  <div>
    <v-row no-gutters>
      <v-col sm="12" class="text-center">
        <v-alert color="green" border="top">
          <h2 class="white--text">{{ restaurantName() }} - {{ table }}</h2>
        </v-alert>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col sm="10">
        <h3>Elegir cliente</h3>
      </v-col>
      <v-col sm="2" class="text-right">
        <v-btn fab small color="primary">
          <v-icon> mdi-account-plus </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col sm="6" class="my-2 px-3">
        <v-autocomplete
          :items="clients"
          v-model="currentClient"
          label="selecciona cliente"
          dense
          outlined
        />
      </v-col>
      <v-col sm="6" class="pl-3 my-2 text-right">
        <v-select :items="meseros" label="cajero" dense outlined />
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col sm="12">
        <v-data-table :headers="headers" :items="ListItems" class="elevation-1">
          <template v-slot:[`item.quantity`]="{ item }">
            <p class="center-input">
              <v-text-field
                label="Quantity"
                outlined
                dense
                solo
                :value="item.quantity"
                @change="updateQuantity($event, item.dishId)"
                @keypress="isNumbered($event)"
              />
            </p>
          </template>
          <template v-slot:[`item.price`]="{ item }">
            {{ numberFormat(item.price, 2) }}
          </template>
          <template v-slot:[`item.total`]="{ item }">
            {{ numberFormat(item.total, 2) }}
          </template>
          <template v-slot:[`item.note`]="{ item }">
            <p class="center-input">
              <v-textarea
                solo
                label="nota"
                :value="item.note"
                @change="updateNote($event, item.dishId)"
                dense
                rows="2"
              />
            </p>
          </template>
          <template v-slot:[`item.dishId`]="{ item }">
            <v-icon
              color="red"
              :disabled="IsReserved"
              @click="removeItem(item)"
            >
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row v-if="IsReserved">
      <v-col sm="12" class="pb-0">
        <v-alert border="top" colored-border color="primary" elevation="2">
          <v-row>
            <v-col sm="12" class="pb-0">
              <v-select
                v-model="currentPaymentMethod"
                :items="paymentMethods"
                item-text="paymentMethod"
                item-value="paymentMethodId"
                label="Metodo de pago"
                persistent-hint
                return-object
                single-line
                outlined
                dense
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col sm="6" class="pt-0 pb-0">
              <v-text-field
                label="Descuento"
                dense
                outlined
                v-model="order.discount"
                @keypress="isNumbered($event)"
              />
            </v-col>
            <v-col sm="6" class="pt-0 pb-0">
              <v-text-field
                label="Monto a pagar"
                dense
                outlined
                v-model="payAmount"
                @keypress="isNumbered($event)"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col sm="6" class="pt-0 pb-0">
              <h2 class="primary--text text-left">Subtotal:</h2>
            </v-col>
            <v-col sm="6" class="pt-0 pb-0">
              <h2 class="primary--text text-right">
                {{ numberFormat(Subtotal, 2) }}
              </h2>
            </v-col>
          </v-row>

          <v-row>
            <v-col sm="6" class="pt-0 pb-0">
              <h2 class="primary--text text-left">Descuento:</h2>
            </v-col>
            <v-col sm="6" class="pt-0 pb-0">
              <h2 class="primary--text text-right">
                {{ numberFormat(order.discount, 2) }}
              </h2>
            </v-col>
          </v-row>

          <v-alert color="success mt-5 mb-0">
            <v-row>
              <v-col sm="6" class="pt-0 pb-0">
                <h1 class="white--text text-left">Total:</h1>
              </v-col>
              <v-col sm="6" class="pt-0 pb-0">
                <h1 class="white--text text-right">
                  {{ numberFormat(Total, 2) }}
                </h1>
              </v-col>
            </v-row>
          </v-alert>

          <v-alert color="warning mt-2" v-if="payAmount - Total >= 0">
            <v-row>
              <v-col sm="6" class="pt-0 pb-0">
                <h1 class="white--text text-left">Devuelta:</h1>
              </v-col>
              <v-col sm="6" class="pt-0 pb-0">
                <h1 class="white--text text-right">
                  {{ numberFormat(payAmount - Total, 2) }}
                </h1>
              </v-col>
            </v-row>
          </v-alert>
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col sm="6">
        <v-btn
          color="success"
          rounded
          :loading="isLoading"
          :disabled="isLoading"
          @click="IsReserved ? closeOrder() : reserveTable()"
        >
          {{ TitleReserved }}
        </v-btn>
      </v-col>
      <v-col sm="6" class="text-right">
        <v-btn
          color="error"
          :disabled="IsReserved"
          rounded
          @click="cancelCurrentOrden()"
        >
          Cancelar Mesa
        </v-btn>
      </v-col>
    </v-row>
    <modalError
      :title="dataError.title"
      :isOpen="dataError.isErorr"
      :errors="dataError.errors"
      :type="dataError.modalType"
      :color="dataError.color"
      @onCloseModal="closedModal"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { isNumbered, numberFormat } from "@/utils/core";
import { STATUS_ORDER, PAYMENT_METHODS } from "@/utils/consts";
import modalError from "../../components/Modal";
import axios from "axios";

export default {
  name: "MenuDetail",
  components: { modalError },
  props: {
    tableId: {
      type: Number,
      required: require
    },
    table: {
      type: String,
      required: require
    }
  },
  async mounted() {
    this.initialData();
    let clients = this.clients;
    await this.getAllClients();

    if (clients.length === 0) {
      const { list } = this.allClients();
      if (list) {
        clients = list.map(client => {
          return {
            text: `${client.name} ${client.lastName}`,
            value: `${client.clientId}`
          };
        });
      }
    }
    clients.unshift({
      text: "No es cliente",
      value: "0"
    });
    this.clients = clients;
  },
  data() {
    return {
      isLoading: false,
      currentQuantity: 0,
      payAmount: 0,
      clients: [],
      meseros: [],
      orderItems: [],
      currentDataTable: [],
      order: {
        status: STATUS_ORDER.close,
        discount: 0,
        tax: 0,
        note: "",
        restaurantId: 0,
        ordersDetail: [],
        invoice: {
          tableId: 0,
          clientId: null,
          userId: null,
          paymentMethod: ""
        },
        garrisons: []
      },
      currentPaymentMethod: null,
      currentClient: "0",
      dataError: {
        isErorr: false,
        errors: [],
        title: "Para continuar necesita resolver los siguientes errores",
        modalType: "error"
      },
      paymentMethods: PAYMENT_METHODS,
      headers: [
        {
          text: "Productos",
          align: "start",
          sortable: false,
          value: "dish",
          width: 200,
          class: "primary white--text"
        },
        {
          text: "Precio",
          align: "end",
          sortable: false,
          value: "price",
          width: 50,
          class: "primary white--text"
        },
        {
          text: "Cantidad",
          align: "center",
          sortable: false,
          value: "quantity",
          width: 50,
          class: "primary white--text"
        },
        {
          text: "Total",
          align: "end",
          sortable: false,
          value: "total",
          width: 50,
          class: "primary white--text"
        },
        {
          text: "Nota",
          align: "start",
          sortable: false,
          value: "note",
          width: 200,
          class: "primary white--text"
        },
        {
          text: "",
          align: "center",
          sortable: false,
          value: "dishId",
          width: 10,
          class: "primary danger--text"
        }
      ]
    };
  },
  computed: {
    Subtotal() {
      let total = 0;
      const items = this.ListItems;
      items.map(x => {
        const { total: current } = x;
        total += current;
      });

      return total;
    },
    Total() {
      return this.Subtotal - this.order.discount;
    },
    ListItems() {
      return this.allOrderItems();
    },
    IsReserved() {
      const isReserved = this.currentDataTable
        ? this.currentDataTable.isReserved
        : false;
      return isReserved;
    },
    TitleReserved() {
      const isReserved = this.currentDataTable
        ? this.currentDataTable.isReserved
        : false;
      return isReserved ? "Procesar" : "Reservar";
    }
  },
  methods: {
    ...mapGetters("api", [
      "allOrderItems",
      "allClients",
      "restaurantName",
      "currentUser",
      "getCurrentTableData",
      "getCurrentTableId",
      "urlPandora"
    ]),
    ...mapActions("api", [
      "updateOrderQuantity",
      "updateOrderNote",
      "cancelOrder",
      "processOrden",
      "removeOrderItem",
      "getTables",
      "getAllClients"
    ]),
    isNumbered: isNumbered,
    numberFormat: numberFormat,
    updateQuantity(quantity, id) {
      const item = {
        quantity,
        id
      };
      this.updateOrderQuantity(item);
    },
    updateNote(note, dishId) {
      const item = {
        note,
        dishId
      };
      this.updateOrderNote(item);
    },
    removeItem({ dishId, tableId }) {
      const data = {
        dishId,
        tableId
      };
      this.removeOrderItem(data);
    },
    async initialData() {
      await this.getTables(this.getCurrentTableId());
      this.currentDataTable = this.getCurrentTableData();
    },
    cancelCurrentOrden() {
      this.cancelOrder();
    },
    async closeOrder() {
      this.isLoading = true;

      const isError = this.validateError();

      if (isError) {
        this.dataError.isErorr = isError;
        this.dataError.modalType = "error";
        this.isLoading = false;
        return;
      }
      const { paymentMethodId } = this.currentPaymentMethod;
      this.order.invoice.tableId = this.getCurrentTableId();
      this.order.invoice.paymentMethod = paymentMethodId;

      const orderDetail = this.ListItems.map(item => {
        const { quantity, price, dishId, note } = item;
        const currentItem = {
          quantity: quantity,
          price: price,
          dishId: dishId,
          note: note
        };
        return currentItem;
      });
      this.order.ordersDetail.push(...orderDetail);

      this.ListItems.forEach(item => {
        const { garrisons } = item;
        if (garrisons) {
          this.order.garrisons.push(...garrisons);
        }
      });

      this.order.restaurantId = this.currentUser().restaurantId;
      const {
        data: { data, message, statusCode }
      } = await this.processOrden(this.order);
      let listErrors = [];

      if (data) {
        const { errors } = data;
        listErrors = Object.values(errors);
        if (listErrors.length > 0) {
          this.dataError.modalType = "list";
          this.dataError.isErorr = true;
          this.dataError.errors = listErrors;
        } else if (statusCode === "201") {
          listErrors.push(message);
          this.dataError.isErorr = true;
          this.dataError.errors = listErrors;
          this.dataError.color = "green";
          this.dataError.title = "";
        } else {
          listErrors.push(message);
          this.dataError.isErorr = true;
          this.dataError.errors = listErrors;
        }
      } else {
        listErrors.push(message);
        this.dataError.isErorr = true;
        this.dataError.errors = listErrors;
      }

      this.isLoading = false;
    },
    async reserveTable() {
      this.isLoading = true;
      const detail = this.ListItems.map(x => {
        return {
          dishId: x.dishId,
          quantity: x.quantity
        };
      });
      var data = {
        tableId: this.tableId,
        orderDetail: detail
      };
      await axios(`${this.urlPandora()}/Tables/reserved`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        data: data
      })
        .then(({ data }) => {
          if (data === true) {
            this.dataError.isErorr = true;
            this.dataError.errors.push("La mesa se reservo correctamente");
            this.dataError.color = "green";
            this.dataError.title = "";
          } else {
            this.dataError.isErorr = true;
            this.dataError.errors.push(
              "Lo sentimos la mesa no se pudo reservar"
            );
            this.dataError.color = "red";
            this.dataError.title = "Error inesperado";
          }
        })
        .catch(er => {
          this.dataError.isErorr = true;
          this.dataError.errors.push(er);
          this.dataError.color = "red";
          this.dataError.title = "Error inesperado";
        })
        .finally(() => {
          this.isLoading = false;
          this.getTables(this.tableId);
          this.currentDataTable = this.getCurrentTableData();
        });
    },
    validateError() {
      let isError = false;

      if (this.ListItems.length === 0) {
        this.dataError.errors.push(
          "No exite ningun <b class='red--text'>producto</b> debe contener por lo menos un <b class='red--text'>producto</b>."
        );
        isError = true;
      }
      if (!this.currentPaymentMethod) {
        this.dataError.errors.push(
          "El <b class='red--text'>metodo de pago</b> es obligatorio."
        );
        isError = true;
      }
      if (this.Total > this.payAmount) {
        this.dataError.errors.push(
          "El <b class='red--text'>monto a pagar</b> tiene que ser mayor al <b class='red--text'>total</b>."
        );
        isError = true;
      }
      return isError;
    },
    closedModal() {
      if (this.dataError.color == "green" && this.IsReserved) {
        this.goToRoom();
      }
      this.clearData();
      this.initialData();
    },
    clearData() {
      this.dataError.errors = [];
      this.order.ordersDetail = [];
      this.dataError = {
        isErorr: false,
        errors: [],
        title: "Para continuar necesita resolver los siguientes errores",
        modalType: "error"
      };
      this.order = {
        status: STATUS_ORDER.close,
        discount: 0,
        tax: 0,
        note: "",
        restaurantId: 0,
        ordersDetail: [],
        invoice: {
          tableId: 0,
          clientId: null,
          userId: null,
          paymentMethod: ""
        },
        garrisons: []
      };
    },
    goToRoom() {
      this.cancelOrder();
      this.$router.push({ name: "Room" });
    }
  }
};
</script>

<style>
.v-input__control {
  vertical-align: middle;
}
.v-icon:hover {
  transform: translateX(5px);
}
</style>
