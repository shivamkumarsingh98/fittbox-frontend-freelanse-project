import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Logo / Brand */}
        <div className="text-3xl font-extrabold tracking-tight uppercase">
          FittBox
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-lg font-medium">
          <FooterLink href="/">Home</FooterLink>
          <FooterLink href="/Menu">Meal Plan</FooterLink>
          <FooterLink href="/Nutrition">Nutrition</FooterLink>
          <FooterLink href="/Contact">Contact</FooterLink>
        </nav>
      </div>

      {/* Divider */}
      <div className="mt-8 h-px bg-white/30 w-full max-w-6xl mx-auto"></div>

      {/* Copyright */}
      <div className="text-center text-sm mt-6 opacity-90">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold">FittBox</span>. All rights reserved.
      </div>
    </footer>
  );
}

function FooterLink({ href, children }) {
  return (
    <Link href={href} className="relative group transition-all">
      <span className="pb-1">{children}</span>
      <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}
