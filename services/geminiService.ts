import { GoogleGenAI, Type } from "@google/genai";
import { ReportData, GeneratedContent } from "../types";
import { COMPETENCY_DATA } from './competencyData';

// Fix: Initialize the Gemini client according to the documentation.
// The API key is automatically picked up from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateReportContent = async (
  formData: ReportData,
  keyIdeas: string
): Promise<GeneratedContent> => {
  // Fix: Use a recommended model for text generation tasks.
  const model = "gemini-2.5-flash";

  const courseCompetency = COMPETENCY_DATA[formData.claveMateria] || 
    `El alumno desarrollará las habilidades y conocimientos fundamentales correspondientes a la materia de ${formData.nombreMateria}.`;

  const systemInstruction = `
    Eres un asistente experto en redacción académica para la Universidad Autónoma de Baja California (UABC).
    Tu tarea es generar el contenido para un "Informe de Actividades y Cumplimiento de Competencias" para un curso.
    Debes redactar de manera formal, profesional y concisa, en español.
    El informe tiene dos secciones principales que debes generar: "Competencia del Curso" y "Informe de actividades realizadas para el cumplimiento de la competencia".
  `;
  
  const prompt = `
    Por favor, genera el contenido para el informe del curso con los siguientes datos:
    - Nombre de la Materia: ${formData.nombreMateria}
    - Nombre del Docente: ${formData.nombreDocente}
    - Periodo: ${formData.periodo}

    Aquí están las ideas clave y actividades realizadas durante el curso, proporcionadas por el docente:
    ---
    ${keyIdeas}
    ---

    Instrucciones para la generación:

    1.  **competenciaDelCurso**:
        - Usa la siguiente competencia oficial del curso como base. Puedes ajustarla ligeramente para mejorar la redacción si es necesario, pero mantén la esencia del texto.
        - Competencia base: "${courseCompetency}"

    2.  **informeDeActividades**:
        - Redacta un párrafo o varios párrafos que describan cómo se cumplió la competencia del curso.
        - Basa tu redacción EXCLUSIVAMENTE en las "ideas clave y actividades" proporcionadas.
        - Sintetiza y organiza las ideas clave en un informe narrativo coherente.
        - Menciona cómo las actividades, proyectos, y temas cubiertos contribuyeron a que los estudiantes alcanzaran la competencia.
        - La longitud debe ser como máximo de 200 palabras.
        - No inventes información que no esté en las ideas clave.

    Genera la respuesta estrictamente en el formato JSON especificado.
  `;

  try {
    // Fix: Use generateContent with a JSON response schema as per the new API guidelines.
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            competenciaDelCurso: {
              type: Type.STRING,
              description: 'El texto oficial de la competencia del curso.'
            },
            informeDeActividades: {
              type: Type.STRING,
              description: 'El informe narrativo de las actividades realizadas, basado en las ideas clave proporcionadas.'
            }
          },
          required: ['competenciaDelCurso', 'informeDeActividades']
        },
        temperature: 0.5,
      }
    });

    // Fix: Extract the text response and parse it as JSON.
    const jsonText = response.text;
    const generatedContent: GeneratedContent = JSON.parse(jsonText);
    
    if (!generatedContent.competenciaDelCurso || !generatedContent.informeDeActividades) {
      throw new Error("La respuesta de la IA no contiene los campos esperados.");
    }

    return generatedContent;
  } catch (error) {
    console.error("Error al generar contenido con Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Error al comunicarse con el servicio de IA: ${error.message}`);
    }
    throw new Error("Ocurrió un error inesperado al generar el informe.");
  }
};