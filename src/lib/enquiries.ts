import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number")
    .max(30)
    .regex(/^[0-9+\-()\s]+$/, "Please enter a valid phone number"),
  email: z.string().trim().email("Please enter a valid email").max(200),
  interest: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type Enquiry = z.infer<typeof enquirySchema>;

export const hasSupabase = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);

export type EnquiryResult =
  | { ok: true }
  | { ok: false; reason: "unconfigured" | "network"; detail?: string };

/**
 * Sends an enquiry to Supabase when it is configured.
 * The import is dynamic on purpose: the generated client throws at module
 * scope if the env vars are missing, which would take the whole site down.
 */
export async function submitEnquiry(payload: Enquiry): Promise<EnquiryResult> {
  if (!hasSupabase) return { ok: false, reason: "unconfigured" };
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    const { error } = await supabase.from("enquiries").insert({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      interest: payload.interest || null,
      message: payload.message || null,
    });
    if (error) return { ok: false, reason: "network", detail: error.message };
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      reason: "network",
      detail: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
