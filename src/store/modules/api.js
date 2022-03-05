import axios from "axios";
import {
  getSpecificDate,
  numberFormat,
  stringToDatetime,
  dateFormat
} from "@/utils/core";
import { PAYMENT_METHODS, INVENTORY_TYPE } from "@/utils/consts";

const HOURS_TO_ADD = 1;

const state = {
  currentUser: {
    userId: 1,
    user: "LLYTTLE",
    restaurantId: 1,
    restaurant: "The jeison Food Truck"
  },
  urlPandora: process.env.VUE_APP_PANDORA_API_URL,
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
  allTotalTables: [],
  allTotalDelivery: [],
  listInvoices: [],
  rooms: []
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
  allRooms: state => state.rooms,
  GetOrderItem(state, dishId) {
    return state.ordersItems.find(
      x => x.dishId === dishId && x.tableId === state.currentTableId
    );
  },
  GetIngredientItem(state, ingredientId) {
    const listIngredient = state.allIngredients;
    return listIngredient.find(x => x.ingredientId === ingredientId);
  },    
  restaurantName: state => state.currentUser.restaurant,
  currentUser: state => state.currentUser,
  getCurrentTableId: state => state.currentTableId,
  getCurrentTable: state => state.currentTable,
  getCurrentTableData: state => state.currentTableData,
  urlPandora: () => process.env.VUE_APP_PANDORA_API_URL,
  listOrderByTables: state => state.allTotalTables,
  listOrderByDelivery: state => state.allTotalDelivery,
  listInvoices: state => state.listInvoices
};

