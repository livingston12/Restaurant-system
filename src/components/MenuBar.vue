<template>
  <v-navigation-drawer
    v-model="drawer"
    @input="needCloseModal" 
    absolute
    temporary
    class="deep-purple accent-4"
    dark
  >
    <v-list dense>
      <v-list-item v-for="item in data" :key="item.title" link>
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
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
      },
    }
  },
  computed: {
    
  },
  data() {
    return {
      data: [
        {
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
        },
        {
          icon: "mdi-food",
          title: "Ventas con reservas"
        },
        {
          icon: "mdi-chart-bar",
          title: "Reportes"
        },
        {
          icon: "mdi-moped",
          title: "Deliverys"
        }
      ],
      drawer: false,
    };
  },
  methods: {
    oncloseMenuBar() {
      this.$emit("oncloseMenuBar", this.drawer);
    },
    needCloseModal(isOpen) {
      if (!isOpen) {
        this.oncloseMenuBar();
      }
    }
  }
};
</script>

<style></style>
