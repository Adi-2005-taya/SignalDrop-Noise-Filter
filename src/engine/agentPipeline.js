/**
 * SignalDrop Multi-Agent Processing Pipeline
 * 
 * AGENT 1: The Sorter
 * - Evaluates raw messages to separate conversational spam/banter from campus signal.
 * - Categorizes into: DEADLINE, RESOURCE, ANNOUNCEMENT, or SPAM.
 * 
 * AGENT 2: The Extractor
 * - Deep entity parser: extracts specific dates, deadlines, URLs, attachments, subject codes, and urgent action items.
 */

// Common spam / conversational chatter patterns in Indian & global college groups
// Supports English, Hinglish, Benglish, Hindi (Devanagari), and Bengali (বাংলা)
const SPAM_REGEXES = [
  // English standard acknowledgments & chatter
  /^(ok|okay|k|okk|okkk)\s*(sir|ma'am|mam|prof|brother|bhai|bhaiya|dada|di)?\s*[\.!\s]*$/i,
  /^(thank\s*you|thanks|thx)\s*(sir|ma'am|mam|bhai|dada)?\s*[\.!\s]*$/i,
  /^(\+1|done|noted|yes sir|no sir|yes ma'am|received)\s*$/i,
  /^(happy\s*birthday|hbd|happy\s*b'day|party\s*kab\s*de\s*raha|party\s*kidhar\s*hai|party\s*kobe\s*dibi)/i,
  /^(sorry\s*sir|sorry\s*ma'am|apologies)/i,
  /^(lol|lmao|hahaha|haha|xd|ded|f\s*$)/i,
  /^(working\s*now|same\s*here|check\s*dm|sent)/i,
  /^[👍🙏🎉🎂🥳🔥❤️🙌👏]+$/,
  /^<Media\s*omitted>$/i,
  /^This\s*message\s*was\s*deleted$/i,

  // Hinglish chatter
  /^(theek\s*hai|thik\s*hai|sahi\s*hai|achha|accha|ha\s*bhai|haan\s*bhai|nahi\s*bhai|kya\s*scene\s*hai|arrey\s*yaar|sahi\s*me|done\s*bhai)\s*[\.!\s]*$/i,
  /^(kya\s*hua|kab\s*aayega|kisine\s*kiya\s*kya|mera\s*bhi\s*nahi\s*hua|bhai\s*notes\s*bhej|bhai\s*link\s*bhej)\s*[\.!\s]*$/i,

  // Benglish chatter
  /^(thik\s*ache|thik\s*ache\s*dada|thik\s*ache\s*sir|hyan\s*sir|ha\s*sir|na\s*re|ki\s*re|ki\s*obostha|ekdom|shotti|bujhlam|dhonnobad\s*sir|dhonnobad\s*dada|pronam\s*sir)\s*[\.!\s]*$/i,
  /^(kothay\s*achis|ki\s*korchish|sir\s*ki\s*bollo|notes\s*ta\s*de\s*na|kono\s*update\s*ache|bujhte\s*parlam\s*na)\s*[\.!\s]*$/i,

  // Hindi (Devanagari script)
  /^(ঠিক\s*है|धन्यवाद|नमस्ते|हाँ\s*सर|नहीं\s*सर|हो\s*गया|नोट\s*कर\s*लिया|प्रणाम\s*सर)\s*[\.!\s]*$/u,
  /^(जन्मदिन\s*की\s*बधाई|पार्टी\s*कब\s*है|क्या\s*हाल\s*है)/u,

  // Bengali (বাংলা script)
  /^(ঠিক\s*আছে|ধন্যবাদ|হ্যাঁ\s*স্যার|না\s*স্যার|হয়ে\s*গেছে|নোট\s*করেছি|প্রণাম\s*স্যার|নমস্কার\s*স্যার)\s*[\.!\s]*$/u,
  /^(শুভ\s*জন্মদিন|পার্টি\s*কবে|কি\s*অবস্থা|নোটস\s*দাও)/u
];

// Keywords indicating deadlines / submissions (English, Hinglish, Benglish, Hindi, Bengali)
const DEADLINE_KEYWORDS = [
  // English
  'deadline', 'due date', 'submission', 'last date', 'by 11:59', 'submit before',
  'exam', 'midterm', 'endterm', 'quiz', 'presentation', 'cutoff', 'register before',
  'hard deadline', 'penalty', 'pm sharp', 'am sharp', 'strictly close', 'close on',
  'closes on', 'submission deadline', 'due on', 'submit before this date', 'giveaway form',
  'closing date', 'last day', 'entries must be submitted',

  // Hinglish
  'jama karna hai', 'jama karne ki tarikh', 'last date hai', 'kal tak submit',
  'aaj raat tak', 'submission kab hai', 'due kab hai', 'form bharna hai', 'aakhri tarikh',
  'assignment submit', 'kal tak jama',

  // Benglish
  'jama dite hobe', 'shesh tarikh', 'submission er date', 'kal er moddhe',
  'shonibar er moddhe', 'last date kobe', 'form fill up korte hobe', 'assignment er deadline',
  'porikkha', 'submit korte hobe', 'joma dite hobe', 'joma dewar date',

  // Hindi (हिंदी script)
  'अंतिम तिथि', 'जमा करें', 'समय सीमा', 'अंतिम दिन', 'फॉर्म भरें', 'सबमिशन',
  'परीक्षा तिथि', 'जमा करने की अंतिम तिथि', 'जमा करना अनिवार्य',

  // Bengali (বাংলা script)
  'জমা দেওয়ার শেষ তারিখ', 'শেষ দিন', 'সময়সীমা', 'জমা দিতে হবে', 'ফর্ম পূরণ',
  'পরীক্ষার তারিখ', 'নির্ধারিত তারিখ', 'জমা দেওয়ার শেষ দিন'
];

const MONTH_NAMES_REGEX_STR = 'january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|জানুয়ারি|ফেব্রুয়ারি|মার্চ|এপ্রিল|মে|জুন|জুলাই|আগস্ট|সেপ্টেম্বর|অক্টোবর|নভেম্বর|ডিসেম্বর|जनवरी|फरवरी|मार्च|अप्रैल|मई|जून|जुलाई|अगस्त|सितंबर|अक्टूबर|नवंबर|दिसंबर';

const MULTILINGUAL_DAYS_STR = 'today|tomorrow|tonight|sunday|monday|tuesday|wednesday|thursday|friday|saturday|aaj|aajke|kal|kaal|shonibar|robibar|sombar|mangalbar|budhbar|brihospotibar|shukrobar|somvaar|mangalvaar|budhvaar|guruvaar|shukravaar|shanivaar|रविवार|सोमवार|मंगलवार|बुधवार|गुरुवार|शुक्रवार|शनिवार|রবিবার|সোমবার|মঙ্গলবার|বুধবার|বৃহস্পতিবার|শুক্রবার|শনিবার';

// Regex detecting any time, day of week, relative day, or date format
export const TIME_INDICATOR_REGEX = new RegExp(
  `\\b(?:${MULTILINGUAL_DAYS_STR})\\b|` +
  `\\b(?:${MONTH_NAMES_REGEX_STR})\\s+\\d{1,2}(?:st|nd|rd|th)?(?:,?\\s+\\d{2,4})?\\b|` +
  `\\b\\d{1,2}(?:st|nd|rd|th)?\\s+(?:${MONTH_NAMES_REGEX_STR})(?:,?\\s+\\d{2,4})?\\b|` +
  `\\b\\d{1,2}[./-]\\d{1,2}(?:[./-]\\d{2,4})?\\b|` +
  `\\b\\d{1,2}(?::\\d{2})?\\s*(?:pm|am|দুপুুর|সকাল|সন্ধ্যা|রাত|बजे|सुबह|शाम)\\b`,
  'iu'
);

// Keywords indicating academic resources / attachments (Multilingual)
const RESOURCE_KEYWORDS = [
  'pdf', 'drive.google.com', 'dropbox', 'classroom.google.com', 'github.com',
  'syllabus', 'notes', 'slides', 'deck', 'question bank', 'handout',
  'template', 'doc', 'docx', 'ppt', 'pptx', 'zip', 'forms.gle', 'joinsuperset',

  // Hinglish & Benglish
  'notes bhej raha', 'ye lo pdf', 'slides ka link', 'syllabus check karo', 'drive link',
  'notes ta pathalam', 'pdf ta dekh', 'file ta download', 'notes pathiyechi',

  // Hindi & Bengali script
  'नोट्स', 'अध्ययन सामग्री', 'पाठ्यक्रम', 'पीडीएफ',
  'নোটস', 'সিলেবাস', 'স্টাডি মেটেরিয়াল', 'ডাউনলোড'
];

// Keywords indicating official notices / campus announcements (Multilingual)
const ANNOUNCEMENT_KEYWORDS = [
  'attention', 'notice', 'circular', 'shifted to room', 'cancelled', 'rescheduled',
  'hall ticket', 'inspection', 'suspended', 'water supply', 'proctorial', 'warden',
  'seminar hall', 'reminder', 'mandatory', 'urgent notice',

  // Hinglish & Benglish
  'zaroori notice', 'class cancel ho gayi', 'class cancel hai', 'room change ho gaya',
  'timing badal gayi', 'chutti hai', 'kal chutti hai', 'attendance mandatory',
  'joruri notice', 'class cancel hoyeche', 'class hobe na', 'room change hoyeche',
  'chuti ache', 'kal chuti', 'shobai ashbe', 'proctorial notice',

  // Hindi (हिंदी) & Bengali (বাংলা)
  'जरूरी सूचना', 'सूचना', 'कक्षा स्थगित', 'कक्षा रद्द', 'छुट्टी', 'उपस्थिति अनिवार्य', 'परिपत्र',
  'জরুরি নোটিশ', 'বিজ্ঞপ্তি', 'ক্লাস বাতিল', 'ছুটি', 'উপস্থিতি বাধ্যতামূলক', 'সরকারি বিজ্ঞপ্তি'
];

// System notifications generated by WhatsApp / Telegram
const SYSTEM_CHAT_REGEXES = [
  /Messages and calls are end-to-end encrypted/i,
  /joined using this group's invite link/i,
  /added you/i,
  /created group/i,
  /changed the subject to/i,
  /changed this group's icon/i,
  /left the group/i,
  /security code changed/i,
  /You're now an admin/i
];

/**
 * Splits raw WhatsApp or Telegram export text into individual message records.
 * Supports Android exports, iOS exports, WhatsApp Web copy-paste,
 * and handles invisible Unicode control characters (\u200E, \u202F, \u00A0).
 */
export function parseRawChat(text) {
  if (!text || typeof text !== 'string') return [];

  // Strip invisible Unicode control characters commonly inserted by WhatsApp iOS & Android
  const cleanedText = text
    .replace(/[\u200E\u200F\u202A-\u202E\uFEFF]/g, '')
    .replace(/[\u202F\u00A0]/g, ' ');

  const lines = cleanedText.split(/\r?\n/);
  const messages = [];
  let currentMsg = null;

  // Patterns for WhatsApp chat lines:
  // 1. [10/24/26, 09:15:10] Sender: Message OR [24.10.2024, 14:20] Sender: Message
  const headerRegex1 = /^\[?(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?)\]?\s*(?:-\s*)?([^:]+?):\s*(.*)$/;
  
  // 2. 10/24/26, 09:15 - Sender: Message OR 24/10/2024, 2:15 pm - Sender: Message
  const headerRegex2 = /^(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?)\s*-\s*([^:]+?):\s*(.*)$/;

  // 3. Simple web copy: "Sender: Message" (no timestamp)
  const headerRegex3 = /^([A-Z][A-Za-z0-9\s._'-]{1,35}):\s+(.*)$/;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check for WhatsApp system noise line (e.g. "Messages and calls are end-to-end encrypted")
    if (SYSTEM_CHAT_REGEXES.some(rx => rx.test(trimmed))) {
      continue;
    }

    const match1 = trimmed.match(headerRegex1);
    const match2 = !match1 ? trimmed.match(headerRegex2) : null;
    const match = match1 || match2;

    if (match) {
      if (currentMsg) {
        messages.push(currentMsg);
      }
      currentMsg = {
        id: `msg-${messages.length + 1}-${Date.now().toString(36)}`,
        date: match[1],
        time: match[2],
        sender: match[3].trim(),
        text: match[4].trim(),
        rawText: trimmed
      };
    } else {
      // Check if this line is "Sender: Message" without timestamp
      const match3 = !currentMsg ? trimmed.match(headerRegex3) : null;
      if (match3 && !trimmed.startsWith('http')) {
        if (currentMsg) {
          messages.push(currentMsg);
        }
        currentMsg = {
          id: `msg-${messages.length + 1}-${Date.now().toString(36)}`,
          date: 'Recent',
          time: 'Live',
          sender: match3[1].trim(),
          text: match3[2].trim(),
          rawText: trimmed
        };
      } else if (currentMsg) {
        // Multiline message continuation
        currentMsg.text += `\n${trimmed}`;
        currentMsg.rawText += `\n${trimmed}`;
      } else {
        // Raw notice without headers
        currentMsg = {
          id: `msg-${messages.length + 1}-${Date.now().toString(36)}`,
          date: 'Recent',
          time: 'Live',
          sender: 'Notice Board',
          text: trimmed,
          rawText: trimmed
        };
      }
    }
  }

  if (currentMsg) {
    messages.push(currentMsg);
  }

  return messages;
}

/**
 * AGENT 1: The Sorter
 * Classifies a parsed message into:
 * - 'DEADLINE'
 * - 'RESOURCE'
 * - 'ANNOUNCEMENT'
 * - 'SPAM'
 */
export function runAgent1Sorter(message) {
  const content = message.text.toLowerCase();
  const trimmed = message.text.trim();

  // 1. Check obvious spam patterns
  for (const rx of SPAM_REGEXES) {
    if (rx.test(trimmed)) {
      return {
        category: 'SPAM',
        categories: ['SPAM'],
        confidence: 0.98,
        reason: 'Conversational acknowledgment or social banter'
      };
    }
  }

  // 2. Very short messages without actionable content
  if (trimmed.length < 15 && !/(http|www|exam|due|form|pdf)/i.test(trimmed)) {
    return {
      category: 'SPAM',
      categories: ['SPAM'],
      confidence: 0.92,
      reason: 'Low informational density conversational fragment'
    };
  }

  // Multi-signal detection
  const deadlineHits = DEADLINE_KEYWORDS.filter(kw => content.includes(kw));
  const hasTimeIndicator = TIME_INDICATOR_REGEX.test(content);
  const isDeadline = deadlineHits.length > 0 && (hasTimeIndicator || /deadline|strictly close|last date|due date|submit before|jama|shesh|antim|শেষ|अंतिम/i.test(content));

  const resourceHits = RESOURCE_KEYWORDS.filter(kw => content.includes(kw));
  const urlMatches = content.match(/https?:\/\/[^\s]+/gi) || [];
  const isResource = resourceHits.length > 0 || urlMatches.length > 0;

  const announcementHits = ANNOUNCEMENT_KEYWORDS.filter(kw => content.includes(kw));
  const hasAnnouncementContent = /welcome to|hackathon|giveaway|grand finale|prize|winner|celebration|notification|circular|seminar|workshop|lecture|relocated|meeting|নোটিশ|বিজ্ঞপ্তি|सूचना|परिपত্র/i.test(content);
  const isFacultyOrAdmin = /(prof|dr\.|hod|warden|coordinator|secretary|cr\b|t&p|placement|gfg|chapter|admin)/i.test(message.sender);
  const isAnnouncement = announcementHits.length > 0 || hasAnnouncementContent || (isFacultyOrAdmin && content.length > 30);

  const categories = [];
  if (isDeadline) categories.push('DEADLINE');
  if (isAnnouncement) categories.push('ANNOUNCEMENT');
  if (isResource) categories.push('RESOURCE');

  if (categories.length === 0) {
    if (content.length < 35) {
      return {
        category: 'SPAM',
        categories: ['SPAM'],
        confidence: 0.75,
        reason: 'Informal chatter filtered out'
      };
    }
    categories.push('ANNOUNCEMENT');
  }

  return {
    category: categories[0],
    categories,
    confidence: 0.95,
    reason: `Signals identified: [${categories.join(', ')}]`
  };
}

/**
 * AGENT 2: The Extractor
 * Extracts specific structured tokens:
 * - URLs
 * - Due dates & countdown targets
 * - Attached file names
 * - Course / Subject tags
 * - Actionable summary
 * - Urgency rating
 */
export function runAgent2Extractor(message, category) {
  const text = message.text;

  // 1. Extract URLs
  const urlRegex = /(https?:\/\/[^\s"'<>]+)/gi;
  const rawUrls = text.match(urlRegex) || [];
  const links = rawUrls.map(url => {
    let type = 'WEBSITE';
    let label = 'External Link';

    if (url.includes('classroom.google.com')) {
      type = 'CLASSROOM';
      label = 'Google Classroom';
    } else if (url.includes('drive.google.com')) {
      type = 'DRIVE';
      label = 'Google Drive File';
    } else if (url.includes('forms.gle') || url.includes('docs.google.com/forms')) {
      type = 'FORM';
      label = 'Google Form';
    } else if (url.includes('joinsuperset.com')) {
      type = 'SUPERSET';
      label = 'Superset Portal';
    } else if (url.includes('teams.microsoft.com') || url.includes('zoom.us') || url.includes('meet.google.com')) {
      type = 'MEETING';
      label = 'Live Meeting';
    } else if (url.includes('github.com')) {
      type = 'GITHUB';
      label = 'GitHub Repo';
    }

    return { url, type, label };
  });

  // 2. Extract Document Names / Attachments
  const docRegex = /([a-zA-Z0-9_\-.]+\.(?:pdf|docx?|pptx?|xlsx?|zip|rar|tar\.gz))/gi;
  const docMatches = text.match(docRegex) || [];
  const documents = docMatches.map(filename => ({
    name: filename,
    extension: filename.split('.').pop().toUpperCase()
  }));

  // 3. Extract Dates & Times (Supports both Month-First and Day-First formats)
  let extractedDate = null;
  let urgency = 'NORMAL';

  const datePatterns = [
    // 1. Explicit deadline clause in English, Benglish, Hindi, Bengali
    /(?:deadline|strictly close(?:s)? on|close(?:s)? on|submitted before|due on|due date|last date|shesh tarikh|jama|শেষ তারিখ|অপেক্ষমান|अंतिम तिथि|समय सीमा)\s*:?\s*(?:the\s+[a-z\s]+?\s+)?(?:on\s+)?((?:(?:sunday|monday|tuesday|wednesday|thursday|friday|saturday|রবিবার|সোমবার|মঙ্গলবার|বুধবার|বৃহস্পতিবার|শুক্রবার|শনিবার|रविवार|सोमवार|मंगलवार|बुधवार|गुरुवार|शुक्रवार|शनिवार),?\s+)?(?:(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|জানুয়ারি|ফেব্রুয়ারি|মার্চ|এপ্রিল|মে|জুন|জুলাই|আগস্ট|সেপ্টেম্বর|অক্টোবর|নভেম্বর|ডিসেম্বর|जनवरी|फरवरी|मार्च|अप्रैल|मई|जून|जुलाई|अगस्त|सितंबर|अक्टूबर|नवंबर|दिसंबर)\s+[\d০-৯०-९]{1,2}(?:st|nd|rd|th)?|[\d০-৯०-९]{1,2}(?:st|nd|rd|th)?\s+(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|জানুয়ারি|ফেব্রুয়ারি|মার্চ|এপ্রিল|মে|জুন|জুলাই|আগস্ট|সেপ্টেম্বর|অক্টোবর|নভেম্বর|ডিসেম্বর|जनवरी|फरवरी|मार्च|अप्रैल|मई|जून|जुलाई|अगस्त|सितंबर|अक्टूबर|नवंबर|दिसंबर))(?:,?\s+[\d০-৯०-९]{2,4})?(?:,?\s*(?:at|by|সময়)?\s*[\d০-৯०-९]{1,2}(?::[\d০-৯०-९]{2})?\s*(?:[AaPp][Mm]|দুপুুর|সকাল|রাত|बजे|सुबह|शाम)?)?)/iu,

    // 2. Standard Day-First multilingual: "20 নভেম্বর", "25 नवंबर", "20 November 2026"
    /(?:(?:sunday|monday|tuesday|wednesday|thursday|friday|saturday),?\s+)?([\d০-৯०-९]{1,2}(?:st|nd|rd|th)?\s+(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|জানুয়ারি|ফেব্রুয়ারি|মার্চ|এপ্রিল|মে|জুন|জুলাই|আগস্ট|সেপ্টেম্বর|অক্টোবর|নভেম্বর|ডিসেম্বর|जनवरी|फरवरी|मार्च|अप्रैल|मई|जून|जुलाई|अगस्त|सितंबर|अक्टूबर|नवंबर|दिसंबर)(?:,?\s+[\d০-৯०-९]{2,4})?(?:,?\s*(?:at|by)?\s*[\d০-৯०-९]{1,2}(?::[\d০-৯०-९]{2})?\s*(?:[AaPp][Mm])?)?)/iu,

    // 3. Month-First multilingual: "November 13, 2026"
    /(?:(?:sunday|monday|tuesday|wednesday|thursday|friday|saturday),?\s+)?((?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|জানুয়ারি|ফেব্রুয়ারি|মার্চ|এপ্রিল|মে|জুন|জুলাই|আগস্ট|সেপ্টেম্বর|অক্টোবর|নভেম্বর|ডিসেম্বর|जनवरी|फरवरी|मार्च|अप्रैल|मई|जून|जुलाई|अगस्त|सितंबर|अक्टूबर|नवंबर|दिसंबर)\s+[\d০-৯०-९]{1,2}(?:st|nd|rd|th)?(?:,?\s+[\d০-৯०-९]{2,4})?(?:,?\s*(?:at|by)?\s*[\d০-৯०-९]{1,2}(?::[\d০-৯०-९]{2})?\s*(?:[AaPp][Mm])?)?)/iu,

    // 4. Relative time: "Today, by 6:00 PM" / "কাল রাত" / "আজকে"
    /(?:today|tomorrow|tonight|aaj|aajke|kal|kaal|আজ|কাল|আজকে|आज|कल),?\s*(?:by|at|tak|পর্যন্ত|तक)?\s*([\d০-৯०-९]{1,2}(?::[\d০-৯०-९]{2})?\s*(?:[AaPp][Mm]|দুপুুর|সকাল|রাত|बजे|सुबह|शाम)?)/iu,

    // 5. Slash/dash numeric: "11/13/2026" or "13/11/2026"
    /([\d০-৯०-९]{1,2}[\/.-][\d০-৯०-९]{1,2}[\/.-][\d০-৯०-९]{2,4})/u
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      extractedDate = (match[1] || match[0]).trim();
      break;
    }
  }

  // 4. Course / Organization Code extraction (e.g. CS-302, GFG, TIU, ECE201, H-4, MATH101)
  const orgMatch = text.match(/\b(GFG|TIU|GENAI|ACM|IEEE|GDG|HACKATHON|T&P|NPTEL)\b/i);
  const courseCodeMatch = text.match(/\b([A-Z]{2,4}[-\s]?\d{3}|H-\d|Hostel\s*\d)\b/i) ||
                          message.sender.match(/\b([A-Z]{2,4}[-\s]?\d{3})\b/i);
  const courseCode = courseCodeMatch 
    ? courseCodeMatch[0].toUpperCase() 
    : orgMatch 
    ? orgMatch[0].toUpperCase() 
    : 'CAMPUS';

  // 5. Determine Urgency
  if (/urgent|strict deadline|mandatory|immediately|penalty|no extensions|today|strictly close/i.test(text)) {
    urgency = 'CRITICAL';
  } else if (category === 'DEADLINE' || /midterm|exam|quiz/i.test(text)) {
    urgency = 'HIGH';
  } else if (/shifted|room\s*\d+|notice/i.test(text)) {
    urgency = 'MEDIUM';
  } else {
    urgency = 'LOW';
  }

  // 6. Action item synthesis (Clear, single-sentence summary)
  let actionSummary = '';
  if (category === 'DEADLINE') {
    if (/giveaway|pitch|golden ticket/i.test(text)) actionSummary = 'Submit giveaway entry & star repo before form closes';
    else if (/hackathon/i.test(text)) actionSummary = 'Register team before deadline';
    else if (/assignment|অ্যাসাইনমেন্ট|असाइनमेंट/i.test(text)) actionSummary = 'Submit assignment via LMS portal';
    else if (/register|registration|নিবন্ধন|पंजीकरण/i.test(text)) actionSummary = 'Complete online registration';
    else if (/exam|midterm|পরীক্ষা|परीक्षा/i.test(text)) actionSummary = 'Prepare for upcoming examination';
    else if (/rebate|form|ফর্ম|फॉर्म/i.test(text)) actionSummary = 'Submit form before closing time';
    else if (/jama|joma|जमा/i.test(text)) actionSummary = 'Submit work before specified deadline';
    else actionSummary = 'Action required before specified deadline';
  } else if (category === 'RESOURCE') {
    if (documents.length > 0) actionSummary = `Download & review ${documents[0].name}`;
    else if (links.length > 0) actionSummary = `Access ${links[0].label}`;
    else if (/notes|নোট|नोट्स/i.test(text)) actionSummary = 'Download shared lecture notes';
    else actionSummary = 'Review shared study materials & references';
  } else if (category === 'ANNOUNCEMENT') {
    if (/hackathon|genarrative|gfg|giveaway/i.test(text)) actionSummary = 'Campus Tech Innovation & Challenge Announcement';
    else if (/workshop|কর্মশালা|कार्यशाला/i.test(text)) actionSummary = 'Campus Technology Workshop Announcement';
    else if (/circular|exam fee|ফি|फीस/i.test(text)) actionSummary = 'Official Academic Circular & Fee Payment Notice';
    else if (/room|ক্লাস|कक्षा/i.test(text)) actionSummary = 'Class venue / schedule notice';
    else if (/inspection/i.test(text)) actionSummary = 'Hostel proctorial inspection scheduled';
    else if (/water/i.test(text)) actionSummary = 'Temporary utility disruption notice';
    else if (/chuti|ছুটি|छुट्टी/i.test(text)) actionSummary = 'Campus holiday & leave notification';
    else actionSummary = 'Campus administrative notification';
  }

  // If announcement, check if there's an event date specifically (e.g. Grand Finale on November 21)
  if (category === 'ANNOUNCEMENT') {
    const eventMatch = text.match(/(?:grand finale|event|workshop|lecture|celebration|held on|starts on)\s*(?:of\s+[a-z0-9\s]+?\s+)?(?:on\s+)?((?:(?:sunday|monday|tuesday|wednesday|thursday|friday|saturday),?\s+)?(?:(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{1,2}(?:st|nd|rd|th)?|\d{1,2}(?:st|nd|rd|th)?\s+(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec))(?:,?\s+\d{2,4})?(?:,?\s*(?:at|by)?\s*\d{1,2}(?::\d{2})?\s*(?:[AaPp][Mm])?)?)/i);
    if (eventMatch) {
      extractedDate = (eventMatch[1] || eventMatch[0]).trim();
    }
  }

  return {
    links,
    documents,
    extractedDate: extractedDate || (category === 'DEADLINE' ? 'Pending Confirmation' : null),
    courseCode,
    urgency,
    actionSummary
  };
}

/**
 * Execute the complete Multi-Agent Pipeline
 */
export function processChatPipeline(rawText) {
  const parsedMessages = parseRawChat(rawText);
  const totalCount = parsedMessages.length;

  if (totalCount === 0) {
    return {
      messages: [],
      deadlines: [],
      resources: [],
      announcements: [],
      spam: [],
      stats: {
        totalMessages: 0,
        noiseFiltered: 0,
        noisePercentage: 0,
        signalCount: 0,
        timeSavedMinutes: 0
      }
    };
  }

  const deadlines = [];
  const resources = [];
  const announcements = [];
  const spam = [];

  parsedMessages.forEach((msg, index) => {
    // Step 1: Agent 1 Sorter classifies message
    const sorterResult = runAgent1Sorter(msg);
    msg.category = sorterResult.category;
    msg.sorterConfidence = sorterResult.confidence;
    msg.sorterReason = sorterResult.reason;

    if (sorterResult.category === 'SPAM') {
      spam.push({
        ...msg,
        status: 'DISCARDED'
      });
    } else {
      // Step 2: Agent 2 Extractor pulls structured entities for every signal detected
      const targetCategories = (sorterResult.categories && sorterResult.categories.length > 0)
        ? sorterResult.categories
        : [sorterResult.category];

      targetCategories.forEach(cat => {
        const extraction = runAgent2Extractor(msg, cat);
        const card = {
          id: `card-${index}-${cat.toLowerCase()}-${Date.now().toString(36)}`,
          originalMessage: msg,
          category: cat,
          sender: msg.sender,
          time: msg.time,
          date: msg.date,
          content: msg.text,
          ...extraction,
          isCompleted: false,
          pinned: false,
          addedAt: new Date().toISOString()
        };

        if (cat === 'DEADLINE') {
          deadlines.push(card);
        } else if (cat === 'RESOURCE') {
          resources.push(card);
        } else if (cat === 'ANNOUNCEMENT') {
          announcements.push(card);
        }
      });
    }
  });

  const noiseCount = spam.length;
  const signalCount = deadlines.length + resources.length + announcements.length;
  const noisePercentage = totalCount > 0 ? Math.round((noiseCount / totalCount) * 100) : 0;
  // Estimated reading time: ~20 seconds per chaotic WhatsApp message
  const timeSavedMinutes = Math.max(1, Math.round((noiseCount * 22) / 60));

  return {
    rawMessages: parsedMessages,
    deadlines,
    resources,
    announcements,
    spam,
    stats: {
      totalMessages: totalCount,
      noiseFiltered: noiseCount,
      noisePercentage,
      signalCount,
      timeSavedMinutes
    }
  };
}

/**
 * Generate a ready-to-share WhatsApp Digest summary
 */
export function generateWhatsAppDigest(deadlines, resources, announcements, groupName = 'Campus Group') {
  let text = `⚡ *SignalDrop Focus Digest // ${groupName}*\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;

  if (deadlines.length > 0) {
    text += `⏰ *CRITICAL DEADLINES:*\n`;
    deadlines.forEach(item => {
      text += `• ${item.extractedDate ? `[${item.extractedDate}] ` : ''}${item.actionSummary || item.content.slice(0, 80)}\n`;
      if (item.links && item.links.length > 0) {
        text += `  🔗 Link: ${item.links[0].url}\n`;
      }
    });
    text += `\n`;
  }

  if (resources.length > 0) {
    text += `📚 *STUDY RESOURCES & ASSETS:*\n`;
    resources.forEach(item => {
      if (item.documents && item.documents.length > 0) {
        text += `• 📄 ${item.documents[0].name}\n`;
      } else if (item.links && item.links.length > 0) {
        text += `• 🔗 ${item.links[0].label}: ${item.links[0].url}\n`;
      } else {
        text += `• ${item.content.slice(0, 70)}\n`;
      }
    });
    text += `\n`;
  }

  if (announcements.length > 0) {
    text += `📢 *NOTICES & UPDATES:*\n`;
    announcements.forEach(item => {
      text += `• ${item.actionSummary || item.content.slice(0, 80)}\n`;
    });
    text += `\n`;
  }

  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `✨ Filtered with SignalDrop AI (Zero Spam).`;

  return text;
}

/**
 * Generate iCalendar (.ics) file content for an extracted deadline
 */
export function generateICSContent(card) {
  const summary = `${card.courseCode}: ${card.actionSummary || 'Campus Deadline'}`;
  const description = `${card.content}\\n\\nSender: ${card.sender}\\nFiltered by SignalDrop Focus Board`;
  const uid = `signaldrop-${card.id}@campus.local`;
  const nowStr = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SignalDrop//Campus Focus Mode//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${nowStr}
DTSTART:${nowStr}
SUMMARY:${summary}
DESCRIPTION:${description}
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT2H
ACTION:DISPLAY
DESCRIPTION:Reminder: ${summary}
END:VALARM
END:VEVENT
END:VCALENDAR`;
}

