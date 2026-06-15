"use client";

import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateCartItem } from "../redux/slices/cartSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useModal } from "../Component/ModalContext";
import toast from "react-hot-toast";
import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";


// export default function Page() {
//   const cart = useSelector((state) => state.cart);
//   const auth = useSelector((state) => state.auth);
//   const router = useRouter();
//   const modal = useModal();
//   const dispatch = useDispatch();

//   const openAuthModal = (mode) => {
//     modal.openModal(
//       <div className="w-full max-w-md mx-auto">
//         <AuthForm
//           mode={mode}
//           onSuccess={() => {
//             // After successful login, redirect to checkout
//             router.push("/checkout");
//           }}
//         />
//         <div className="mt-4 text-center text-sm">
//           {mode === "login" ? (
//             <button
//               onClick={() => {
//                 modal.closeModal();
//                 setTimeout(() => openAuthModal("register"), 200);
//               }}
//               className="text-blue-600 hover:text-blue-800"
//             >
//               Don't have an account? Register
//             </button>
//           ) : (
//             <button
//               onClick={() => {
//                 modal.closeModal();
//                 setTimeout(() => openAuthModal("login"), 200);
//               }}
//               className="text-blue-600 hover:text-blue-800"
//             >
//               Already have an account? Login
//             </button>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const handleCheckout = () => {
//     // Check if user is authenticated
//     if (!auth.isAuthenticated || !auth.token) {
//       // User not authenticated, show login modal
//       toast.error("Please login to proceed to checkout");
//       openAuthModal("login");
//       return;
//     }
//     // User is authenticated, proceed to checkout
//     router.push("/checkout");
//   };

//   if (cart.items.length === 0) {
//     return (
//       <div className="min-h-[60vh] flex flex-col items-center justify-center">
//         <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
//         <Link href="/Menu" className="text-blue-600 hover:text-blue-800">
//           Continue Shopping
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 min-h-[60vh]">
//       <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
//       <div className="flex flex-col lg:flex-row gap-8">
//         <div className="lg:w-2/3">
//           {cart.items.map((item) => {
//             const isTrialMeal = item.planType === "TrialMeal";
//             const durationDays = isTrialMeal ? item.days ?? 1 : 30;
//             const quantity = isTrialMeal ? item.quantity ?? 1 : 1;
//             const itemTotal = isTrialMeal
//               ? item.price * quantity * durationDays
//               : item.price;
//             console.log("🛒 Cart Item Debug:", {
//               id: item.id,
//               name: item.name,
//               type: item.type,
//               category: item.category,
//               planType: item.planType,
//               price: item.price,
//               quantity: item.quantity,
//               days: item.days,
//               itemTotal,
//             });
//             return (
//               <div
//                 key={item.id}
//                 className="flex items-center gap-4 border-b py-4"
//               >
//                 <div className="flex-1">
//                   <h2 className="text-xl font-semibold">{item.category}</h2>
//                   <h3 className="text-xl font-semibold">{item.name}</h3>
//                   <h4 className="text-xl font-semibold">{item.type}</h4>
//                   <p className="text-gray-600">₹{item.price}</p>

//                   <div className="flex items-center gap-2 mt-2 flex-wrap">
//                     {isTrialMeal && (
//                       <>
//                         <div className="flex items-center gap-2">
//                           <label className="text-sm text-gray-600">
//                             Days (1–3):
//                           </label>
//                           <input
//                             type="number"
//                             min="1"
//                             max="3"
//                             value={durationDays}
//                             onChange={(e) => {
//                               const daysValue = parseInt(e.target.value);
//                               if (
//                                 !isNaN(daysValue) &&
//                                 daysValue >= 1 &&
//                                 daysValue <= 3
//                               ) {
//                                 dispatch(
//                                   updateCartItem({
//                                     id: item.id,
//                                     days: daysValue,
//                                   })
//                                 );
//                               }
//                             }}
//                             className="w-16 px-2 py-1 border rounded text-sm"
//                           />
//                         </div>

//                         {/* <div className="flex items-center gap-2">
//                           <label className="text-sm text-gray-600">
//                             Quantity:
//                           </label>
//                           <input
//                             type="number"
//                             min="1"
//                             max="10"
//                             value={quantity}
//                             onChange={(e) => {
//                               const qty = parseInt(e.target.value);
//                               if (!isNaN(qty) && qty >= 1 && qty <= 10) {
//                                 dispatch(
//                                   updateCartItem({ id: item.id, quantity: qty })
//                                 );
//                               }
//                             }}
//                             className="w-16 px-2 py-1 border rounded text-sm"
//                           />
//                         </div> */}
//                       </>
//                     )}

