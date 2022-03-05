export const TYPE_IMAGES = [
  {
    typeId: "C",
    type: "category"
  },
  {
    typeId: "D",
    type: "dish"
  },
  {
    typeId: "I",
    type: "ingredient"
  }
];

export const STATUS_ORDER = {
  active: "Active",
  cancelled: "Canceled",
  close: "Close",
  delivered: "Delivered"
};

export const LIST_STATUS_ORDER = [
  {
    status: "Active",
    color: "green"
  },
  {
    status: "Canceled",
    color: "red"
  },
  {
    status: "Close",
    color: "teal"
  },
  {
    status: "Delivered",
    color: "warning"
  }
];

export const PAYMENT_METHODS = [
  {
    paymentMethod: "Efectivo",
    paymentMethodId: "E",
    color: "green"
  },
  {
    paymentMethod: "Tarjeta",
    paymentMethodId: "T",
    color: "teal"
  },
  {
    paymentMethod: "Cheque",
    paymentMethodId: "C",
    color: "warning"
  }
];

export const INVENTORY_TYPE = {
  increase: 0,
  decrease: 1,
  current: 2
}

export const DATA_ERROR = {
  isOpen: false,
  errors: [],
  title: "Para continuar necesita resolver los siguientes errores",
  modalType: "error"
};

export const APPROVALS = {
  DISH: "DISH",
  INGREDIENTS: "INGREDIENTS"
};

export const RULES = {
  required: value => !!value || "El valor es requerido",
  min: (num, min) => num >= min || `El valor minimo es ${min}`,
  len: (num, min) => num >= min || `La cantidad minima de letras es ${min}`
};
