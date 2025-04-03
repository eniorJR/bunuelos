"use client";
import { useEffect, useState } from "react";
import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";

export default function CartP() {
  const [cartList, setCartList] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  // Function to get a cookie by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  // Add these calculations at the top of your component, after setting cartList
  useEffect(() => {
    try {
      const cartData = getCookie("cart");
      setCartList(
        Array.isArray(JSON.parse(cartData)) ? JSON.parse(cartData) : []
      );
    } catch (error) {
      console.error("Error loading cart:", error);
      setCartList([]);
    }
  }, []);

  // Function to remove an item from the cart
  const removeFromCart = (itemId) => {
    const updatedCart = cartList.filter((item) => item.id !== itemId);
    setCartList(updatedCart);

    // Update the cookie with the new cart data
    document.cookie = `cart=${JSON.stringify(
      updatedCart
    )}; path=/; max-age=86400`;
  };

  // Calculate cart totals
  const calculateTotals = () => {
    if (!cartList || cartList.length === 0)
      return { subtotal: 0, shipping: 0, tax: 0, total: 0 };

    const subtotal = cartList.reduce((sum, item) => {
      const price =
        typeof item.price === "number" ? item.price : parseFloat(item.price);
      return sum + price;
    }, 0);

    const shipping = subtotal > 0 ? 2.5 : 0;
    const tax = (subtotal + shipping) * 0.21; // 21% IVA
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };

  const { subtotal, shipping, tax, total } = calculateTotals();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle Stripe payment
  const handleStripePayment = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address
    ) {
      alert("Por favor, complete todos los campos del formulario");
      return;
    }

    setIsProcessing(true);

    try {
      // Initialize Stripe
      const stripePromise = loadStripe(
        "pk_test_51R4OKfRO11XoyFzDWrZoVxf78A6NiVyXeCEcBI225uJUER9GeLb8yBhIwpXmlu8NjKaEHem4zW6PN83vsEAw9MSB00SuECPUt9"
      );
      const stripe = await stripePromise;

      // Create a checkout session
      const response = await fetch("/api/route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartList,
          customerInfo: formData,
          shipping: shipping,
          tax: tax,
          total: total,
        }),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error("Network response was not ok");
      }
      console.log("llego");
      const session = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error(result.error.message);
        alert("Error al procesar el pago. Por favor, inténtelo de nuevo.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al procesar el pago. Por favor, inténtelo de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className=" relative z-10 after:contents-[''] after:absolute after:z-0 after:h-full xl:after:w-1/3 after:top-0 after:right-0 after:bg-gray-50">
      <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto relative z-10">
        <div className="grid grid-cols-12">
          <div className="col-span-12 xl:col-span-8 lg:pr-8 pt-14 pb-8 lg:py-24 w-full max-xl:max-w-3xl max-xl:mx-auto">
            <div className="flex items-center justify-between pb-8 border-b border-gray-300">
              <h2 className="font-manrope font-bold text-3xl leading-10 text-black">
                Carrito de la compra
              </h2>
              <h2 className="font-manrope font-bold text-xl leading-8 text-gray-600">
                {cartList && cartList.length}{" "}
                {cartList && cartList.length === 1 ? "Producto" : "Productos"}
              </h2>
            </div>
            <div className="grid grid-cols-12 mt-8 max-md:hidden pb-6 border-b border-gray-200">
              <div className="col-span-12 md:col-span-7">
                <p className="font-normal text-lg leading-8 text-gray-400">
                  Producto
                </p>
              </div>
              <div className="col-span-12 md:col-span-5">
                <div className="grid grid-cols-5">
                  <div className="col-span-3">
                    <p className="font-normal text-lg leading-8 text-gray-400 text-center">
                      Cantidad
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-normal text-lg leading-8 text-gray-400 text-center">
                      Total
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {cartList && cartList.length > 0 ? (
              cartList.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col min-[500px]:flex-row min-[500px]:items-center gap-5 py-6  border-b border-gray-200 group"
                >
                  <div className="w-full md:max-w-[126px]">
                    <img
                      src={item.imageSrc}
                      alt="perfume bottle image"
                      className="mx-auto rounded-xl object-cover"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 w-full">
                    <div className="md:col-span-2">
                      <div className="flex flex-col max-[500px]:items-center gap-3">
                        <h6 className="font-semibold text-base leading-7 text-black">
                          {item.name}
                        </h6>
                        <h6 className="font-normal text-base leading-7 text-gray-500">
                          {item.cat}
                        </h6>
                      </div>
                    </div>
                    <div className="flex m-auto items-center max-[500px]:justify-center h-full max-md:mt-3">
                      <div className="flex items-center h-full">
                        <span
                          type="text"
                          className="border-gray-200 text-gray-900 font-semibold text-lg w-full max-w-[73px] min-w-[60px] placeholder:text-gray-900 py-[15px] text-center bg-transparent"
                        >
                          {" "}
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-3 p-2 cursor-pointer rounded-full hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors"
                          title="Eliminar producto"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center max-[500px]:justify-center md:justify-end max-md:mt-3 h-full">
                      <p className="font-bold text-lg leading-8 text-gray-600 text-center transition-all duration-300 group-hover:text-indigo-600">
                        {item.price} €
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="font-bold text-lg leading-8 text-gray-600 text-center">
                  No hay productos en el carrito
                </p>
              </div>
            )}

            <div className="flex items-center justify-end mt-8">
              <a
                href="/shop#products"
                className="flex items-center cursor-pointer px-5 py-3 rounded-full gap-2 border-none outline-0 group font-semibold text-lg leading-8 text-indigo-600 shadow-sm shadow-transparent transition-all duration-500 hover:text-indigo-700"
              >
                Seguir comprando
                <svg
                  className="transition-all duration-500 group-hover:translate-x-2"
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                >
                  <path
                    d="M12.7757 5.5L18.3319 11.0562M18.3319 11.0562L12.7757 16.6125M18.3319 11.0562L1.83203 11.0562"
                    stroke="#4F46E5"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div className=" col-span-12 xl:col-span-4 bg-gray-50 w-full max-xl:px-6 max-w-3xl xl:max-w-lg mx-auto lg:pl-8 py-24">
            <h2 className="font-manrope font-bold text-3xl leading-10 text-black pb-8 border-b border-gray-300">
              Confirmar pedido
            </h2>
            <div className="mt-8">
              <form onSubmit={handleStripePayment}>
                <label className="flex items-center mb-1.5 text-gray-600 text-sm font-medium">
                  Nombre completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full h-11 pr-11 pl-5 py-2.5 text-base font-normal shadow-xs text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-gray-400"
                  placeholder="Marcos Llor Mas"
                  required
                />
                <label className="flex mt-2 items-center mb-1.5 text-gray-600 text-sm font-medium">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="block w-full h-11 pr-11 pl-5 py-2.5 text-base font-normal shadow-xs text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-gray-400"
                  placeholder="612 345 678"
                  required
                />
                <label className="flex mt-2 items-center mb-1.5 text-gray-600 text-sm font-medium">
                  Correo
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full h-11 pr-11 pl-5 py-2.5 text-base font-normal shadow-xs text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-gray-400"
                  placeholder="micorreo@midominio.es"
                  required
                />
                <label className="flex mt-2 items-center mb-1.5 text-gray-600 text-sm font-medium">
                  Dirección
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="block w-full h-11 pr-11 pl-5 py-2.5 text-base font-normal shadow-xs text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-gray-400"
                  placeholder="C/ Nombre de la calle, 12, 4º 1ª, 09029"
                  required
                />

                <div className="py-8">
                  <div className="flex items-center justify-between ">
                    <p className="font-medium text-base leading-8 text-black">
                      Coste de envío
                    </p>
                    <p className=" text-base leading-8 text-gray-600">
                      {shipping.toFixed(2)}€
                    </p>
                  </div>
                  <div className="flex items-center justify-between ">
                    <p className="font-medium text-base leading-8 text-black">
                      Total productos
                    </p>
                    <p className=" text-base leading-8 text-gray-600">
                      {subtotal.toFixed(2)}€
                    </p>
                  </div>
                  <div className="flex items-center justify-between ">
                    <p className="font-medium text-base leading-8 text-black">
                      IVA (21%)
                    </p>
                    <p className=" text-base leading-8 text-gray-600">
                      {tax.toFixed(2)}€
                    </p>
                  </div>
                  <div className="flex items-center justify-between ">
                    <p className="font-medium text-xl mt-2 leading-8 text-black">
                      Total
                    </p>
                    <p className="font-semibold text-xl leading-8 text-indigo-600">
                      {total.toFixed(2)}€
                    </p>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full cursor-pointer flex items-center gap-5 hover:gap-4 transition-all justify-center text-center bg-indigo-600 rounded-xl py-3 px-6 font-semibold text-lg text-white transition-all duration-500 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Procesando..." : "Pagar"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    className=""
                    viewBox="0 0 512 512"
                  >
                    <rect
                      width={416}
                      height={320}
                      x={48}
                      y={96}
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={32}
                      rx={56}
                      ry={56}
                    ></rect>
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinejoin="round"
                      strokeWidth={60}
                      d="M48 192h416M128 300h48v20h-48z"
                    ></path>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
