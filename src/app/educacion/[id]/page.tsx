'use client';

import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import React from 'react';

const CONTENIDO_ARTICULOS: Record<string, { titulo: string; nivel: string; tipo: string; contenido: React.ReactNode }> = {
  'celular-basura': {
    titulo: '¿Por qué tirar un celular a la basura es peligroso?',
    nivel: 'BÁSICO',
    tipo: 'ARTÍCULO',
    contenido: (
      <div className="prose prose-lg max-w-none">
        <p className="lead text-lg text-gray-700 mb-6">
          Los celulares y dispositivos electrónicos contienen metales pesados que pueden causar serios daños ambientales si no se desechan correctamente.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Metales peligrosos en tu celular</h2>
        <p className="mb-4">
          La mayoría de los dispositivos electrónicos contienen metales pesados como:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Plomo:</strong> Altamente tóxico, puede causar daño neurológico y problemas renales</li>
          <li><strong>Mercurio:</strong> Afecta el sistema nervioso y los riñones</li>
          <li><strong>Cadmio:</strong> Cancerígeno, se acumula en el cuerpo y causa daño óseo</li>
          <li><strong>Arsénico:</strong> Tóxico para el hígado y el sistema cardiovascular</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">¿Cómo contaminan el ambiente?</h2>
        <p className="mb-4">
          Cuando tiramos un celular a la basura común o lo abandonamos en la calle:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Los metales se filtran al suelo con la lluvia</li>
          <li>Contaminan las aguas subterráneas y los ríos</li>
          <li>Pueden ser absorbidos por las plantas y entrar en la cadena alimentaria</li>
          <li>En vertederos controlados, estos metales se filtran pero el proceso es costoso y no 100% efectivo</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">¿Qué puedes hacer?</h2>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>No tires celulares a la basura común</strong> - llévalos a centros de acopio especializados</li>
          <li><strong>Reutiliza</strong> - si el celular aún funciona, donarlo o venderlo</li>
          <li><strong>Participa en campañas de recolección</strong> - muchas empresas y gobiernos organizan eventos de recolección</li>
          <li><strong>Borra tus datos</strong> - antes de desechar, formatea el dispositivo para proteger tu información personal</li>
        </ul>
        
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 my-6">
          <p className="font-semibold text-emerald-900">
            💡 Recuerda: Un solo celular puede contaminar hasta 600,000 litros de agua.
          </p>
        </div>
      </div>
    ),
  },
  'tipos-centros-acopio': {
    titulo: 'Qué acepta cada tipo de centro de acopio',
    nivel: 'BÁSICO',
    tipo: 'INFOGRAFÍA',
    contenido: (
      <div className="prose prose-lg max-w-none">
        <p className="lead text-lg text-gray-700 mb-6">
          No todos los centros de acopio aceptan el mismo tipo de residuos. Es importante saber a dónde llevar cada aparato para asegurar su correcto reciclaje.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Centros especializados en RAEE</h2>
        <p className="mb-4">
          Estos centros están equipados para manejar Residuos de Aparatos Eléctricos y Electrónicos de forma segura:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Celulares y smartphones</strong> - aceptan cualquier marca y estado (funcionales o no)</li>
          <li><strong>Computadoras y laptops</strong> - incluyendo monitores, teclados y periféricos</li>
          <li><strong>Televisores y monitores</strong> - de cualquier tamaño y tecnología</li>
          <li><strong>Baterías</strong> - de celulares, laptops y vehículos</li>
          <li><strong>Pequeños electrodomésticos</strong> - licuadoras, batidoras, microondas</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Centros de acopio general</h2>
        <p className="mb-4">
          Algunos centros de basura municipal también aceptan ciertos RAEE, pero con restricciones:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Solo aceptan aparatos pequeños (menos de 50 cm)</li>
          <li>Pueden tener días específicos para recolección electrónica</li>
          <li>Generalmente NO aceptan baterías separadas</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Puntos de recolección en Querétaro</h2>
        <p className="mb-4">
          En Querétaro existen varios puntos especializados para RAEE:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Tiendas de electrónica</strong> - Samsung, Apple, Lenovo aceptan sus propios productos</li>
          <li><strong>Centros de acopio municipal</strong> - consulta con tu delegación</li>
          <li><strong>Programas especiales</strong> - vigila campañas temporales de recolección</li>
        </ul>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
          <p className="font-semibold text-blue-900">
            ℹ️ Antes de llevar un aparato, verifica en el centro qué tipos acepta.
          </p>
        </div>
      </div>
    ),
  },
  'economia-circular': {
    titulo: 'De la chatarra a la economía circular',
    nivel: 'AVANZADO',
    tipo: 'ARTÍCULO',
    contenido: (
      <div className="prose prose-lg max-w-none">
        <p className="lead text-lg text-gray-700 mb-6">
          El reciclaje de RAEE no es solo una cuestión ambiental, sino un modelo económico completo que genera empleo, recupera materiales valiosos y reduce la dependencia de recursos primarios.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">¿Qué es la economía circular?</h2>
        <p className="mb-4">
          La economía circular es un modelo que contrasta con la economía lineal tradicional:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Economía lineal:</strong> extraer → fabricar → usar → desechar (muy ineficiente)</li>
          <li><strong>Economía circular:</strong> diseñar → usar → recuperar → reutilizar (sostenible)</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Valor de los materiales en RAEE</h2>
        <p className="mb-4">
          Los dispositivos electrónicos contienen materiales valiosos que pueden recuperarse:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Oro:</strong> ~0.034 gramos por celular (~$2 USD)</li>
          <li><strong>Plata:</strong> ~0.25 gramos por celular (~$0.20 USD)</li>
          <li><strong>Cobre:</strong> ~13 gramos por celular (~$0.30 USD)</li>
          <li><strong>Paladio:</strong> usado en conectores de celulares (~muy valioso)</li>
          <li><strong>Litio:</strong> crítico para baterías (cada vez más demandado)</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Impacto económico del reciclaje</h2>
        <p className="mb-4">
          El reciclaje formal de RAEE genera:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Empleo formal</strong> - en centros de recolección, desmantelamiento y procesamiento</li>
          <li><strong>Reducción de importaciones</strong> - menos dependencia de materias primarias</li>
          <li><strong>Nuevas industrias</strong> - empresas especializadas en recuperación de materiales</li>
          <li><strong>Comercio informal</strong> - pero debe regularizarse para seguridad laboral y ambiental</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Desafíos en México</h2>
        <p className="mb-4">
          A pesar del potencial, México enfrenta retos:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Infraestructura formal insuficiente</li>
          <li>Comercio informal predominante (chatarreros)</li>
          <li>Falta de conciencia ciudadana</li>
          <li>Normativa en evolución</li>
        </ul>
        
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 my-6">
          <p className="font-semibold text-purple-900">
            📚 Para docentes: Este tema puede conectarse con geografía (distribución de recursos), economía (oferta y demanda) y ciencias (propiedades de los materiales).
          </p>
        </div>
      </div>
    ),
  },
  'raee-aula': {
    titulo: 'RAEE en el aula: actividades para escuelas',
    nivel: 'AVANZADO',
    tipo: 'GUÍA DOCENTE',
    contenido: (
      <div className="prose prose-lg max-w-none">
        <p className="lead text-lg text-gray-700 mb-6">
          Guía completa para docentes que deseen enseñar sobre reciclaje de RAEE en el aula, con actividades prácticas y datos técnicos.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Objetivos de aprendizaje</h2>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Comprender qué son los RAEE y por qué son importantes</li>
          <li>Identificar los componentes principales de un dispositivo electrónico</li>
          <li>Clasificar residuos electrónicos correctamente</li>
          <li>Conocer el impacto ambiental de la disposición inadecuada</li>
          <li>Fomentar hábitos de consumo responsable</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Actividad 1: Disección de dispositivo (Secundaria)</h2>
        <p className="mb-4">
          <strong>Tiempo:</strong> 45 minutos
        </p>
        <p className="mb-4">
          <strong>Materiales:</strong> Cartón, marcadores, pegamento
        </p>
        <p className="mb-4">
          <strong>Instrucciones:</strong>
        </p>
        <ol className="list-decimal pl-6 mb-6 space-y-2">
          <li>En grupos de 3-4, diseñar un dispositivo electrónico ideal para reciclaje (fácil de desarmar, materiales no tóxicos)</li>
          <li>Presentar el diseño al grupo explicando las decisiones tomadas</li>
          <li>Discutir cómo estos diseños podrían implementarse en la realidad</li>
        </ol>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Actividad 2: Clasificación práctica (Primaria)</h2>
        <p className="mb-4">
          <strong>Tiempo:</strong> 30 minutos
        </p>
        <p className="mb-4">
          <strong>Materiales:</strong> Imágenes de diferentes residuos (papel, plástico, vidrio, batería, celular, cable)
        </p>
        <p className="mb-4">
          <strong>Instrucciones:</strong>
        </p>
        <ol className="list-decimal pl-6 mb-6 space-y-2">
          <li>Colocar imágenes de residuos en el suelo</li>
          <li>Pedir a los estudiantes que separen en dos grupos: reciclables y no reciclables</li>
          <li>Revisar las clasificaciones juntos y corregir errores</li>
          <li>Destacar que RAEE requiere manejo especial (centros especializados)</li>
        </ol>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Actividad 3: Cálculo de impacto (Secundaria)</h2>
        <p className="mb-4">
          <strong>Tiempo:</strong> 50 minutos
        </p>
        <p className="mb-4">
          <strong>Instrucciones:</strong>
        </p>
        <ol className="list-decimal pl-6 mb-6 space-y-2">
          <li>Investigar cuántos metales contiene un celular promedio</li>
          <li>Calcular cuántos celulares se desechan anualmente en México (datos aproximados: 30-40 millones)</li>
          <li>Estimar el volumen total de metales</li>
          <li>Calcular cuánta agua se contaminaría si no se recicla</li>
          <li>Presentar resultados en gráficos o infografías</li>
        </ol>
        
        <h2 className="text-2xl font-bold text-gray-900 técnicos mt-8 mb-4">Datos técnicos para docentes</h2>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Generación RAEE en México:</strong> ~1.2 kg per cápita/año (una de las más altas de Latinoamérica)</li>
          <li><strong>Tasa de reciclaje formal:</strong> ~15% (el resto termina en vertederos o chatarreros)</li>
          <li><strong>Materiales recuperables:</strong> oro, plata, cobre, paladio, litio, neodimio, terbio</li>
          <li><strong>Valor potencial:</strong> ~$1.2 mil millones USD anuales en materiales perdidos</li>
        </ul>
        
        <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 my-6">
          <p className="font-semibold text-cyan-900">
            📚 Adaptación curricular: Estas actividades pueden integrarse en clases de Ciencias Naturales, Física (propiedades de materiales), Matemáticas (cálculos) y Formación Cívica.
          </p>
        </div>
      </div>
    ),
  },
  'clasifica-residuos': {
    titulo: 'Identifica el residuo correcto',
    nivel: 'BÁSICO',
    tipo: 'QUIZ',
    contenido: (
      <div className="prose prose-lg max-w-none">
        <p className="lead text-lg text-gray-700 mb-6">
          Pon a prueba tus conocimientos sobre clasificación de residuos. Responde correctamente para ganar puntos de experiencia.
        </p>
        
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="font-bold text-gray-900 mb-4">Pregunta 1: ¿Dónde va una pila AA alkalina?</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
              <input type="radio" name="q1" value="a" />
              <span>A) Basura orgánica</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
              <input type="radio" name="q1" value="b" />
              <span>B) Residuo peligroso especial</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
              <input type="radio" name="q1" value="c" />
              <span>C) Reciclaje</span>
            </label>
          </div>
          
          <h3 className="font-bold text-gray-900 mb-4">Pregunta 2: ¿Qué es RAEE?</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
              <input type="radio" name="q2" value="a" />
              <span>A) Residuos de Aparatos Eléctricos y Electrónicos</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
              <input type="radio" name="q2" value="b" />
              <span>B) Residuos Automotrices</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
              <input type="radio" name="q2" value="c" />
              <span>C) Residuos de Alimentos</span>
            </label>
          </div>
          
          <h3 className="font-bold text-gray-900 mb-4">Pregunta 3: ¿Cuál de estos se puede reciclar en un centro de acopio común?</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
              <input type="radio" name="q3" value="a" />
              <span>A) Batería de laptop</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
              <input type="radio" name="q3" value="b" />
              <span>B) Botella de PET vacía</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
              <input type="radio" name="q3" value="c" />
              <span>C) Celular roto</span>
            </label>
          </div>
          
          <h3 className="font-bold text-gray-900 mb-4">Pregunta 4: ¿Qué metal es muy valioso en celulares?</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
              <input type="radio" name="q4" value="a" />
              <span>A) Hierro</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
              <input type="radio" name="q4" value="b" />
              <span>B) Oro</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
              <input type="radio" name="q4" value="c" />
              <span>C) Plomo</span>
            </label>
          </div>
          
          <h3 className="font-bold text-gray-900 mb-4">Pregunta 5: ¿Por qué no debemos tirar baterías al basurero?</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
              <input type="radio" name="q5" value="a" />
              <span>A) Ocupan mucho espacio</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
              <input type="radio" name="q5" value="b" />
              <span>B) Pueden explotar y causar incendios</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
              <input type="radio" name="q5" value="c" />
              <span>C) Son muy pesadas</span>
            </label>
          </div>
        </div>
        
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 my-6">
          <p className="font-semibold text-rose-900">
            🎯 ¡Pon a prueba tus conocimientos! Este quiz es educativo. No estás siendo evaluado.
          </p>
        </div>
      </div>
    ),
  },
};

