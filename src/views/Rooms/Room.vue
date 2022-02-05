<template>
  <v-card
  elevation="14"
  shaped
  outlined  
  >
    <v-tabs
      v-model="currentTab"
      color="teal"
      centered
    >
        <v-tab 
            v-for="Room in rooms"
            :key="Room.roomId"
        >
            {{ Room.room }}
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
import Table from "./Tables/Table";
import { mapActions, mapGetters } from 'vuex';
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
    };
  },
  async mounted() {
    await this.getAllRooms();
    const { list } = this.allRooms();
    this.rooms = list;
  },
  methods: {
    ...mapActions('api', ['getAllRooms']),
    ...mapGetters('api', ['allRooms']),
  },
};
</script>
