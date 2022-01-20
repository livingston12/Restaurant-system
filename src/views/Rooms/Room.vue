<template>
  <v-card
  elevation="14"
  shaped
  outlined
  
  >
    <v-tabs
      v-model="currentTab"
      class="primary"
      centered
    >
        <v-tab 
            v-for="Room in rooms"
            :key="Room.roomId"
        >
            <span class="white--text">{{ Room.room }}</span>
        </v-tab>
    </v-tabs>
    <v-tabs-items 
        v-model="currentTab"
    >
      <v-tab-item
        v-for="Room in rooms"
        :key="Room.roomId"
      >
        <v-card flat>
          <Table :tables="Room.tables" />
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script>
import axios from "axios";
import Table from "./Tables/Table.vue";

export default {
  name: "left-nav",
  components: {
    Table
  },
  data() {
    return {
      rooms: [],
      loading: false,
      img: require("@/assets/mesaReservada.jpg"),
      currentTab: null,
      tables: [],
    };
  },
  mounted() {
    this.getAsyncRooms();
  },
  methods: {
    async getAsyncRooms() {
      await axios
        .get(`https://localhost:5001/api/v1/rooms`)
        .then(response => {
          if (response.status === 204) {
            //this.showWarnings('Account Branches: No content');
          } else {
            this.rooms = response.data.list;
          }
        })
        .catch(() => {
          // handle errors
          //this.showErrors(`Account Branches: ${error}`);
        })
        .finally(() => {
          // always executed
        });
    },
    async getAsyncTables(RoomId) {
      await axios
        .get(`https://localhost:5001/api/v1/rooms/${RoomId}/Tables`)
        .then(response => {
          if (response.status === 204) {
            //this.showWarnings('Account Branches: No content');
          } else {
            this.tables = response.data.list;
          }
        })
        .catch(() => {
          // handle errors
          //this.showErrors(`Account Branches: ${error}`);
        })
        .finally(() => {
          // always executed
        });
    },
  }
};
</script>
