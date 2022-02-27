<template>
  <v-navigation-drawer
    v-model="drawer"
    absolute
    bottom
    right
    temporary
    width="50%"
    @input="oncloseDrawer"
  >
    <v-toolbar flat class="primary font-weight-bold">
      <v-toolbar-title
        >Numero de Factura {{ data.invoiceId }} - Mesa ({{
          getTableName(data)
        }})</v-toolbar-title
      >
    </v-toolbar>

    <v-row justify="space-around">
      <v-col cols="12" sm="5" class="pb-0">
        <span>Fecha Factura (AAA-MM-DD)</span>
        <v-input disabled>
          {{ CurrentData.order.placementDate }}
        </v-input>
      </v-col>
      <v-col cols="12" sm="5" class="pb-0">
        Cantidad Total
        <v-input disabled>
          {{ CurrentData.order.itemsQuantity }}
        </v-input>
      </v-col>

      <v-col cols="12" sm="5" class="py-0">
        <span>Descuento</span>
        <v-input disabled>
          {{ CurrentData.order.discount }}
        </v-input>
      </v-col>
      <v-col cols="12" sm="5" class="py-0">
        Impuestos
        <v-input disabled>
          {{ CurrentData.order.tax }}
        </v-input>
      </v-col>

      <v-col cols="12" sm="5" class="py-0">
        <span>Subtotal</span>
        <v-input disabled>
          {{ CurrentData.order.subtotal }}
        </v-input>
      </v-col>
      <v-col cols="12" sm="5" class="py-0">
        Total
        <v-input disabled>
          {{ CurrentData.order.total }}
        </v-input>
      </v-col>
      <v-col cols="12" sm="5" class="py-0">
        Metodo de pago
        <v-chip
          class="full-width my-2"
          :color="paymentMethodColor(CurrentData.paymentMethod)"
          pill
        >
          {{ CurrentData.paymentMethod }}
          <v-icon right>
            mdi-credit-card
          </v-icon>
        </v-chip>
      </v-col>
      <v-col cols="12" sm="5" class="py-0">
        Status
        <v-chip
          class="full-width my-2"
          :color="statusColor(CurrentData.order.status)"
          pill
        >
          {{ CurrentData.order.status }}
        </v-chip>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6">{{ data }}</v-col>
      <v-col cols="12" sm="6"></v-col>
    </v-row>
  </v-navigation-drawer>
</template>

<script>
import { PAYMENT_METHODS, LIST_STATUS_ORDER } from "../../utils/consts";

export default {
  props: {
    isOpen: {
      type: Boolean,
      require: true
    },
    data: {
      type: Object,
      require: true
    }
  },
  watch: {
    data: {
      handler() {
        this.drawer = this.isOpen;
      }
    }
  },
  computed: {
    CurrentData() {
      const data = this.data;
      const isEmpty = Object.keys(data).length === 0;

      if (!isEmpty) {
        return data;
      } else {
        return {
          invoiceId: 0,
          orderId: 0,
          tableId: 0,
          paymentMethod: "",
          order: {
            orderId: 0,
            placementDate: "",
            status: "",
            itemsQuantity: 0,
            discount: "0.00",
            subtotal: 0,
            tax: "0.00",
            total: "0.00",
            note: ""
          },
          table: {
            tableId: 6,
            table: "Llevar",
            description: "Esta es la mesa 4",
            active: true,
            roomId: 2,
            restaurantId: 1,
            isReserved: false,
            room: null
          }
        };
      }
    }
  },
  data() {
    return {
      drawer: false,
      paym: {}
    };
  },
  methods: {
    oncloseDrawer() {
      this.$emit("oncloseDrawer", this.drawer);
    },
    needCloseModal(isOpen) {
      if (!isOpen) {
        this.oncloseDrawer();
      }
    },
    getTableName({ table }) {
      let tableName = "";

      if (table) {
        tableName = table.table;
      }

      return tableName;
    },
    paymentMethodColor(paymentMethod) {
      return this.getPaymentMethodColor(paymentMethod);
    },
    getPaymentMethodColor(payment) {
      let color = "";
      const paymentMethod = PAYMENT_METHODS;
      if (paymentMethod) {
        const finded = paymentMethod.find(x => x.paymentMethod === payment);
        if (finded) {
          color = finded.color;
        }
      }
      return color;
    },
    statusColor(status) {
      return this.getStatusColor(status);
    },
    getStatusColor(status) {
      let color = "";
      const statusOrder = LIST_STATUS_ORDER;
      if (statusOrder) {
        const finded = statusOrder.find(x => x.status === status);
        if (finded) {
          color = finded.color;
        }
      }
      return color;
    }
  }
};
</script>

<style>
.full-width {
  width: 100% !important;
  justify-content: center !important;
}
</style>
