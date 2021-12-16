<template>
  <v-card 
    :loading="loading"
    class="mr-top-30 mx-auto"
  >
    <v-row>
      <div 
        v-for="table in tables"
        v-bind:key="table.TableId"
      >
        <v-col cols="6" sm="12">
          <template slot="progress">
            <v-progress-linear
              color="deep-purple"
              height="8"
              indeterminate
            ></v-progress-linear>
          </template>

          <v-img 
            :src="img"
            max-width="230"
            height="200"
            class="rounded"
            alt="" 
          />
          
          <v-card-title class="text-center">
            {{ table.table }}
          </v-card-title>

          <v-card-text>
            <v-row 
              class="mx-0"
              justify="center"
            >
              <v-rating
                :value="4.5"
                color="amber"
                dense
                half-increments
                readonly
                size="14"
              ></v-rating>
            </v-row>
          </v-card-text>
          <v-divider class="mx-4"></v-divider>

          <v-card-text class="text-center"> {{ table.description }}</v-card-text>
          <v-card-actions class="text-center">
            <v-btn color="deep-purple accent-4" @click="reservar(table.tableId, table.table)">
              Reservar
            </v-btn>
          </v-card-actions>
          
        </v-col>
      </div>
    </v-row>
  </v-card>
</template>
<script>
export default {
  name: "Table",
  data() {
    return {     
      loading: false,
      img: require("@/assets/mesaSinReservar.jpg"),
    };
  },
  props:{
   tables: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  mounted() {
  },
  methods: {
    reservar(tableId, table) {
     this.$router.push({ name: 'Menu', params: { tableId: tableId, table: table } });
    },
    async getImage(url){
     return await require(url);
   },
  },
  computed: {
   
  }
};
</script>
