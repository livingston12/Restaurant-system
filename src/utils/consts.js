export const TYPE_IMAGES = [
  {
    typeId: 'C',
    type: 'category'
  },
  {
    typeId: 'D',
    type: 'dish'
  }
]

export const STATUS_ORDER = 
{
  active: "Active",
  cancelled: "Canceled",
  close: "Close",
  delivered: "Delivered",
}

export const PAYMENT_METHODS = [
  {
    paymentMethod: "Efectivo",
    paymentMethodId: "E",
  },
  {
    paymentMethod: "Tarjeta",
    paymentMethodId: "T"
  }
]

export const DATA_ERROR = {  
    isOpen: false,
    errors: [],
    title: "Para continuar necesita resolver los siguientes errores",
    modalType: "error"  
}

export const APPROVALS = {
  DISH: 'DISH',
  INGREDIENTS : 'INGREDIENTS'
}

export const RULES = {
  required: value => !!value || 'El valor es requerido',
  min: (num, min) => num >= min || `El valor minimo es ${min}`,
  len: (num, min) => num >= min || `La cantidad minima de letras es ${min}`,
}

