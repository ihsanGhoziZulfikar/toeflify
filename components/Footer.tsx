import { Facebook, Twitter, Instagram } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import "../themes/index.css";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700 mt-12 py-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
        {/* Logo + Description + Socials */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-1">
              <Image
                src="/assets/images/logo.svg"
                alt="logo"
                width={30}
                height={30}
                className="object-contain"
                priority
              />
              <span className="font-rowdies text-xl font-semibold tracking-tight text-primary">
                TOEFLify
              </span>
            </Link>
          </div>

          <p className="text-sm text-gray-600 max-w-md font-saira">
            Follow on social service
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-4 mt-2">
            <Link href="#" aria-label="Facebook" className="hover:text-primary">
              <Facebook size={18} />
            </Link>
            <Link href="#" aria-label="Instagram" className="hover:text-primary">
              <Instagram size={18} />
            </Link>
            <Link href="#" aria-label="Twitter" className="hover:text-primary">
              <Twitter size={18} />
            </Link>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg text-purple mb-3 font-rowdies">Links</h3>
          <ul className="space-y-2 text-sm font-saira">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li><Link href="/help" className="hover:text-primary">Help Center</Link></li>
            <li><Link href="/services" className="hover:text-primary">Services</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg text-primary mb-3 font-rowdies">Resources</h3>
          <ul className="space-y-2 text-sm font-saira">
            <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link href="/contribute" className="hover:text-primary">Contribution</Link></li>
            <li><Link href="/legal" className="hover:text-primary">Legal Notice</Link></li>
          </ul>
        </div>

        {/* Contacts */}
        <div>
          <h3 className="text-lg text-danger mb-3 font-rowdies">Contacts</h3>
          <ul className="space-y-2 text-sm font-saira font-saira">
            <li>0812-3456-789</li>
            <li>Indonesia</li>
            <li>+1 234 5678</li>
          </ul>
        </div>
      </div>

      {/* Divider Line */}
      <div className="flex justify-center mt-10">
        <div className="w-3/4 border-t border-gray-300"></div>
      </div>

      {/* Copyright */}
      <div className="text-center text-xs text-gray-500 mt-8 font-saira">
        Copyrights {new Date().getFullYear()} © All rights reserved.
      </div>
    </footer>
  );
}
