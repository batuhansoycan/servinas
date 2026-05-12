"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.normalizeScroll(true);
}

const INJECTED_STYLES = `
  .gsap-reveal { visibility: hidden; }

  .scroll-indicator {
      position: fixed;
      bottom: max(48px, calc(env(safe-area-inset-bottom, 0px) + 24px));
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      z-index: 100;
      opacity: 1;
      transition: opacity 0.6s ease;
      pointer-events: none;
  }
  .scroll-indicator.hidden { opacity: 0; }

  .scroll-indicator-text {
      writing-mode: vertical-rl;
      text-orientation: mixed;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.25em;
      color: rgba(255,255,255,0.35);
      text-transform: uppercase;
  }

  .scroll-indicator-line {
      width: 1px;
      height: 52px;
      background: rgba(255,255,255,0.1);
      position: relative;
      overflow: hidden;
  }

  .scroll-indicator-line::after {
      content: '';
      position: absolute;
      top: -100%;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom, transparent, #F57C00, transparent);
      animation: scroll-line 1.6s ease-in-out infinite;
  }

  @keyframes scroll-line {
      0%   { top: -100%; }
      100% { top: 100%; }
  }

  .film-grain {
      position: absolute; inset: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 50; opacity: 0.04; mix-blend-mode: overlay;
      background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  }

  .bg-grid-theme {
      background-size: 60px 60px;
      background-image:
          linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px);
      mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }

  .text-3d-matte {
      color: #fff;
      text-shadow:
          0 10px 30px rgba(245,124,0,0.15),
          0 2px 4px rgba(0,0,0,0.5);
  }

  .text-silver-matte {
      background: linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.5) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
      filter:
          drop-shadow(0px 10px 20px rgba(245,124,0,0.2))
          drop-shadow(0px 2px 4px rgba(0,0,0,0.8));
  }

  .text-orange-gradient {
      background: linear-gradient(180deg, #FF9A3C 0%, #F57C00 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
      filter: drop-shadow(0px 8px 20px rgba(245,124,0,0.4));
  }

  .text-card-silver-matte {
      background: linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
      filter:
          drop-shadow(0px 12px 24px rgba(0,0,0,0.9))
          drop-shadow(0px 4px 8px rgba(0,0,0,0.7));
  }

  .premium-depth-card {
      background: linear-gradient(145deg, #1C0E00 0%, #0A0A0A 50%, #0D0D0D 100%);
      box-shadow:
          0 40px 100px -20px rgba(0, 0, 0, 0.95),
          0 20px 40px -20px rgba(0, 0, 0, 0.85),
          inset 0 1px 2px rgba(245, 124, 0, 0.12),
          inset 0 -2px 4px rgba(0, 0, 0, 0.9);
      border: 1px solid rgba(245, 124, 0, 0.08);
      position: relative;
  }

  .card-sheen {
      position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
      background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(245,124,0,0.05) 0%, transparent 40%);
      mix-blend-mode: screen; transition: opacity 0.3s ease;
  }

  .iphone-bezel {
      background-color: #111;
      box-shadow:
          inset 0 0 0 2px #52525B,
          inset 0 0 0 7px #000,
          0 40px 80px -15px rgba(0,0,0,0.95),
          0 15px 25px -5px rgba(0,0,0,0.8);
      transform-style: preserve-3d;
  }

  .hardware-btn {
      background: linear-gradient(90deg, #404040 0%, #171717 100%);
      box-shadow:
          -2px 0 5px rgba(0,0,0,0.8),
          inset -1px 0 1px rgba(255,255,255,0.15),
          inset 1px 0 2px rgba(0,0,0,0.8);
      border-left: 1px solid rgba(255,255,255,0.05);
  }

  .screen-glare {
      background: linear-gradient(110deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 45%);
  }

  .widget-depth {
      background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
      box-shadow:
          0 10px 20px rgba(0,0,0,0.3),
          inset 0 1px 1px rgba(255,255,255,0.05),
          inset 0 -1px 1px rgba(0,0,0,0.5);
      border: 1px solid rgba(255,255,255,0.03);
  }

  .floating-ui-badge {
      background: linear-gradient(135deg, rgba(245, 124, 0, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      box-shadow:
          0 0 0 1px rgba(245, 124, 0, 0.15),
          0 25px 50px -12px rgba(0, 0, 0, 0.85),
          inset 0 1px 1px rgba(245,124,0,0.12),
          inset 0 -1px 1px rgba(0,0,0,0.5);
  }

  .btn-store {
      transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
      background: linear-gradient(180deg, #1A1A1A 0%, #111111 100%);
      color: rgba(255,255,255,0.45);
      box-shadow: 0 0 0 1px rgba(255,255,255,0.08), 0 2px 4px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.06);
      cursor: not-allowed;
      position: relative;
      overflow: hidden;
  }

  .btn-store::after {
      content: 'Yakında';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(245, 124, 0, 0.9);
      color: #fff;
      font-weight: 700;
      font-size: 0.9rem;
      letter-spacing: 0.05em;
      opacity: 0;
      transition: opacity 0.2s ease;
      border-radius: inherit;
  }

  .btn-store:hover::after {
      opacity: 1;
  }

  .waitlist-input {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      color: #fff;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .waitlist-input::placeholder { color: rgba(255,255,255,0.3); }
  .waitlist-input:focus {
      border-color: rgba(245,124,0,0.5);
      box-shadow: 0 0 0 3px rgba(245,124,0,0.08);
  }

  .btn-waitlist {
      background: linear-gradient(180deg, #FF9A3C 0%, #F57C00 100%);
      color: #000;
      font-weight: 700;
      transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
      box-shadow: 0 4px 20px rgba(245,124,0,0.4), inset 0 1px 1px rgba(255,255,255,0.3);
  }
  .btn-waitlist:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(245,124,0,0.5), inset 0 1px 1px rgba(255,255,255,0.3);
  }
  .btn-waitlist:active {
      transform: translateY(0px);
      box-shadow: 0 2px 10px rgba(245,124,0,0.3);
  }
  .btn-waitlist:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
  }

  .progress-ring {
      transform: rotate(-90deg);
      transform-origin: center;
      stroke-dasharray: 402;
      stroke-dashoffset: 402;
      stroke-linecap: round;
  }

  .orange-glow {
      box-shadow: 0 0 20px rgba(245,124,0,0.3), 0 0 40px rgba(245,124,0,0.1);
  }
`;

