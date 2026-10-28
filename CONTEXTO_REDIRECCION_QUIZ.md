# Contexto: Redirección del Botón "Comenzar Quiz"

**Fecha:** 2026-10-28  
**Rama:** `JSuarez`  
**Commit:** pendiente

---

## Cambio Realizado

### Archivo Modificado
`src/app/educacion/page.tsx`

### Modificación
Convertir el botón "Comenzar quiz" en un Link que redirige a `/educacion/clasifica-residuos`

**Antes:**
```tsx
<button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl transition-colors whitespace-nowrap text-sm">
  Comenzar quiz
</button>
```

**Después:**
```tsx
<Link
  href="/educacion/clasifica-residuos"
  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl transition-colors whitespace-nowrap text-sm cursor-pointer"
>
  Comenzar quiz
</Link>
```

---

## Justificación

El banner de quiz invitaba a los usuarios a responder 5 preguntas rápidas sobre reciclaje electrónico, pero el botón no tenía funcionalidad. Al hacer clic, no ocurría nada.

La página `/educacion/clasifica-residuos` ya existe y contiene el quiz interactivo con las 5 preguntas implementadas anteriormente. Esta redirección conecta el CTA (Call to Action) con el contenido real del quiz.

---

## Flujo del Usuario

1. Usuario visita `/educacion`
2. Ve el banner: "¿Cuánto sabes sobre reciclaje electrónico?"
3. Hace clic en "Comenzar quiz"
4. Es redirigido a `/educacion/clasifica-residuos`
5. Responde las 5 preguntas del quiz

---

## Página de Destino

`/educacion/clasifica-residuos` contiene:
- Quiz con 5 preguntas sobre clasificación de residuos
- Opciones de respuesta sin revelar las correctas
- Contenido educativo sobre RAEE
- Nivel: BÁSICO
- Tipo: QUIZ

---

## Cambios Posteriores

Se agregó `cursor-pointer` a la clase del Link para mantener el cursor de puntero al pasar el mouse, consistente con la UX de botones.
