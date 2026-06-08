import { useAuth } from "@/hooks/useAuth";
import { useAllPieces } from "@/hooks/usePieces";
import { useNews } from "@/hooks/useNews";
import { useSiteImages } from "@/hooks/useSiteImages";
import { useClassTypes } from "@/hooks/useClasses";

const Dashboard = () => {
  const { user, roles } = useAuth();
  const { data: pieces } = useAllPieces();
  const { data: news } = useNews(false);
  const { data: siteImages } = useSiteImages();
  const { data: classTypes } = useClassTypes(false);

  const activeClasses = classTypes?.filter((c) => c.is_active)?.length ?? 0;
  const imagesConfigured = siteImages?.filter((i) => !!i.image_url)?.length ?? 0;
  const totalImages = siteImages?.length ?? 0;

  const stats = [
    { label: "Piezas", value: pieces?.length ?? 0 },
    { label: "Clases activas", value: activeClasses },
    { label: "Novedades", value: news?.length ?? 0 },
    { label: "Imágenes", value: `${imagesConfigured}/${totalImages}` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl">Bienvenida al Backoffice</h1>
        <p className="text-muted-foreground font-sans text-sm mt-1">
          Hola, {user?.email}. Rol: {roles.join(", ") || "sin rol"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border border-border p-6 bg-card"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-sans">
              {stat.label}
            </p>
            <p className="font-serif text-3xl mt-2">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
