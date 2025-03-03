import { useReducer } from "react";

// Initial State
const initialState = {
  selectedCustomer: null,
  selectedProduct: null,
  quantity: 1,
  showModal: false,
  cartItems: [],
  subTotal: 0,
  cash: 0,
  change: 0,
  selectedCategory: "",
  discount: "",
  products: [],
  filteredProducts: [],
  searchTerm: "",
  showReceiptModal: false,
  showSnapModal: false,
  loading: true,
  paymentMethod: "cash",
};

// Action Types
const ACTIONS = {
  SET_SELECTED_CUSTOMER: "SET_SELECTED_CUSTOMER",
  SET_SELECTED_PRODUCT: "SET_SELECTED_PRODUCT",
  SET_QUANTITY: "SET_QUANTITY",
  SET_SHOW_MODAL: "SET_SHOW_MODAL",
  SET_CART_ITEMS: "SET_CART_ITEMS",
  SET_SUBTOTAL: "SET_SUBTOTAL",
  SET_CASH: "SET_CASH",
  SET_CHANGE: "SET_CHANGE",
  SET_SELECTED_CATEGORY: "SET_SELECTED_CATEGORY",
  SET_DISCOUNT: "SET_DISCOUNT",
  SET_FILTERED_PRODUCTS: "SET_FILTERED_PRODUCTS",
  SET_SEARCH_TERM: "SET_SEARCH_TERM",
  SET_SHOW_RECEIPT_MODAL: "SET_SHOW_RECEIPT_MODAL",
  SET_SHOW_SNAP_MODAL: "SET_SHOW_SNAP_MODAL",
  SET_LOADING: "SET_LOADING",
  SET_PAYMENT_METHOD: "SET_PAYMENT_METHOD",
  SET_PRODUCTS: "SET_PRODUCTS",
  RESET_SELECTIONS: "RESET_SELECTIONS",
  CALCULATE_SUBTOTAL: "CALCULATE_SUBTOTAL",
  FILTER_PRODUCTS: "FILTER_PRODUCTS",
};

// Reducer Function
const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_SELECTED_CUSTOMER:
      return { ...state, selectedCustomer: action.payload };

    case ACTIONS.SET_SELECTED_PRODUCT:
      return { ...state, selectedProduct: action.payload };

    case ACTIONS.SET_QUANTITY:
      return { ...state, quantity: action.payload };

    case ACTIONS.SET_SHOW_MODAL:
      return { ...state, showModal: action.payload };

    case ACTIONS.SET_CART_ITEMS:
      return { ...state, cartItems: action.payload };

    case ACTIONS.SET_SUBTOTAL:
      return { ...state, subTotal: action.payload };

    case ACTIONS.SET_CASH:
      return { ...state, cash: action.payload };

    case ACTIONS.SET_CHANGE:
      return { ...state, change: action.payload };

    case ACTIONS.SET_SELECTED_CATEGORY:
      return { ...state, selectedCategory: action.payload };

    case ACTIONS.SET_DISCOUNT:
      return { ...state, discount: action.payload };

    case ACTIONS.SET_FILTERED_PRODUCTS:
      return { ...state, filteredProducts: action.payload };

    case ACTIONS.SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload };

    case ACTIONS.SET_SHOW_RECEIPT_MODAL:
      return { ...state, showReceiptModal: action.payload };

    case ACTIONS.SET_SHOW_SNAP_MODAL:
      return { ...state, showSnapModal: action.payload };

    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case ACTIONS.SET_PAYMENT_METHOD:
      return { ...state, paymentMethod: action.payload };

    case ACTIONS.SET_PRODUCTS:
      return { ...state, products: action.payload, filteredProducts: action.payload };

    case ACTIONS.RESET_SELECTIONS:
      return { ...state, selectedProduct: null, quantity: 1 };

    case ACTIONS.CALCULATE_SUBTOTAL:
      const total = state.cartItems.reduce(
        (acc, item) => acc + (Number(item.total_price) || 0),
        0
      );
      return { ...state, subTotal: total };


    case ACTIONS.FILTER_PRODUCTS:
    let filtered = state.products;

    if (state.selectedCategory) {
      filtered = filtered.filter(
        (p) => p.category_id === Number(state.selectedCategory)
      );
    }

    if (state.searchTerm) {
      const lowercasedTerm = state.searchTerm.toLowerCase();
      filtered = filtered.filter((p) =>
        (p.name && p.name.toLowerCase().includes(lowercasedTerm)) ||
        (p.barcode && p.barcode.toLowerCase().includes(lowercasedTerm))
      );
    }

    return { ...state, filteredProducts: filtered };


    default:
      return state;
  }
};

// Action Creators
export const setSelectedCustomer = (customer) => ({
  type: ACTIONS.SET_SELECTED_CUSTOMER,
  payload: customer,
});

export const setSelectedProduct = (product) => ({
  type: ACTIONS.SET_SELECTED_PRODUCT,
  payload: product,
});

export const setQuantity = (quantity) => ({
  type: ACTIONS.SET_QUANTITY,
  payload: quantity,
});

export const setShowModal = (show) => ({
  type: ACTIONS.SET_SHOW_MODAL,
  payload: show,
});

export const setCartItems = (items) => ({
  type: ACTIONS.SET_CART_ITEMS,
  payload: items,
});

export const setSubTotal = (total) => ({
  type: ACTIONS.SET_SUBTOTAL,
  payload: total,
});

export const setCash = (cash) => ({
  type: ACTIONS.SET_CASH,
  payload: cash,
});

export const setChange = (change) => ({
  type: ACTIONS.SET_CHANGE,
  payload: change,
});

export const setSelectedCategory = (category) => ({
  type: ACTIONS.SET_SELECTED_CATEGORY,
  payload: category,
});

export const setDiscount = (discount) => ({
  type: ACTIONS.SET_DISCOUNT,
  payload: discount,
});

export const setFilteredProducts = (products) => ({
  type: ACTIONS.SET_FILTERED_PRODUCTS,
  payload: products,
});

export const setSearchTerm = (term) => ({
  type: ACTIONS.SET_SEARCH_TERM,
  payload: term,
});

export const setShowReceiptModal = (show) => ({
  type: ACTIONS.SET_SHOW_RECEIPT_MODAL,
  payload: show,
});

export const setShowSnapModal = (show) => ({
  type: ACTIONS.SET_SHOW_SNAP_MODAL,
  payload: show,
});

export const setLoading = (loading) => ({
  type: ACTIONS.SET_LOADING,
  payload: loading,
});

export const setPaymentMethod = (method) => ({
  type: ACTIONS.SET_PAYMENT_METHOD,
  payload: method,
});

export const setProducts = (products) => ({
  type: ACTIONS.SET_PRODUCTS,
  payload: products,
});

export const resetSelections = () => ({
  type: ACTIONS.RESET_SELECTIONS,
});

export const calculateSubtotal = () => ({
  type: ACTIONS.CALCULATE_SUBTOTAL,
});


export const filterProducts = () => ({
  type: ACTIONS.FILTER_PRODUCTS,
});

// Custom Hook
const useSalesReducer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
};

export default useSalesReducer;
