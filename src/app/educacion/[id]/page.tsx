export default function ArticuloPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <a
          href="/educacion"
          className="inline-block text-green-600 hover:text-green-700 mb-6"
        >
          ← Volver al centro educativo
        </a>
        
        <article className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold mb-4">
            Artículo: {params.id}
          </h1>
          <p className="text-gray-600 mb-6">
            Contenido del artículo sobre {params.id}
          </p>
          
          <div className="prose max-w-none">
            <p>
              Este es un placeholder para el contenido del artículo. 
              Aquí se mostrará el contenido educativo detallado sobre el tema seleccionado.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
