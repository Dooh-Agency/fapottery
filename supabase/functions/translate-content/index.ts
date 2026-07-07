import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type FaqItem = { question: string; answer: string };

const deeplTranslate = async (texts: string[]): Promise<string[]> => {
  const apiKey = Deno.env.get("DEEPL_API_KEY") ?? "";
  const endpoint = apiKey.endsWith(":fx")
    ? "https://api-free.deepl.com/v2/translate"
    : "https://api.deepl.com/v2/translate";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: texts, source_lang: "ES", target_lang: "EN-GB" }),
  });

  if (!res.ok) throw new Error(`DeepL error ${res.status}: ${await res.text()}`);

  const data = await res.json();
  return data.translations.map((t: { text: string }) => t.text);
};

// Translates only the non-empty entries and reassembles the array in order,
// since DeepL rejects empty strings in the `text` list.
const translatePreservingBlanks = async (texts: string[]): Promise<string[]> => {
  const nonEmptyIdx = texts.map((t, i) => (t.trim() ? i : -1)).filter((i) => i >= 0);
  if (nonEmptyIdx.length === 0) return texts;
  const translated = await deeplTranslate(nonEmptyIdx.map((i) => texts[i]));
  const result = [...texts];
  nonEmptyIdx.forEach((idx, k) => (result[idx] = translated[k]));
  return result;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: userData, error: userErr } = await supabaseAuth.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: isStaff } = await supabaseAuth.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    const { data: isColaborador } = await supabaseAuth.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "colaborador",
    });
    if (!isStaff && !isColaborador) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { table, id } = await req.json();
    if (!id || (table !== "class_types" && table !== "news")) {
      return new Response(JSON.stringify({ error: "Missing or invalid table/id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: row, error: fetchErr } = await supabaseAdmin
      .from(table)
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !row) {
      return new Response(JSON.stringify({ error: "Row not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (table === "news") {
      const [titleEn, bodyEn] = await translatePreservingBlanks([row.title ?? "", row.body ?? ""]);

      const { error: updateErr } = await supabaseAdmin
        .from("news")
        .update({ title_en: titleEn || null, body_en: bodyEn || null })
        .eq("id", id);
      if (updateErr) throw updateErr;

      return new Response(JSON.stringify({ ok: true, title_en: titleEn, body_en: bodyEn }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const faq: FaqItem[] = Array.isArray(row.faq) ? row.faq : [];
    const texts = [
      row.title ?? "",
      row.description ?? "",
      ...faq.flatMap((f) => [f.question ?? "", f.answer ?? ""]),
    ];
    const result = await translatePreservingBlanks(texts);

    const titleEn = result[0] || null;
    const descriptionEn = result[1] || null;
    const faqEn: FaqItem[] = faq.map((_, i) => ({
      question: result[2 + i * 2] || "",
      answer: result[2 + i * 2 + 1] || "",
    }));

    const { error: updateErr } = await supabaseAdmin
      .from("class_types")
      .update({
        title_en: titleEn,
        description_en: descriptionEn,
        faq_en: faqEn.length ? faqEn : null,
      })
      .eq("id", id);
    if (updateErr) throw updateErr;

    return new Response(
      JSON.stringify({ ok: true, title_en: titleEn, description_en: descriptionEn, faq_en: faqEn }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
