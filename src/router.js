import Vue from "vue";
import VueRouter from "vue-router";
import RoomPage from "./views/Rooms/Room";
import MenuPage from "./views/Menus/Menu";


Vue.use(VueRouter);

const routes = [
  {
    name: "Home",
    path: "/" 
  },
  {
    name: "Room",
    path: "/room",
    component: RoomPage
  },
  {
    name: "Menu",
    path: "/menu",
    component: MenuPage
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
