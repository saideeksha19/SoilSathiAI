import type { MessageTable } from "./types";

/** Domain vocabulary shared by the engine output and every screen. */
export const domainMessages: MessageTable = {
  "param.pH": { en: "Soil pH", kn: "ಮಣ್ಣಿನ pH", hi: "मृदा pH" },
  "param.nitrogen": { en: "Nitrogen (N)", kn: "ಸಾರಜನಕ (N)", hi: "नाइट्रोजन (N)" },
  "param.phosphorus": { en: "Phosphorus (P)", kn: "ರಂಜಕ (P)", hi: "फॉस्फोरस (P)" },
  "param.potassium": { en: "Potassium (K)", kn: "ಪೊಟ್ಯಾಸಿಯಮ್ (K)", hi: "पोटैशियम (K)" },
  "param.organicCarbon": { en: "Organic Carbon", kn: "ಸಾವಯವ ಇಂಗಾಲ", hi: "जैविक कार्बन" },
  "param.electricalConductivity": {
    en: "Electrical Conductivity",
    kn: "ವಿದ್ಯುತ್ ವಾಹಕತೆ",
    hi: "विद्युत चालकता",
  },

  "status.optimal": { en: "Optimal", kn: "ಉತ್ತಮ", hi: "उत्तम" },
  "status.acceptable": { en: "Acceptable", kn: "ಸ್ವೀಕಾರಾರ್ಹ", hi: "स्वीकार्य" },
  "status.marginal": { en: "Marginal", kn: "ಗಡಿ ಮಟ್ಟ", hi: "सीमांत" },
  "status.unsuitable": { en: "Outside range", kn: "ಶ್ರೇಣಿಯ ಹೊರಗೆ", hi: "श्रेणी से बाहर" },
  "status.missing": { en: "Missing", kn: "ಕಾಣೆಯಾಗಿದೆ", hi: "अनुपलब्ध" },
  "status.unreliable": { en: "Verify", kn: "ಪರಿಶೀಲಿಸಿ", hi: "सत्यापित करें" },

  "suitability.well-suited": { en: "Well suited", kn: "ಉತ್ತಮ ಹೊಂದಾಣಿಕೆ", hi: "अच्छी उपयुक्तता" },
  "suitability.moderately-suited": {
    en: "Moderately suited",
    kn: "ಮಧ್ಯಮ ಹೊಂದಾಣಿಕೆ",
    hi: "मध्यम उपयुक्तता",
  },
  "suitability.limited": { en: "Limited", kn: "ಸೀಮಿತ", hi: "सीमित" },
  "suitability.insufficient-data": {
    en: "Insufficient data",
    kn: "ಸಾಕಷ್ಟು ಮಾಹಿತಿ ಇಲ್ಲ",
    hi: "अपर्याप्त डेटा",
  },

  "confidence.high": { en: "High confidence", kn: "ಹೆಚ್ಚಿನ ವಿಶ್ವಾಸ", hi: "उच्च विश्वास" },
  "confidence.medium": { en: "Medium confidence", kn: "ಮಧ್ಯಮ ವಿಶ್ವಾಸ", hi: "मध्यम विश्वास" },
  "confidence.low": { en: "Low confidence", kn: "ಕಡಿಮೆ ವಿಶ್ವಾಸ", hi: "निम्न विश्वास" },

  "source.sample": { en: "Sample", kn: "ಮಾದರಿ", hi: "नमूना" },
  "source.manual": { en: "User entered", kn: "ಬಳಕೆದಾರ ನಮೂದು", hi: "उपयोगकर्ता द्वारा दर्ज" },
  "source.extracted": { en: "AI extracted", kn: "AI ಮೂಲಕ ಹೊರತೆಗೆದದ್ದು", hi: "AI द्वारा निकाला" },
  "source.simulated": { en: "Hypothetical", kn: "ಕಾಲ್ಪನಿಕ", hi: "काल्पनिक" },

  "water.low": { en: "Low water need", kn: "ಕಡಿಮೆ ನೀರಿನ ಅಗತ್ಯ", hi: "कम जल आवश्यकता" },
  "water.moderate": { en: "Moderate water need", kn: "ಮಧ್ಯಮ ನೀರಿನ ಅಗತ್ಯ", hi: "मध्यम जल आवश्यकता" },
  "water.high": { en: "High water need", kn: "ಹೆಚ್ಚು ನೀರಿನ ಅಗತ್ಯ", hi: "अधिक जल आवश्यकता" },

  "verification.verified": { en: "Verified source", kn: "ಪರಿಶೀಲಿತ ಮೂಲ", hi: "सत्यापित स्रोत" },
  "verification.derived": {
    en: "Derived from source",
    kn: "ಮೂಲದಿಂದ ವ್ಯುತ್ಪನ್ನ",
    hi: "स्रोत से व्युत्पन्न",
  },
  "verification.unverified": { en: "Unverified", kn: "ಪರಿಶೀಲಿಸದ", hi: "असत्यापित" },

  "assess.noRange": {
    en: "No specific reference range defined for this crop in the current dataset.",
    kn: "ಈ ಬೆಳೆಗೆ ಪ್ರಸ್ತುತ ದತ್ತಾಂಶದಲ್ಲಿ ನಿರ್ದಿಷ್ಟ ಉಲ್ಲೇಖ ಶ್ರೇಣಿ ನಿಗದಿಪಡಿಸಿಲ್ಲ.",
    hi: "इस फसल के लिए वर्तमान डेटासेट में कोई विशिष्ट संदर्भ श्रेणी परिभाषित नहीं है।",
  },
  "assess.missing": {
    en: "Measurement missing; suitability cannot be fully assessed for this parameter.",
    kn: "ಅಳತೆ ಇಲ್ಲ; ಈ ಪರಾಮಿತಿಯ ಹೊಂದಾಣಿಕೆಯನ್ನು ಪೂರ್ಣವಾಗಿ ನಿರ್ಣಯಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.",
    hi: "माप उपलब्ध नहीं; इस पैरामीटर के लिए उपयुक्तता पूरी तरह आँकी नहीं जा सकती।",
  },
  "assess.unreliable": {
    en: "Measurement present but flagged low-confidence/out-of-range; verify before decisions.",
    kn: "ಅಳತೆ ಇದೆ, ಆದರೆ ಕಡಿಮೆ ವಿಶ್ವಾಸ/ಶ್ರೇಣಿಯ ಹೊರಗೆ ಎಂದು ಗುರುತಿಸಲಾಗಿದೆ; ನಿರ್ಧಾರಕ್ಕೂ ಮೊದಲು ಪರಿಶೀಲಿಸಿ.",
    hi: "माप मौजूद है, पर कम विश्वास/श्रेणी से बाहर के रूप में चिह्नित है; निर्णय से पहले सत्यापित करें।",
  },
  "assess.belowMin": {
    en: "Below documented minimum ({min} {unit}). May limit suitability.",
    kn: "ದಾಖಲಿತ ಕನಿಷ್ಠ ಮಟ್ಟಕ್ಕಿಂತ ಕಡಿಮೆ ({min} {unit}). ಹೊಂದಾಣಿಕೆಗೆ ಮಿತಿಯಾಗಬಹುದು.",
    hi: "प्रलेखित न्यूनतम ({min} {unit}) से कम। उपयुक्तता सीमित कर सकता है।",
  },
  "assess.aboveMax": {
    en: "Above documented maximum ({max} {unit}). May limit suitability.",
    kn: "ದಾಖಲಿತ ಗರಿಷ್ಠ ಮಟ್ಟಕ್ಕಿಂತ ಹೆಚ್ಚು ({max} {unit}). ಹೊಂದಾಣಿಕೆಗೆ ಮಿತಿಯಾಗಬಹುದು.",
    hi: "प्रलेखित अधिकतम ({max} {unit}) से अधिक। उपयुक्तता सीमित कर सकता है।",
  },
  "assess.optimal": {
    en: "Within documented optimal range.",
    kn: "ದಾಖಲಿತ ಉತ್ತಮ ಶ್ರೇಣಿಯೊಳಗಿದೆ.",
    hi: "प्रलेखित उत्तम श्रेणी के भीतर है।",
  },
  "assess.slightlyBelowOptimal": {
    en: "Slightly below optimal range ({optimalMin} {unit}).",
    kn: "ಉತ್ತಮ ಶ್ರೇಣಿಗಿಂತ ಸ್ವಲ್ಪ ಕಡಿಮೆ ({optimalMin} {unit}).",
    hi: "उत्तम श्रेणी से थोड़ा कम ({optimalMin} {unit})।",
  },
  "assess.belowOptimal": {
    en: "Below optimal range but within documented tolerance.",
    kn: "ಉತ್ತಮ ಶ್ರೇಣಿಗಿಂತ ಕಡಿಮೆ, ಆದರೆ ದಾಖಲಿತ ಸಹನಾ ಮಟ್ಟದೊಳಗಿದೆ.",
    hi: "उत्तम श्रेणी से कम, पर प्रलेखित सहनशीलता के भीतर।",
  },
  "assess.slightlyAboveOptimal": {
    en: "Slightly above optimal range ({optimalMax} {unit}).",
    kn: "ಉತ್ತಮ ಶ್ರೇಣಿಗಿಂತ ಸ್ವಲ್ಪ ಹೆಚ್ಚು ({optimalMax} {unit}).",
    hi: "उत्तम श्रेणी से थोड़ा अधिक ({optimalMax} {unit})।",
  },
  "assess.aboveOptimal": {
    en: "Above optimal range but within documented tolerance.",
    kn: "ಉತ್ತಮ ಶ್ರೇಣಿಗಿಂತ ಹೆಚ್ಚು, ಆದರೆ ದಾಖಲಿತ ಸಹನಾ ಮಟ್ಟದೊಳಗಿದೆ.",
    hi: "उत्तम श्रेणी से अधिक, पर प्रलेखित सहनशीलता के भीतर।",
  },
  "assess.withinTolerance": {
    en: "Within documented tolerance.",
    kn: "ದಾಖಲಿತ ಸಹನಾ ಮಟ್ಟದೊಳಗಿದೆ.",
    hi: "प्रलेखित सहनशीलता के भीतर।",
  },

  "why.insufficient": {
    en: "Key required measurements are missing or unreliable, so a confident comparison is not possible.",
    kn: "ಅಗತ್ಯವಾದ ಪ್ರಮುಖ ಅಳತೆಗಳು ಇಲ್ಲ ಅಥವಾ ಅವಿಶ್ವಸನೀಯ, ಆದ್ದರಿಂದ ನಂಬಲರ್ಹ ಹೋಲಿಕೆ ಸಾಧ್ಯವಿಲ್ಲ.",
    hi: "आवश्यक प्रमुख माप अनुपलब्ध या अविश्वसनीय हैं, इसलिए भरोसेमंद तुलना संभव नहीं।",
  },
  "why.unsuitable": {
    en: "{count} parameter(s) fall outside the documented tolerance range for this crop.",
    kn: "ಈ ಬೆಳೆಗೆ ದಾಖಲಿತ ಸಹನಾ ಶ್ರೇಣಿಯ ಹೊರಗೆ {count} ಪರಾಮಿತಿಗಳಿವೆ.",
    hi: "इस फसल की प्रलेखित सहनशीलता श्रेणी से {count} पैरामीटर बाहर हैं।",
  },
  "why.marginal": {
    en: "{count} parameter(s) are near the edge of the optimal range.",
    kn: "{count} ಪರಾಮಿತಿಗಳು ಉತ್ತಮ ಶ್ರೇಣಿಯ ಅಂಚಿನಲ್ಲಿವೆ.",
    hi: "{count} पैरामीटर उत्तम श्रेणी के किनारे हैं।",
  },
  "why.optimal": {
    en: "{count} parameter(s) are within the documented optimal range.",
    kn: "{count} ಪರಾಮಿತಿಗಳು ದಾಖಲಿತ ಉತ್ತಮ ಶ್ರೇಣಿಯೊಳಗಿವೆ.",
    hi: "{count} पैरामीटर प्रलेखित उत्तम श्रेणी में हैं।",
  },
  "why.water": {
    en: "Water need: {need} — {note}.",
    kn: "ನೀರಿನ ಅಗತ್ಯ: {need} — {note}.",
    hi: "जल आवश्यकता: {need} — {note}।",
  },
  "why.noYield": {
    en: "Suitability is based only on available soil measurements and documented reference ranges, not on yield guarantees.",
    kn: "ಹೊಂದಾಣಿಕೆಯು ಲಭ್ಯವಿರುವ ಮಣ್ಣಿನ ಅಳತೆಗಳು ಮತ್ತು ದಾಖಲಿತ ಉಲ್ಲೇಖ ಶ್ರೇಣಿಗಳನ್ನು ಮಾತ್ರ ಆಧರಿಸಿದೆ; ಇಳುವರಿ ಭರವಸೆ ಅಲ್ಲ.",
    hi: "उपयुक्तता केवल उपलब्ध मृदा मापों और प्रलेखित संदर्भ श्रेणियों पर आधारित है, उपज की गारंटी नहीं।",
  },
  "why.referenceGap": {
    en: "Reference basis: {verified} verified, {derived} derived, {unverified} indicative band(s).",
    kn: "ಉಲ್ಲೇಖ ಆಧಾರ: {verified} ಪರಿಶೀಲಿತ, {derived} ವ್ಯುತ್ಪನ್ನ, {unverified} ಸೂಚಕ ಶ್ರೇಣಿ.",
    hi: "संदर्भ आधार: {verified} सत्यापित, {derived} व्युत्पन्न, {unverified} सांकेतिक श्रेणी।",
  },

  "note.converted": {
    en: "Converted from kg/ha to mg/kg using the approximate factor ÷2.24; confirm the laboratory units.",
    kn: "kg/ha ನಿಂದ mg/kg ಗೆ ಸುಮಾರು ÷2.24 ಅಂಶದಿಂದ ಪರಿವರ್ತಿಸಲಾಗಿದೆ; ಪ್ರಯೋಗಾಲಯದ ಘಟಕವನ್ನು ದೃಢಪಡಿಸಿ.",
    hi: "kg/ha से mg/kg में लगभग ÷2.24 गुणक से परिवर्तित; प्रयोगशाला की इकाई की पुष्टि करें।",
  },
  "note.outOfRange": {
    en: "Value {value} {unit} is outside the expected validation range ({min}-{max} {expectedUnit}); please verify.",
    kn: "ಮೌಲ್ಯ {value} {unit} ನಿರೀಕ್ಷಿತ ಪರಿಶೀಲನಾ ಶ್ರೇಣಿಯ ({min}-{max} {expectedUnit}) ಹೊರಗಿದೆ; ದಯವಿಟ್ಟು ಪರಿಶೀಲಿಸಿ.",
    hi: "मान {value} {unit} अपेक्षित सत्यापन श्रेणी ({min}-{max} {expectedUnit}) से बाहर है; कृपया जाँचें।",
  },
  "note.hypothetical": {
    en: "Hypothetical simulation value (measured value: {measured}).",
    kn: "ಕಾಲ್ಪನಿಕ ಸಿಮ್ಯುಲೇಶನ್ ಮೌಲ್ಯ (ಅಳೆದ ಮೌಲ್ಯ: {measured}).",
    hi: "काल्पनिक सिमुलेशन मान (मापा मान: {measured})।",
  },

  "warn.missing": {
    en: "{param} is missing.",
    kn: "{param} ಕಾಣೆಯಾಗಿದೆ.",
    hi: "{param} अनुपलब्ध है।",
  },
  "warn.outOfRange": {
    en: "{param}: value {value} {unit} is outside the expected range ({min}-{max} {expectedUnit}); verify.",
    kn: "{param}: ಮೌಲ್ಯ {value} {unit} ನಿರೀಕ್ಷಿತ ಶ್ರೇಣಿಯ ({min}-{max} {expectedUnit}) ಹೊರಗಿದೆ; ಪರಿಶೀಲಿಸಿ.",
    hi: "{param}: मान {value} {unit} अपेक्षित श्रेणी ({min}-{max} {expectedUnit}) से बाहर है; जाँचें।",
  },
  "warn.hypothetical": {
    en: "Hypothetical simulation — modified values are not real soil measurements.",
    kn: "ಕಾಲ್ಪನಿಕ ಸಿಮ್ಯುಲೇಶನ್ — ಬದಲಾದ ಮೌಲ್ಯಗಳು ನಿಜವಾದ ಮಣ್ಣಿನ ಅಳತೆಗಳಲ್ಲ.",
    hi: "काल्पनिक सिमुलेशन — बदले गए मान वास्तविक मृदा माप नहीं हैं।",
  },
  "warn.aiExtracted": {
    en: "Values were read by Gemini and must be reviewed and corrected before analysis.",
    kn: "ಮೌಲ್ಯಗಳನ್ನು Gemini ಓದಿದೆ; ವಿಶ್ಲೇಷಣೆಗೆ ಮೊದಲು ಪರಿಶೀಲಿಸಿ ಸರಿಪಡಿಸಬೇಕು.",
    hi: "मान Gemini द्वारा पढ़े गए हैं; विश्लेषण से पहले इन्हें जाँचना और सुधारना आवश्यक है।",
  },
};
