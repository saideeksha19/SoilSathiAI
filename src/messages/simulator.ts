import type { MessageTable } from "./types";

export const simulatorMessages: MessageTable = {
  "sim.eyebrow": {
    en: "Step 4 · What-if simulator",
    kn: "ಹಂತ 4 · ಏನಾದರೆ ಸಿಮ್ಯುಲೇಟರ್",
    hi: "चरण 4 · व्हाट-इफ सिम्युलेटर",
  },
  "sim.title": {
    en: "Test a decision before the season does",
    kn: "ಋತು ನಿರ್ಧರಿಸುವ ಮೊದಲೇ ನಿರ್ಧಾರ ಪರೀಕ್ಷಿಸಿ",
    hi: "मौसम तय करने से पहले निर्णय जाँचें",
  },
  "sim.description": {
    en: "Every slider creates a hypothetical soil profile, not a claim about your field. The same deterministic engine evaluates it, and only the differences are reported.",
    kn: "ಪ್ರತಿ ಸ್ಲೈಡರ್ ಕಾಲ್ಪನಿಕ ಮಣ್ಣಿನ ವಿವರವನ್ನು ರಚಿಸುತ್ತದೆ; ಅದು ನಿಮ್ಮ ಹೊಲದ ಬಗ್ಗೆ ಹೇಳಿಕೆ ಅಲ್ಲ. ಅದೇ ನಿರ್ಣಾಯಕ ಎಂಜಿನ್ ಅದನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡುತ್ತದೆ ಮತ್ತು ವ್ಯತ್ಯಾಸಗಳನ್ನು ಮಾತ್ರ ತೋರಿಸುತ್ತದೆ.",
    hi: "प्रत्येक स्लाइडर एक काल्पनिक मृदा विवरण बनाता है, आपके खेत के बारे में दावा नहीं। वही नियतात्मक इंजन उसका मूल्यांकन करता है और केवल अंतर दिखाता है।",
  },
  "sim.purpose": {
    en: "The what-if simulator",
    kn: "ಏನಾದರೆ ಸಿಮ್ಯುಲೇಟರ್",
    hi: "व्हाट-इफ सिम्युलेटर",
  },
  "sim.callout.title": {
    en: "Simulated values are not soil measurements",
    kn: "ಸಿಮ್ಯುಲೇಟೆಡ್ ಮೌಲ್ಯಗಳು ಮಣ್ಣಿನ ಅಳತೆಗಳಲ್ಲ",
    hi: "सिम्युलेटेड मान मृदा माप नहीं हैं",
  },
  "sim.callout.body": {
    en: "Moving a slider does not change your soil, and it does not predict what an amendment or practice would achieve. It answers a narrower question: if this parameter were at this level, which documented constraints would still apply?",
    kn: "ಸ್ಲೈಡರ್ ಚಲಿಸಿದರೆ ನಿಮ್ಮ ಮಣ್ಣು ಬದಲಾಗುವುದಿಲ್ಲ, ಮತ್ತು ಯಾವ ಸುಧಾರಣೆ ಅಥವಾ ಕ್ರಮ ಏನು ಸಾಧಿಸುತ್ತದೆ ಎಂದು ಅದು ಮುನ್ಸೂಚಿಸುವುದಿಲ್ಲ. ಅದು ಒಂದು ಸಣ್ಣ ಪ್ರಶ್ನೆಗೆ ಉತ್ತರಿಸುತ್ತದೆ: ಈ ಪರಾಮಿತಿ ಈ ಮಟ್ಟದಲ್ಲಿದ್ದರೆ, ಯಾವ ದಾಖಲಿತ ಮಿತಿಗಳು ಇನ್ನೂ ಅನ್ವಯಿಸುತ್ತವೆ?",
    hi: "स्लाइडर खिसकाने से आपकी मृदा नहीं बदलती, और यह नहीं बताता कि कोई सुधार या क्रिया क्या परिणाम देगी। यह एक सीमित प्रश्न का उत्तर देता है: यदि यह पैरामीटर इस स्तर पर हो, तो कौन-सी प्रलेखित सीमाएँ लागू रहेंगी?",
  },
  "sim.panel.title": {
    en: "Hypothetical parameters",
    kn: "ಕಾಲ್ಪನಿಕ ಪರಾಮಿತಿಗಳು",
    hi: "काल्पनिक पैरामीटर",
  },
  "sim.simulated": { en: "Simulated", kn: "ಸಿಮ್ಯುಲೇಟೆಡ್", hi: "सिम्युलेटेड" },
  "sim.measured": { en: "measured: {value}", kn: "ಅಳತೆ: {value}", hi: "मापा: {value}" },
  "sim.notReported": { en: "not reported", kn: "ವರದಿಯಾಗಿಲ್ಲ", hi: "दर्ज नहीं" },
  "sim.overridden": {
    en: "Overridden for this scenario.",
    kn: "ಈ ಸನ್ನಿವೇಶಕ್ಕೆ ಬದಲಿಸಲಾಗಿದೆ.",
    hi: "इस परिदृश्य के लिए बदला गया।",
  },
  "sim.water.title": {
    en: "Declared water availability",
    kn: "ಘೋಷಿಸಿದ ನೀರಿನ ಲಭ್ಯತೆ",
    hi: "घोषित जल उपलब्धता",
  },
  "sim.water.note": {
    en: "A stated input, not a measured soil property. Soil results alone cannot determine water suitability.",
    kn: "ಇದು ನೀಡಿದ ಮಾಹಿತಿ, ಅಳೆದ ಮಣ್ಣಿನ ಗುಣ ಅಲ್ಲ. ಮಣ್ಣಿನ ಫಲಿತಾಂಶಗಳಿಂದ ಮಾತ್ರ ನೀರಿನ ಹೊಂದಾಣಿಕೆ ನಿರ್ಣಯಿಸಲಾಗದು.",
    hi: "यह दिया गया इनपुट है, मापी गई मृदा संपत्ति नहीं। केवल मृदा परिणामों से जल उपयुक्तता तय नहीं होती।",
  },
  "sim.water.low": { en: "Low", kn: "ಕಡಿಮೆ", hi: "कम" },
  "sim.water.moderate": { en: "Moderate", kn: "ಮಧ್ಯಮ", hi: "मध्यम" },
  "sim.water.high": { en: "High", kn: "ಹೆಚ್ಚು", hi: "अधिक" },
  "sim.water.low.note": {
    en: "Rain-fed or very limited irrigation.",
    kn: "ಮಳೆಯಾಧಾರಿತ ಅಥವಾ ಬಹಳ ಸೀಮಿತ ನೀರಾವರಿ.",
    hi: "वर्षा आधारित या अत्यंत सीमित सिंचाई।",
  },
  "sim.water.moderate.note": {
    en: "Some irrigation available in most seasons.",
    kn: "ಬಹುತೇಕ ಋತುಗಳಲ್ಲಿ ಸ್ವಲ್ಪ ನೀರಾವರಿ ಲಭ್ಯ.",
    hi: "अधिकांश मौसमों में कुछ सिंचाई उपलब्ध।",
  },
  "sim.water.high.note": {
    en: "Assured irrigation through the season.",
    kn: "ಋತುವಿಡೀ ಖಾತರಿಯ ನೀರಾವರಿ.",
    hi: "पूरे मौसम निश्चित सिंचाई।",
  },
  "sim.changed.title": {
    en: "Parameters changed in this scenario",
    kn: "ಈ ಸನ್ನಿವೇಶದಲ್ಲಿ ಬದಲಾದ ಪರಾಮಿತಿಗಳು",
    hi: "इस परिदृश्य में बदले पैरामीटर",
  },
  "sim.changed.none": {
    en: "None yet. The results on the right currently match your measured report.",
    kn: "ಇನ್ನೂ ಯಾವುದೂ ಇಲ್ಲ. ಬಲಗಡೆಯ ಫಲಿತಾಂಶಗಳು ಈಗ ನಿಮ್ಮ ಅಳತೆ ವರದಿಗೆ ಹೊಂದುತ್ತವೆ.",
    hi: "अभी कुछ नहीं। दाईं ओर के परिणाम अभी आपकी मापी रिपोर्ट से मेल खाते हैं।",
  },
  "sim.results.title": { en: "Measured vs hypothetical", kn: "ಅಳತೆ vs ಕಾಲ್ಪನಿಕ", hi: "मापा बनाम काल्पनिक" },
  "sim.results.note": {
    en: "Suitability changes only where a documented rule fires differently. Unchanged rows mean the scenario did not touch that crop's constraints.",
    kn: "ದಾಖಲಿತ ನಿಯಮ ಬೇರೆ ರೀತಿ ಅನ್ವಯಿಸಿದಾಗ ಮಾತ್ರ ಹೊಂದಾಣಿಕೆ ಬದಲಾಗುತ್ತದೆ. ಬದಲಾಗದ ಸಾಲುಗಳು ಸನ್ನಿವೇಶ ಆ ಬೆಳೆಯ ಮಿತಿಗಳನ್ನು ಸ್ಪರ್ಶಿಸಿಲ್ಲ ಎಂದು ಅರ್ಥ.",
    hi: "उपयुक्तता केवल तब बदलती है जब कोई प्रलेखित नियम अलग तरह लागू हो। अपरिवर्तित पंक्तियाँ दिखाती हैं कि परिदृश्य ने उस फसल की सीमाओं को नहीं छुआ।",
  },
  "sim.improved": { en: "Improved", kn: "ಸುಧಾರಿಸಿದೆ", hi: "सुधरा" },
  "sim.reduced": { en: "Reduced", kn: "ಕಡಿಮೆಯಾಗಿದೆ", hi: "घटा" },
  "sim.newConstraint": { en: "New constraint:", kn: "ಹೊಸ ಮಿತಿ:", hi: "नई सीमा:" },
  "sim.resolved": { en: "No longer triggered:", kn: "ಇನ್ನು ಅನ್ವಯಿಸುವುದಿಲ್ಲ:", hi: "अब लागू नहीं:" },
  "sim.noChange": {
    en: "No change from the measured scenario.",
    kn: "ಅಳೆದ ಸನ್ನಿವೇಶದಿಂದ ಯಾವುದೇ ಬದಲಾವಣೆ ಇಲ್ಲ.",
    hi: "मापे गए परिदृश्य से कोई बदलाव नहीं।",
  },
  "sim.stillMissing": { en: "Still missing: {list}", kn: "ಇನ್ನೂ ಇಲ್ಲ: {list}", hi: "अभी अनुपलब्ध: {list}" },
  "sim.waterCheck.title": { en: "Water reality check", kn: "ನೀರಿನ ವಾಸ್ತವ ಪರಿಶೀಲನೆ", hi: "जल वास्तविकता जाँच" },
  "sim.waterCheck.note": {
    en: "This compares your declared availability with each crop's documented water need. It is a stated input, not a soil result, and it does not model rainfall or irrigation scheduling.",
    kn: "ಇದು ನೀವು ಘೋಷಿಸಿದ ಲಭ್ಯತೆಯನ್ನು ಪ್ರತಿ ಬೆಳೆಯ ದಾಖಲಿತ ನೀರಿನ ಅಗತ್ಯದೊಂದಿಗೆ ಹೋಲಿಸುತ್ತದೆ. ಇದು ನೀಡಿದ ಮಾಹಿತಿ, ಮಣ್ಣಿನ ಫಲಿತಾಂಶ ಅಲ್ಲ; ಮಳೆ ಅಥವಾ ನೀರಾವರಿ ಯೋಜನೆಯನ್ನು ಮಾಡೆಲ್ ಮಾಡುವುದಿಲ್ಲ.",
    hi: "यह आपकी घोषित उपलब्धता की तुलना प्रत्येक फसल की प्रलेखित जल आवश्यकता से करता है। यह दिया गया इनपुट है, मृदा परिणाम नहीं; वर्षा या सिंचाई कार्यक्रम का मॉडल नहीं।",
  },
  "sim.waterCheck.empty": {
    en: "Choose a water availability level on the left to compare water needs.",
    kn: "ನೀರಿನ ಅಗತ್ಯಗಳನ್ನು ಹೋಲಿಸಲು ಎಡಗಡೆ ನೀರಿನ ಲಭ್ಯತೆ ಆಯ್ಕೆಮಾಡಿ.",
    hi: "जल आवश्यकताओं की तुलना के लिए बाईं ओर जल उपलब्धता स्तर चुनें।",
  },
  "sim.next.title": { en: "Next step", kn: "ಮುಂದಿನ ಹಂತ", hi: "अगला चरण" },
  "sim.next.body": {
    en: "A scenario is most useful as a question for an expert: “If my phosphorus were in this range, which crop options and management practices would you consider for my district?” Carry the scenario into the decision report, or explain it in your preferred language.",
    kn: "ಸನ್ನಿವೇಶವು ತಜ್ಞರಿಗೆ ಕೇಳುವ ಪ್ರಶ್ನೆಯಾಗಿ ಹೆಚ್ಚು ಉಪಯುಕ್ತ: “ನನ್ನ ರಂಜಕ ಈ ಶ್ರೇಣಿಯಲ್ಲಿದ್ದರೆ, ನನ್ನ ಜಿಲ್ಲೆಗೆ ಯಾವ ಬೆಳೆ ಆಯ್ಕೆಗಳು ಮತ್ತು ನಿರ್ವಹಣಾ ಕ್ರಮಗಳನ್ನು ಪರಿಗಣಿಸುತ್ತೀರಿ?” ಸನ್ನಿವೇಶವನ್ನು ನಿರ್ಧಾರ ವರದಿಗೆ ಸೇರಿಸಿ ಅಥವಾ ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ವಿವರಿಸಿ.",
    hi: "परिदृश्य विशेषज्ञ से पूछे गए प्रश्न के रूप में सबसे उपयोगी है: “यदि मेरा फॉस्फोरस इस श्रेणी में हो, तो मेरे जिले के लिए कौन-सी फसलें और प्रबंधन उपाय उचित मानेंगे?” परिदृश्य को निर्णय रिपोर्ट में जोड़ें या अपनी भाषा में समझें।",
  },
  "sim.next.compare": { en: "Compare measured crops", kn: "ಅಳೆದ ಬೆಳೆಗಳನ್ನು ಹೋಲಿಸಿ", hi: "मापी फसलों की तुलना" },

  "sim.hint.pH": {
    en: "Acidity or alkalinity of the soil solution.",
    kn: "ಮಣ್ಣಿನ ದ್ರಾವಣದ ಆಮ್ಲೀಯತೆ ಅಥವಾ ಕ್ಷಾರೀಯತೆ.",
    hi: "मृदा विलयन की अम्लता या क्षारीयता।",
  },
  "sim.hint.nitrogen": {
    en: "Available nitrogen as reported by the laboratory.",
    kn: "ಪ್ರಯೋಗಾಲಯ ವರದಿ ಮಾಡಿದ ಲಭ್ಯ ಸಾರಜನಕ.",
    hi: "प्रयोगशाला द्वारा दर्ज उपलब्ध नाइट्रोजन।",
  },
  "sim.hint.phosphorus": {
    en: "Available phosphorus (Olsen-type extraction).",
    kn: "ಲಭ್ಯ ರಂಜಕ (ಓಲ್ಸನ್ ಮಾದರಿಯ ಹೊರತೆಗೆಯುವಿಕೆ).",
    hi: "उपलब्ध फॉस्फोरस (ओल्सन प्रकार निष्कर्षण)।",
  },
  "sim.hint.potassium": {
    en: "Exchangeable potassium.",
    kn: "ವಿನಿಮಯ ಸಾಧ್ಯ ಪೊಟ್ಯಾಸಿಯಮ್.",
    hi: "विनिमेय पोटैशियम।",
  },
  "sim.hint.organicCarbon": {
    en: "Organic carbon percentage.",
    kn: "ಸಾವಯವ ಇಂಗಾಲದ ಶೇಕಡಾವಾರು.",
    hi: "जैविक कार्बन प्रतिशत।",
  },
  "sim.hint.electricalConductivity": {
    en: "Salinity indicator in dS/m.",
    kn: "dS/m ನಲ್ಲಿ ಲವಣಾಂಶ ಸೂಚಕ.",
    hi: "dS/m में लवणता संकेतक।",
  },

  "water.unknown": {
    en: "Water availability not provided. Soil results alone do not determine water suitability.",
    kn: "ನೀರಿನ ಲಭ್ಯತೆ ನೀಡಿಲ್ಲ. ಮಣ್ಣಿನ ಫಲಿತಾಂಶಗಳಿಂದ ಮಾತ್ರ ನೀರಿನ ಹೊಂದಾಣಿಕೆ ನಿರ್ಣಯಿಸಲಾಗದು.",
    hi: "जल उपलब्धता नहीं दी गई। केवल मृदा परिणामों से जल उपयुक्तता तय नहीं होती।",
  },
  "water.adequate": {
    en: "Declared water availability ({available}) meets the documented {need} water need.",
    kn: "ಘೋಷಿಸಿದ ನೀರಿನ ಲಭ್ಯತೆ ({available}) ದಾಖಲಿತ {need} ನೀರಿನ ಅಗತ್ಯಕ್ಕೆ ಸರಿಹೊಂದುತ್ತದೆ.",
    hi: "घोषित जल उपलब्धता ({available}) प्रलेखित {need} जल आवश्यकता को पूरा करती है।",
  },
  "water.marginal": {
    en: "Crop is documented as {need} water need; declared availability is {available}. Irrigation or a lower-water option may be needed.",
    kn: "ಬೆಳೆಗೆ ದಾಖಲಿತ ಅಗತ್ಯ {need}; ಘೋಷಿಸಿದ ಲಭ್ಯತೆ {available}. ನೀರಾವರಿ ಅಥವಾ ಕಡಿಮೆ ನೀರಿನ ಆಯ್ಕೆ ಬೇಕಾಗಬಹುದು.",
    hi: "फसल की प्रलेखित आवश्यकता {need}; घोषित उपलब्धता {available}। सिंचाई या कम जल वाला विकल्प आवश्यक हो सकता है।",
  },
  "water.insufficient": {
    en: "Documented {need} water need is well above declared {available} availability. This is a major practical constraint, not a soil constraint.",
    kn: "ದಾಖಲಿತ {need} ನೀರಿನ ಅಗತ್ಯ ಘೋಷಿಸಿದ {available} ಲಭ್ಯತೆಗಿಂತ ಬಹಳ ಹೆಚ್ಚು. ಇದು ಮಣ್ಣಿನ ಮಿತಿಯಲ್ಲ, ಪ್ರಮುಖ ಪ್ರಾಯೋಗಿಕ ಮಿತಿ.",
    hi: "प्रलेखित {need} जल आवश्यकता घोषित {available} उपलब्धता से कहीं अधिक है। यह मृदा की नहीं, बड़ी व्यावहारिक सीमा है।",
  },
};
