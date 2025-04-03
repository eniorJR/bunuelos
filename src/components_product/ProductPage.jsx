"use client";
import bun1 from "../assets/bun1.webp";
import bun2 from "../assets/bun2.webp";
import bun3 from "../assets/bun3.webp";
import bun4 from "../assets/bun4.jpg";

import { useState, useEffect } from "react";
import { Radio, RadioGroup } from "@headlessui/react";

// Initial product data
const initialProduct = {
  name: "Pack 12 buñuelos clasicos",
  price: 9 + " €",
  href: "#",
  breadcrumbs: [{ id: 1, name: "Familia", href: "#" }],
  images: [
    {
      src: bun1.src,
      alt: "Two each of gray, white, and black shirts laying flat.",
    },
    {
      src: bun1.src,
      alt: "Model wearing plain black basic tee.",
    },
    {
      src: bun1.src,
      alt: "Model wearing plain gray basic tee.",
    },
    {
      src: bun1.src,
      alt: "Model wearing plain white basic tee.",
    },
  ],
  colors: [
    {
      name: "Clasico",
      class: "bg-gray-900",
      selectedClass: "ring-gray-900",
      imageSrc: bun1.src,
    },
    {
      name: "Crema",
      class: "bg-white",
      selectedClass: "ring-gray-400",
      imageSrc: bun2.src,
    },
    {
      name: "Nata",
      class: "bg-gray-200",
      selectedClass: "ring-gray-400",
      imageSrc: bun3.src,
    },
    {
      name: "Chocolate",
      class: "bg-gray-900",
      selectedClass: "ring-gray-900",
      imageSrc: bun4.src,
    },
  ],
  sizes: [
    { name: "9", inStock: false, price: 7 },
    { name: "12", inStock: true, price: 9 },
    { name: "16", inStock: true, price: 11 },
    { name: "24", inStock: true, price: 16 },
    { name: "28", inStock: true, price: 18 },
    { name: "32", inStock: true, price: 20 },
    { name: "46", inStock: true, price: 28 },
    { name: "50", inStock: true, price: 30 },
  ],
  description:
    "Nuestro Pack de 12 Buñuelos Clásicos te ofrece el auténtico sabor tradicional español. Elaborados artesanalmente siguiendo recetas familiares, estos buñuelos son perfectos para disfrutar en cualquier momento del día, especialmente con un buen café o chocolate caliente. Su textura esponjosa por dentro y crujiente por fuera te transportará a los sabores de siempre.",
  highlights: [
    "Elaborados artesanalmente cada día",
    "Ingredientes 100% naturales y de proximidad",
    "Sin conservantes ni aditivos artificiales",
    "Receta tradicional desde 1990",
  ],
  details:
    "El Pack de 12 Buñuelos Clásicos incluye nuestros buñuelos tradicionales con un ligero toque de canela y azúcar. Perfectos para desayunos, meriendas o como postre. Conservar en lugar fresco y seco. Consumir preferentemente en las 48 horas tras su elaboración para disfrutar de toda su frescura y sabor.",
};

const reviews = { href: "#", average: 4, totalCount: 117 };

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
// Function to set a cookie
const setCookieFunction = (name, value, days) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
};

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return "[]";
};

