import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-100 to-green-200 p-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-green-800 mb-4">
          🫒 Green Olive Chain
        </h1>
        <p className="text-xl text-green-600 mb-2">
          Système de Blockchain pour la Gestion des Déchets d'Olives
        </p>{" "}
        <p className="text-black">
          Traçabilité complète de la production agricole au recyclage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        <OrganizationCard
          title="Agriculteur"
          description="Gestion et traçabilité des déchets agricoles issus de la culture des olives"
          href="./farmer/wasteDash"
          icon="🌱"
        />

        <OrganizationCard
          title="Extraction d'Huile"
          description="Suivi des déchets générés lors de l'extraction de l'huile d'olive et production"
          href="./processor/extractionDash"
          icon="🏭"
        />

        <OrganizationCard
          title="Organisation de Recyclage"
          description="Transformation des déchets en ressources valorisables et durables"
          href="./recycler/recyclingDash"
          icon="♻️"
        />
      </div>

      {/* Blockchain Dashboard Link */}
      <div className="mt-8 w-full max-w-md">
        <Link
          href="/blockchain-dashboard"
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center shadow-lg transform hover:scale-105"
        >
          <span className="text-2xl mr-3">🔗</span>
          <div className="text-center">
            <div className="font-bold text-lg">Blockchain Dashboard</div>
            <div className="text-sm opacity-90">Monitoring & Analytics</div>
          </div>
        </Link>
      </div>

      {/* Additional Information */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-6 max-w-4xl">
        {" "}
        <h2 className="text-2xl font-semibold text-black mb-4 text-center">
          🔗 Traçabilité Blockchain
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="font-semibold text-black mb-2">Transparence</h3>
            <p className="text-sm text-black">
              Suivi en temps réel de tous les déchets depuis la production
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl">🔒</span>{" "}
            </div>
            <h3 className="font-semibold text-black mb-2">Sécurité</h3>
            <p className="text-sm text-black">
              Données immutables et vérifiables sur la blockchain
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl">🌍</span>
            </div>
            <h3 className="font-semibold text-black mb-2">Durabilité</h3>
            <p className="text-sm text-black">
              Optimisation du recyclage et réduction des déchets
            </p>
          </div>
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
      <div className="text-5xl mb-4">{icon}</div>
      <h2 className="text-2xl font-semibold text-green-700 mb-2">{title}</h2>
      <p className="text-black">{description}</p>
      <div className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors">
        Accéder
      </div>
    </Link>
  );
}
