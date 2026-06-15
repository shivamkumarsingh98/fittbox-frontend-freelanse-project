import { createSlice } from "@reduxjs/toolkit";

// Get initial state from localStorage if available

function removeDuplicateItems(items) {
  const map = {};
  items.forEach((item) => {
    if (!map[item.id]) {
      map[item.id] = item;
    }
  });
  return Object.values(map);
}

const computeItemTotalPrice = (item) => {
  if (item.planType === "MealPlan") {
    // Monthly meal plans are already stored as the full plan price
    return item.price;
  }

  if (item.planType === "TrialMeal") {
    const quantity = item.quantity ?? 1;
    const days = item.days ?? 1;
    return item.price * quantity * days;
  }

  // Fallback for any other items
  const quantity = item.quantity ?? 1;
  const days = item.days ?? 1;
  return item.price * quantity * days;
};

const getInitialState = () => {
  if (typeof window !== "undefined") {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);

        // CLEAN DUPLICATES HERE
        const cleanedItems = removeDuplicateItems(parsed.items || []);

        // Recalculate totals
        const totalQuantity = cleanedItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        const totalAmount = cleanedItems.reduce(
          (total, item) => total + computeItemTotalPrice(item),
          0
        );

        return {
          items: cleanedItems,
          totalQuantity,
          totalAmount,
        };
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
      }
    }
  }
  return {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
  };
};

const initialState = getInitialState();

// Helper function to save cart to localStorage
const saveCartToStorage = (cartState) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("cart", JSON.stringify(cartState));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.items = removeDuplicateItems(state.items);
      const meal = action.payload;

      // Use the id already passed
      const id = meal.id; // <-- important

      const existingItem = state.items.find((item) => item.id === id);

      const isTrialMeal = meal.planType === "TrialMeal";
      const days = isTrialMeal ? meal.days ?? 1 : 30;
      const quantity = isTrialMeal ? meal.quantity ?? 1 : 1;

      if (existingItem) {
        if (meal.planType === "MealPlan") {
          return;
        }
        if (meal.planType === "TrialMeal") {
          return;
        }

        existingItem.totalPrice = computeItemTotalPrice(existingItem);
      } else {
        const cartItem = {
          id,
          name: meal.name,
          category: meal.category,
          type: meal.type,
          planType: meal.planType,
          price: meal.price,
          quantity,
          days,
        };

        cartItem.totalPrice = computeItemTotalPrice(cartItem);
        state.items.push(cartItem);
      }

      state.totalQuantity = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      state.totalAmount = state.items.reduce(
        (sum, item) => sum + computeItemTotalPrice(item),
        0
      );

      saveCartToStorage(state);
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.items = state.items.filter((item) => item.id !== id);
        } else {
          existingItem.quantity--;
          existingItem.totalPrice = computeItemTotalPrice(existingItem);
        }

        state.totalQuantity = state.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        state.totalAmount = state.items.reduce(
          (total, item) => total + computeItemTotalPrice(item),
          0
        );

        saveCartToStorage(state);
      }
    },
    updateCartItem: (state, action) => {
      const { id, days, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        if (days !== undefined) existingItem.days = days;
        if (quantity !== undefined) existingItem.quantity = quantity;

        existingItem.totalPrice = computeItemTotalPrice(existingItem);

        state.totalQuantity = state.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        state.totalAmount = state.items.reduce(
          (total, item) => total + computeItemTotalPrice(item),
          0
        );

        saveCartToStorage(state);
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      saveCartToStorage(state);
    },
  },
});

export const { addToCart, removeFromCart, updateCartItem, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
