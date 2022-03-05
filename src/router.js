import Vue from "vue";
import VueRouter from "vue-router";
import RoomPage from "./views/Rooms/Room";
import MenuPage from "./views/Menus/Menu";
import Inventory from "./views/Inventories/Inventory";
import InventoryMisePlace from "./views/Inventories/InventoryMisePlace";
import ReportSales from "./views/Reports/ReportSales";
import Categories from './views/Maintenance/Categories';

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
    name: "InventoryMisePlace",
    path: "/inventory/miseplace",
    component: InventoryMisePlace
  },
  {
    name: "ReportSales",
    path: "/report/sales",
    component: ReportSales
  },
  {
    name: "Categories",
    path: "/maintenance/Categories",
    component: Categories
  }
];

const router = new VueRouter({
  mode: "hash",
  base: `/`,
  routes
});

export default router;