export interface CinematicHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  brandName?: string;
  tagline1?: string;
  tagline2?: string;
  cardHeading?: string;
  cardDescription?: React.ReactNode;
  metricValue?: number;
  metricLabel?: string;
  ctaHeading?: string;
  ctaDescription?: string;
}

export function CinematicHero({
  brandName = "Servinas",
  tagline1 = "Aracının her şeyi,",
  tagline2 = "tek yerde.",
  cardHeading = "Bakım takibi, yeniden tanımlandı.",
  cardDescription = <><span className="text-white font-semibold">Servinas</span> ile araç bakımlarını, yakıt masraflarını ve önemli tarihlerini tek uygulamada yönet. Hatırlatmalar, servis geçmişi ve çok daha fazlası.</>,
  metricValue = 48750,
  metricLabel = "Toplam Km",
  ctaHeading = "Yakında geliyor.",
  ctaDescription = "Araç bakımını, masraflarını ve önemli tarihlerini tek bir uygulamada yönet. Erken erişim için kaydol.",
  className,
  ...props
}: CinematicHeroProps) {

  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitted(true);
      setSubmitting(false);
    }, 800);
  }

  useEffect(() => {
    const handleScroll = () => { if (window.scrollY > 80) setScrolled(true); };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 2) return;
      cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(() => {
        if (mainCardRef.current && mockupRef.current) {
          const rect = mainCardRef.current.getBoundingClientRect();
          mainCardRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
          mainCardRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
          const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
          const yVal = (e.clientY / window.innerHeight - 0.5) * 2;
          gsap.to(mockupRef.current, {
            rotationY: xVal * 12,
            rotationX: -yVal * 12,
            ease: "power3.out",
            duration: 1.2,
          });
        }
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      gsap.set(".text-track", { autoAlpha: 0, y: 60, scale: 0.85, filter: "blur(20px)", rotationX: -20 });
      gsap.set(".text-days", { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" });
      gsap.set(".main-card", { y: window.innerHeight + 200, autoAlpha: 1 });
      gsap.set([".card-left-text", ".card-right-text", ".mockup-scroll-wrapper", ".floating-badge", ".phone-widget"], { autoAlpha: 0 });
      gsap.set(".cta-wrapper", { autoAlpha: 0, scale: 0.8, filter: isMobile ? "blur(10px)" : "blur(30px)" });

      const introTl = gsap.timeline({ delay: 0.3 });
      introTl
        .to(".text-track", { duration: 1.8, autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", rotationX: 0, ease: "expo.out" })
        .to(".text-days", { duration: 1.4, clipPath: "inset(0 0% 0 0)", ease: "power4.inOut" }, "-=1.0");

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=6000",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      scrollTl
        .to([".hero-text-wrapper", ".bg-grid-theme"], { scale: 1.15, filter: isMobile ? "blur(8px)" : "blur(20px)", opacity: 0.2, ease: "power2.inOut", duration: 2 }, 0)
        .to(".main-card", { y: 0, ease: "power3.inOut", duration: 2 }, 0)
        .to(".main-card", { width: "100%", height: "100%", borderRadius: "0px", ease: "power3.inOut", duration: 1.5 })
        .fromTo(".mockup-scroll-wrapper",
          { y: isMobile ? 150 : 300, z: isMobile ? 0 : -500, rotationX: isMobile ? 15 : 50, rotationY: isMobile ? 0 : -30, autoAlpha: 0, scale: 0.6 },
          { y: 0, z: 0, rotationX: 0, rotationY: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 2.5 }, "-=0.8"
        )
        .fromTo(".phone-widget", { y: 40, autoAlpha: 0, scale: 0.95 }, { y: 0, autoAlpha: 1, scale: 1, stagger: 0.15, ease: "back.out(1.2)", duration: 1.5 }, "-=1.5")
        .to(".progress-ring", { strokeDashoffset: 80, duration: 2, ease: "power3.inOut" }, "-=1.2")
        .to(".counter-val", { innerHTML: metricValue.toLocaleString("tr-TR"), duration: 2, ease: "expo.out",
          onUpdate: function() {
            const el = document.querySelector(".counter-val");
            if (el) {
              const progress = this.progress();
              const val = Math.round(metricValue * progress);
              el.innerHTML = val.toLocaleString("tr-TR");
            }
          }
        }, "-=2.0")
        .fromTo(".floating-badge", { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: -10 }, { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: "back.out(1.5)", duration: 1.5, stagger: 0.2 }, "-=2.0")
        .fromTo(".card-left-text", { x: -50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.5 }, "-=1.5")
        .fromTo(".card-right-text", { x: 50, autoAlpha: 0, scale: 0.8 }, { x: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 1.5 }, "<")
        .to({}, { duration: 0.6 })
        .set(".hero-text-wrapper", { autoAlpha: 0 })
        .set(".cta-wrapper", { autoAlpha: 1 })
        .to({}, { duration: 0.4 })
        .to([".mockup-scroll-wrapper", ".floating-badge", ".card-left-text", ".card-right-text"], {
          scale: 0.9, y: -40, z: -200, autoAlpha: 0, ease: "power3.in", duration: 1.2, stagger: 0.05,
        })
        .to(".main-card", {
          width: isMobile ? "92vw" : "85vw",
          height: isMobile ? "92vh" : "85vh",
          borderRadius: isMobile ? "32px" : "40px",
          ease: "expo.inOut",
          duration: 1.8
        }, "pullback")
        .to(".cta-wrapper", { scale: 1, filter: "blur(0px)", ease: "expo.inOut", duration: 1.8 }, "pullback")
        .to(".main-card", { y: -window.innerHeight - 300, ease: "power3.in", duration: 1.5 });

    }, containerRef);

    return () => ctx.revert();
  }, [metricValue]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-screen overflow-hidden flex items-center justify-center bg-black text-white font-sans antialiased", className)}
      style={{ perspective: "1500px", height: "100dvh" }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className={`scroll-indicator${scrolled ? " hidden" : ""}`} aria-hidden="true">
        <span className="scroll-indicator-text">scroll</span>
        <div className="scroll-indicator-line" />
      </div>
      <div className="film-grain" aria-hidden="true" />
      <div className="bg-grid-theme absolute inset-0 z-0 pointer-events-none opacity-60" aria-hidden="true" />

      {/* Subtle orange radial glow top-left */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] pointer-events-none z-0"
        style={{ background: "radial-gradient(circle at 0% 0%, rgba(245,124,0,0.08) 0%, transparent 65%)" }}
        aria-hidden="true"
      />

      {/* Hero Texts */}
      <div className="hero-text-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 will-change-transform">
        <h1 className="text-track gsap-reveal text-3d-matte text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tight mb-2">
          {tagline1}
        </h1>
        <h1 className="text-days gsap-reveal text-orange-gradient text-5xl md:text-7xl lg:text-[6rem] font-extrabold tracking-tighter">
          {tagline2}
        </h1>
      </div>

      {/* CTA Section */}
      <div className="cta-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 gsap-reveal pointer-events-auto will-change-transform">
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-orange-500/20 bg-orange-500/5">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-orange-400 text-xs font-bold tracking-widest uppercase">Yakında Geliyor</span>
        </div>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-silver-matte">
          {ctaHeading}
        </h2>
        <p className="text-white/40 text-lg md:text-xl mb-10 max-w-xl mx-auto font-light leading-relaxed">
          {ctaDescription}
        </p>

        {/* Email Waitlist Form */}
        <div className="w-full max-w-md mb-10">
          {submitted ? (
            <div className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl border border-orange-500/30 bg-orange-500/5">
              <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-orange-300 font-semibold">Kaydedildi! Seni haberdar edeceğiz.</span>
            </div>
          ) : (
            <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="E-posta adresin"
                className="waitlist-input flex-1 px-5 py-4 rounded-2xl text-sm font-medium"
                suppressHydrationWarning
              />
              <button
                type="submit"
                disabled={submitting}
                className="btn-waitlist px-7 py-4 rounded-2xl text-sm whitespace-nowrap"
              >
                {submitting ? "Kaydediliyor..." : "Erken Erişim Al"}
              </button>
            </form>
          )}
        </div>

        {/* Store Buttons (disabled) */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="btn-store flex items-center justify-center gap-3 px-8 py-4 rounded-[1.25rem]" aria-label="App Store — Yakında" disabled>
            <svg className="w-7 h-7 opacity-40" fill="currentColor" viewBox="0 0 384 512">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
            </svg>
            <div className="text-left opacity-40">
              <div className="text-[10px] font-bold tracking-wider uppercase mb-[-2px]">Download on the</div>
              <div className="text-xl font-bold leading-none tracking-tight">App Store</div>
            </div>
          </button>
          <button className="btn-store flex items-center justify-center gap-3 px-8 py-4 rounded-[1.25rem]" aria-label="Google Play — Yakında" disabled>
            <svg className="w-6 h-6 opacity-40" fill="currentColor" viewBox="0 0 512 512">
              <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
            </svg>
            <div className="text-left opacity-40">
              <div className="text-[10px] font-bold tracking-wider uppercase mb-[-2px]">Get it on</div>
              <div className="text-xl font-bold leading-none tracking-tight">Google Play</div>
            </div>
          </button>
        </div>

        <p className="mt-8 text-white/20 text-xs">
          © 2026 Servinas — Westecute Yazılım Ltd. Şti.
        </p>
      </div>

      {/* Foreground Card */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ perspective: "1500px" }}>
        <div
          ref={mainCardRef}
          className="main-card premium-depth-card relative overflow-hidden gsap-reveal flex items-center justify-center pointer-events-auto w-[92vw] md:w-[85vw] h-[92vh] md:h-[85vh] rounded-[32px] md:rounded-[40px]"
        >
          <div className="card-sheen" aria-hidden="true" />

          <div className="relative w-full h-full max-w-7xl mx-auto px-4 lg:px-12 flex flex-col justify-evenly lg:grid lg:grid-cols-3 items-center lg:gap-8 z-10 py-6 lg:py-0">

            {/* Brand Name */}
            <div className="card-right-text gsap-reveal order-1 lg:order-3 flex justify-center lg:justify-end z-20 w-full">
              <h2 className="text-6xl md:text-[6rem] lg:text-[8rem] font-black uppercase tracking-tighter text-card-silver-matte lg:mt-0">
                {brandName}
              </h2>
            </div>

            {/* iPhone Mockup */}
            <div className="mockup-scroll-wrapper order-2 lg:order-2 relative w-full h-[380px] lg:h-[600px] flex items-center justify-center z-10" style={{ perspective: "1000px" }}>
              <div className="relative w-full h-full flex items-center justify-center transform scale-[0.65] md:scale-85 lg:scale-100">
                <div
                  ref={mockupRef}
                  className="relative w-[280px] h-[580px] rounded-[3rem] iphone-bezel flex flex-col will-change-transform"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Hardware Buttons */}
                  <div className="absolute top-[120px] -left-[3px] w-[3px] h-[25px] hardware-btn rounded-l-md z-0" aria-hidden="true" />
                  <div className="absolute top-[160px] -left-[3px] w-[3px] h-[45px] hardware-btn rounded-l-md z-0" aria-hidden="true" />
                  <div className="absolute top-[220px] -left-[3px] w-[3px] h-[45px] hardware-btn rounded-l-md z-0" aria-hidden="true" />
                  <div className="absolute top-[170px] -right-[3px] w-[3px] h-[70px] hardware-btn rounded-r-md z-0 scale-x-[-1]" aria-hidden="true" />

                  {/* Screen */}
                  <div className="absolute inset-[7px] bg-[#050914] rounded-[2.5rem] overflow-hidden shadow-[inset_0_0_15px_rgba(0,0,0,1)] text-white z-10">
                    <div className="absolute inset-0 screen-glare z-40 pointer-events-none" aria-hidden="true" />

                    {/* Dynamic Island */}
                    <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-full z-50 flex items-center justify-end px-3 shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(245,124,0,0.8)] animate-pulse" />
                    </div>

                    {/* App UI */}
                    <div className="relative w-full h-full pt-12 px-5 pb-8 flex flex-col">
                      {/* Header */}
                      <div className="phone-widget flex justify-between items-center mb-6">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mb-1">Araçlarım</span>
                          <span className="text-xl font-bold tracking-tight text-white drop-shadow-md">Dashboard</span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-sm border border-orange-500/20 shadow-lg shadow-black/50">AY</div>
                      </div>

                      {/* Km Ring */}
                      <div className="phone-widget relative w-44 h-44 mx-auto flex items-center justify-center mb-6 drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]">
                        <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
                          <circle cx="88" cy="88" r="64" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="12" />
                          <circle className="progress-ring" cx="88" cy="88" r="64" fill="none" stroke="#F57C00" strokeWidth="12" />
                        </svg>
                        <div className="text-center z-10 flex flex-col items-center">
                          <span className="counter-val text-3xl font-extrabold tracking-tighter text-white">0</span>
                          <span className="text-[8px] text-orange-300/60 uppercase tracking-[0.1em] font-bold mt-0.5">{metricLabel}</span>
                        </div>
                      </div>

                      {/* Widgets */}
                      <div className="space-y-3">
                        <div className="phone-widget widget-depth rounded-2xl p-3 flex items-center">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/5 flex items-center justify-center mr-3 border border-orange-400/20 shadow-inner">
                            <svg className="w-4 h-4 text-orange-400 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="h-2 w-20 bg-orange-100/20 rounded-full mb-2" />
                            <div className="h-1.5 w-12 bg-neutral-600 rounded-full" />
                          </div>
                          <span className="text-[10px] text-orange-400 font-bold ml-2">Yağ</span>
                        </div>
                        <div className="phone-widget widget-depth rounded-2xl p-3 flex items-center">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 flex items-center justify-center mr-3 border border-amber-400/20 shadow-inner">
                            <svg className="w-4 h-4 text-amber-400 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="h-2 w-16 bg-amber-100/20 rounded-full mb-2" />
                            <div className="h-1.5 w-24 bg-neutral-600 rounded-full" />
                          </div>
                          <span className="text-[10px] text-amber-400 font-bold ml-2">Muayene</span>
                        </div>
                      </div>

                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-[4px] bg-white/20 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                    </div>
                  </div>
                </div>

                {/* Floating Badges */}
                <div className="floating-badge absolute hidden lg:flex top-6 lg:top-12 left-[-15px] lg:left-[-80px] floating-ui-badge rounded-xl lg:rounded-2xl p-3 lg:p-4 items-center gap-3 lg:gap-4 z-30">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-b from-orange-500/20 to-orange-900/10 flex items-center justify-center border border-orange-400/30 shadow-inner">
                    <span className="text-base lg:text-xl drop-shadow-lg" aria-hidden="true">🔧</span>
                  </div>
                  <div>
                    <p className="text-white text-xs lg:text-sm font-bold tracking-tight">Yağ Değişimi</p>
                    <p className="text-orange-300/50 text-[10px] lg:text-xs font-medium">500 km kaldı</p>
                  </div>
                </div>

                <div className="floating-badge absolute hidden lg:flex bottom-12 lg:bottom-20 right-[-15px] lg:right-[-80px] floating-ui-badge rounded-xl lg:rounded-2xl p-3 lg:p-4 items-center gap-3 lg:gap-4 z-30">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-b from-amber-500/20 to-amber-900/10 flex items-center justify-center border border-amber-400/30 shadow-inner">
                    <span className="text-base lg:text-lg drop-shadow-lg" aria-hidden="true">📋</span>
                  </div>
                  <div>
                    <p className="text-white text-xs lg:text-sm font-bold tracking-tight">Servis Randevusu</p>
                    <p className="text-orange-300/50 text-[10px] lg:text-xs font-medium">Yarın 10:00</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Left Text */}
            <div className="card-left-text gsap-reveal order-3 lg:order-1 flex flex-col justify-center text-center lg:text-left z-20 w-full lg:max-w-none px-4 lg:px-0">
              <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-0 lg:mb-5 tracking-tight">
                {cardHeading}
              </h3>
              <p className="hidden md:block text-orange-100/50 text-sm md:text-base lg:text-lg font-normal leading-relaxed mx-auto lg:mx-0 max-w-sm lg:max-w-none">
                {cardDescription}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