export default function Example() {
  // Convert product to state
  const parm = Number(document.baseURI.split("prod=")[1]) || 0;
  const [product, setProduct] = useState(initialProduct);
  const [selectedColor, setSelectedColor] = useState(
    initialProduct.colors[parm >= 0 && parm <= 3 ? parm : 0]
  );
  const [selectedSize, setSelectedSize] = useState(initialProduct.sizes[1]);

  // Update product when size changes
  useEffect(() => {
    if (selectedSize) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        name: `Pack ${
          selectedSize.name
        } buñuelos ${selectedColor.name.toLowerCase()}`,
        price: selectedSize.price + " €",
        description: prevProduct.description.replace(
          /Pack de \d+ Buñuelos/g,
          `Pack de ${selectedSize.name} Buñuelos`
        ),
        details: prevProduct.details.replace(
          /Pack de \d+ Buñuelos/g,
          `Pack de ${selectedSize.name} Buñuelos`
        ),
      }));
    }
  }, [selectedSize, selectedColor]);

  // Update product when color changes
  useEffect(() => {
    if (selectedColor) {
      const imageSrc = selectedColor.imageSrc;

      setProduct((prevProduct) => ({
        ...prevProduct,
        name: `Pack ${
          selectedSize.name
        } buñuelos ${selectedColor.name.toLowerCase()}`,
        price: selectedSize.price + " €",
        description: prevProduct.description.replace(
          /Pack de \d+ Buñuelos/g,
          `Pack de ${selectedSize.name} Buñuelos`
        ),
        details: prevProduct.details.replace(
          /Pack de \d+ Buñuelos/g,
          `Pack de ${selectedSize.name} Buñuelos`
        ),
        // Update all images with the selected type's image
        images: prevProduct.images.map((image) => ({
          ...image,
          src: imageSrc,
          alt: `Buñuelos de ${selectedColor.name.toLowerCase()}`,
        })),
      }));
    }
  }, [selectedColor, selectedSize]);
  const addProduct = (prod) => {
    // Get cart from cookie
    const cart = getCookie("cart");

    // If cart is empty, create an array
    if (!cart) {
      setCookieFunction("cart", JSON.stringify([prod]), 7);
    } else {
      try {
        let x = JSON.parse(cart);
        x.push(prod);
        setCookieFunction("cart", JSON.stringify(x), 7);
      } catch (err) {
        prod.id = 1;
        setCookieFunction("cart", JSON.stringify([prod]), 7);
      }
    }

    // Dispatch a custom event to notify other components about cart changes
    const cartUpdateEvent = new CustomEvent("cartUpdated", {
      detail: { action: "add", product: prod },
    });
    window.dispatchEvent(cartUpdateEvent);

    window.scrollTo(0, 0);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();

    const prd = {
      id: JSON.parse(getCookie("cart")).length + 1,
      name: product.name,
      price: selectedSize.price,
      quantity: selectedSize.name,
      cat: "Familia",
      imageSrc: product.images[0].src,
      imageAlt: product.name,
      color: selectedColor.name,
      size: selectedSize.name,
    };
    console.log(prd);

    // Add product to cart
    addProduct(prd);
  };

  return (
    <div className="bg-white">
      <div className="pt-6">
        <nav aria-label="Breadcrumb">
          <ol
            role="list"
            className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
          >
            {product.breadcrumbs.map((breadcrumb) => (
              <li key={breadcrumb.id}>
                <div className="flex items-center">
                  <a
                    href={breadcrumb.href}
                    className="mr-2 text-sm font-medium text-gray-900"
                  >
                    {breadcrumb.name}
                  </a>
                  <svg
                    fill="currentColor"
                    width={16}
                    height={20}
                    viewBox="0 0 16 20"
                    aria-hidden="true"
                    className="h-5 w-4 text-gray-300"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>
            ))}
            <li className="text-sm">
              <a
                href={product.href}
                aria-current="page"
                className="font-medium text-gray-500 hover:text-gray-600"
              >
                {product.name}
              </a>
            </li>
          </ol>
        </nav>

        {/* Image gallery */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
          <img
            alt={product.images[0].alt}
            src={product.images[0].src}
            className="hidden size-full rounded-lg object-cover lg:block"
          />
          <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
            <img
              alt={product.images[1].alt}
              src={product.images[1].src}
              className="aspect-3/2 w-full rounded-lg object-cover"
            />
            <img
              alt={product.images[2].alt}
              src={product.images[2].src}
              className="aspect-3/2 w-full rounded-lg object-cover"
            />
          </div>
          <img
            alt={product.images[3].alt}
            src={product.images[3].src}
            className="aspect-4/5 size-full object-cover sm:rounded-lg lg:aspect-auto"
          />
        </div>

        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {product.name}
            </h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-gray-900">
              {product.price}
            </p>

            {/* Reviews */}
            <div className="mt-6">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <svg
                      key={rating}
                      className={classNames(
                        reviews.average > rating
                          ? "text-gray-900"
                          : "text-gray-200",
                        "size-5 shrink-0"
                      )}
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="m12 17.275l-4.15 2.5q-.275.175-.575.15t-.525-.2t-.35-.437t-.05-.588l1.1-4.725L3.775 10.8q-.25-.225-.312-.513t.037-.562t.3-.45t.55-.225l4.85-.425l1.875-4.45q.125-.3.388-.45t.537-.15t.537.15t.388.45l1.875 4.45l4.85.425q.35.05.55.225t.3.45t.038.563t-.313.512l-3.675 3.175l1.1 4.725q.075.325-.05.588t-.35.437t-.525.2t-.575-.15z"
                      ></path>
                    </svg>
                  ))}
                </div>
                <p className="sr-only">{reviews.average} out of 5 stars</p>
                <a
                  href={reviews.href}
                  className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {reviews.totalCount} reviews
                </a>
              </div>
            </div>

            <form className="mt-10">
              {/* Colors */}
              <div>
                <h3 className="text-sm font-medium text-gray-900">Tipo</h3>

                <fieldset aria-label="Choose a color" className="mt-4">
                  <RadioGroup
                    value={selectedColor}
                    onChange={setSelectedColor}
                    className="flex items-center gap-x-3"
                  >
                    {product.colors.map((color) => (
                      <Radio
                        key={color.name}
                        value={color}
                        className={classNames(
                          "cursor-pointer bg-white text-gray-900 shadow-xs",
                          "group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium  hover:bg-gray-50 focus:outline-hidden data-focus:ring-2 data-focus:ring-indigo-500 sm:flex-1 sm:py-6"
                        )}
                      >
                        <span>{color.name}</span>

                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -inset-px rounded-md border-2 border-transparent group-data-checked:border-indigo-500 group-data-focus:border"
                        />
                      </Radio>
                    ))}
                  </RadioGroup>
                </fieldset>
              </div>

              {/* Sizes */}
              <div className="mt-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    Cantidad
                  </h3>
                  <a
                    href="#"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Buñuelos en caja
                  </a>
                </div>

                <fieldset aria-label="Choose a size" className="mt-4">
                  <RadioGroup
                    value={selectedSize}
                    onChange={setSelectedSize}
                    className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4"
                  >
                    {product.sizes.map((size) => (
                      <Radio
                        key={size.name}
                        value={size}
                        disabled={!size.inStock}
                        className={classNames(
                          size.inStock
                            ? "cursor-pointer bg-white text-gray-900 shadow-xs"
                            : "cursor-not-allowed bg-gray-50 text-gray-200",
                          "group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-hidden data-focus:ring-2 data-focus:ring-indigo-500 sm:flex-1 sm:py-6"
                        )}
                      >
                        <span>{size.name}</span>
                        {size.inStock ? (
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -inset-px rounded-md border-2 border-transparent group-data-checked:border-indigo-500 group-data-focus:border"
                          />
                        ) : (
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                          >
                            <svg
                              stroke="currentColor"
                              viewBox="0 0 100 100"
                              preserveAspectRatio="none"
                              className="absolute inset-0 size-full stroke-2 text-gray-200"
                            >
                              <line
                                x1={0}
                                x2={100}
                                y1={100}
                                y2={0}
                                vectorEffect="non-scaling-stroke"
                              />
                            </svg>
                          </span>
                        )}
                      </Radio>
                    ))}
                  </RadioGroup>
                </fieldset>
              </div>

              <button
                onClick={(e) => {
                  handleAddToCart(e);
                }}
                className="mt-10 cursor-pointer flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
              >
                Añadir a cesta&nbsp;
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1m-9-1a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1M18 6H4.27l2.55 6H15c.33 0 .62-.16.8-.4l3-4c.13-.17.2-.38.2-.6a1 1 0 0 0-1-1m-3 7H6.87l-.77 1.56L6 15a1 1 0 0 0 1 1h11v1H7a2 2 0 0 1-2-2a2 2 0 0 1 .25-.97l.72-1.47L2.34 4H1V3h2l.85 2H18a2 2 0 0 1 2 2c0 .5-.17.92-.45 1.26l-2.91 3.89c-.36.51-.96.85-1.64.85"
                  ></path>
                </svg>
              </button>
            </form>
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pr-8 lg:pb-16">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>

              <div className="space-y-6">
                <p className="text-base text-gray-900">{product.description}</p>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">
                Nuestros buñuelos
              </h3>

              <div className="mt-4">
                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                  {product.highlights.map((highlight) => (
                    <li key={highlight} className="text-gray-400">
                      <span className="text-gray-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Detalles</h2>

              <div className="mt-4 space-y-6">
                <p className="text-sm text-gray-600">{product.details}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
