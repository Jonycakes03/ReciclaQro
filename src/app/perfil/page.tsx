export default function PerfilPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Mi Perfil
        </h1>
        
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Nivel y XP */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Nivel 5</h2>
              <span className="text-gray-600">1250 XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-green-600 h-4 rounded-full"
                style={{ width: '65%' }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              1250 / 2000 XP para el siguiente nivel
            </p>
          </div>
          
          {/* Historial de reciclaje */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Historial de Reciclaje</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Centro de Acopio Norte</p>
                  <p className="text-sm text-gray-600">Papel y cartón</p>
                </div>
                <span className="text-green-600 font-semibold">+50 XP</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Centro de Acopio Sur</p>
                  <p className="text-sm text-gray-600">Plástico PET</p>
                </div>
                <span className="text-green-600 font-semibold">+30 XP</span>
              </div>
            </div>
          </div>
          
          {/* Logros */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Logros</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-4xl mb-2">🌱</div>
                <p className="text-sm font-medium">Primer Paso</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-4xl mb-2">♻️</div>
                <p className="text-sm font-medium">Reciclador</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg opacity-50">
                <div className="text-4xl mb-2">🏆</div>
                <p className="text-sm font-medium">Maestro</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg opacity-50">
                <div className="text-4xl mb-2">⭐</div>
                <p className="text-sm font-medium">Leyenda</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
