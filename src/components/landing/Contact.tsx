import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { enquirySchema, submitEnquiry } from "@/lib/enquiries";
import { SITE, waLink } from "@/lib/site";

export const Contact = ({ projectName }: { projectName?: string }) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const parsed = enquirySchema.safeParse({
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      email: String(data.get("email") ?? ""),
      interest: String(data.get("interest") ?? ""),
      message: String(data.get("message") ?? ""),
    });

    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      });
      setErrors(next);
      return;
    }

    setErrors({});
    setSubmitting(true);
    const result = await submitEnquiry(parsed.data);
    setSubmitting(false);

    if (result.ok) {
      toast({ title: "Thank you.", description: "Our team will reach out within 24 hours." });
      form.reset();
      return;
    }

    // Never leave a lead stranded — hand them straight to WhatsApp.
    const fallback = waLink(
      `Hello Alpine Landmarks, I'm ${parsed.data.name}.\nPhone: ${parsed.data.phone}\nEmail: ${parsed.data.email}` +
        (parsed.data.interest ? `\nInterested in: ${parsed.data.interest}` : "") +
        (parsed.data.message ? `\n${parsed.data.message}` : ""),
    );
    window.open(fallback, "_blank", "noopener,noreferrer");
    toast({
      title: "Let's continue on WhatsApp",
      description: `We've opened a chat with your details. You can also call ${SITE.phone}.`,
    });
  };

  const fieldError = (key: string) =>
    errors[key] ? (
      <p className="mt-1.5 text-xs text-destructive">{errors[key]}</p>
    ) : null;

  return (
    <section id="contact" className="bg-secondary/50 py-24 md:py-32">
      <div className="container grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <div>
          <p className="eyebrow">
            <span className="hairline-gold" /> Get in touch
          </p>
          <h2 className="mt-6 text-balance font-serif text-[clamp(2.2rem,4.6vw,3.8rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-foreground">
            {projectName ? `Enquire about ${projectName}.` : "Begin the conversation."}
          </h2>
          <p className="mt-6 max-w-md text-muted-foreground md:text-lg">
            Share a few details and our team will personally reach out to schedule a private
            viewing — usually the same day.
          </p>

          <dl className="mt-12 space-y-7 border-t border-border pt-10">
            <div className="flex gap-4">
              <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-gold" strokeWidth={1.6} />
              <div>
                <dt className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                  Office
                </dt>
                <dd className="mt-2 font-serif text-lg font-medium tracking-[-0.03em] text-foreground">
                  {SITE.address}
                </dd>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone className="mt-1 h-4 w-4 flex-shrink-0 text-gold" strokeWidth={1.6} />
              <div>
                <dt className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                  Call
                </dt>
                <dd className="mt-2 font-serif text-lg font-medium text-foreground">
                  <a href={`tel:${SITE.phoneRaw}`} className="hover:text-gold">
                    {SITE.phone}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex gap-4">
              <Mail className="mt-1 h-4 w-4 flex-shrink-0 text-gold" strokeWidth={1.6} />
              <div>
                <dt className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                  Email
                </dt>
                <dd className="mt-2 text-foreground">
                  <a href={`mailto:${SITE.email}`} className="hover:text-gold">
                    {SITE.email}
                  </a>
                </dd>
              </div>
            </div>
          </dl>

          <a
            href={waLink(
              projectName
                ? `Hello Alpine Landmarks, I'd like to know more about ${projectName}.`
                : "Hello Alpine Landmarks, I'd like to enquire.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-10 inline-flex items-center gap-3 rounded-full border border-border bg-background px-6 py-3.5 text-[11px] uppercase tracking-[0.22em] text-foreground transition-colors hover:border-gold hover:text-gold"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={1.6} />
            Chat on WhatsApp
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

        <form
          onSubmit={onSubmit}
          noValidate
          className="rounded-2xl border border-border bg-card p-7 shadow-card-soft md:p-10"
        >
          <h3 className="font-serif text-2xl font-semibold tracking-[-0.035em] text-foreground">
            Enquiry form
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            We respond personally to every enquiry.
          </p>

          <div className="mt-8 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Input required placeholder="Full name" name="name" aria-label="Full name" />
                {fieldError("name")}
              </div>
              <div>
                <Input required placeholder="Phone" name="phone" type="tel" aria-label="Phone" />
                {fieldError("phone")}
              </div>
            </div>
            <div>
              <Input required placeholder="Email" name="email" type="email" aria-label="Email" />
              {fieldError("email")}
            </div>
            <Input
              defaultValue={projectName ?? ""}
              placeholder="Project of interest"
              name="interest"
              aria-label="Project of interest"
            />
            <Textarea
              placeholder="Your message (optional)"
              rows={4}
              name="message"
              aria-label="Message"
            />
            <Button type="submit" variant="dark" size="lg" className="w-full" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit enquiry"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              By submitting, you agree to be contacted by {SITE.shortName}.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};
