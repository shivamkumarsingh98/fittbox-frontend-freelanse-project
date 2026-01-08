"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Button } from "../Component/ui/button";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  ArrowRight,
} from "lucide-react";
import { getContact } from "../api/admin";

export default function Footer() {
  const adminAuth = useSelector((state) => state.adminAuth);
  const isAdmin = adminAuth?.isAuthenticated;
  const [contact, setContact] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchContact() {
      try {
        const res = await getContact();
        if (!mounted) return;

        // admin.getContact returns axios response.data (e.g. { success:true, data: { address... } })
        const payload = res && typeof res === "object" ? res.data ?? res : res;

        // payload may be the inner object with address/email/phone
        const contactObj =
          payload &&
          typeof payload === "object" &&
          (payload.address || payload.email || payload.phone)
            ? payload
            : payload?.data ?? null;

        if (contactObj) setContact(contactObj);
      } catch (err) {
        // keep fallback UI if fetch fails
        // eslint-disable-next-line no-console
        console.error("getContact error:", err);
      }
    }

    fetchContact();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <footer className="bg-black text-white">
      {/* Order CTA section styled like the provided image */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="relative overflow-hidden rounded-lg p-12 flex flex-col items-center text-center">
          {/* subtle radial green glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(circle at 80% 60%, rgba(16,185,129,0.18), rgba(4,120,87,0.06) 25%, transparent 40%)",
            }}
          />

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-white max-w-4xl">
            Ready to Start Your{" "}
            <span className="text-red-500">Health Journey?</span>
          </h2>

          <p className="max-w-2xl text-muted-foreground mt-6 mb-8">
            Join thousands of satisfied customers who've transformed their
            eating habits with FittBox — fresh, nutritious meals delivered to
            your door.
          </p>

          <div className="w-full flex flex-col sm:flex-row sm:justify-center gap-4">
            <Link href="/Menu" className="w-full sm:w-auto">
              <Button
                aria-label="Order Now"
                className="w-full sm:w-auto bg-emerald-400 text-black hover:bg-emerald-500 border-0"
              >
                <span className="flex items-center gap-2">
                  Order Now
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </Link>

            <Link href="/Menu" className="w-full sm:w-auto">
              <Button
                aria-label="View Plans"
                className="w-full sm:w-auto bg-transparent text-emerald-300 border border-emerald-600 hover:bg-emerald-900/40"
              >
                View Plans
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand + Social Icons */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <span className="font-display text-4xl font-bold text-red-500">
                  FittBox
                </span>
              </Link>

              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Fuel your lifestyle with fresh and healthy meals. Order now via
                Swiggy, Zomato & WhatsApp.
              </p>

              <div className="flex gap-3">
                <SocialIcon
                  href="https://www.instagram.com/fittbox.in?igsh=aTVreW5lYnlzc2Q="
                  label="Instagram"
                  icon={Instagram}
                />
                <SocialIcon
                  href="https://www.facebook.com/share/1JqfqJ9PGn/?mibextid=wwXIfr"
                  label="Facebook"
                  icon={Facebook}
                />
              </div>
            </div>

            {/* Quick Links */}
            <FooterSection title="Quick Links">
              <FooterItem href="/">Home</FooterItem>
              <FooterItem href="/Menu">Meal</FooterItem>
              <FooterItem href="/Nutrition">Nutrition</FooterItem>
              <FooterItem href="/Contact">Contact</FooterItem>
            </FooterSection>

            {/* Order Platforms */}
            <FooterSection title="Order On">
              <FooterItem href="/Contact">Contact</FooterItem>
              {isAdmin ? (
                <FooterItem href="/Dashboard/Admin">Admin Dashboard</FooterItem>
              ) : (
                <FooterItem href="/Admin/auth">Admin</FooterItem>
              )}
            </FooterSection>

            {/* Contact Us */}
            <FooterSection title="Contact Us">
              {contact ? (
                <>
                  <ContactItem icon={MapPin}>
                    {contact.address || contact?.location || (
                      <>
                        123 Health Street,
                        <br />
                        Bangalore, Karnataka 560001
                      </>
                    )}
                  </ContactItem>

                  <ContactItem icon={Phone}>
                    {contact.phone ? (
                      <Link href={`tel:${contact.phone}`}>{contact.phone}</Link>
                    ) : (
                      <Link href="tel:+919876543210">+91 98765 43210</Link>
                    )}
                  </ContactItem>

                  <ContactItem icon={Mail}>
                    {contact.email ? (
                      <Link href={`mailto:${contact.email}`}>
                        {contact.email}
                      </Link>
                    ) : (
                      <Link href="mailto:hello@fittbox.com">
                        hello@fittbox.com
                      </Link>
                    )}
                  </ContactItem>
                </>
              ) : (
                <>
                  <ContactItem icon={MapPin}>
                    123 Health Street,
                    <br />
                    Bangalore, Karnataka 560001
                  </ContactItem>

                  <ContactItem icon={Phone}>
                    <Link href="tel:+919876543210">+91 98765 43210</Link>
                  </ContactItem>

                  <ContactItem icon={Mail}>
                    <Link href="mailto:hello@fittbox.com">
                      hello@fittbox.com
                    </Link>
                  </ContactItem>
                </>
              )}
            </FooterSection>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="border-t border-border">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-muted-foreground text-sm">
                © {new Date().getFullYear()} FittBox. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <Link href="/PrivacyPolicy">
                  <p>Privacy Policy</p>
                </Link>
                <Link href="/Term&Service">
                  <p>Terms of Service</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* --------- Reusable UI Components ---------- */

function FooterSection({ title, children }) {
  return (
    <div>
      <h4 className="font-display font-bold text-white mb-6">{title}</h4>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

function FooterItem({ href, children }) {
  return (
    <li>
      <Link
        href={href}
        className="text-muted-foreground hover:text-primary transition-colors text-sm"
      >
        {children}
      </Link>
    </li>
  );
}

function ContactItem({ icon: Icon, children }) {
  return (
    <li className="flex items-start gap-3">
      <Icon className="w-5 h-5 text-primary mt-0.5" />
      <span className="text-muted-foreground text-sm">{children}</span>
    </li>
  );
}

function SocialIcon({ href, icon: Icon, label }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="w-10 h-10 rounded-xl glass flex items-center justify-center 
      text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
    >
      <Icon className="w-5 h-5" />
    </Link>
  );
}

function FooterLegal({ href, children }) {
  return (
    <Link
      href={href}
      className="text-muted-foreground hover:text-primary transition-colors"
    >
      {children}
    </Link>
  );
}
