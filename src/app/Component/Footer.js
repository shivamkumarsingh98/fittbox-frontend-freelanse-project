import Link from "next/link";

export default function Footer() {
	return (
		<footer className="footer-animated w-full py-8 px-4 text-white flex flex-col items-center justify-center">
			<div className="footer-content flex flex-col md:flex-row gap-6 md:gap-12 items-center justify-between w-full max-w-4xl">
				<div className="footer-logo text-2xl font-bold tracking-tight">
					ditweb
				</div>
				<nav className="footer-links flex gap-6 text-lg">
					<FooterLink href="/">Home</FooterLink>
					<FooterLink href="/meal-plan">Meal Plan</FooterLink>
					<FooterLink href="/nutrition">Nutrition</FooterLink>
					<FooterLink href="/contact">Contact</FooterLink>
				</nav>
			</div>
			<div className="mt-6 text-sm opacity-80">&copy; {new Date().getFullYear()} ditweb. All rights reserved.</div>
		</footer>
	);
}

function FooterLink({ href, children }) {
	return (
		<Link href={href} className="footer-link relative inline-block">
			{children}
			<span className="footer-underline" />
		</Link>
	);
}
