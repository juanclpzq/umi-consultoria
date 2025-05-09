import React from "react";
import Image from "next/image";

const SocialProof = () => (
  <div className="mt-8 pt-6 border-t border-gray-200">
    <p className="text-sm text-gray-500 mb-3 text-center">
      Empresas que ya utilizan nuestras recomendaciones:
    </p>
    <div className="flex flex-wrap justify-center gap-6">
      <div className="w-24 h-10 bg-gray-200 rounded flex items-center justify-center">
        Logo
      </div>
      <div className="w-24 h-10 bg-gray-200 rounded flex items-center justify-center">
        Logo
      </div>
      <div className="w-24 h-10 bg-gray-200 rounded flex items-center justify-center">
        Logo
      </div>
      <div className="w-24 h-10 bg-gray-200 rounded flex items-center justify-center">
        Logo
      </div>
    </div>

    <div className="mt-6 flex justify-center">
      <div className="flex items-center overflow-hidden">
        <div className="flex -space-x-2">
          <Image
            src="/api/placeholder/40/40"
            alt="Usuario"
            className="w-8 h-8 rounded-full border-2 border-white"
          />
          <Image
            src="/api/placeholder/40/40"
            alt="Usuario"
            className="w-8 h-8 rounded-full border-2 border-white"
          />
          <Image
            src="/api/placeholder/40/40"
            alt="Usuario"
            className="w-8 h-8 rounded-full border-2 border-white"
          />
        </div>
        <div className="ml-2">
          <p className="text-xs text-gray-500">
            <strong>27 personas</strong> completaron este diagnóstico en las
            últimas 24 horas
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default SocialProof;
