import Vue from "vue";
import VueRouter from "vue-router";
import RoomPage from "./views/Rooms/Room";
import MenuPage from "./views/Menus/Menu";
import Inventory from "./views/Inventories/Inventory";
import ReportSales from "./views/Reports/ReportSales";

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
  {
    name: "Inventory",
    path: "/inventory",
    component: Inventory
  },
  {
    name: "ReportSales",
    path: "/reportsales",
    component: ReportSales
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
