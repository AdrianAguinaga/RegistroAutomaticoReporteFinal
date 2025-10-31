
import { GoogleGenAI, Type } from "@google/genai";
import { ReportData, GeneratedContent } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateReportContent(formData: ReportData, keyIdeas: string): Promise<GeneratedContent> {
  const model = 'gemini-2.5-flash';
  
  const prompt = `
    Eres un profesor universitario de la Facultad de Contaduría y Administración de la UABC.
    Tu tarea es redactar un informe académico formal basado en los siguientes datos y ideas clave.
    El tono debe ser profesional, claro y conciso.

    Datos del curso:
    - Nombre de la Materia: ${formData.nombreMateria}
    - Nombre del Docente: ${formData.nombreDocente}
    - Periodo: ${formData.periodo}
    
    Ideas Clave proporcionadas:
    ---
    ${keyIdeas}
    ---

    Basado en lo anterior, genera el contenido para las siguientes dos secciones del "Informe de Actividades y Cumplimiento de Competencias":
    1.  **Competencia del Curso**: Describe la competencia principal del curso de manera formal y académica.
    2.  **Informe de actividades realizadas para el cumplimiento de la competencia**: Elabora un párrafo o lista detallada que describa las actividades, proyectos y temas cubiertos que ayudaron a los estudiantes a alcanzar dicha competencia. Expande las ideas clave proporcionadas en una narrativa coherente.
    
    Devuelve el resultado estrictamente en el formato JSON especificado.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            competenciaDelCurso: {
              type: Type.STRING,
              description: "El texto formal que describe la competencia principal del curso."
            },
            informeDeActividades: {
              type: Type.STRING,
              description: "El texto detallado que describe las actividades realizadas para cumplir la competencia."
            }
          },
          required: ["competenciaDelCurso", "informeDeActividades"]
        },
        temperature: 0.5,
      }
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    
    return parsedJson as GeneratedContent;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate report content from Gemini API.");
  }
}