const actions = {
  getMenus({ commit }) {
    axios
      .get(`${process.env.VUE_APP_PANDORA_API_URL}/menus`, {
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
      .get(
        `${process.env.VUE_APP_PANDORA_API_URL}/menus/${menuId}/categories`,
        {
          params: { params }
        }
      )
      .then(response => commit("SET_CATEGORIES", response.data))
      .catch(err => console.error(err));
  },
  async getListCategories({ commit }) {
    const restaurantId = state.currentUser.restaurantId;
    await axios
      .get(
        `${process.env.VUE_APP_PANDORA_API_URL}/Categories/summary/${restaurantId}`
      )
      .then(response => commit("SET_LIST_CATEGORIES", response.data))
      .catch(err => console.error(err));
  },
  async getDishesByCategory({ commit }, categoryId) {
    await axios
      .get(`${process.env.VUE_APP_PANDORA_API_URL}/menus/${categoryId}/Dishes`)
      .then(response => commit("SET_DISHES", response.data))
      .catch(err => console.error(err));
  },
  async getDishesByMenu({ commit }, menuId) {
    await axios
      .get(`${process.env.VUE_APP_PANDORA_API_URL}/menus/${menuId}/dishesmenu`)
      .then(response => commit("SET_ALL_DISHES", response.data))
      .catch(err => console.error(err));
  },
  async getDishes({ commit }, pageIndex) {
    let page = 1;

    if (pageIndex) {
      page = pageIndex;
    }

    await axios
      .get(`${process.env.VUE_APP_PANDORA_API_URL}/Dishes?PageIndex=${page}`)
      .then(response => commit("SET_ALL_DISHES", response.data))
      .catch(err => console.error(err));
  },
  async getAllDishes({ commit }) {
    const restaurantId = state.currentUser.restaurantId;

    await axios
      .get(
        `${process.env.VUE_APP_PANDORA_API_URL}/Dishes/summary/${restaurantId}`
      )
      .then(response => commit("SET_ALL_DISHES", response.data))
      .catch(err => console.error(err));
  },
  async getAllClients({ commit }) {
    await axios
      .get(`${process.env.VUE_APP_PANDORA_API_URL}/Clients`)
      .then(response => commit("SET_ALL_CLIENTS", response.data))
      .catch(err => console.error(err));
  },
  async getTables({ commit }, tableId) {
    let data = [];
    await axios
      .get(`${process.env.VUE_APP_PANDORA_API_URL}/Tables?TableIds=${tableId}`)
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
      .get(
        `${process.env.VUE_APP_PANDORA_API_URL}/Dishes/${dishId}/ingredients`
      )
      .then(response => commit("SET_INGREDIENTS", response.data))
      .catch(err => console.error(err));
  },
  async getAllIngredients({ commit }) {
    const restaurantId = state.currentUser.restaurantId;
    await axios
      .get(
        `${process.env.VUE_APP_PANDORA_API_URL}/Ingredients/summary/${restaurantId}`
      )
      .then(response => commit("SET_ALL_INGREDIENTS", response.data))
      .catch(err => console.error(err));
  },
  async getGarrisons({ commit }) {
    const restaurantId = state.currentUser.restaurantId;
    await axios
      .get(
        `${process.env.VUE_APP_PANDORA_API_URL}/Ingredients/garrisons/${restaurantId}`
      )
      .then(response => commit("SET_ALL_INGREDIENTS", response.data))
      .catch(err => console.error(err));
  },
  async getAllRooms({ commit }) {
    const restaurantId = state.currentUser.restaurantId;
    await axios
      .get(
        `${process.env.VUE_APP_PANDORA_API_URL}/Rooms/summary?restaurantId=${restaurantId}`
      )
      .then(response => commit("SET_ALL_ROOMS", response.data))
      .catch(err => console.error(err));
  },
  async getTotalOrderByTables({ commit }, dates) {
    const restaurantId = state.currentUser.restaurantId;
    let dateFrom = "";
    let dateTo = "";
    let options = "";

    if (dates) {
      dateFrom = dates.dateFrom;
      dateTo = dates.dateTo;
    }

    if (dateFrom) {
      options = "&DateFrom=" + dateFrom;
    }
    if (dateTo) {
      options += "&DateTo=" + dateTo;
    }

    await axios
      .get(
        `${process.env.VUE_APP_PANDORA_API_URL}/Orders/TotalsByTables?RestaurantId=${restaurantId}${options}`
      )
      .then(response => commit("SET_ALL_TOTAL_TABLES", response.data))
      .catch(err => console.error(err));
  },
  async getTotalOrderByDelivery({ commit }, dates) {
    const restaurantId = state.currentUser.restaurantId;
    let dateFrom = "";
    let dateTo = "";
    let options = "";

    if (dates) {
      dateFrom = dates.dateFrom;
      dateTo = dates.dateTo;
    }

    if (dateFrom) {
      options = "&DateFrom=" + dateFrom;
    }
    if (dateTo) {
      options += "&DateTo=" + dateTo;
    }

    await axios
      .get(
        `${process.env.VUE_APP_PANDORA_API_URL}/Orders/TotalsByDelivery?RestaurantId=${restaurantId}${options}`
      )
      .then(response => commit("SET_ALL_TOTAL_DELIVERY", response.data))
      .catch(err => console.error(err));
  },
  async getInvoices({ commit }, data) {
    let page = 1;
    let options = "";

    if (data) {
      if (data.page) {
        page = data.page;
      }
      if (data.dateFrom) {
        options = "&DateFrom=" + data.dateFrom;
      }
      if (data.dateTo) {
        options += "&DateTo=" + data.dateTo;
      }
    }

    await axios
      .get(
        `${process.env.VUE_APP_PANDORA_API_URL}/Invoices?RestaurantId=${state.currentUser.restaurantId}&PageIndex=${page}${options}`
      )
      .then(response => commit("SET_INVOICES", response.data))
      .catch(err => console.error(err));
  },
  removeOrderItem({ commit }, data) {
    commit("REMOVE_ORDER_ITEM", data);
  },
  getImages({ commit }, data) {
    axios
      .get(
        `${process.env.VUE_APP_PANDORA_API_URL}/Images/${data.directory}/${data.fileName}`
      )
      .then(response => commit("SET_IMAGES", response.data))
      .catch(err => console.error(err));
  },
  async upadateIngredient({ commit }, data) {
    const response = await axios(
      `${process.env.VUE_APP_PANDORA_API_URL}/Dishes`,
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
  async updateInventoryIngredient({ commit }, data) {
    const response = await axios(
      `${process.env.VUE_APP_PANDORA_API_URL}/Ingredients/inventory`,
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

    if (response.status === 200) {
      const result = {response: response.data, data};
      commit("SET_INVENTORY_INGREDIENT", result);
    }
    return response;
  },
  async processOrden({ commit }, data) {
    const response = await axios(
      `${process.env.VUE_APP_PANDORA_API_URL}/Orders`,
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
      `${process.env.VUE_APP_PANDORA_API_URL}/Dishes`,
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
  async addDishDetailAsync({ dispatch }, data) {
    const response = await axios(
      `${process.env.VUE_APP_PANDORA_API_URL}/Dishes/details`,
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
  updateOrderNote({ commit }, dish) {
    commit("SET_ORDER_NOTE", dish);
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
      ? getters.GetOrderItem(state, dish.dishId)
      : [];
    if (existOrder) {
      existOrder.quantity += parseInt(dish.quantity);
      existOrder.total = existOrder.quantity * existOrder.price;
    } else {
      state.ordersItems.push(dish);
    }
  },
  SET_INVENTORY_INGREDIENT(state, ingredient) {
    const {data, response } = ingredient;
    const existIngredient = state.allIngredients
      ? getters.GetIngredientItem(state, data.ingredientId)
      : null;
    if (existIngredient && response.isUpdate) {
      if (
        INVENTORY_TYPE.increase == data.type ||
        INVENTORY_TYPE.decrease == data.type
      ) {
        existIngredient.quantity += parseInt(response.statusCode);
      } else {
        existIngredient.quantity = parseInt(response.statusCode);
      }
    }
  },
  SET_ORDER_QUANTITY(state, item) {
    const existsOrder = getters.GetOrderItem(state, item.id);
    if (existsOrder) {
      mutations.SET_ORDER_ITEM_UPDATED(existsOrder, item.quantity);
    }
  },
  SET_ORDER_ITEM_UPDATED(orderItem, quantity) {
    orderItem.quantity = parseInt(quantity);
    orderItem.total = quantity * orderItem.price;
  },
  SET_ORDER_NOTE(state, item) {
    const existsOrder = getters.GetOrderItem(state, item.dishId);
    if (existsOrder) {
      mutations.SET_ORDER_ITEM_UPDATED_NOTE(existsOrder, item.note);
    }
  },
  SET_ORDER_ITEM_UPDATED_NOTE(orderItem, note) {
    orderItem.note = note;
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
    state.ordersItems.splice(findItem, 1);
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
  SET_ALL_INGREDIENTS(state, ingredients) {
    state.allIngredients = ingredients;
  },
  SET_ALL_TOTAL_TABLES(state, totalTables) {
    state.allTotalTables = totalTables;
  },
  SET_ALL_TOTAL_DELIVERY(state, totalDelivery) {
    state.allTotalDelivery = totalDelivery;
  },
  SET_INVOICES(state, invoices) {
    state.listInvoices = {};
    if (invoices) {
      const formatInvoices = invoices.list.map(e => {
        e.order.total = numberFormat(e.order.total, 2);
        e.order.discount = numberFormat(e.order.discount, 2);
        e.order.tax = numberFormat(e.order.tax, 2);
        e.order.placementDate = dateFormat(
          stringToDatetime(e.order.placementDate)
        );
        e.paymentMethod = PAYMENT_METHODS.find(
          x => x.paymentMethodId == e.paymentMethod
        ).paymentMethod;
        return e;
      });
      invoices.list = formatInvoices;
      state.listInvoices = { ...invoices };
    }
  },
  SET_ALL_ROOMS(state, rooms) {
    state.rooms = rooms;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
