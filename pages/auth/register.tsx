import Link from "next/link";
import React from "react";
import Image from "next/image";

export default function Register() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-3xl">
        <div className="p-5 bg-green-600 text-white">
          <h2 className="text-2xl font-bold text-center">Éco-Olive</h2>
          <p className="text-green-100 text-center">
            Inscription à la plateforme de gestion des déchets d'olive
          </p>
        </div>

        <div className="p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Créer un compte
          </h1>

          <div>
            <button className="w-[320px] h-[50px] mx-auto flex justify-center items-center hover:bg-[#2a0678] bg-[#431c99] text-white py-2 px-4 rounded-lg cursor-pointer">
              S'inscrire
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte?{" "}
              <Link
                href="login"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Removed as the default export is now inline with the function declaration
