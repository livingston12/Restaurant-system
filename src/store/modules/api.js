import axios from "axios";
import { getSpecificDate } from "@/utils/core";

const HOURS_TO_ADD = 1;

const state = {
  currentUser: {
    userId: 1,
    user: "LLYTTLE",
    restaurantId: 1,
    restaurant: "The jeison Food Truck"
  },
  urlPandora: "https://localhost:5001/api/v1",
  categories: {},
  menus: {},
  dishes: {},
  listDishes: [],
  listClients: [],
  images: null,
  ordersItems: [],
  currentTableId: 0,
  currentTable: 0,
  currentTableData: [],
  listcategories: [],
  currentIngredients: [],
  allIngredients: [],
};

const getters = {
  allMenus: state => state.menus,
  allCategories: state => state.categories,
  listCategories: state => state.listcategories,
  allDishesByCategory: state => state.dishes,
  listDishes: state => state.listDishes,
  allClients: state => state.listClients,
  currentIngredients: state => state.currentIngredients,
  allIngredients: state => state.allIngredients,
  allImages: state => state.images,
  allOrderItems(state) {
    return state.ordersItems.filter(x => x.tableId === state.currentTableId);
  },
  getOrderItem(state, dishId) {
    return state.ordersItems.find(
      x => x.dishId === dishId && x.tableId === state.currentTableId
    );
  },
  restaurantName: state => state.currentUser.restaurant,
  currentUser: state => state.currentUser,
  getCurrentTableId: state => state.currentTableId,
  getCurrentTable: state => state.currentTable,
  getCurrentTableData: state => state.currentTableData,
  urlPandora: state => state.urlPandora
};

const actions = {
  getMenus({ commit }) {
    axios
      .get(`${state.urlPandora}/menus`, {
        params: {
          restaurantId: state.currentUser.restaurantId
        }
      })
      .then(response => commit("SET_MENUS", response.data))
      .catch(err => console.error(err));
  },
  getCategories({ commit }, menuId) {
    const params = {
      menuId: menuId
    };
    axios
      .get(`${state.urlPandora}/menus/${menuId}/categories`, {
        params: { params }
      })
      .then(response => commit("SET_CATEGORIES", response.data))
      .catch(err => console.error(err));
  },
  async getListCategories({ commit }) {
    await axios
      .get(`${state.urlPandora}/Categories`)
      .then(response => commit("SET_LIST_CATEGORIES", response.data))
      .catch(err => console.error(err));
  },
  async getDishesByCategory({ commit }, categoryId) {
    await axios
      .get(`${state.urlPandora}/menus/${categoryId}/Dishes`)
      .then(response => commit("SET_DISHES", response.data))
      .catch(err => console.error(err));
  },
  async getAllDishes({ commit }) {
    await axios
      .get(`${state.urlPandora}/Dishes`)
      .then(response => commit("SET_ALL_DISHES", response.data))
      .catch(err => console.error(err));
  },
  async getAllClients({ commit }) {
    await axios
      .get(`${state.urlPandora}/Clients`)
      .then(response => commit("SET_ALL_CLIENTS", response.data))
      .catch(err => console.error(err));
  },
  async getTables({ commit }, tableId) {
    let data = [];
    await axios
      .get(`${state.urlPandora}/Tables?TableIds=${tableId}`)
      .then(response => {
        if (response.status !== 204) {
          data = response.data.list;
        }
      })
      .catch(() => {
        data = [];
      })
      .finally(() => {
        commit("SET_TABLES", data);
      });
  },
  async getIngredients({ commit }, dishId) {
    await axios
      .get(`${state.urlPandora}/Dishes/${dishId}/ingredients`)
      .then(response => commit("SET_INGREDIENTS", response.data))
      .catch(err => console.error(err));
  },
  async getAllIngredients({ commit }) {
    await axios
      .get(`${state.urlPandora}/Ingredients/summary/${state.currentUser.restaurantId}`)
      .then(response => commit("SET_ALL_INGREDIENTS", response.data))
      .catch(err => console.error(err));
  },
  removeOrderItem({ commit }, data) {
    commit("REMOVE_ORDER_ITEM", data);
  },
  getImages({ commit }, data) {
    axios
      .get(`${state.urlPandora}/Images/${data.directory}/${data.fileName}`)
      .then(response => commit("SET_IMAGES", response.data))
      .catch(err => console.error(err));
  },  
  async upadateIngredient({ commit }, data) 
  {
    const response = await axios(
      `${state.urlPandora}/Dishes`,
      {
        method: "put",
        headers: {
          "Content-Type": "application/json"
        },
        data: data
      },
      {
        responseType: "json"
      }
    );

    if (response.status === 201) {
      commit("SET_INGREDIENTS", response.data);
    }
    return response;
  },
  async processOrden({ commit }, data) {
    const response = await axios(
      `${state.urlPandora}/Orders`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        data: data
      },
      {
        responseType: "json"
      }
    );
    if (response.status === 201) {
      commit("SET_ORDERS", response.data);
    }
    return response;
  },
  async addDishAsync({ commit }, data) {
    const response = await axios(
      `${state.urlPandora}/Dishes`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        data: data
      },
      {
        responseType: "json"
      }
    );
    if (response.status === 201) {
      commit("SET_DISHES", response.data);
    }
    return response;
  },
  async addDishDetailAsync({ dispatch }, data) 
  {
    const response = await axios(
      `${state.urlPandora}/Dishes/details`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        data: data
      },
      {
        responseType: "json"
      }
    );

    if (response.status === 201) {
      dispatch("SET_ALL_INGREDIENTS", response.data);
    }
    return response;
  },
  setOrderItem({ commit }, data) {
    commit("SET_ORDER_ITEMS", data);
  },
  updateOrderQuantity({ commit }, dish) {
    commit("SET_ORDER_QUANTITY", dish);
  },
  setCurrentTableId({ commit }, tableId) {
    commit("SET_CURRENT_TABLEID", tableId);
  },
  setCurrentTable({ commit }, table) {
    commit("SET_CURRENT_TABLE", table);
  },
  cancelOrder({ commit }) {
    commit("CANCEL_ORDER");
  }
};