//                     <button
//                       onClick={() => dispatch(removeFromCart(item.id))}
//                       className="text-red-600 hover:text-red-800 text-sm"
//                     >
//                       <RiDeleteBin6Line />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="text-xl font-bold">₹{itemTotal.toFixed(2)}</div>
//               </div>
//             );
//           })}
//         </div>
//         <div className="lg:w-1/3">
//           <div className="bg-gray-50 p-6 rounded-lg">
//             <h2 className="text-xl font-bold mb-4">Order Summary</h2>
//             <div className="space-y-2">
//               <div className="flex justify-between">
//                 <span>Subtotal</span>
//                 <span>₹{cart.totalAmount.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Shipping</span>
//                 <span>Free</span>
//               </div>
//               <div className="border-t pt-2 mt-2">
//                 <div className="flex justify-between font-bold">
//                   <span>Total</span>
//                   <span>₹{cart.totalAmount.toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>
//             <button
//               onClick={handleCheckout}
//               className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700"
//             >
//               Proceed to Checkout
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
export default function Page() {
  const cart = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);
  const router = useRouter();
  const modal = useModal();
  const dispatch = useDispatch();

  const handleCheckout = () => {
    if (!auth.isAuthenticated || !auth.token) {
      toast.error("Please login to proceed to checkout");
      router.push("/login");
      return;
    }
    router.push("/checkout");
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-8 bg-gray-200 border-2 border-dashed rounded-xl flex items-center justify-center">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h18l-2 12H5L3 3zm4 18a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z"
              />
            </svg>
          </div>
          <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
            Your cart is empty
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Looks like you haven't added anything yet.
          </p>
          <Link
            href="/Menu"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transform hover:scale-105 transition shadow-lg"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center lg:text-left">
          Your Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.items.map((item) => {
              const isTrialMeal = item.planType === "TrialMeal";
              const durationDays = isTrialMeal ? item.days ?? 1 : 30;
              const quantity = isTrialMeal ? item.quantity ?? 1 : 1;
              // const itemTotal = isTrialMeal
              //   ? item.price * quantity * durationDays
              //   : item.price;
              const itemTotal = item.totalPrice;

              console.log("🛒 Cart Item Debug:", {
                id: item.id,
                name: item.name,
                type: item.type,
                category: item.category,
                planType: item.planType,
                price: item.price,
                quantity: item.quantity,
                days: item.days,
                itemTotal,
              });

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-lg text-gray-700 mt-1">
                        {item.category} • {item.type}
                      </p>
                      <p className="text-xl font-semibold text-blue-600 mt-3">
                        ₹{item.price.toFixed(2)} / meal
                      </p>

                      {isTrialMeal && (
                        <div className="mt-5 flex flex-wrap items-center gap-6">
                          <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-gray-700">
                              Days:
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="3"
                              value={durationDays}
                              onChange={(e) => {
                                const daysValue = parseInt(e.target.value);
                                if (
                                  !isNaN(daysValue) &&
                                  daysValue >= 1 &&
                                  daysValue <= 3
                                ) {
                                  dispatch(
                                    updateCartItem({
                                      id: item.id,
                                      days: daysValue,
                                    })
                                  );
                                }
                              }}
                              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                          </div>

                          {/* Quantity input commented as before */}
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-900">
                        ₹{itemTotal.toFixed(2)}
                      </p>
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="mt-6 text-red-500 hover:text-red-700 hover:bg-red-50 p-3 rounded-full transition"
                      >
                        <RiDeleteBin6Line className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 px-8 pt-8">
                Order Summary
              </h2>

              <div className="px-8 pb-8 space-y-4">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    ₹{cart.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>

                <div className="border-t-2 border-gray-200 pt-6 mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-3xl font-extrabold text-blue-600">
                      ₹{cart.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full mt-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition duration-200 shadow-lg"
                >
                  Proceed to Checkout
                </button>

                <p className="text-center text-sm text-gray-500 mt-6">
                  Secure checkout • Free delivery • 100% fresh guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
