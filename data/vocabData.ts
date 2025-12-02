
import { ExamCategory } from "../types";

// High frequency vocabulary lists
// In a real production app, these lists would be much larger (3500+ words)
export const VOCAB_DATABASE: Record<ExamCategory, string[]> = {
  [ExamCategory.HENAN_ZHUANSHENGBEN]: [
    "abandon", "absolute", "absorb", "abstract", "academic", "access", "accommodate", "accompany", "accomplish", "accordance",
    "account", "accumulate", "accurate", "accuse", "achieve", "acknowledge", "acquire", "adapt", "adequate", "adjust",
    "administration", "admire", "admission", "adopt", "advance", "advantage", "adventure", "advocate", "affair", "affect",
    "afford", "agency", "aggressive", "agreement", "agriculture", "alarm", "alcohol", "alert", "allowance", "alter",
    "alternative", "amateur", "amaze", "ambition", "ambulance", "amount", "amuse", "analyze", "ancestor", "anchor",
    "ancient", "angle", "anniversary", "announce", "annoy", "annual", "anticipate", "anxiety", "apologize", "appeal",
    "appetite", "applaud", "applicant", "appoint", "appreciate", "approach", "appropriate", "approval", "approve", "approximate",
    "arbitrary", "architect", "architecture", "argue", "argument", "arise", "arithmetic", "arrange", "arrest", "arrival",
    "artificial", "artist", "artistic", "ashamed", "assess", "asset", "assign", "assist", "associate", "assume",
    "assure", "athlete", "atmosphere", "attach", "attack", "attain", "attempt", "attend", "attitude", "attract",
    "attribute", "audience", "authentic", "author", "authority", "automatic", "available", "avenue", "average", "avoid",
    "await", "award", "aware", "awful", "awkward", "background", "backward", "bacteria", "badminton", "balance",
    "ban", "bandage", "bang", "bankrupt", "banner", "barely", "bargain", "barrier", "base", "basic",
    "basin", "basis", "bathe", "battery", "battle", "bay", "beam", "bear", "beast", "behalf",
    "behave", "behavior", "belief", "belong", "beloved", "beneath", "beneficial", "benefit", "betray", "beyond"
  ],
  [ExamCategory.GAOKAO]: [
    "ability", "abroad", "absence", "accent", "accept", "accident", "account", "ache", "achieve", "action",
    "active", "activity", "actor", "actress", "actual", "add", "address", "admire", "admission", "admit",
    "adult", "advance", "advantage", "adventure", "advertise", "advertisement", "advice", "advise", "affair", "afford",
    "afraid", "africa", "afternoon", "again", "against", "age", "agency", "agenda", "agent", "aggressive",
    "ago", "agree", "agreement", "agricultural", "agriculture", "ahead", "aid", "aim", "air", "aircraft",
    "airline", "airmail", "airplane", "airport", "alarm", "album", "alcohol", "alive", "all", "allow",
    "almost", "alone", "along", "aloud", "alphabet", "already", "also", "alternative", "although", "altitude",
    "altogether", "aluminium", "always", "amateur", "amaze", "amazing", "ambition", "ambulance", "america", "american",
    "among", "amount", "amuse", "amusement", "analyze", "analysis", "ancestor", "anchor", "ancient", "and",
    "anger", "angle", "angry", "animal", "ankle", "anniversary", "announce", "annoy", "annual", "another"
  ],
  [ExamCategory.CET4]: [], // Placeholder
  [ExamCategory.CET6]: []  // Placeholder
};
