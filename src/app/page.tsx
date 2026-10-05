export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-4">
          ReciclaQro
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Encuentra centros de acopio de reciclaje en Querétaro
        </p>
        
        {/* Mapa interactivo placeholder */}
        <div className="w-full h-[600px] bg-gray-200 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Mapa interactivo de centros de acopio</p>
        </div>
      </div>
    </main>
  );
}
