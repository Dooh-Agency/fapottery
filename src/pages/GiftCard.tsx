import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Gift } from "lucide-react";
import { useCreateGiftCardCheckout } from "@/hooks/useGiftCards";

const AMOUNTS = [30, 50, 75, 100];

const GiftCard = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const createCheckout = useCreateGiftCardCheckout();

  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ buyerName?: string; buyerEmail?: string; amount?: string }>({});

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success(t("giftCard.toastSuccess"));
    } else if (searchParams.get("cancelled") === "true") {
      toast.info(t("giftCard.toastCancelled"));
    }
  }, [searchParams, t]);

  const finalAmount = customAmount ? Number(customAmount) : amount;

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!buyerName.trim()) newErrors.buyerName = t("giftCard.errorNombre");
    if (!buyerEmail.trim()) newErrors.buyerEmail = t("giftCard.errorEmailRequerido");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail)) newErrors.buyerEmail = t("giftCard.errorEmailInvalido");
    if (!Number.isFinite(finalAmount) || finalAmount < 20 || finalAmount > 500) newErrors.amount = t("giftCard.errorMonto");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      const res = await createCheckout.mutateAsync({
        amount: finalAmount,
        buyer_name: buyerName.trim(),
        buyer_email: buyerEmail.trim(),
        recipient_name: recipientName.trim() || undefined,
        recipient_email: recipientEmail.trim() || undefined,
        message: message.trim() || undefined,
      });
      if (res?.url) window.open(res.url, "_blank");
      toast.success(t("giftCard.toastRedirigiendo"));
    } catch (e: any) {
      toast.error(e.message || t("giftCard.toastError"));
    }
  };

  return (
    <Layout>
      <SEO title={t("giftCard.seoTitle")} description={t("giftCard.seoDescription")} path="/bono-regalo" />
      <section className="pt-10 md:pt-14 pb-20 md:pb-28">
        <div className="container mx-auto px-6">
          <div className="max-w-lg mx-auto text-center mb-10">
            <Gift className="h-8 w-8 mx-auto mb-4 text-muted-foreground" aria-hidden="true" />
            <h1 className="font-serif font-bold text-2xl md:text-3xl mb-3">{t("giftCard.titulo")}</h1>
            <p className="body-text text-muted-foreground">{t("giftCard.subtitulo")}</p>
          </div>

          <form
            className="max-w-lg mx-auto space-y-6 border border-border bg-card p-6 md:p-8"
            onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
            noValidate
          >
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium mb-1">{t("giftCard.elegirMonto")}</legend>
              <div className="grid grid-cols-4 gap-2">
                {AMOUNTS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => { setAmount(a); setCustomAmount(""); }}
                    aria-pressed={!customAmount && amount === a}
                    className={`font-sans text-sm px-3 py-2.5 border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                      !customAmount && amount === a
                        ? "border-foreground bg-foreground text-primary-foreground"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    €{a}
                  </button>
                ))}
              </div>
              <div className="space-y-1">
                <Label htmlFor="custom-amount">{t("giftCard.otroMonto")}</Label>
                <Input
                  id="custom-amount"
                  type="number"
                  min={20}
                  max={500}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="€20 – €500"
                />
                {errors.amount && <p className="text-xs text-destructive" role="alert">{errors.amount}</p>}
              </div>
            </fieldset>

            <div className="space-y-4 pt-2 border-t border-border">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground pt-4">{t("giftCard.tusDatos")}</p>
              <div className="space-y-1">
                <Label htmlFor="buyer-name">{t("giftCard.tuNombre")} <span aria-hidden="true">*</span></Label>
                <Input id="buyer-name" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} required autoComplete="name" aria-invalid={!!errors.buyerName} />
                {errors.buyerName && <p className="text-xs text-destructive" role="alert">{errors.buyerName}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="buyer-email">{t("giftCard.tuEmail")} <span aria-hidden="true">*</span></Label>
                <Input id="buyer-email" type="email" value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} placeholder="tu@email.com" required autoComplete="email" aria-invalid={!!errors.buyerEmail} />
                {errors.buyerEmail && <p className="text-xs text-destructive" role="alert">{errors.buyerEmail}</p>}
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-border">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground pt-4">{t("giftCard.datosDestinatario")}</p>
              <div className="space-y-1">
                <Label htmlFor="recipient-name">{t("giftCard.nombreDestinatario")}</Label>
                <Input id="recipient-name" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="recipient-email">{t("giftCard.emailDestinatario")}</Label>
                <Input id="recipient-email" type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="destinatario@email.com" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="gift-message">{t("giftCard.mensaje")}</Label>
                <Textarea id="gift-message" value={message} onChange={(e) => setMessage(e.target.value)} rows={3} />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={createCheckout.isPending}>
              {createCheckout.isPending ? t("giftCard.procesando") : t("giftCard.comprarBono", { amount: finalAmount || 0 })}
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default GiftCard;
