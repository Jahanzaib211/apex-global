"use client";
import Link from "next/link";
import { useState } from "react";
export default function AdminLoginPage() {
  const [message, setMessage] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1431] p-5">
      <div className="w-full max-w-md border border-white/10 bg-white p-8 shadow-2xl">
        <p className="text-gold text-xs font-semibold tracking-[.2em] uppercase">
          Apex Group Admin
        </p>
        <h1 className="font-display mt-3 text-4xl text-[#0B1431]">Sign in</h1>
        <p className="text-slate/60 mt-2 text-sm">Admin Login Required — UI shell only.</p>
        <form
          className="mt-8 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            console.info("Admin sign in attempted — Phase 2");
            setMessage("Phase 2 — backend coming soon");
          }}
        >
          <label className="text-slate block text-sm font-semibold">
            Email
            <input
              type="email"
              required
              className="focus:border-gold mt-2 w-full border border-slate-300 px-4 py-3 font-normal outline-none"
              placeholder="admin@apexgroup.example"
            />
          </label>
          <label className="text-slate block text-sm font-semibold">
            Password
            <input
              type="password"
              required
              className="focus:border-gold mt-2 w-full border border-slate-300 px-4 py-3 outline-none"
              placeholder="••••••••"
            />
          </label>
          <button className="bg-gold w-full px-5 py-3 font-semibold text-[#0B1431] hover:bg-[#0B1431] hover:text-white">
            Sign In
          </button>
        </form>
        {message && (
          <p role="status" className="text-slate mt-4 bg-[#fff9e8] p-3 text-sm">
            {message}
          </p>
        )}
        <button
          onClick={() => setMessage("Phase 2 — backend coming soon")}
          className="text-slate/60 mt-5 text-xs underline"
        >
          Forgot password?
        </button>
        <Link href="/" className="hover:text-gold mt-8 block text-sm text-[#0B1431]">
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
