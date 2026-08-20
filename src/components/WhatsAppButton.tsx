import { useState, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const PHONE = "918421337090";
const DISPLAY = "+91 84213 37090";

const QUICK_REPLIES = [
  "I'd like to know about Alpine Astonia",
  "Share latest project brochure",
  "Schedule a site visit",
  "Pricing & availability",
];

const waUrl = (text: string) =>
  `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;

export const WhatsAppButton = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const sendLinkRef = useRef<HTMLAnchorElement>(null);

  const defaultText = "Hello Alpine Landmarks, I'd like to enquire.";
  const sendHref = waUrl(message.trim() || defaultText);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendLinkRef.current?.click();
      setMessage("");
    }
  };

  return (
    <>
      {/* Chat panel */}
      <div
        className={cn(
          "fixed bottom-24 right-4 z-40 w-[min(22rem,calc(100vw-2rem))] origin-bottom-right overflow-hidden rounded-2xl border border-border bg-background shadow-2xl transition-all duration-300 sm:right-6",
          open
            ? "scale-100 opacity-100 translate-y-0"
            : "pointer-events-none scale-95 opacity-0 translate-y-2"
        )}
        role="dialog"
        aria-label="WhatsApp chat"
      >
        <div className="flex items-center gap-3 bg-[hsl(142,70%,32%)] px-4 py-3.5 text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
            <MessageCircle className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <div className="flex-1 leading-tight">
            <div className="font-serif text-base">Alpine Landmarks</div>
            <div className="text-[11px] text-white/80">Typically replies in minutes</div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="rounded-full p-1 text-white/80 transition hover:bg-white/15 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 bg-secondary/40 px-4 py-4">
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-background px-3.5 py-2.5 text-sm text-foreground shadow-sm">
            👋 Hello! How can our sales team help you today?
          </div>

          <div className="space-y-2 pt-1">
            {QUICK_REPLIES.map((q) => (
              <a
                key={q}
                href={waUrl(q)}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-full border border-border bg-background px-3.5 py-2 text-left text-xs text-foreground transition hover:border-gold hover:text-gold"
              >
                {q}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-border bg-background px-3 py-2.5">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a message…"
            className="flex-1 bg-transparent px-2 py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <a
            ref={sendLinkRef}
            href={sendHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMessage("")}
            aria-label="Send on WhatsApp"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(142,70%,32%)] text-white transition hover:bg-[hsl(142,70%,28%)]"
          >
            <Send className="h-4 w-4" strokeWidth={1.75} />
          </a>
        </div>
        <div className="bg-background px-4 pb-2.5 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Chat on WhatsApp · {DISPLAY}
        </div>
      </div>

      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close WhatsApp chat" : "Open WhatsApp chat"}
        className="fixed bottom-6 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(142,70%,40%)] text-white shadow-soft transition-luxury hover:scale-105 hover:bg-[hsl(142,70%,35%)] sm:right-6"
      >
        {open ? (
          <X className="h-6 w-6" strokeWidth={1.75} />
        ) : (
          <>
            <MessageCircle className="h-6 w-6" strokeWidth={1.75} />
            <span className="absolute right-0 top-0 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
            </span>
          </>
        )}
      </button>
    </>
  );
};