export default function ArticuloPage() {
  const params = useParams();
  const id = params.id as string;
  const staticArticulo = CONTENIDO_ARTICULOS[id];

  const [articuloDinamico, setArticuloDinamico] = React.useState<{
    titulo: string;
    nivel: string;
    tipo: string;
    contenido: string;
  } | null>(null);

  React.useEffect(() => {
    let cancel = false;
    async function fetchArticulo() {
      try {
        const res = await fetch(`/api/educacion/${id}`);
        if (!res.ok) return;
        const json = await res.json();
        if (json.data && !cancel) {
          setArticuloDinamico({
            titulo: json.data.titulo,
            nivel: (json.data.nivel || 'BÁSICO').toUpperCase(),
            tipo: (json.data.tipo || 'ARTÍCULO').toUpperCase(),
            contenido: json.data.contenido,
          });
        }
      } catch (err) {
        console.warn('Fallback a contenido estático:', err);
      }
    }
    fetchArticulo();
    return () => {
      cancel = true;
    };
  }, [id]);

  if (!staticArticulo && !articuloDinamico) {
    notFound();
  }

  // Si es el quiz interactivo, priorizamos el componente de React para mantener los controles
  const esQuiz = id === 'clasifica-residuos';

  const titulo = articuloDinamico?.titulo ?? staticArticulo?.titulo ?? 'Material Educativo';
  const nivel = articuloDinamico?.nivel ?? staticArticulo?.nivel ?? 'BÁSICO';
  const tipo = articuloDinamico?.tipo ?? staticArticulo?.tipo ?? 'ARTÍCULO';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/educacion"
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6 transition-colors font-medium text-sm"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7 7" />
          </svg>
          Volver al centro educativo
        </Link>
        
        <div className="mb-6">
          <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
            nivel === 'BÁSICO'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            {nivel}
          </span>
          <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ml-2 ${
            tipo === 'ARTÍCULO'
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : tipo === 'INFOGRAFÍA'
              ? 'bg-purple-50 text-purple-800 border border-purple-200'
              : tipo === 'QUIZ'
              ? 'bg-rose-50 text-rose-800 border border-rose-200'
              : 'bg-cyan-50 text-cyan-800 border border-cyan-200'
          }`}>
            {tipo}
          </span>
        </div>
        
        <article className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            {titulo}
          </h1>
          
          {esQuiz || !articuloDinamico?.contenido ? (
            staticArticulo?.contenido
          ) : (
            <div
              className="prose prose-emerald max-w-none text-gray-700 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: articuloDinamico.contenido }}
            />
          )}
        </article>
      </div>
    </div>
  );
}
