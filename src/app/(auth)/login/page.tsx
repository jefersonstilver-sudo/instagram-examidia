"use client";

import { useState, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";

/* ─── Animated grid background ─── */
function AnimatedGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Animated glow lines - horizontal */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute left-0 right-0 h-px"
          style={{
            top: `${15 + i * 18}%`,
            background: `linear-gradient(90deg, transparent, oklch(0.60 0.24 25 / ${0.08 + i * 0.02}), transparent)`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scaleX: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 4 + i * 0.8,
            repeat: Infinity,
            delay: i * 1.2,
            ease: "easeInOut",
          }}
        />
      ))}
      {/* Animated glow lines - vertical */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute top-0 bottom-0 w-px"
          style={{
            left: `${20 + i * 20}%`,
            background: `linear-gradient(180deg, transparent, oklch(0.60 0.24 25 / ${0.06 + i * 0.015}), transparent)`,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scaleY: [0.2, 1, 0.2],
          }}
          transition={{
            duration: 5 + i * 1.2,
            repeat: Infinity,
            delay: i * 1.5 + 0.5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Floating orbs ─── */
function FloatingOrbs() {
  return (
    <>
      {/* Main red orb */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.60 0.24 25 / 12%) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          x: ["-10%", "10%", "-5%"],
          y: ["-10%", "5%", "-10%"],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        initial={{ top: "10%", left: "20%" }}
      />
      {/* Secondary cyan orb */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.75 0.14 210 / 8%) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: ["5%", "-10%", "5%"],
          y: ["5%", "-5%", "5%"],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        initial={{ bottom: "10%", right: "15%" }}
      />
      {/* Small accent orb */}
      <motion.div
        className="absolute w-[200px] h-[200px] rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.78 0.16 85 / 6%) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{
          x: ["-5%", "15%", "-5%"],
          y: ["10%", "-10%", "10%"],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        initial={{ top: "50%", left: "60%" }}
      />
    </>
  );
}

/* ─── Particle field ─── */
function Particles() {
  const particles = useRef(
    [...Array(30)].map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 4,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            opacity: [0, 0.4, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Scan line effect ─── */
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-[2px] pointer-events-none"
      style={{
        background: "linear-gradient(90deg, transparent 0%, oklch(0.60 0.24 25 / 30%) 50%, transparent 100%)",
        boxShadow: "0 0 20px oklch(0.60 0.24 25 / 20%)",
      }}
      animate={{ top: ["-5%", "105%"] }}
      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
    />
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email ou senha incorretos");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[oklch(0.08_0.01_260)] relative flex items-center justify-center overflow-hidden">
      {/* Animated background layers */}
      <AnimatedGrid />
      <FloatingOrbs />
      <Particles />
      <ScanLine />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, oklch(0.05 0.01 260 / 80%) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        <AnimatePresence>
          {mounted && (
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* Logo + Title */}
              <motion.div
                className="text-center space-y-5"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* EXA Logo */}
                <motion.div
                  className="relative mx-auto w-48"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <img
                    src="/logo-exa-white.png"
                    alt="EXA Midia"
                    className="w-full h-auto"
                  />
                  {/* Glow behind logo */}
                  <div
                    className="absolute inset-0 -z-10 scale-150 opacity-30"
                    style={{
                      background: "radial-gradient(circle, oklch(0.60 0.24 25 / 40%) 0%, transparent 70%)",
                      filter: "blur(30px)",
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <h1 className="text-xl font-medium tracking-wide">
                    <span className="text-gradient-red font-bold">Growth</span>{" "}
                    <span className="text-muted-foreground">Command Center</span>
                  </h1>
                  <p className="text-xs text-muted-foreground mt-2 tracking-widest uppercase">
                    Plataforma de Inteligencia Instagram
                  </p>
                </motion.div>
              </motion.div>

              {/* Login form */}
              <motion.form
                onSubmit={handleSubmit}
                className="relative backdrop-blur-2xl bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 space-y-5"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                style={{
                  boxShadow: "0 0 80px oklch(0.60 0.24 25 / 5%), inset 0 1px 0 oklch(1 0 0 / 5%)",
                }}
              >
                {/* Glowing top border accent */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
                  style={{
                    background: "linear-gradient(90deg, transparent, oklch(0.60 0.24 25 / 60%), transparent)",
                  }}
                />

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="admin@examidia.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-exa-red/40 focus:ring-1 focus:ring-exa-red/20 transition-all duration-300"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-11 px-4 pr-11 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-exa-red/40 focus:ring-1 focus:ring-exa-red/20 transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs text-red-400 text-center py-1 px-3 rounded-lg bg-red-500/10 border border-red-500/20">
                        {error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="relative w-full h-12 rounded-xl text-sm font-semibold text-white overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {/* Button background with animated gradient */}
                  <div
                    className="absolute inset-0 transition-all duration-500"
                    style={{
                      background: "linear-gradient(135deg, oklch(0.55 0.24 25) 0%, oklch(0.50 0.22 30) 50%, oklch(0.55 0.24 25) 100%)",
                    }}
                  />
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: "linear-gradient(135deg, oklch(0.65 0.24 25) 0%, oklch(0.55 0.22 30) 50%, oklch(0.60 0.24 25) 100%)",
                    }}
                  />
                  {/* Glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                      boxShadow: "0 0 40px oklch(0.60 0.24 25 / 40%), 0 0 80px oklch(0.60 0.24 25 / 15%)",
                    }}
                  />
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Entrar
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </span>
                </motion.button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/[0.06]" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 text-[10px] text-muted-foreground bg-[oklch(0.08_0.01_260)]">
                      ou continue com
                    </span>
                  </div>
                </div>

                {/* Google login */}
                <motion.button
                  type="button"
                  onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                  className="w-full h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 flex items-center justify-center gap-3"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Entrar com Google
                </motion.button>
              </motion.form>

              {/* Footer */}
              <motion.div
                className="text-center space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <p className="text-[10px] text-muted-foreground/60 tracking-wider">
                  EXA MIDIA &mdash; DOOH Intelligence Platform
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
