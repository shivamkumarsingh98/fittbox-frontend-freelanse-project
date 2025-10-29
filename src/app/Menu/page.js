"use client";

import Image from "next/image";
import Link from "next/link";
import { TrialMenu, MonthlyMenu } from "../Data";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";

function Page() {
  const dispatch = useDispatch();

  const handleAddToCart = (meal, type) => {
    const price = type === "veg" ? meal.veg : meal.nonveg;
    dispatch(
      addToCart({
        id: `${meal.name}-${type}`,
        name: `${meal.name} (${type})`,
        price: price,
        image: meal.img,
      })
    );
  };
  return (
    <main className="bg-[#f7f8fa] flex items-center">
      <div className="w-full max-w-7xl mx-auto px-4 py-10">
        {/* Hero Section */}
        <section className="menu-hero flex flex-col md:flex-row gap-8 items-center relative border-b pb-10">
          <div className="hero-left flex-1 max-w-[60%]">
            <h1 className="text-[3.5rem] leading-none text-[#07101a] font-extrabold mb-5">
              Our Menu
            </h1>
            <p className="text-[#0b1720] opacity-75 max-w-[48ch] mb-6">
              Fresh, zesty, and bursting with crunch—our meals are crafted to
              keep you energized and healthy every day!
            </p>
            <Link
              href="/menu/list"
              className="inline-block border-2 border-[#07101a] rounded-md text-[#07101a] font-bold tracking-widest px-4 py-2 hover:bg-[#07101a] hover:text-white transition"
            >
              VIEW MENU
            </Link>
          </div>

          <div className="hero-right flex-1 flex items-center justify-end relative">
            <div className="relative w-[300px] h-[300px] rounded-full overflow-hidden shadow-lg">
              <Image
                src="/hero3.jpg"
                alt="Healthy bowl"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Trial Menu Section */}
        <section className="menu-section mt-20">
          <h2 className="text-3xl font-bold mb-8 text-[#07101a]">Trial Menu</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {TrialMenu.map((meal, i) => (
              <div
                key={i}
                className="w-full max-w-[420px] menu-card border rounded-2xl bg-white overflow-hidden shadow-md hover:shadow-xl transition flex flex-col"
              >
                <div className="w-full h-52 relative">
                  <Image
                    src={meal.img}
                    alt={meal.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-[#07101a] mb-3">
                    {meal.name}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    <strong>Veg:</strong> ₹{meal.veg} &nbsp;|&nbsp;{" "}
                    <strong>Non-Veg:</strong> ₹{meal.nonveg}
                  </p>
                  <div className="mt-auto flex gap-2">
                    <button
                      onClick={() => handleAddToCart(meal, "veg")}
                      className="flex-1 bg-green-600 text-white py-2 px-2 rounded-md font-semibold hover:bg-green-700 transition"
                    >
                      Add Veg
                    </button>
                    <button
                      onClick={() => handleAddToCart(meal, "nonveg")}
                      className="flex-1 bg-[#07101a] text-white py-1 px-4 rounded-md font-semibold hover:bg-[#0c1b2a] transition"
                    >
                      Add Non-Veg
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Monthly Menu Section */}
        <section className="menu-section mt-20">
          <h2 className="text-3xl font-bold mb-8 text-[#07101a]">
            Monthly Menu
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {MonthlyMenu.map((meal, i) => (
              <div
                key={i}
                className="w-full max-w-[420px] menu-card border rounded-2xl bg-white overflow-hidden shadow-md hover:shadow-xl transition flex flex-col"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={meal.img}
                    alt={meal.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-[#07101a] mb-3">
                    {meal.name}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    <strong>Veg:</strong> ₹{meal.veg} &nbsp;|&nbsp;{" "}
                    <strong>Non-Veg:</strong> ₹{meal.nonveg}
                  </p>
                  <div className="mt-auto flex gap-2">
                    <button
                      onClick={() => handleAddToCart(meal, "veg")}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-700 transition"
                    >
                      Add Veg
                    </button>
                    <button
                      onClick={() => handleAddToCart(meal, "nonveg")}
                      className="flex-1 bg-[#07101a] text-white py-2 px-4 rounded-md font-semibold hover:bg-[#0c1b2a] transition"
                    >
                      Add Non-Veg
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Page;
