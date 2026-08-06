import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import logoMenu from "@/assets/logo-menu.svg";

const BackofficeLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({
        title: "Error al iniciar sesión",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/backoffice");
    }
    setLoading(false);
  };

  const handlePasswordRecovery = async () => {
    if (!email) {
      toast({
        title: "Ingresá tu email",
        description: "Escribí primero el email con el que accedés al backoffice.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    // El destino se adapta al entorno: local para probar y fapottery.com en producción.
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/backoffice/reset-password`,
    });
    setLoading(false);

    if (error) {
      toast({ title: "No pudimos enviar el enlace", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Revisá tu email", description: "Te enviamos un enlace para crear una contraseña nueva." });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm border-border">
        <CardHeader className="text-center">
          <img src={logoMenu} alt="FA Pottery" className="h-16 mx-auto mb-4" />
          <CardTitle className="font-serif text-xl">Backoffice</CardTitle>
          <CardDescription className="font-sans text-xs tracking-wide uppercase text-muted-foreground">
            Acceso al panel de gestión
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-sans text-xs uppercase tracking-wider">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-sans text-xs uppercase tracking-wider">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full font-sans text-xs uppercase tracking-[0.15em]"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </Button>
            <button
              type="button"
              onClick={handlePasswordRecovery}
              disabled={loading}
              className="w-full text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground disabled:opacity-50"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackofficeLogin;
