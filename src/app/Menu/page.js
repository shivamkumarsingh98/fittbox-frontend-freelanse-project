import Image from "next/image";
import Link from "next/link";

function Page() {
  return (
    <main className="bg-menu-hero min-h-[60vh] flex items-center">
      <div className="w-full max-w-[1200px] mx-auto px-4 py-10">
        <section className="menu-hero flex gap-8 items-center relative">
          <div className="hero-left flex-1 max-w-[60%]">
            <h1 className="text-[4rem] leading-none text-[#07101a] font-extrabold mb-5">
              Our Menu
            </h1>
            <p className="text-[#0b1720] opacity-75 max-w-[48ch] mb-6">
              Fresh, zesty, and bursting with crunch—our sprout salad is a
              flavor explosion in every bite!
            </p>
            <Link
              href="/menu/list"
              className="inline-block border-2 border-[#07101a] rounded-md text-[#07101a] font-bold tracking-widest px-4 py-2"
            >
              VIEW MENU
            </Link>
          </div>

          <div
            className="hero-right flex-1 flex items-center justify-end relative"
            aria-hidden
          >
            <div className="circle-large relative rounded-full overflow-hidden">
              <Image
                src="/hero3.jpg"
                alt="bowl"
                fill
                sizes="(max-width: 900px) 220px, 420px"
                className="object-cover"
              />
            </div>

            <div className="circle-small absolute -top-8 right-[120px] rounded-full overflow-hidden">
              <Image
                src="/hero2.jpg"
                alt="small bowl"
                fill
                sizes="(max-width: 900px) 90px, 140px"
                className="object-cover"
              />
            </div>
          </div>
        </section>
        {/* section two: menu grid */}
        <section className="menu-section mt-20">
          <h2 className="menu-section-title">Salads & Bowls</h2>
          <div className="menu-grid">
            {/* Static meal data */}
            {[
              {
                title: "Greek Salad",
                desc: "Apple, capsicum, cucumber, cherry tomato, pickled onion, feta cheese, lettuce, black olives/jalapeno, tangy Greek dressing.",
                img: "/hero3.jpg",
              },
              {
                title: "Falafel Salad",
                desc: "Crispy falafel, bell peppers, onions, lettuce, tomato, tangy yogurt dressing.",
                img: "/hero2.jpg",
              },
              {
                title: "Mexican Salad",
                desc: "Kidney beans, carrots, cherry tomato, bell pepper, corn, nachos, lettuce, creamy basil dressing.",
                img: "/hero4.jpg",
              },
              {
                title: "High Protein Bowl",
                desc: "Grilled chicken, quinoa, chickpeas, spinach, tomato, egg, spicy vinaigrette.",
                img: "/hero5.jpg",
              },
              {
                title: "Veg Protein Bowl",
                desc: "Paneer, kidney beans, broccoli, carrot, lettuce, brown rice, mint yogurt dressing.",
                img: "/hero6.jpg",
              },
              {
                title: "Non-Veg Bowl",
                desc: "Chicken tikka, brown rice, lettuce, tomato, onion, spicy mayo dressing.",
                img: "/hero7.jpg",
              },
            ].map((meal, i) => (
              <div className="menu-card" key={i}>
                <div className="menu-card-img">
                  <img src={meal.img} alt={meal.title} />
                </div>
                <div className="menu-card-content">
                  <h3 className="menu-card-title">{meal.title}</h3>
                  <p className="menu-card-desc">{meal.desc}</p>
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
