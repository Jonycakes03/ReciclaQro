export default function EducacionPage() {
  const articulos = [
    { id: 'baterias', titulo: 'Cómo reciclar baterías', descripcion: 'Aprende a desechar correctamente tus baterías' },
    { id: 'plastico', titulo: 'Tipos de plástico', descripcion: 'Identifica y clasifica los diferentes plásticos' },
    { id: 'papel', titulo: 'Reciclaje de papel', descripcion: 'Guía completa para reciclar papel y cartón' },
    { id: 'vidrio', titulo: 'Reciclaje de vidrio', descripcion: 'Todo sobre el reciclaje de vidrio' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-4">
          Centro Educativo
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Aprende sobre reciclaje y sostenibilidad
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articulos.map((articulo) => (
            <a
              key={articulo.id}
              href={`/educacion/${articulo.id}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{articulo.titulo}</h2>
              <p className="text-gray-600">{articulo.descripcion}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
