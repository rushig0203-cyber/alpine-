import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FormEvent, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Contact = ({ projectName }: { projectName?: string }) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    setSubmitting(true);

    const { error } = await supabase.from("enquiries").insert({
      name: String(data.get("name") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      interest: String(data.get("interest") ?? "").trim() || null,
      message: String(data.get("message") ?? "").trim() || null,
    });

    setSubmitting(false);

    if (error) {
      toast({
        title: "Something went wrong.",
        description: "Please try again, or reach us on WhatsApp at +91 84213 37090.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Thank you.",
      description: "Our team will reach out within 24 hours.",
    });
    form.reset();
  };

  return (
    <section id="contact" className="bg-secondary/40 py-28">
      <div className="container grid gap-16 lg:grid-cols-2">
        <div>
          <p className="flex items-center gap-4 text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            <span className="hairline" /> Get in Touch
          </p>
          <h2 className="mt-6 text-balance font-serif text-4xl font-semibold leading-tight tracking-[-0.04em] text-foreground md:text-5xl">
            {projectName ? `Enquire about ${projectName}.` : "Begin the conversation."}
          </h2>
          <p className="mt-6 max-w-md text-muted-foreground md:text-lg">
            Share a few details and our team will personally reach out to schedule a
            private viewing.
          </p>

          <dl className="mt-12 space-y-6 border-t border-border pt-10">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Office</dt>
              <dd className="mt-2 font-serif text-lg text-foreground">Jai Ganesh Vision, Office No. 160/161, B-Wing, Akurdi, Pune - 411035</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Contact</dt>
              <dd className="mt-2 font-serif text-lg text-foreground">+91 84213 37090</dd>
              <dd className="mt-1 text-sm text-muted-foreground">alpinelandmarks26@gmail.com</dd>
            </div>
          </dl>
        </div>

        <form onSubmit={onSubmit} className="bg-background p-8 md:p-10 shadow-card-soft">
          <h3 className="font-serif text-2xl font-semibold text-foreground">Enquiry Form</h3>
          <p className="mt-2 text-sm text-muted-foreground">We respond personally to every enquiry.</p>

          <div className="mt-8 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input required placeholder="Full name" name="name" />
              <Input required placeholder="Phone" name="phone" type="tel" />
            </div>
            <Input required placeholder="Email" name="email" type="email" />
            <Input
              defaultValue={projectName ?? ""}
              placeholder="Project of interest"
              name="interest"
            />
            <Textarea placeholder="Your message (optional)" rows={4} name="message" />
            <Button type="submit" variant="dark" size="lg" className="w-full" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit Enquiry"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              By submitting, you agree to be contacted by Alpine Landmarks.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};
