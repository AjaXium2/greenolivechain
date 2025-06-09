import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-100 to-green-200 p-6">
      <h1 className="text-4xl font-bold text-green-800 mb-8">
        Gestion des Produits des Plantes d'Olives
      </h1>

      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl justify-center items-center">
          <OrganizationCard
            title="Olives"
            description="Traitement des olives"
            href="olivesDash"
            icon="🫒"
          />

          <OrganizationCard
            title="Déchets"
            description="Traitement des déchets, feuilles et branches"
            href="wasteDash"
            icon="🎋"
          />
        </div>
      </div>
    </main>
  );
}

interface OrganizationCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
}

function OrganizationCard({
  title,
  description,
  href,
  icon,
}: OrganizationCardProps) {
  return (
    <Link
      href={href}
      className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center border border-green-200"
    >
      {" "}
      <div className="text-5xl mb-4">{icon}</div>
      <h2 className="text-2xl font-semibold text-green-700 mb-2">{title}</h2>
      <p className="text-black">{description}</p>
      <div className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors">
        Accéder
      </div>
    </Link>
  );
}