const mutations = {
  SET_MENUS(state, menus) {
    state.menus = {
      ...menus,
      expirationDate: getSpecificDate(HOURS_TO_ADD)
    };
  },
  SET_CATEGORIES(state, categories) {
    state.categories = {
      ...categories,
      expirationDate: getSpecificDate(HOURS_TO_ADD)
    };
  },
  SET_DISHES(state, dishes) {
    state.dishes = {
      ...dishes,
      expirationDate: getSpecificDate(HOURS_TO_ADD)
    };
  },
  SET_ALL_DISHES(state, dishes) {
    state.listDishes = dishes;   
  },
  SET_IMAGES(state, images) {
    state.images = images;
  },
  SET_ORDER_ITEMS(state, dish) {
    const existOrder = state.ordersItems
      ? getters.getOrderItem(state, dish.dishId)
      : [];
    if (existOrder) {
      existOrder.quantity += parseInt(dish.quantity);
      existOrder.total = existOrder.quantity * existOrder.price;
    } else {
      state.ordersItems.push(dish);
    }
  },
  SET_ORDER_QUANTITY(state, item) {
    const existsOrder = getters.getOrderItem(state, item.id);
    if (existsOrder) {
      mutations.SET_ORDER_ITEM_UPDATED(existsOrder, item.quantity);
    }
  },
  SET_ORDER_ITEM_UPDATED(orderItem, quantity) {
    orderItem.quantity = parseInt(quantity);
    orderItem.total = quantity * orderItem.price;
  },
  SET_CURRENT_TABLEID(state, tableId) {
    state.currentTableId = tableId;
  },
  SET_CURRENT_TABLE(state, table) {
    state.currentTable = table;
  },
  CANCEL_ORDER(state) {
    state.ordersItems = [];
  },
  SET_ORDERS(state, data) {
    state.ordersItems = data;
  },
  REMOVE_ORDER_ITEM(state, data) {
    const findItem = state.ordersItems.findIndex(
      order => order.tableId === data.tableId && order.dishId === data.dishId
    );
    state.ordersItems.splice(findItem);
  },
  SET_TABLES(state, data) {
    const [table] = data;
    state.currentTableData = table;
  },
  SET_ALL_CLIENTS(state, clients) {
    state.listClients = {
      ...clients,
      expirationDate: getSpecificDate(HOURS_TO_ADD)
    };
  },
  SET_LIST_CATEGORIES(state, categories) {
    state.listcategories = {
      ...categories,
      expirationDate: getSpecificDate(HOURS_TO_ADD)
    };
  },
  SET_INGREDIENTS(state, ingredients) {
    state.currentIngredients = ingredients;
  },
  SET_ALL_INGREDIENTS(state, ingredients){
    state.allIngredients = ingredients;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
