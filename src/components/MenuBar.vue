<template>
  <v-navigation-drawer
    v-model="drawer"
    @input="needCloseModal"
    absolute
    temporary
    class="primary mx-auto"
  >
    <v-list dense>
      <v-subheader class="font-weight-bold text-h5 " style="color: #BBDEFB">{{
        Restaurant
      }}</v-subheader>
      <v-list-item
        v-for="item in data"
        :key="item.title"
        link
        @click="goToPage(item.view)"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-group
        :value="false"
        prepend-icon="mdi-chart-bar"
        activeClass="white--text"
      >
        <template v-slot:activator>
          <v-list-item-title>Reportes</v-list-item-title>
        </template>

        <v-list-item
          @click="goToPage(view)"
          :key="i"
          link
          v-for="([icon, title, view], i) in reports"
        >
          <v-list-item-title v-text="title"></v-list-item-title>

          <v-list-item-icon>
            <v-icon v-text="icon"></v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    isOpen: {
      type: Boolean,
      required: false,
      default: () => false
    }
  },
  watch: {
    isOpen: {
      handler() {
        this.drawer = this.isOpen;
      }
    }
  },
  computed: {
    Restaurant() {
      return this.currentUser().restaurant
    },
  },
  data() {
    return {
      data: [
        /*{
          icon: "mdi-wrench",
          title: "Mantenimientos"
        },
        {
          icon: "mdi-magnify",
          title: "Consultas"
        },
        {
          icon: "mdi-credit-card",
          title: "Venta rapida"
        },*/
        {
          icon: "mdi-table",
          title: "Mesas",
          view: "Room"
        },
        {
          icon: "mdi-food",
          title: "Inventario",
          view: "Inventory"
        }
        //{
        //icon: "mdi-moped",
        //title: "Deliverys"
        //}
      ],
      drawer: this.isOpen,
      reports: [["mdi-cash", "Reporte de ventas", "ReportSales"]]
    };
  },
  methods: {
    ...mapGetters("api", ["currentUser"]),
    oncloseMenuBar() {
      this.$emit("oncloseMenuBar", this.drawer);
    },
    needCloseModal(isOpen) {
      if (!isOpen) {
        this.oncloseMenuBar();
      }
    },
    goToPage(view) {
      if (this.$route.name !== view) {
        this.$router.push({ name: view });
      }
    }
  }
};
</script>

<style></style>
