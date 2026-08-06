import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import logoMenu from "@/assets/logo-menu.svg";

const BackofficeResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [validRecovery, setValidRecovery] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Supabase establece una sesión temporal al abrir un enlace de recuperación válido.
    supabase.auth.getSession().then(({ data: { session } }) => setValidRecovery(Boolean(session)));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({ title: "Contraseña demasiado corta", description: "Usá al menos 8 caracteres.", variant: "destructive" });
      return;
    }
    if (password !== confirmation) {
      toast({ title: "Las contraseñas no coinciden", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast({ title: "No pudimos actualizar la contraseña", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Contraseña actualizada", description: "Ya podés ingresar al backoffice." });
    navigate("/backoffice/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm border-border">
        <CardHeader className="text-center">
          <img src={logoMenu} alt="FA Pottery" className="h-16 mx-auto mb-4" />
          <CardTitle className="font-serif text-xl">Nueva contraseña</CardTitle>
          <CardDescription className="font-sans text-xs tracking-wide uppercase text-muted-foreground">
            Acceso al panel de gestión
          </CardDescription>
        </CardHeader>
        <CardContent>
          {validRecovery ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="font-sans text-xs uppercase tracking-wider">Nueva contraseña</Label>
                <Input id="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="font-sans text-xs uppercase tracking-wider">Repetir contraseña</Label>
                <Input id="confirm-password" type="password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} required minLength={8} />
              </div>
              <Button type="submit" disabled={loading} className="w-full font-sans text-xs uppercase tracking-[0.15em]">
                {loading ? "Actualizando..." : "Guardar contraseña"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">El enlace no es válido o ya venció. Pedí uno nuevo desde el inicio de sesión.</p>
              <Button variant="outline" className="w-full" onClick={() => navigate("/backoffice/login")}>Volver a ingresar</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BackofficeResetPassword;
