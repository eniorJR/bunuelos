import bun1 from "../assets/bun1.webp";
import bun2 from "../assets/bun2.webp";
import bun3 from "../assets/bun3.webp";
import bun4 from "../assets/bun4.jpg";

const products = [
  {
    id: 1,
    name: "Pack 12 buñuelos clasicos",
    href: "/shop/product?prod=0",
    price: "9€",
    imageSrc: bun1.src,
    imageAlt: "Pack de compra de 12 buñuelos clasicos",
  },
  {
    id: 2,
    name: "Pack 12 buñuelos de crema",
    href: "/shop/product?prod=1",
    price: "9,12€",
    imageSrc: bun2.src,
    imageAlt: "Pack de compra de 12 buñuelos crema",
  },
  {
    id: 3,
    name: "Pack 12 buñuelos de nata",
    href: "/shop/product?prod=2",
    price: "9,20€",
    imageSrc: bun3.src,
    imageAlt: "Pack de compra de 12 buñuelos  nata",
  },
  {
    id: 4,
    name: "Pack 12 buñuelos de chocolate",
    href: "/shop/product?prod=3",
    price: "9,50€",
    imageSrc: bun4.src,
    imageAlt: "Pack de compra de 12 buñuelos chocolate",
  },
  // More products...
];

const productsBig = [
  {
    id: 1,
    name: "Pedido grande buñuelos clásicos",
    href: "shop/product?prod=0",
    price: "35€",
    imageSrc: bun1.src,
    imageAlt: "Pack mayorista de 50 buñuelos clásicos para panaderías",
  },
  {
    id: 2,
    name: "Pedido grande buñuelos crema",
    href: "shop/product?prod=1",
    price: "65€",
    imageSrc: bun2.src,
    imageAlt: "Pack mayorista de 100 buñuelos surtidos para panaderías",
  },
  {
    id: 3,
    name: "Pedido grande buñuelos nata",
    href: "shop/produc?prod=2",
    price: "55€",
    imageSrc: bun3.src,
    imageAlt: "Pack mayorista de 75 buñuelos premium para panaderías",
  },
  {
    id: 4,
    name: "Pedido grande buñuelos chocolate",
    href: "shop/product?prod=3",
    price: "70€",
    imageSrc: bun4.src,
    imageAlt: "Pack mayorista de 120 mini buñuelos para eventos y panaderías",
  },

  // More products...
];

export default function Products() {
  return (
    <div className="bg-bkac" id="products">
      <div className="mx-auto max-w-2xl px-10 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 ">
        <h2 className="mb-5 font-bold text-4xl">Packs familia</h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <a key={product.id} href={product.href} className="group">
              <img
                alt={product.imageAlt}
                src={product.imageSrc}
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
              />
              <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">
                {product.price}
              </p>
            </a>
          ))}
        </div>
      </div>

      <div className="bg-white py-6 sm:py-8 lg:py-12 px-4">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <div className="flex flex-col overflow-hidden rounded-lg bg-gray-900 sm:flex-row md:h-80">
            <div className="flex w-full flex-col p-4 sm:w-1/2 sm:p-8 lg:w-2/5">
              <h2 className="mb-4 text-xl font-bold text-white md:text-2xl lg:text-4xl">
                ¡Crea tu pack ideal de <strong>buñuelos favoritos</strong>!
              </h2>

              <p className="mb-4 max-w-md text-gray-400">
                ¿No puedes decidirte por un solo sabor? Combina tus buñuelos
                preferidos en un pack personalizado y disfruta de una
                experiencia única. ¡Tú eliges, nosotros lo preparamos con todo
                el cariño!
              </p>

              <div className="">
                <a
                  href="#"
                  className="inline-block rounded-lg bg-white px-8 py-2 text-center text-sm font-semibold text-gray-800 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-100 focus-visible:ring active:bg-gray-200 md:text-base"
                >
                  ¡Crear mi pack!
                </a>
              </div>
            </div>

            <div className="order-first h-48 w-full bg-gray-700 sm:order-none sm:h-auto sm:w-1/2 lg:w-3/5">
              <img
                src={bun1.src}
                loading="lazy"
                alt="Photo by Dom Hill"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-2xl px-10 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="mb-5 font-bold text-4xl">Pedidos grandes</h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {productsBig.map((product) => (
            <a key={product.id} href={product.href} className="group">
              <img
                alt={product.imageAlt}
                src={product.imageSrc}
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
              />
              <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
              {/*<p className="mt-1 text-lg font-medium text-gray-900">
                {product.price}
              </p>*/}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
