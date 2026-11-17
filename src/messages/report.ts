import type { MessageTable } from "./types";

export const reportMessages: MessageTable = {
  "report.title": { en: "Farm decision report", kn: "ಕೃಷಿ ನಿರ್ಧಾರ ವರದಿ", hi: "कृषि निर्णय रिपोर्ट" },
  "report.subtitle": {
    en: "Review, then print or save as PDF from your browser's print dialog.",
    kn: "ಪರಿಶೀಲಿಸಿ, ನಂತರ ಬ್ರೌಸರ್ ಮುದ್ರಣ ವಿಂಡೋದಿಂದ ಮುದ್ರಿಸಿ ಅಥವಾ PDF ಉಳಿಸಿ.",
    hi: "समीक्षा करें, फिर ब्राउज़र के प्रिंट डायलॉग से प्रिंट या PDF सहेजें।",
  },
  "report.eyebrow": {
    en: "SoilSathi AI · Farm decision report",
    kn: "SoilSathi AI · ಕೃಷಿ ನಿರ್ಧಾರ ವರದಿ",
    hi: "SoilSathi AI · कृषि निर्णय रिपोर्ट",
  },
  "report.sampleHeading": { en: "Sample {id}", kn: "ಮಾದರಿ {id}", hi: "नमूना {id}" },
  "report.soilHeading": { en: "Soil assessment", kn: "ಮಣ್ಣಿನ ಮೌಲ್ಯಮಾಪನ", hi: "मृदा मूल्यांकन" },
  "report.locationMissing": { en: "Location not provided", kn: "ಸ್ಥಳ ನೀಡಿಲ್ಲ", hi: "स्थान नहीं दिया" },
  "report.generated": { en: "Generated {date}", kn: "ರಚಿಸಿದ ದಿನಾಂಕ {date}", hi: "तैयार {date}" },
  "report.engine": {
    en: "Engine: deterministic reference-range evaluation",
    kn: "ಎಂಜಿನ್: ನಿರ್ಣಾಯಕ ಉಲ್ಲೇಖ ಶ್ರೇಣಿ ಮೌಲ್ಯಮಾಪನ",
    hi: "इंजन: नियतात्मक संदर्भ श्रेणी मूल्यांकन",
  },
  "report.origin.sample": {
    en: "Synthetic sample report (DEMO-KA-042)",
    kn: "ಕೃತಕ ಮಾದರಿ ವರದಿ (DEMO-KA-042)",
    hi: "कृत्रिम नमूना रिपोर्ट (DEMO-KA-042)",
  },
  "report.origin.manual": { en: "Manual entry by the user", kn: "ಬಳಕೆದಾರರ ಕೈಯಿಂದ ನಮೂದು", hi: "उपयोगकर्ता द्वारा मैन्युअल प्रविष्टि" },
  "report.origin.extracted": {
    en: "AI-extracted from an uploaded report, reviewed by the user",
    kn: "ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ವರದಿಯಿಂದ AI ಹೊರತೆಗೆದದ್ದು, ಬಳಕೆದಾರರಿಂದ ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    hi: "अपलोड की गई रिपोर्ट से AI द्वारा निकाला, उपयोगकर्ता ने समीक्षा की",
  },
  "report.origin.simulated": { en: "Hypothetical simulation", kn: "ಕಾಲ್ಪನಿಕ ಸಿಮ್ಯುಲೇಶನ್", hi: "काल्पनिक सिमुलेशन" },

  "report.section.profile": { en: "1. Soil profile", kn: "1. ಮಣ್ಣಿನ ವಿವರ", hi: "1. मृदा विवरण" },
  "report.section.crops": { en: "2. Crop comparison", kn: "2. ಬೆಳೆ ಹೋಲಿಕೆ", hi: "2. फसल तुलना" },
  "report.section.gaps": {
    en: "3. Missing and unverified information",
    kn: "3. ಕಾಣೆಯಾದ ಮತ್ತು ಪರಿಶೀಲಿಸದ ಮಾಹಿತಿ",
    hi: "3. अनुपलब्ध और असत्यापित जानकारी",
  },
  "report.section.scenario": { en: "4. What-if scenario", kn: "4. ಏನಾದರೆ ಸನ್ನಿವೇಶ", hi: "4. व्हाट-इफ परिदृश्य" },
  "report.section.questions": {
    en: "5. Questions for an agricultural expert",
    kn: "5. ಕೃಷಿ ತಜ್ಞರಿಗೆ ಪ್ರಶ್ನೆಗಳು",
    hi: "5. कृषि विशेषज्ञ के लिए प्रश्न",
  },
  "report.section.sources": { en: "6. Reference basis", kn: "6. ಉಲ್ಲೇಖ ಆಧಾರ", hi: "6. संदर्भ आधार" },

  "report.table.value": { en: "Value", kn: "ಮೌಲ್ಯ", hi: "मान" },
  "report.texture": { en: "Texture: {texture}", kn: "ವಿನ್ಯಾಸ: {texture}", hi: "बनावट: {texture}" },
  "report.confidence": { en: "Confidence: {level}", kn: "ವಿಶ್ವಾಸ: {level}", hi: "विश्वास: {level}" },
  "report.nothingImputed": {
    en: "Values are reproduced exactly as validated; nothing is imputed.",
    kn: "ಮೌಲ್ಯಗಳನ್ನು ಪರಿಶೀಲಿಸಿದಂತೆಯೇ ನೀಡಲಾಗಿದೆ; ಯಾವುದನ್ನೂ ಊಹಿಸಿ ಸೇರಿಸಿಲ್ಲ.",
    hi: "मान सत्यापित रूप में ही दिए गए हैं; कुछ भी अनुमान से नहीं जोड़ा गया।",
  },
  "report.verify": { en: "verify", kn: "ಪರಿಶೀಲಿಸಿ", hi: "सत्यापित करें" },
  "report.allReported": {
    en: "All six tracked parameters were reported and none is flagged for verification.",
    kn: "ಎಲ್ಲಾ ಆರು ಪರಾಮಿತಿಗಳು ವರದಿಯಾಗಿವೆ ಮತ್ತು ಯಾವುದೂ ಪರಿಶೀಲನೆಗೆ ಗುರುತಿಸಲ್ಪಟ್ಟಿಲ್ಲ.",
    hi: "सभी छह पैरामीटर दर्ज हैं और कोई सत्यापन के लिए चिह्नित नहीं है।",
  },
  "report.notReportedBySource": {
    en: "{param}: not reported by the source document.",
    kn: "{param}: ಮೂಲ ದಾಖಲೆಯಲ್ಲಿ ವರದಿಯಾಗಿಲ್ಲ.",
    hi: "{param}: स्रोत दस्तावेज़ में दर्ज नहीं।",
  },
  "report.flagged": {
    en: "{param}: present but flagged for verification.",
    kn: "{param}: ಇದೆ, ಆದರೆ ಪರಿಶೀಲನೆಗೆ ಗುರುತಿಸಲಾಗಿದೆ.",
    hi: "{param}: मौजूद है, पर सत्यापन के लिए चिह्नित।",
  },
  "report.waterDeclared": {
    en: "Water availability declared by the user: {value}. Soil results alone do not determine water suitability.",
    kn: "ಬಳಕೆದಾರರು ಘೋಷಿಸಿದ ನೀರಿನ ಲಭ್ಯತೆ: {value}. ಮಣ್ಣಿನ ಫಲಿತಾಂಶಗಳಿಂದ ಮಾತ್ರ ನೀರಿನ ಹೊಂದಾಣಿಕೆ ನಿರ್ಣಯಿಸಲಾಗದು.",
    hi: "उपयोगकर्ता द्वारा घोषित जल उपलब्धता: {value}। केवल मृदा परिणामों से जल उपयुक्तता तय नहीं होती।",
  },
  "report.scenario.saved": {
    en: "Hypothetical scenario saved {date}. These values are simulations, not measurements.",
    kn: "ಕಾಲ್ಪನಿಕ ಸನ್ನಿವೇಶ {date} ರಂದು ಉಳಿಸಲಾಗಿದೆ. ಈ ಮೌಲ್ಯಗಳು ಸಿಮ್ಯುಲೇಶನ್, ಅಳತೆಗಳಲ್ಲ.",
    hi: "काल्पनिक परिदृश्य {date} को सहेजा गया। ये मान सिमुलेशन हैं, माप नहीं।",
  },
  "report.scenario.none": {
    en: "No scenario saved. Run the what-if simulator and choose “Use scenario in report” to include hypothetical results here.",
    kn: "ಯಾವುದೇ ಸನ್ನಿವೇಶ ಉಳಿಸಿಲ್ಲ. ಏನಾದರೆ ಸಿಮ್ಯುಲೇಟರ್ ಚಲಾಯಿಸಿ “ಸನ್ನಿವೇಶವನ್ನು ವರದಿಯಲ್ಲಿ ಬಳಸಿ” ಆಯ್ಕೆಮಾಡಿ.",
    hi: "कोई परिदृश्य सहेजा नहीं गया। व्हाट-इफ सिम्युलेटर चलाएँ और “परिदृश्य रिपोर्ट में जोड़ें” चुनें।",
  },
  "report.scenario.newConstraint": { en: "new constraint: {list}", kn: "ಹೊಸ ಮಿತಿ: {list}", hi: "नई सीमा: {list}" },
  "report.scenario.resolved": { en: "no longer triggered: {list}", kn: "ಇನ್ನು ಅನ್ವಯಿಸುವುದಿಲ್ಲ: {list}", hi: "अब लागू नहीं: {list}" },
  "report.noQuestions": {
    en: "Generate the explanation step to add a tailored question list, or ask your agriculture officer about district-appropriate varieties, water feasibility, and local soil management.",
    kn: "ವಿವರಣೆ ಹಂತವನ್ನು ರಚಿಸಿ ಪ್ರಶ್ನೆಗಳ ಪಟ್ಟಿ ಸೇರಿಸಿ, ಅಥವಾ ನಿಮ್ಮ ಜಿಲ್ಲೆಗೆ ಸೂಕ್ತ ತಳಿ, ನೀರಿನ ಸಾಧ್ಯತೆ ಮತ್ತು ಸ್ಥಳೀಯ ಮಣ್ಣು ನಿರ್ವಹಣೆ ಬಗ್ಗೆ ಕೃಷಿ ಅಧಿಕಾರಿಯನ್ನು ಕೇಳಿ.",
    hi: "व्याख्या चरण बनाकर प्रश्न-सूची जोड़ें, या अपने जिले के लिए उपयुक्त किस्म, जल संभावना और स्थानीय मृदा प्रबंधन पर कृषि अधिकारी से पूछें।",
  },
  "report.summaryTitle": { en: "Explanation summary ({lang})", kn: "ವಿವರಣೆ ಸಾರಾಂಶ ({lang})", hi: "व्याख्या सारांश ({lang})" },
  "report.sourcesNote": {
    en: "See SOURCES.md for verification status of every reference used here.",
    kn: "ಇಲ್ಲಿ ಬಳಸಿದ ಪ್ರತಿ ಉಲ್ಲೇಖದ ಪರಿಶೀಲನಾ ಸ್ಥಿತಿಗಾಗಿ SOURCES.md ನೋಡಿ.",
    hi: "यहाँ प्रयुक्त प्रत्येक संदर्भ की सत्यापन स्थिति के लिए SOURCES.md देखें।",
  },
  "report.footer": {
    en: "This report supports, and does not replace, local agricultural expertise. Suitability labels describe alignment with documented soil reference ranges only; they are not yield or profit forecasts and do not account for climate, variety, pests, or management. Confirm major decisions with a qualified agricultural officer or KVK.",
    kn: "ಈ ವರದಿ ಸ್ಥಳೀಯ ಕೃಷಿ ಪರಿಣತಿಯನ್ನು ಬೆಂಬಲಿಸುತ್ತದೆ, ಬದಲಿಸುವುದಿಲ್ಲ. ಹೊಂದಾಣಿಕೆಯ ಲೇಬಲ್‌ಗಳು ದಾಖಲಿತ ಮಣ್ಣಿನ ಉಲ್ಲೇಖ ಶ್ರೇಣಿಗಳಿಗೆ ಹೊಂದುವುದನ್ನು ಮಾತ್ರ ತಿಳಿಸುತ್ತವೆ; ಇವು ಇಳುವರಿ ಅಥವಾ ಲಾಭದ ಮುನ್ಸೂಚನೆ ಅಲ್ಲ, ಹವಾಮಾನ/ತಳಿ/ಕೀಟ/ನಿರ್ವಹಣೆಯನ್ನು ಗಣನೆಗೆ ತೆಗೆದುಕೊಳ್ಳುವುದಿಲ್ಲ. ಪ್ರಮುಖ ನಿರ್ಧಾರಗಳನ್ನು ಅರ್ಹ ಕೃಷಿ ಅಧಿಕಾರಿ ಅಥವಾ KVK ಜೊತೆ ದೃಢಪಡಿಸಿ.",
    hi: "यह रिपोर्ट स्थानीय कृषि विशेषज्ञता का समर्थन करती है, उसका विकल्प नहीं। उपयुक्तता लेबल केवल प्रलेखित मृदा संदर्भ श्रेणियों के अनुरूपता बताते हैं; ये उपज या लाभ का पूर्वानुमान नहीं और जलवायु, किस्म, कीट या प्रबंधन को ध्यान में नहीं रखते। बड़े निर्णय योग्य कृषि अधिकारी या KVK से पुष्टि करें।",
  },
  "report.footerSample": {
    en: "Values come from the labelled synthetic sample report.",
    kn: "ಮೌಲ್ಯಗಳು ಗುರುತಿಸಿದ ಕೃತಕ ಮಾದರಿ ವರದಿಯಿಂದ ಬಂದವು.",
    hi: "मान चिह्नित कृत्रिम नमूना रिपोर्ट से हैं।",
  },
  "report.tagline": {
    en: "SoilSathi AI · Understand your soil. Simulate your choices. Farm smarter.",
    kn: "SoilSathi AI · ನಿಮ್ಮ ಮಣ್ಣನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ. ಆಯ್ಕೆಗಳನ್ನು ಸಿಮ್ಯುಲೇಟ್ ಮಾಡಿ. ಬುದ್ಧಿವಂತಿಕೆಯಿಂದ ಬೇಸಾಯ ಮಾಡಿ.",
    hi: "SoilSathi AI · अपनी मृदा समझें। विकल्पों का सिमुलेशन करें। समझदारी से खेती करें।",
  },
  "report.next.simulator": {
    en: "Revisit the what-if simulator",
    kn: "ಏನಾದರೆ ಸಿಮ್ಯುಲೇಟರ್ ಮತ್ತೆ ನೋಡಿ",
    hi: "व्हाट-इफ सिम्युलेटर फिर देखें",
  },
  "report.next.sources": {
    en: "Inspect the source documentation",
    kn: "ಮೂಲ ದಾಖಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ",
    hi: "स्रोत दस्तावेज़ देखें",
  },
};
