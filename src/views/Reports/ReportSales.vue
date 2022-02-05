<template>
  <v-card shaped style="min-height: 80vh">
    <v-row>
      <v-col cols="12" sm="5" class="pb-0">
        <DatePicker
          title="Fecha desde"
          :date="dateFrom"
          @onCloseDatePicker="onCloseDatePickerFrom"
        />
      </v-col>
      <v-col cols="12" sm="5" class="pb-0">
        <DatePicker
          title="Fecha hasta"
          :date="dateTo"
          @onCloseDatePicker="onCloseDatePickerTo"
        />
      </v-col>
      <v-col cols="12" class="pb-0" sm="1">
        <v-btn
          block
          color="primary"
          @click="filterDates"
          elevation="2"
          :loading="isLoading"
          rounded
        >
          Filtrar
        </v-btn>
      </v-col>
      <v-col
        cols="12"
        class="pb-0"
        @click="filterDates"
        :loading="isLoading"
        sm="1"
      >
        <v-btn
          block
          color="teal"
          @click="clearData"
          elevation="2"
          :loading="isLoading"
          rounded
        >
          Limpiar
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="pt-0">
      <v-col cols="12" sm="6">
        <Sparkline :data="dataByTables" title="Ventas del dia por mesas" />
      </v-col>
      <v-col cols="12" sm="6">
        <Sparkline :data="dataByDelivery" title="Ventas del dia por delivery" />
      </v-col>
    </v-row>
    <Table
      :data="DataInvoices"
      :headers="headerInvoices"
      :totalPage="invoices.totalPage ? invoices.totalPage : 1"
      title="Ordenes realizadas"
      itemKey="invoiceId"
      :isExpanded="true"
      @onPaginateUpdate="tablePaginate"
      class="pt-7"
      @onExpanded="OnExpandedTable"
    />
    <DrawerSales
      :isOpen="IsExpandDrawer"
      :data="expanded"
      @oncloseDrawer="closeDrawer"
    />
  </v-card>
</template>

<script>
import Sparkline from "../../components/Sparkline";
import DatePicker from "../../components/DatePicker";
import Table from "../../components/Table";
import { mapGetters, mapActions } from "vuex";
import { sumArray } from "../../utils/core";
import DrawerSales from "../../components/ReportSales/Drawer";

export default {
  components: {
    Sparkline,
    DatePicker,
    Table,
    DrawerSales
  },
  computed: {
    DataInvoices() {
      return this.invoices;
    },
    IsExpandDrawer() {
      return Object.keys(this.expanded).length !== 0;
    }
  },
  data: function() {
    return {
      dataByTables: {
        totals: [],
        labels: []
      },
      dataByDelivery: {
        totals: [],
        labels: []
      },
      dateFrom: null,
      dateTo: null,
      invoices: {},
      headerInvoices: [
        { text: "Numero Factura", value: "invoiceId", align: "center" },
        { text: "Estatus", value: "order.status", align: "center" },
        { text: "Metodo de pago", value: "paymentMethod", align: "center" },
        { text: "Mesa", value: "table.table", align: "center" },
        {
          text: "Fecha (AAAA-M-D)",
          value: "order.placementDate",
          align: "center"
        },
        {
          text: "Cantidad total",
          value: "order.itemsQuantity",
          align: "center"
        },
        { text: "Impuestos", value: "order.tax", align: "end" },
        { text: "Descuento", value: "order.discount", align: "end" },
        { text: "Total", value: "order.total", align: "end" },
        { text: "", value: "data-table-expand" }
      ],
      expanded: {},
      isLoading: false
    };
  },
  methods: {
    ...mapGetters("api", [
      "listOrderByTables",
      "listOrderByDelivery",
      "listInvoices"
    ]),
    ...mapActions("api", [
      "getTotalOrderByTables",
      "getTotalOrderByDelivery",
      "getInvoices"
    ]),
    sumArray: sumArray,
    async onCloseDatePickerFrom(date) {
      this.dateFrom = date;
    },
    async onCloseDatePickerTo(date) {
      this.dateTo = date;
    },
    async getInitialData(dates) {
      await this.getTotalOrderByTables(dates);
      await this.getTotalOrderByDelivery(dates);
      await this.getCurrentInvoices(dates);

      const dataByTables = this.listOrderByTables();
      const dataByDelivery = this.listOrderByDelivery();

      this.addTotalToSparkLine(dataByTables, dataByDelivery);
    },
    addTotalToSparkLine(dataByTables, dataByDelivery) {
      const arrTotal = ["Total"];

      if (dataByTables.labels.length > 0) {
        const totalTable = this.sumArray(dataByTables.totals);
        this.dataByTables = { ...dataByTables };
        this.dataByTables.labels = dataByTables.labels.concat(arrTotal);
        this.dataByTables.totals = dataByTables.totals.concat(totalTable);
      } else {
        this.dataByTables = {};
      }
      if (dataByDelivery.labels.length > 0) {
        const totalDelivery = this.sumArray(dataByDelivery.totals);
        this.dataByDelivery = { ...dataByDelivery };
        this.dataByDelivery.labels = dataByDelivery.labels.concat(arrTotal);
        this.dataByDelivery.totals = dataByDelivery.totals.concat(
          totalDelivery
        );
      } else {
        this.dataByDelivery = {};
      }
    },
    async tablePaginate(page) {
      const data = {
        page: page
      };
      await this.getInvoices(data);
      this.invoices = { ...this.listInvoices() };
    },
    async getCurrentInvoices(currentData) {
      await this.getInvoices(currentData);
      this.invoices = { ...this.listInvoices() };
    },
    OnExpandedTable(payload) {
      const [data] = payload;
      if (data) {
        this.expanded = { ...data };
      } else {
        this.expanded = {};
      }
    },
    closeDrawer(open) {
      if (!open) {
        this.expanded = {};
      }
    },
    async filterDates() {
      this.isLoading = true;

      const dateFrom = this.dateFrom;
      const dateTo = this.dateTo;

      const dates = {
        dateFrom: dateFrom,
        dateTo: dateTo
      };

      await this.getInitialData(dates);
      this.isLoading = false;
    },
    async clearData() {
      this.isLoading = true;
      this.dateFrom = "";
      this.dateTo = "";
      await this.getInitialData();
      this.isLoading = false;
    }
  },
  async created() {
    await this.getInitialData();
  }
};
</script>
