import { useState, useEffect, useCallback } from "react";

const DATA = {
  tools: [
    { id: 1, name: "NeuralDraft", tagline: "AI writing co-pilot for pros", price: 29, category: "Writing", image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=280&fit=crop&auto=format", badge: "Bestseller" },
    { id: 2, name: "VisionForge", tagline: "Text-to-image generation suite", price: 49, category: "Image", image: "https://images.unsplash.com/photo-1686191128892-3b37add4c844?w=400&h=280&fit=crop&auto=format", badge: "New" },
    { id: 3, name: "CodeMind", tagline: "Autonomous code review & refactor", price: 39, category: "Dev", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=280&fit=crop&auto=format", badge: null },
    { id: 4, name: "SynthVoice", tagline: "Ultra-realistic voice cloning", price: 59, category: "Audio", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=280&fit=crop&auto=format", badge: "Hot" },
    { id: 5, name: "DataOracle", tagline: "Natural language data analytics", price: 45, category: "Analytics", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=280&fit=crop&auto=format", badge: null },
    { id: 6, name: "AgentFlow", tagline: "No-code AI workflow automation", price: 69, category: "Automation", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=280&fit=crop&auto=format", badge: "Popular" }
  ],
  plans: [
    { id: "starter", name: "Starter", price: 19, description: "Perfect for indie hackers and solo builders", features: ["Access to 3 AI tools", "5,000 credits / month", "Community support", "API access", "Basic analytics"], cta: "Get Started", highlighted: false },
    { id: "pro", name: "Pro", price: 59, description: "Built for teams moving fast", features: ["Access to all 6 AI tools", "50,000 credits / month", "Priority support", "Advanced API access", "Full analytics dashboard", "Custom integrations"], cta: "Go Pro", highlighted: true },
    { id: "enterprise", name: "Enterprise", price: 199, description: "For organizations at scale", features: ["Unlimited AI tools", "Unlimited credits", "Dedicated support", "White-label options", "SSO & SAML", "SLA guarantee", "Custom model fine-tuning"], cta: "Contact Sales", highlighted: false }
  ]
};

const categoryColors = {
  Writing: "#22d3ee", Image: "#a78bfa", Dev: "#34d399",
  Audio: "#fb923c", Analytics: "#f472b6", Automation: "#facc15"
};

// ── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          border: "1px solid #22d3ee",
          borderLeft: "3px solid #22d3ee",
          color: "#e2e8f0",
          padding: "12px 18px",
          borderRadius: 8,
          fontSize: 13,
          fontFamily: "'JetBrains Mono', monospace",
          boxShadow: "0 0 20px rgba(34,211,238,0.15)",
          display: "flex", alignItems: "center", gap: 10,
          animation: "slideIn 0.3s ease",
          minWidth: 220
        }}>
          <span style={{ color: "#22d3ee", fontSize: 16 }}>✓</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

// ── Cart Drawer ───────────────────────────────────────────────────────────────
function CartDrawer({ cart, onClose, onRemove }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 999, backdropFilter: "blur(4px)" }} />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: "min(380px, 100vw)",
        background: "#0a0f1e", borderLeft: "1px solid #1e3a5f",
        zIndex: 1000, display: "flex", flexDirection: "column",
        animation: "drawerIn 0.3s ease"
      }}>
        {/* Header */}
        <div style={{ padding: "24px 24px 20px", borderBottom: "1px solid #1e3a5f", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#22d3ee", letterSpacing: 3, marginBottom: 4 }}>CART</div>
            <div style={{ color: "#e2e8f0", fontSize: 18, fontWeight: 600 }}>{cart.length} item{cart.length !== 1 ? "s" : ""}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 22, lineHeight: 1 }}>×</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", color: "#475569", marginTop: 60 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🛒</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>Your cart is empty</div>
            </div>
          ) : cart.map(item => (
            <div key={item.id} style={{ display: "flex", gap: 14, marginBottom: 16, padding: 14, background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
              <img src={item.image} alt={item.name} style={{ width: 60, height: 50, objectFit: "cover", borderRadius: 6 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{item.name}</div>
                <div style={{ color: "#64748b", fontSize: 12 }}>{item.category}</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, alignItems: "center" }}>
                  <span style={{ color: "#22d3ee", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>${item.price} × {item.qty}</span>
                  <button onClick={() => onRemove(item.id)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 12, textDecoration: "underline" }}>remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: "20px 24px", borderTop: "1px solid #1e3a5f" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ color: "#94a3b8", fontSize: 14 }}>Total</span>
              <span style={{ color: "#e2e8f0", fontSize: 20, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>${total}</span>
            </div>
            <button style={{
              width: "100%", padding: "14px 0", background: "linear-gradient(135deg, #0891b2, #22d3ee)",
              border: "none", borderRadius: 8, color: "#0a0f1e", fontWeight: 700, fontSize: 15, cursor: "pointer",
              letterSpacing: 0.5
            }}>
              Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav({ cartCount, onCartOpen }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: scrolled ? "12px 40px" : "20px 40px",
      background: scrolled ? "rgba(10,15,30,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid #1e293b" : "none",
      transition: "all 0.3s ease",
      display: "flex", alignItems: "center", justifyContent: "space-between"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "linear-gradient(135deg, #0891b2, #22d3ee)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16
        }}>⚡</div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#e2e8f0", fontSize: 16, fontWeight: 700 }}>
          nexus<span style={{ color: "#22d3ee" }}>.ai</span>
        </span>
      </div>

      <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
        {["Tools", "Pricing", "Docs"].map(l => (
          <a key={l} href="#" style={{ color: "#64748b", fontSize: 14, textDecoration: "none", fontFamily: "'JetBrains Mono', monospace", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = "#22d3ee"}
            onMouseLeave={e => e.target.style.color = "#64748b"}>{l}</a>
        ))}
        <button onClick={onCartOpen} style={{
          position: "relative", background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)",
          borderRadius: 8, padding: "8px 14px", cursor: "pointer", color: "#e2e8f0", fontSize: 18,
          display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s"
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(34,211,238,0.15)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(34,211,238,0.08)"}>
          🛒
          {cartCount > 0 && (
            <span style={{
              position: "absolute", top: -8, right: -8,
              background: "#22d3ee", color: "#0a0f1e", fontSize: 11, fontWeight: 700,
              width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'JetBrains Mono', monospace",
              animation: "pop 0.3s ease"
            }}>{cartCount}</span>
          )}
        </button>
      </div>
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "120px 40px 80px", position: "relative", overflow: "hidden"
    }}>
      {/* Grid bg */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px"
      }} />
      {/* Glow orbs */}
      <div style={{ position: "absolute", top: "20%", left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(8,145,178,0.12) 0%, transparent 70%)", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)", zIndex: 0 }} />

      <div style={{ maxWidth: 800, textAlign: "center", zIndex: 1, position: "relative" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28,
          padding: "6px 16px", background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)",
          borderRadius: 100, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#22d3ee", letterSpacing: 2
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22d3ee", display: "inline-block", animation: "pulse 2s infinite" }} />
          THE AI TOOL MARKETPLACE
        </div>

        <h1 style={{
          fontFamily: "'Space Grotesk', 'Syne', sans-serif",
          fontSize: "clamp(42px, 7vw, 88px)",
          fontWeight: 800,
          lineHeight: 1.05,
          marginBottom: 24,
          color: "#f1f5f9",
          letterSpacing: -2
        }}>
          Ship smarter<br />
          <span style={{ color: "transparent", backgroundClip: "text", WebkitBackgroundClip: "text", backgroundImage: "linear-gradient(135deg, #22d3ee, #a78bfa)" }}>with AI tools</span>
        </h1>

        <p style={{
          color: "#64748b", fontSize: "clamp(16px, 2vw, 20px)", lineHeight: 1.7, marginBottom: 40,
          maxWidth: 560, margin: "0 auto 40px"
        }}>
          The best AI tools, in one place. Supercharge your workflow with cutting-edge models for writing, code, voice, and more.
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button style={{
            padding: "14px 32px", background: "linear-gradient(135deg, #0891b2, #22d3ee)",
            border: "none", borderRadius: 10, color: "#0a0f1e", fontWeight: 700, fontSize: 15, cursor: "pointer",
            letterSpacing: 0.3, transition: "transform 0.2s, box-shadow 0.2s",
            boxShadow: "0 0 30px rgba(34,211,238,0.2)"
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(34,211,238,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 0 30px rgba(34,211,238,0.2)"; }}>
            Browse Tools →
          </button>
          <button style={{
            padding: "14px 32px", background: "transparent",
            border: "1px solid #1e3a5f", borderRadius: 10, color: "#94a3b8", fontWeight: 500, fontSize: 15, cursor: "pointer"
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#22d3ee"; e.currentTarget.style.color = "#22d3ee"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e3a5f"; e.currentTarget.style.color = "#94a3b8"; }}>
            View Pricing
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", justifyContent: "center", gap: 48, marginTop: 64, flexWrap: "wrap" }}>
          {[["6+", "AI Tools"], ["12k+", "Users"], ["99.9%", "Uptime"]].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 700, color: "#22d3ee" }}>{val}</div>
              <div style={{ color: "#475569", fontSize: 13, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ tool, onAdd }) {
  const [hovered, setHovered] = useState(false);
  const [adding, setAdding] = useState(false);
  const accent = categoryColors[tool.category] || "#22d3ee";

  const handleAdd = () => {
    setAdding(true);
    onAdd(tool);
    setTimeout(() => setAdding(false), 600);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#0f172a" : "#080d1a",
        border: `1px solid ${hovered ? accent + "40" : "#1e293b"}`,
        borderRadius: 14,
        overflow: "hidden",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? `0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px ${accent}20` : "none",
        display: "flex", flexDirection: "column"
      }}>
      {/* Image */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img src={tool.image} alt={tool.name} style={{
          width: "100%", height: 180, objectFit: "cover",
          transition: "transform 0.4s ease",
          transform: hovered ? "scale(1.05)" : "scale(1)"
        }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 50%, rgba(8,13,26,0.9) 100%)` }} />
        {/* Category tag */}
        <div style={{
          position: "absolute", top: 12, left: 12,
          padding: "4px 10px", borderRadius: 100,
          background: accent + "20", border: `1px solid ${accent}40`,
          color: accent, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1
        }}>{tool.category}</div>
        {/* Badge */}
        {tool.badge && (
          <div style={{
            position: "absolute", top: 12, right: 12,
            padding: "4px 10px", borderRadius: 100,
            background: "rgba(0,0,0,0.7)", border: "1px solid #475569",
            color: "#f1f5f9", fontSize: 11, fontWeight: 600
          }}>{tool.badge}</div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "18px 20px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{ color: "#f1f5f9", fontSize: 18, fontWeight: 700, margin: "0 0 6px", letterSpacing: -0.3 }}>{tool.name}</h3>
        <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 16px", lineHeight: 1.5, flex: 1 }}>{tool.tagline}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
          <div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: "#f1f5f9" }}>${tool.price}</span>
            <span style={{ color: "#475569", fontSize: 12, marginLeft: 4 }}>/tool</span>
          </div>
          <button
            onClick={handleAdd}
            style={{
              padding: "9px 18px",
              background: adding ? accent : "transparent",
              border: `1px solid ${accent}`,
              borderRadius: 8,
              color: adding ? "#0a0f1e" : accent,
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              transition: "all 0.2s",
              display: "flex", alignItems: "center", gap: 6
            }}>
            {adding ? "✓ Added" : "+ Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Products Section ──────────────────────────────────────────────────────────
function ProductsSection({ onAdd }) {
  return (
    <section style={{ padding: "80px 40px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 56 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#22d3ee", letterSpacing: 3, marginBottom: 12 }}>// TOOLS</div>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#f1f5f9", margin: 0, letterSpacing: -1 }}>
          Our AI arsenal
        </h2>
        <p style={{ color: "#64748b", fontSize: 16, marginTop: 12 }}>Hand-picked tools that actually move the needle.</p>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 24
      }}>
        {DATA.tools.map(tool => <ProductCard key={tool.id} tool={tool} onAdd={onAdd} />)}
      </div>
    </section>
  );
}

// ── Pricing ───────────────────────────────────────────────────────────────────
function PricingSection() {
  return (
    <section style={{ padding: "80px 40px", position: "relative" }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: 600, height: 300, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(8,145,178,0.06) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#22d3ee", letterSpacing: 3, marginBottom: 12 }}>// PRICING</div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#f1f5f9", margin: "0 0 12px", letterSpacing: -1 }}>
            Simple, transparent pricing
          </h2>
          <p style={{ color: "#64748b", fontSize: 16 }}>Start free, scale when ready. No hidden fees.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {DATA.plans.map(plan => (
            <div key={plan.id} style={{
              background: plan.highlighted ? "linear-gradient(135deg, #0c1a2e 0%, #0f2240 100%)" : "#080d1a",
              border: plan.highlighted ? "1px solid rgba(34,211,238,0.4)" : "1px solid #1e293b",
              borderRadius: 16, padding: 32,
              position: "relative", overflow: "hidden",
              boxShadow: plan.highlighted ? "0 0 60px rgba(34,211,238,0.08)" : "none",
              transform: plan.highlighted ? "scale(1.03)" : "none"
            }}>
              {plan.highlighted && (
                <>
                  <div style={{
                    position: "absolute", top: 16, right: 16,
                    background: "linear-gradient(135deg, #0891b2, #22d3ee)",
                    color: "#0a0f1e", fontSize: 10, fontWeight: 800,
                    padding: "4px 12px", borderRadius: 100, letterSpacing: 1
                  }}>MOST POPULAR</div>
                  <div style={{ position: "absolute", top: -40, right: -40, width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)" }} />
                </>
              )}
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: plan.highlighted ? "#22d3ee" : "#64748b", letterSpacing: 2, marginBottom: 8 }}>{plan.name.toUpperCase()}</div>
              <div style={{ marginBottom: 6 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 44, fontWeight: 800, color: "#f1f5f9" }}>${plan.price}</span>
                <span style={{ color: "#475569", fontSize: 14, marginLeft: 4 }}>/mo</span>
              </div>
              <p style={{ color: "#64748b", fontSize: 13, marginBottom: 24, lineHeight: 1.5 }}>{plan.description}</p>
              <div style={{ borderTop: "1px solid #1e293b", paddingTop: 20, marginBottom: 24 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                    <span style={{ color: "#22d3ee", fontSize: 14, marginTop: 1, flexShrink: 0 }}>✓</span>
                    <span style={{ color: "#94a3b8", fontSize: 13 }}>{f}</span>
                  </div>
                ))}
              </div>
              <button style={{
                width: "100%", padding: "13px 0",
                background: plan.highlighted ? "linear-gradient(135deg, #0891b2, #22d3ee)" : "transparent",
                border: plan.highlighted ? "none" : "1px solid #1e3a5f",
                borderRadius: 8, color: plan.highlighted ? "#0a0f1e" : "#94a3b8",
                fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s"
              }}
                onMouseEnter={e => { if (!plan.highlighted) { e.currentTarget.style.borderColor = "#22d3ee"; e.currentTarget.style.color = "#22d3ee"; } }}
                onMouseLeave={e => { if (!plan.highlighted) { e.currentTarget.style.borderColor = "#1e3a5f"; e.currentTarget.style.color = "#94a3b8"; } }}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #1e293b", padding: "48px 40px 32px", marginTop: 40 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48, flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 30, height: 30, borderRadius: 7, background: "linear-gradient(135deg, #0891b2, #22d3ee)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>⚡</div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#e2e8f0", fontSize: 15, fontWeight: 700 }}>nexus<span style={{ color: "#22d3ee" }}>.ai</span></span>
            </div>
            <p style={{ color: "#475569", fontSize: 13, lineHeight: 1.7, maxWidth: 260 }}>The best AI tools marketplace. Built for builders, by builders.</p>
          </div>
          {[
            { title: "Product", links: ["Tools", "Pricing", "Changelog", "Roadmap"] },
            { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
            { title: "Legal", links: ["Privacy", "Terms", "Cookies", "License"] }
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#22d3ee", letterSpacing: 2, marginBottom: 16 }}>{col.title.toUpperCase()}</div>
              {col.links.map(l => (
                <div key={l} style={{ marginBottom: 10 }}>
                  <a href="#" style={{ color: "#475569", fontSize: 13, textDecoration: "none" }}
                    onMouseEnter={e => e.target.style.color = "#94a3b8"}
                    onMouseLeave={e => e.target.style.color = "#475569"}>{l}</a>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #1e293b", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ color: "#334155", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>© 2025 nexus.ai — All rights reserved</span>
          <span style={{ color: "#334155", fontSize: 12 }}>Built for the future</span>
        </div>
      </div>
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((msg) => {
    const id = Date.now();
    setToasts(t => [...t, { id, message: msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2800);
  }, []);

  const handleAdd = useCallback((tool) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === tool.id);
      if (existing) return prev.map(i => i.id === tool.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...tool, qty: 1 }];
    });
    addToast(`${tool.name} added to cart`);
  }, [addToast]);

  const handleRemove = useCallback((id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#060b16", color: "#e2e8f0", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Syne:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #060b16; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0f1e; }
        ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 3px; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes drawerIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes pop { 0% { transform: scale(0.5); } 70% { transform: scale(1.2); } 100% { transform: scale(1); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>

      <Nav cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <Hero />
      <ProductsSection onAdd={handleAdd} />
      <PricingSection />
      <Footer />

      {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onRemove={handleRemove} />}
      <Toast toasts={toasts} />
    </div>
  );
}