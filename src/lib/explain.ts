import { ExplanationRequest, ExplanationResponse } from "./types";
import { cropName, localisedWhy, suitabilityLabel, t, type Lang } from "./i18n";
import type { CropEvaluation } from "./types";

/** One localised finding line, built from structured codes rather than English prose. */
function findingLine(lang: Lang, e: CropEvaluation): string {
  const complete = t(lang, "label.dataComplete", { pct: e.completeness });
  const stop = lang === "hi" ? "।" : ".";
  return `${cropName(lang, e.cropId)}: ${suitabilityLabel(lang, e.suitability)} (${complete})${stop} ${localisedWhy(lang, e)}`;
}

export function buildDeterministicExplanation(req: ExplanationRequest): ExplanationResponse {
  const { evaluations, scenarioLabel, language } = req;
  const top = evaluations.slice().sort((a, b) => score(b.suitability) - score(a.suitability))[0];
  const missing = Array.from(new Set(evaluations.flatMap((e) => e.missingInfo))).slice(0, 6);
  const limiting = Array.from(new Set(evaluations.flatMap((e) => e.limitingFactors))).slice(0, 6);
  const base = {
    en: {
      summary: `${scenarioLabel ? scenarioLabel + ": " : ""}Based on validated soil measurements and documented reference ranges, ${top ? top.cropName : "no crop"} shows the strongest fit among compared options, but results depend on local climate, water availability, variety, and management. This is decision support, not a guarantee.`,
      keyFindings: [
        ...evaluations.map((e) => findingLine("en", e)),
        ...limiting.map((l) => `Constraint: ${l}`),
      ].slice(0, 8),
      questionsForExpert: [
        "Which crop varieties are recommended for my district and season?",
        "Given my irrigation/water availability, which option is practical this season?",
        "Are there local soil amendments or management practices appropriate for these constraints?",
        "Should I repeat or expand soil testing (depth, micronutrients, texture, Ca/Mg/S)?",
      ],
      additionalTests: [
        "Confirm soil texture and drainage characteristics.",
        "Test secondary/micronutrients if deficiencies are suspected (e.g., S, Zn, B, Fe).",
        "Assess irrigation water quality if salinity is a concern.",
      ],
      disclaimer: "Recommendations support, not replace, local agricultural expertise. Do not treat these results as yield or profit guarantees.",
    },
    kn: {
      summary: `${scenarioLabel ? scenarioLabel + ": " : ""}ಮಾನ್ಯ ಮಣ್ಣಿನ ಅಳತೆಗಳು ಮತ್ತು ದಾಖಲಿತ ಉಲ್ಲೇಖ ಶ್ರೇಣಿಗಳ ಆಧಾರದ ಮೇಲೆ, ಹೋಲಿಸಿದ ಬೆಳೆಗಳಲ್ಲಿ ${top ? cropName("kn", top.cropId) : "ಯಾವುದೇ ಬೆಳೆ"} ಹೆಚ್ಚು ಹೊಂದಿಕೆಯಾಗಬಹುದು. ಆದರೆ ಸ್ಥಳೀಯ ಹವಾಮಾನ, ನೀರು, ತಳಿ ಮತ್ತು ನಿರ್ವಹಣೆ ಫಲಿತಾಂಶವನ್ನು ಬದಲಾಯಿಸುತ್ತವೆ. ಇದು ನಿರ್ಧಾರ ಸಹಾಯ ಮಾತ್ರ, ಭರವಸೆ ಅಲ್ಲ.`,
      keyFindings: [
        ...evaluations.map((e) => findingLine("kn", e)),
        ...(limiting.length
          ? [`${limiting.length} ಮಿತಿಗಳು ಗುರುತಿಸಲಾಗಿವೆ; ಪ್ರತಿ ಪರಾಮಿತಿಯ ವಿವರಗಳನ್ನು ವಿಶ್ಲೇಷಣೆ ಪುಟದಲ್ಲಿ ನೋಡಿ.`]
          : []),
      ].slice(0, 8),
      questionsForExpert: [
        "ನನ್ನ ಜಿಲ್ಲೆ ಮತ್ತು ಋತುವಿಗೆ ಸೂಕ್ತ ಬೆಳೆ ತಳಿಗಳು ಯಾವುವು?",
        "ನನ್ನ ನೀರಿನ ಲಭ್ಯತೆಗೆ ಈ ಋತುವಿನಲ್ಲಿ ಯಾವ ಆಯ್ಕೆ ಪ್ರಾಯೋಗಿಕ?",
        "ಈ ಮಿತಿಗಳಿಗೆ ಸ್ಥಳೀಯ ಮಣ್ಣಿನ ಸುಧಾರಣೆ ಅಥವಾ ನಿರ್ವಹಣೆ ಕ್ರಮಗಳು ಏನು?",
        "ಮಣ್ಣಿನ ಪರೀಕ್ಷೆಯನ್ನು ಮರುಪರೀಕ್ಷೆ/ವಿಸ್ತರಿಸಬೇಕೇ (ಆಳ, ಸೂಕ್ಷ್ಮ ಪೋಷಕಾಂಶಗಳು)?",
      ],
      additionalTests: [
        "ಮಣ್ಣಿನ ವಿನ್ಯಾಸ ಮತ್ತು ಒಳಚರಂಡಿ ಗುಣಲಕ್ಷಣಗಳನ್ನು ದೃಢಪಡಿಸಿ.",
        "ಅಗತ್ಯವಿದ್ದರೆ ಸೂಕ್ಷ್ಮ/ದ್ವಿತೀಯ ಪೋಷಕಾಂಶಗಳ ಪರೀಕ್ಷೆ ಮಾಡಿ (S, Zn, B, Fe).",
        "ಲವಣಾಂಶದ ಆತಂಕವಿದ್ದರೆ ನೀರಿನ ಗುಣಮಟ್ಟ ಪರೀಕ್ಷಿಸಿ.",
      ],
      disclaimer: "ಈ ಮಾಹಿತಿಯು ಸ್ಥಳೀಯ ಕೃಷಿ ತಜ್ಞರ ಸಲಹೆಯನ್ನು ಬದಲಿಸುವುದಿಲ್ಲ. ಇಳುವರಿ/ಲಾಭದ ಭರವಸೆ ನೀಡುವುದಿಲ್ಲ.",
    },
    hi: {
      summary: `${scenarioLabel ? scenarioLabel + ": " : ""}मान्य मृदा मापों और प्रलेखित संदर्भ श्रेणियों के आधार पर, तुलना की गई फसलों में ${top ? cropName("hi", top.cropId) : "कोई फसल"} अधिक उपयुक्त प्रतीत होती है, लेकिन परिणाम स्थानीय जलवायु, जल उपलब्धता, किस्म और प्रबंधन पर निर्भर करते हैं। यह निर्णय सहायता है, गारंटी नहीं।`,
      keyFindings: [
        ...evaluations.map((e) => findingLine("hi", e)),
        ...(limiting.length
          ? [`${limiting.length} सीमाएँ चिह्नित हैं; प्रत्येक पैरामीटर का विवरण विश्लेषण पृष्ठ पर देखें।`]
          : []),
      ].slice(0, 8),
      questionsForExpert: [
        "मेरे जिले और मौसम के लिए कौन-सी किस्में उपयुक्त हैं?",
        "मेरी सिंचाई/जल उपलब्धता के अनुसार इस मौसम में कौन-सा विकल्प व्यावहारिक है?",
        "इन सीमाओं के लिए स्थानीय मृदा सुधार या प्रबंधन उपाय क्या हैं?",
        "क्या मृदा परीक्षण दोहराना/विस्तारित करना चाहिए (गहराई, सूक्ष्म पोषक तत्व)?",
      ],
      additionalTests: [
        "मृदा बनावट और जल निकास की पुष्टि करें।",
        "आवश्यक होने पर द्वितीयक/सूक्ष्म पोषक तत्वों की जाँच करें (S, Zn, B, Fe)।",
        "यदि लवणता की चिंता हो तो सिंचाई जल की गुणवत्ता जाँचें।",
      ],
      disclaimer: "यह जानकारी स्थानीय कृषि विशेषज्ञ की सलाह का विकल्प नहीं है। उपज या लाभ की गारंटी नहीं।",
    },
  };

  const b = base[language];
  const missingLine = missing.length
    ? language === "en"
      ? `Missing/unreliable: ${missing.join("; ")}`
      : language === "kn"
        ? `ಕಾಣೆಯಾದ/ಅವಿಶ್ವಸನೀಯ ಅಳತೆಗಳು: ${missing.length} (ವಿವರಗಳು ವಿಶ್ಲೇಷಣೆ ಪುಟದಲ್ಲಿವೆ).`
        : `अनुपलब्ध/अविश्वसनीय माप: ${missing.length} (विवरण विश्लेषण पृष्ठ पर).`
    : null;
  return {
    language,
    summary: b.summary,
    keyFindings: missingLine ? [...b.keyFindings, missingLine].slice(0, 9) : b.keyFindings,
    questionsForExpert: [...b.questionsForExpert],
    additionalTests: [...b.additionalTests],
    disclaimer: b.disclaimer,
    usedAi: false,
  };
}

function score(s: string) {
  return s === "well-suited" ? 4 : s === "moderately-suited" ? 3 : s === "limited" ? 2 : 1;
}

