"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
    Star,
    Download,
    Phone,
    Mail,
    ShieldCheck,
    Landmark,
    LocateFixed,
} from "lucide-react";
import { reverseGeocode } from "@/lib/googleMaps";
import PlacesInput from "../shared/PlacesInput";

const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About us", href: "#about" },
    { label: "Our Services", href: "#services" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact us", href: "#contact" },
];

interface HeroProps {
    onGetQuote?: (from: string, to: string) => void;
    onContactClick?: () => void;
}

const Hero = ({ onGetQuote, onContactClick }: HeroProps) => {
    const [movingFrom, setMovingFrom] = useState("");
    const [movingTo, setMovingTo] = useState("");
    const [locating, setLocating] = useState(false);
    const [quoteError, setQuoteError] = useState("");
    const hasFetchedLocation = useRef(false);
    const [navVisible, setNavVisible] = useState(true);
    const lastScrollY = useRef(0);

    // ── Hide navbar on scroll down, show on scroll up ─────────────────
    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            setNavVisible(y < 50 || y < lastScrollY.current);
            lastScrollY.current = y;
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // ── Request geolocation once on mount ─────────────────────────────────
    useEffect(() => {
        if (hasFetchedLocation.current) return;
        hasFetchedLocation.current = true;

        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                setLocating(true);
                try {
                    const address = await reverseGeocode(
                        pos.coords.latitude,
                        pos.coords.longitude
                    );
                    setMovingFrom(address);
                } catch {
                    // silently ignore – user can type manually
                } finally {
                    setLocating(false);
                }
            },
            () => {
                // permission denied – user types manually
            }
        );
    }, []);

    const handleGetQuote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!movingFrom.trim() || !movingTo.trim()) {
            setQuoteError("Please enter both pick-up and drop-off addresses.");
            return;
        }
        setQuoteError("");
        onGetQuote?.(movingFrom.trim(), movingTo.trim());
    };

    return (
        <section className="min-h-screen overflow-hidden relative">
            {/* Mountains Background - High quality Himalayan image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2070&auto=format&fit=crop')" }}
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-[#0d1b2e]/70 pointer-events-none" />
            {/* Bottom gradient for smooth transition */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b2e] via-transparent to-[#0d1b2e]/50 pointer-events-none" />

            {/* ─── Navbar ─── */}
            <nav className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl shadow-lg shadow-black/10 transition-all duration-300 ${navVisible ? "translate-y-0 opacity-100" : "-translate-y-[calc(100%+2rem)] opacity-0"}`}>
                <div className="flex items-center justify-between px-6 py-3">
                    <a href="/" className="flex items-center">
                        <img src="/logoOfficial.png" alt="NNR Logo" className="h-10 w-auto" />
                    </a>

                    <ul className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <li key={link.label}>
                                <a
                                    href={link.href}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const target = document.querySelector(link.href);
                                        target?.scrollIntoView({ behavior: "smooth" });
                                    }}
                                    className="text-sm font-medium text-white/80 hover:bg-white/15 hover:text-white rounded-full px-4 py-1.5 transition"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <a
                        href="tel:0452649320"
                        className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-red-700 transition"
                    >
                        <Phone className="h-4 w-4" />
                        Call Now
                    </a>

                </div>
            </nav>

            {/* ─── Hero Content ─── */}
            <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2 px-6 pt-24 lg:pt-28">
                {/* Left Column */}
                <div className="flex flex-col justify-center pb-16 lg:pb-24 lg:pr-12">
                    {/* Nepali greeting badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mb-6 inline-flex w-fit items-center gap-3 rounded-full border border-red-500/30 bg-red-600/10 px-4 py-2 text-sm"
                    >
                        <span className="text-2xl">🙏</span>
                        <span className="text-white/90 font-medium">नमस्ते! Welcome to NNR</span>
                        <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            ))}
                        </div>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-3xl sm:text-5xl lg:text-[2.8rem] font-bold leading-tight text-white mb-6"
                    >
                        <span className="text-red-500">Namaste</span> Nepal
                        <br />
                        Australian Removals,{" "}
                        <span className="relative inline-block text-red-400">
                            Simplified
                            <svg
                                className="absolute -bottom-2 left-0 w-full"
                                viewBox="0 0 286 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M2 8C50 2 236 -1 284 6" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                        </span>
                    </motion.h1>

                    {/* Subtext */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mb-8 max-w-lg text-white/70 leading-relaxed text-lg"
                    >
                        Your trusted Nepali-owned removal service in Australia. Moving home? Need a man with van? We make it happen with care and respect — just like family. 🇳🇵 🇦🇺
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-wrap items-center gap-4 mb-10"
                    >
                        <a href="tel:0452649320" className="inline-flex items-center gap-2 rounded-full border-2 border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition">
                            <Phone className="h-4 w-4 text-red-400" />
                            Call 0452 649 320
                        </a>
                        <button
                            type="button"
                            onClick={onContactClick}
                            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-red-700 transition"
                        >
                            <Mail className="h-4 w-4" />
                            Contact Us
                        </button>
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="flex flex-wrap items-center gap-6"
                    >
                        <div className="flex items-center gap-2 text-sm text-white/80">
                            <span className="flex items-center justify-center rounded-full border border-red-500/30 bg-red-600/20 px-3 py-1 text-xs font-bold text-red-400">
                                AFRA
                            </span>
                            Registered
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                            <ShieldCheck className="h-5 w-5 text-red-400" />
                            Fully Insured
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                            <Landmark className="h-5 w-5 text-red-400" />
                            Australia-Wide
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                            <LocateFixed className="h-5 w-5 text-red-400" />
                            HQ Sydney
                        </div>
                    </motion.div>
                </div>

                {/* Right Column – Quote form */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex items-center justify-center lg:justify-end"
                >
                    <div className="w-full max-w-md">
                        <form
                            onSubmit={handleGetQuote}
                            className="rounded-2xl bg-white/20 backdrop-blur-sm p-6 shadow-2xl border border-white/30"
                        >
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-white mb-1">Get Your Quote</h3>
                                <p className="text-sm text-white/70">Fast, reliable Nepali movers 🇳🇵</p>
                            </div>

                            <div className="space-y-4 mb-4">
                                {/* Moving from */}
                                <div>
                                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-white">
                                        📍 Moving from
                                    </label>
                                    <PlacesInput
                                        variant="default"
                                        value={movingFrom}
                                        onChange={setMovingFrom}
                                        placeholder="e.g. Auburn, Sydney"
                                    />
                                </div>

                                {/* Moving to */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-white">
                                        📍 Moving to
                                    </label>
                                    <PlacesInput
                                        variant="default"
                                        value={movingTo}
                                        onChange={setMovingTo}
                                        placeholder="e.g. Melbourne, Brisbane"
                                    />
                                </div>
                            </div>

                            {/* Validation error */}
                            {quoteError && (
                                <p className="mb-3 text-xs text-red-400 text-center">{quoteError}</p>
                            )}

                            <button
                                type="submit"
                                className="w-full rounded-xl bg-red-600 py-4 text-sm font-bold text-white shadow-lg hover:bg-red-700 transition"
                            >
                                Get Instant Quote →
                            </button>

                            <p className="text-center text-xs text-white/60 mt-4">
                                ✓ No obligation &nbsp;•&nbsp; ✓ Response within 30 mins
                            </p>
                        </form>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;