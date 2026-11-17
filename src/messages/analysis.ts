import type { MessageTable } from "./types";

export const analysisMessages: MessageTable = {
  "analysis.eyebrow": {
    en: "Step 2 · Soil intelligence",
    kn: "ಹಂತ 2 · ಮಣ್ಣಿನ ವಿಶ್ಲೇಷಣೆ",
    hi: "चरण 2 · मृदा बुद्धिमत्ता",
  },
  "analysis.title": {
    en: "What your soil supports",
    kn: "ನಿಮ್ಮ ಮಣ್ಣು ಏನನ್ನು ಬೆಂಬಲಿಸುತ್ತದೆ",
    hi: "आपकी मृदा क्या समर्थन देती है",
  },
  "analysis.description": {
    en: "Each measurement is compared with documented reference ranges. Results explain which factors help, which constrain, and what information is still missing.",
    kn: "ಪ್ರತಿ ಅಳತೆಯನ್ನು ದಾಖಲಿತ ಉಲ್ಲೇಖ ಶ್ರೇಣಿಗಳೊಂದಿಗೆ ಹೋಲಿಸಲಾಗುತ್ತದೆ. ಯಾವ ಅಂಶಗಳು ಸಹಾಯ ಮಾಡುತ್ತವೆ, ಯಾವುವು ಮಿತಿ ಹಾಕುತ್ತವೆ ಮತ್ತು ಯಾವ ಮಾಹಿತಿ ಇನ್ನೂ ಇಲ್ಲ ಎಂಬುದನ್ನು ಫಲಿತಾಂಶ ತಿಳಿಸುತ್ತದೆ.",
    hi: "प्रत्येक माप की तुलना प्रलेखित संदर्भ श्रेणियों से की जाती है। परिणाम बताते हैं कि कौन-से कारक सहायक हैं, कौन-से सीमित करते हैं और कौन-सी जानकारी अभी अनुपलब्ध है।",
  },
  "analysis.notice.purpose": {
    en: "The soil intelligence engine",
    kn: "ಮಣ್ಣಿನ ವಿಶ್ಲೇಷಣ ಎಂಜಿನ್",
    hi: "मृदा बुद्धिमत्ता इंजन",
  },

  "analysis.card.provided": {
    en: "Measurements provided",
    kn: "ಲಭ್ಯವಿರುವ ಅಳತೆಗಳು",
    hi: "उपलब्ध माप",
  },
  "analysis.card.providedAll": {
    en: "All tracked parameters present.",
    kn: "ಎಲ್ಲಾ ಪರಾಮಿತಿಗಳು ಲಭ್ಯವಿವೆ.",
    hi: "सभी ट्रैक किए गए पैरामीटर उपलब्ध हैं।",
  },
  "analysis.card.providedMissing": {
    en: "{count} parameter not reported.",
    kn: "{count} ಪರಾಮಿತಿ ವರದಿಯಾಗಿಲ್ಲ.",
    hi: "{count} पैरामीटर दर्ज नहीं है।",
  },
  "analysis.card.confidence": { en: "Report confidence", kn: "ವರದಿಯ ವಿಶ್ವಾಸ", hi: "रिपोर्ट विश्वास" },
  "analysis.card.confidenceNote": {
    en: "Based on coverage and validation flags, not on laboratory accreditation.",
    kn: "ಇದು ಲಭ್ಯತೆ ಮತ್ತು ಪರಿಶೀಲನಾ ಸೂಚನೆಗಳ ಮೇಲೆ ಆಧಾರಿತ; ಪ್ರಯೋಗಾಲಯ ಮಾನ್ಯತೆ ಅಲ್ಲ.",
    hi: "यह कवरेज और सत्यापन संकेतों पर आधारित है, प्रयोगशाला मान्यता पर नहीं।",
  },
  "analysis.card.best": { en: "Strongest soil fit", kn: "ಅತ್ಯುತ್ತಮ ಹೊಂದಾಣಿಕೆ", hi: "सर्वोत्तम मृदा अनुकूलता" },
  "analysis.card.bestNote": {
    en: "Among the compared crops only, at {pct}% completeness.",
    kn: "ಹೋಲಿಸಿದ ಬೆಳೆಗಳಲ್ಲಿ ಮಾತ್ರ, {pct}% ಮಾಹಿತಿ ಪೂರ್ಣತೆಯೊಂದಿಗೆ.",
    hi: "केवल तुलना की गई फसलों में, {pct}% डेटा पूर्णता के साथ।",
  },
  "analysis.card.noneSelected": {
    en: "No crops selected.",
    kn: "ಯಾವುದೇ ಬೆಳೆ ಆಯ್ಕೆಯಾಗಿಲ್ಲ.",
    hi: "कोई फसल चयनित नहीं।",
  },
  "analysis.card.withConstraints": {
    en: "Crops with constraints",
    kn: "ಮಿತಿಗಳಿರುವ ಬೆಳೆಗಳು",
    hi: "सीमाओं वाली फसलें",
  },
  "analysis.card.withConstraintsNote": {
    en: "At least one measured value near or outside a range.",
    kn: "ಕನಿಷ್ಠ ಒಂದು ಅಳತೆ ಶ್ರೇಣಿಯ ಬಳಿ ಅಥವಾ ಹೊರಗಿದೆ.",
    hi: "कम से कम एक माप श्रेणी के पास या बाहर है।",
  },

  "analysis.warnings.title": {
    en: "Data notes carried into the analysis",
    kn: "ವಿಶ್ಲೇಷಣೆಗೆ ಸೇರಿಸಿದ ಡೇಟಾ ಟಿಪ್ಪಣಿಗಳು",
    hi: "विश्लेषण में शामिल डेटा टिप्पणियाँ",
  },
  "analysis.warnings.more": {
    en: "Plus {count} more notes.",
    kn: "ಇದಲ್ಲದೆ {count} ಟಿಪ್ಪಣಿಗಳಿವೆ.",
    hi: "इसके अतिरिक्त {count} टिप्पणियाँ और हैं।",
  },

  "analysis.profile.title": { en: "Validated soil profile", kn: "ಪರಿಶೀಲಿತ ಮಣ್ಣಿನ ವಿವರ", hi: "सत्यापित मृदा विवरण" },
  "analysis.missing.title": {
    en: "Missing or unverified",
    kn: "ಕಾಣೆಯಾದ ಅಥವಾ ಪರಿಶೀಲಿಸದ",
    hi: "अनुपलब्ध या असत्यापित",
  },
  "analysis.missing.allPresent": {
    en: "All six tracked parameters are present and no value is flagged.",
    kn: "ಎಲ್ಲಾ ಆರು ಪರಾಮಿತಿಗಳು ಲಭ್ಯವಿವೆ ಮತ್ತು ಯಾವುದೇ ಮೌಲ್ಯ ಗುರುತಿಸಲ್ಪಟ್ಟಿಲ್ಲ.",
    hi: "सभी छह पैरामीटर उपलब्ध हैं और कोई मान चिह्नित नहीं है।",
  },
  "analysis.missing.notReported": {
    en: "{param}: not reported. Crops needing it are marked insufficient-data.",
    kn: "{param}: ವರದಿಯಾಗಿಲ್ಲ. ಇದನ್ನು ಅಗತ್ಯವಿರುವ ಬೆಳೆಗಳನ್ನು ಅಪರ್ಯಾಪ್ತ ಮಾಹಿತಿ ಎಂದು ಗುರುತಿಸಲಾಗಿದೆ.",
    hi: "{param}: दर्ज नहीं। इसे आवश्यक मानने वाली फसलें अपर्याप्त डेटा के रूप में चिह्नित हैं।",
  },
  "analysis.missing.flagged": {
    en: "{param}: value present but flagged for verification.",
    kn: "{param}: ಮೌಲ್ಯ ಇದೆ, ಆದರೆ ಪರಿಶೀಲನೆಗೆ ಗುರುತಿಸಲಾಗಿದೆ.",
    hi: "{param}: मान मौजूद है, पर सत्यापन के लिए चिह्नित है।",
  },

  "analysis.unknown.title": {
    en: "What this engine does not know",
    kn: "ಈ ಎಂಜಿನ್‌ಗೆ ತಿಳಿಯದಿರುವ ಅಂಶಗಳು",
    hi: "यह इंजन क्या नहीं जानता",
  },
  "analysis.unknown.rain": { en: "Rainfall, temperature, and season.", kn: "ಮಳೆ, ತಾಪಮಾನ ಮತ್ತು ಋತು.", hi: "वर्षा, तापमान और मौसम।" },
  "analysis.unknown.variety": {
    en: "Variety or hybrid nutrient demand.",
    kn: "ತಳಿ ಅಥವಾ ಹೈಬ್ರಿಡ್‌ನ ಪೋಷಕಾಂಶ ಅಗತ್ಯ.",
    hi: "किस्म या हाइब्रिड की पोषक तत्व आवश्यकता।",
  },
  "analysis.unknown.soil": {
    en: "Soil depth, drainage, and texture class in calculations.",
    kn: "ಮಣ್ಣಿನ ಆಳ, ಒಳಚರಂಡಿ ಮತ್ತು ವಿನ್ಯಾಸ ವರ್ಗ ಲೆಕ್ಕಕ್ಕೆ ಸೇರಿಲ್ಲ.",
    hi: "गणना में मृदा गहराई, जल निकास और बनावट वर्ग शामिल नहीं।",
  },
  "analysis.unknown.micro": {
    en: "Micronutrients, Ca/Mg, CEC, and organic matter quality.",
    kn: "ಸೂಕ್ಷ್ಮ ಪೋಷಕಾಂಶಗಳು, Ca/Mg, CEC ಮತ್ತು ಸಾವಯವ ಪದಾರ್ಥದ ಗುಣಮಟ್ಟ.",
    hi: "सूक्ष्म पोषक तत्व, Ca/Mg, CEC और जैविक पदार्थ की गुणवत्ता।",
  },
  "analysis.unknown.market": {
    en: "Pests, labour, and market conditions.",
    kn: "ಕೀಟಗಳು, ಕಾರ್ಮಿಕ ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಪರಿಸ್ಥಿತಿ.",
    hi: "कीट, श्रम और बाज़ार स्थिति।",
  },
  "analysis.unknown.note": {
    en: "These are stated as assumptions, not silently modelled.",
    kn: "ಇವು ಊಹೆಗಳಾಗಿ ಸ್ಪಷ್ಟವಾಗಿ ತಿಳಿಸಲಾಗಿದೆ, ರಹಸ್ಯವಾಗಿ ಮಾಡೆಲ್ ಮಾಡಿಲ್ಲ.",
    hi: "ये धारणाओं के रूप में स्पष्ट हैं, चुपचाप मॉडल नहीं किए गए।",
  },

  "analysis.next.title": { en: "Next: test a decision", kn: "ಮುಂದೆ: ನಿರ್ಧಾರ ಪರೀಕ್ಷಿಸಿ", hi: "अगला: निर्णय जाँचें" },
  "analysis.next.body": {
    en: "Change pH or nutrient levels hypothetically and see exactly which constraints move.",
    kn: "pH ಅಥವಾ ಪೋಷಕಾಂಶ ಮಟ್ಟವನ್ನು ಕಾಲ್ಪನಿಕವಾಗಿ ಬದಲಿಸಿ, ಯಾವ ಮಿತಿಗಳು ಬದಲಾಗುತ್ತವೆ ಎಂದು ನೋಡಿ.",
    hi: "pH या पोषक तत्व स्तर काल्पनिक रूप से बदलें और देखें कौन-सी सीमाएँ बदलती हैं।",
  },

  "analysis.matrix.title": {
    en: "Parameter status by crop",
    kn: "ಬೆಳೆವಾರು ಪರಾಮಿತಿ ಸ್ಥಿತಿ",
    hi: "फसल के अनुसार पैरामीटर स्थिति",
  },
  "analysis.matrix.note": {
    en: "How each of the six parameters classifies for every compared crop.",
    kn: "ಪ್ರತಿ ಹೋಲಿಸಿದ ಬೆಳೆಗೆ ಆರು ಪರಾಮಿತಿಗಳು ಹೇಗೆ ವರ್ಗೀಕರಿಸುತ್ತವೆ.",
    hi: "प्रत्येक तुलना की गई फसल के लिए छह पैरामीटर कैसे वर्गीकृत होते हैं।",
  },
  "analysis.suitability.title": { en: "Crop suitability", kn: "ಬೆಳೆ ಹೊಂದಾಣಿಕೆ", hi: "फसल उपयुक्तता" },
  "analysis.suitability.note": {
    en: "Compared crops only. Suitability reflects alignment with reference ranges, not expected yield.",
    kn: "ಹೋಲಿಸಿದ ಬೆಳೆಗಳಿಗೆ ಮಾತ್ರ. ಹೊಂದಾಣಿಕೆ ಉಲ್ಲೇಖ ಶ್ರೇಣಿಗಳಿಗೆ ಹೊಂದುವುದನ್ನು ತೋರಿಸುತ್ತದೆ, ನಿರೀಕ್ಷಿತ ಇಳುವರಿ ಅಲ್ಲ.",
    hi: "केवल तुलना की गई फसलें। उपयुक्तता संदर्भ श्रेणियों के अनुरूपता दर्शाती है, अपेक्षित उपज नहीं।",
  },
  "analysis.suitability.link": { en: "Open full comparison", kn: "ಪೂರ್ಣ ಹೋಲಿಕೆ ತೆರೆಯಿರಿ", hi: "पूरी तुलना खोलें" },

  "analysis.howTo.title": { en: "How to use this page", kn: "ಈ ಪುಟವನ್ನು ಹೇಗೆ ಬಳಸುವುದು", hi: "इस पृष्ठ का उपयोग कैसे करें" },
  "analysis.howTo.body": {
    en: "Treat the suitability label as a starting point for a conversation with your local agriculture officer or KVK. It cannot account for rainfall, variety, or management, and no result here guarantees yield or profit.",
    kn: "ಹೊಂದಾಣಿಕೆಯ ಲೇಬಲ್ ಅನ್ನು ಸ್ಥಳೀಯ ಕೃಷಿ ಅಧಿಕಾರಿ ಅಥವಾ KVK ಜೊತೆ ಮಾತುಕತೆಗೆ ಆರಂಭ ಬಿಂದುವಾಗಿ ಪರಿಗಣಿಸಿ. ಇದು ಮಳೆ, ತಳಿ ಅಥವಾ ನಿರ್ವಹಣೆಯನ್ನು ಗಣನೆಗೆ ತೆಗೆದುಕೊಳ್ಳಲಾರದು; ಇಲ್ಲಿ ಯಾವ ಫಲಿತಾಂಶವೂ ಇಳುವರಿ ಅಥವಾ ಲಾಭದ ಭರವಸೆ ನೀಡುವುದಿಲ್ಲ.",
    hi: "उपयुक्तता लेबल को स्थानीय कृषि अधिकारी या KVK से बातचीत की शुरुआत मानें। यह वर्षा, किस्म या प्रबंधन को ध्यान में नहीं रख सकता, और यहाँ कोई परिणाम उपज या लाभ की गारंटी नहीं देता।",
  },
};
