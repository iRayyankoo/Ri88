// Rayyan Portal 2.0 Core Logic

// Tool Data Definitions
// Status: 'existing' or 'added'
const tools = [
  // Finance
  {
    id: 'loan-calc', cat: 'finance', icon: 'calculator', status: 'existing',
    title: 'Loan Calculator', titleAr: 'حاسبة القروض',
    desc: 'Calculate monthly payments & interest amortization.', descAr: 'احسب الدفعات الشهرية وجدول استهلاك الفائدة.'
  },
  {
    id: 'vat-calc', cat: 'finance', icon: 'percent', status: 'existing',
    title: 'VAT Calculator', titleAr: 'حاسبة الضريبة',
    desc: 'Add or remove 15% VAT instantly.', descAr: 'أضف أو أزل ضريبة القيمة المضافة 15% فوراً.'
  },
  {
    id: 'net-salary', cat: 'finance', icon: 'wallet', status: 'existing',
    title: 'Net Salary', titleAr: 'حاسبة الراتب',
    desc: 'Estimate KSA net salary after GOSI.', descAr: 'تقدير صافي الراتب بعد خصم التأمينات الاجتماعية.'
  },
  {
    id: 'currency', cat: 'finance', icon: 'arrow-right-left', status: 'existing',
    title: 'Currency Converter', titleAr: 'محول العملات',
    desc: 'Live exchange rates for SAR/USD/EUR.', descAr: 'أسعار صرف مباشرة للريال والدولار واليورو.'
  },
  {
    id: 'savings', cat: 'finance', icon: 'landmark', status: 'added',
    title: 'Savings Goal', titleAr: 'هدف الادخار',
    desc: 'Plan how long to reach your savings goal.', descAr: 'خطط للمدة اللازمة للوصول لهدفك الادخاري.'
  },
  {
    id: 'zakat', cat: 'finance', icon: 'hand-coins', status: 'added',
    title: 'Zakat Calculator', titleAr: 'حاسبة الزكاة',
    desc: 'Calculate Zakat (2.5%) on your assets.', descAr: 'حساب الزكاة (2.5%) على إجمالي الأصول.'
  },
  {
    id: 'fin-crypto', cat: 'finance', icon: 'bitcoin', status: 'new',
    title: 'Crypto Converter', titleAr: 'محول العملات الرقمية',
    desc: 'Convert BTC/ETH to SAR/USD.', descAr: 'تحويل العملات الرقمية إلى ريال/دولار.'
  },

  // Time
  {
    id: 'hijri', cat: 'time', icon: 'moon', status: 'existing',
    title: 'Hijri Converter', titleAr: 'محول التاريخ الهجري',
    desc: 'Convert between Gregorian and Hijri dates.', descAr: 'التحويل بين التاريخ الميلادي والهجري.'
  },
  {
    id: 'diff', cat: 'time', icon: 'calendar-clock', status: 'existing',
    title: 'Date Difference', titleAr: 'حاسبة الفرق بين تاريخين',
    desc: 'Calculate exact duration between two dates.', descAr: 'حساب المدة الدقيقة بين أي تاريخين.'
  },
  {
    id: 'timer', cat: 'time', icon: 'timer', status: 'existing',
    title: 'Stopwatch / Timer', titleAr: 'ساعة إيقاف / مؤقت',
    desc: 'Simple countdown and stopwatch.', descAr: 'مؤقت تنازلي وساعة إيقاف بسيطة.'
  },
  {
    id: 'timezone', cat: 'time', icon: 'globe', status: 'added',
    title: 'Time Zone', titleAr: 'محول التوقيت',
    desc: 'Check time across major global cities.', descAr: 'معرفة الوقت في أهم مدن العالم.'
  },

  // Text
  {
    id: 'adobe-fix', cat: 'text', icon: 'align-right', status: 'existing',
    title: 'Arabic for Adobe', titleAr: 'مصحح النص العربي',
    desc: 'Fix RTL text issues for Photoshop/Premiere.', descAr: 'إصلاح مشاكل النص العربي في برامج أدوبي.'
  },
  {
    id: 'cleaner', cat: 'text', icon: 'eraser', status: 'existing',
    title: 'Text Cleaner', titleAr: 'تنظيف النصوص',
    desc: 'Remove extra spaces, emojis, and styling.', descAr: 'إزالة المسافات الزائدة والرموز التعبيرية والتنسيق.'
  },
  {
    id: 'case', cat: 'text', icon: 'case-sensitive', status: 'added',
    title: 'Case Converter', titleAr: 'محول حالة الأحرف',
    desc: 'UPPERCASE, lowercase, Title Case.', descAr: 'تحويل الحروف الكبيرة، الصغيرة، والعناوين.'
  },
  {
    id: 'hashtag', cat: 'text', icon: 'hash', status: 'added',
    title: 'Hashtag Generator', titleAr: 'مولد الهاشتاق',
    desc: 'Generate popular hashtags for content.', descAr: 'توليد هاشتاقات شائعة للمحتوى.'
  },
  {
    id: 'utm', cat: 'text', icon: 'link-2', status: 'added',
    title: 'UTM Builder', titleAr: 'باني روابط UTM',
    desc: 'Track marketing campaigns with UTM tags.', descAr: 'تتبع حملاتك التسويقية باستخدام روابط UTM.'
  },

  // Productivity
  {
    id: 'qr', cat: 'productivity', icon: 'qr-code', status: 'existing',
    title: 'QR Generator', titleAr: 'صانع الباركود',
    desc: 'Create custom QR codes for URLs or text.', descAr: 'إنشاء رموز استجابة سريعة للروابط والنصوص.'
  },
  {
    id: 'unit', cat: 'productivity', icon: 'ruler', status: 'existing',
    title: 'Unit Converter', titleAr: 'محول الوحدات',
    desc: 'Length, Weight, and Temperature tools.', descAr: 'أدوات تحويل الطول والوزن ودرجة الحرارة.'
  },
  {
    id: 'password', cat: 'productivity', icon: 'lock', status: 'added',
    title: 'Password Generator', titleAr: 'مولد كلمات المرور',
    desc: 'Create strong, secure passwords.', descAr: 'إنشاء كلمات مرور قوية وآمنة.'
  },
  {
    id: 'speed', cat: 'productivity', icon: 'gauge', status: 'added',
    title: 'Speed Test', titleAr: 'قياس السرعة',
    desc: 'Check your internet latency/speed.', descAr: 'فحص سرعة استجابة الإنترنت لديك.'
  },

  // Content
  {
    id: 'social-sizes', cat: 'content', icon: 'smartphone', status: 'added',
    title: 'Social Media Sizes', titleAr: 'مقاسات السوشيال ميديا',
    desc: 'Check perfect dimensions for post & stories.', descAr: 'تعرف على المقاسات الصحيحة لمنشورات وقصص منصات التواصل.'
  },
  {
    id: 'caption', cat: 'content', icon: 'pen-tool', status: 'added',
    title: 'Caption Templates', titleAr: 'قوالب العناوين',
    desc: 'Generate captions for social posts.', descAr: 'توليد عناوين لمنشورات التواصل الاجتماعي.'
  },
  {
    id: 'ideas', cat: 'content', icon: 'lightbulb', status: 'added',
    title: 'Content Ideas', titleAr: 'أفكار محتوى',
    desc: 'Get content pillars and weekly plans.', descAr: 'الحصول على أفكار وخطط أسبوعية للمحتوى.'
  },
  {
    id: 'proof', cat: 'content', icon: 'search-check', status: 'added',
    title: 'Proofreading', titleAr: 'تدقيق لغوي',
    desc: 'Simple text checker for errors.', descAr: 'فحص بسيط للأخطاء اللغوية.'
  },

  {
    id: 'saudi-holiday', cat: 'saudi', icon: 'calendar', status: 'new',
    title: 'Hijri Date', titleAr: 'التاريخ الهجري',
    desc: 'Current Hijri date.', descAr: 'عرض التاريخ الهجري الحالي.'
  },
  {
    id: 'saudi-vacation', cat: 'saudi', icon: 'sun', status: 'new',
    title: 'Vacation Salary', titleAr: 'راتب الإجازة',
    desc: 'Calculate advance vacation pay.', descAr: 'حساب الراتب المقدم للإجازة.'
  },

  // PDF
  {
    id: 'pdf-merge', cat: 'pdf', icon: 'files', status: 'added',
    title: 'Merge PDFs', titleAr: 'دمج ملفات PDF',
    desc: 'Combine multiple PDF files into one document.', descAr: 'دمج عدة ملفات PDF في ملف واحد.'
  },
  {
    id: 'pdf-split', cat: 'pdf', icon: 'scissors', status: 'added',
    title: 'Split PDF', titleAr: 'تقسيم PDF',
    desc: 'Extract pages or split a file into multiple PDFs.', descAr: 'استخراج صفحات أو تقسيم ملف إلى عدة ملفات.'
  },
  {
    id: 'pdf-compress', cat: 'pdf', icon: 'minimize-2', status: 'added',
    title: 'Compress PDF', titleAr: 'ضغط PDF',
    desc: 'Reduce file size while keeping quality.', descAr: 'تقليل حجم الملف مع الحفاظ على الجودة.'
  },
  {
    id: 'pdf-to-img', cat: 'pdf', icon: 'image',
    title: 'PDF to Images', titleAr: 'تحويل PDF لصور',
    desc: 'Convert PDF pages to PNG or JPG images.', descAr: 'تحويل صفحات PDF إلى صور PNG أو JPG.'
  },
  {
    id: 'img-to-pdf', cat: 'pdf', icon: 'file-text',
    title: 'Images to PDF', titleAr: 'صور إلى PDF',
    desc: 'Convert multiple images into a single PDF.', descAr: 'تحويل مجموعة صور إلى ملف PDF واحد.'
  },
  {
    id: 'pdf-page-num', cat: 'pdf', icon: 'list-ordered',
    title: 'Add Page Numbers', titleAr: 'أرقام الصفحات',
    desc: 'Add page numbers to your document.', descAr: 'إضافة أرقام الصفحات إلى ملفك.'
  },
  {
    id: 'pdf-rotate', cat: 'pdf', icon: 'rotate-cw',
    title: 'Rotate Pages', titleAr: 'تدوير الصفحات',
    desc: 'Rotate PDF pages permanently.', descAr: 'تدوير صفحات PDF بشكل دائم.'
  },
  {
    id: 'pdf-watermark', cat: 'pdf', icon: 'stamp',
    title: 'Add Watermark', titleAr: 'إضافة علامة مائية',
    desc: 'Stamp text or image on PDF pages.', descAr: 'إضافة نص أو صورة كعلامة مائية.'
  },
  {
    id: 'pdf-protect', cat: 'pdf', icon: 'lock',
    title: 'Protect PDF', titleAr: 'حماية PDF',
    desc: 'Encrypt PDF with a password.', descAr: 'تشفير ملف PDF بكلمة مرور.'
  },
  {
    id: 'pdf-unlock', cat: 'pdf', icon: 'unlock',
    title: 'Unlock PDF', titleAr: 'فك حماية PDF',
    desc: 'Remove password from PDF (if known).', descAr: 'إزالة كلمة المرور من ملف PDF (إذا كنت تعرفها).'
  },
  {
    id: 'pdf-rem', cat: 'pdf', icon: 'file-minus', status: 'added',
    title: 'Remove Pages', titleAr: 'حذف صفحات',
    desc: 'Delete specific pages from PDF.', descAr: 'حذف صفحات محددة من الملف.'
  },
  {
    id: 'pdf-ord', cat: 'pdf', icon: 'arrow-up-down', status: 'added',
    title: 'Reorder Pages', titleAr: 'ترتيب الصفحات',
    desc: 'Rearrange page order.', descAr: 'إعادة ترتيب صفحات الملف.'
  },
  {
    id: 'pdf-crop', cat: 'pdf', icon: 'crop', status: 'added',
    title: 'Crop Pages', titleAr: 'قص الصفحات',
    desc: 'Trim margins from PDF pages.', descAr: 'قص الهوامش من الصفحات.'
  },

  // Image Tools
  {
    id: 'img-compress', cat: 'image', icon: 'image-minus', status: 'added',
    title: 'Image Compressor', titleAr: 'ضغط الصور',
    desc: 'Compress JPG/PNG/WebP images.', descAr: 'ضغط ملفات الصور مع الحفاظ على الجودة.'
  },
  {
    id: 'img-resize', cat: 'image', icon: 'maximize', status: 'added',
    title: 'Image Resizer', titleAr: 'تغيير الحجم',
    desc: 'Resize images by pixels.', descAr: 'تغيير أبعاد الصورة بالبكسل.'
  },
  {
    id: 'img-webp', cat: 'image', icon: 'zap', status: 'added',
    title: 'Convert to WebP', titleAr: 'تحويل لـ WebP',
    desc: 'Convert images to modern WebP format.', descAr: 'تحويل الصور لصيغة WebP الحديثة.'
  },
  {
    id: 'img-bg', cat: 'image', icon: 'layers', status: 'added',
    title: 'Remove Background', titleAr: 'إزالة الخلفية',
    desc: 'Remove image backgrounds (Link).', descAr: 'إزالة خلفية الصورة (رابط خارجي).'
  },
  {
    id: 'img-heic', cat: 'image', icon: 'camera', status: 'added',
    title: 'HEIC to JPG', titleAr: 'HEIC إلى JPG',
    desc: 'Convert iPhone photos to JPG.', descAr: 'تحويل صور الآيفون إلى JPG.'
  },
  {
    id: 'img-social', cat: 'image', icon: 'share-2', status: 'added',
    title: 'Social Post Prep', titleAr: 'تجهيز صور التواصل',
    desc: 'Crop/Fit images for social media.', descAr: 'قص وتجهيز الصور لمنصات التواصل.'
  },
  {
    id: 'img-border', cat: 'image', icon: 'square', status: 'added',
    title: 'Add Frame', titleAr: 'إضافة إطار',
    desc: 'Add shadow and border to screenshots.', descAr: 'إضافة ظل وإطار للقطات الشاشة.'
  },
  {
    id: 'img-meta', cat: 'image', icon: 'eye-off', status: 'added',
    title: 'Remove Metadata', titleAr: 'حذف البيانات الوصفية',
    desc: 'Strip EXIF data from photos.', descAr: 'مسح بيانات EXIF من الصور.'
  },
  {
    id: 'img-crop', cat: 'image', icon: 'crop', status: 'new',
    title: 'Image Cropper', titleAr: 'قص الصور',
    desc: 'Crop images to valid dimensions.', descAr: 'قص الصور بأبعاد مخصصة.'
  },
  {
    id: 'img-filter', cat: 'image', icon: 'sliders', status: 'new',
    title: 'Photo Filters', titleAr: 'فلاتر الصور',
    desc: 'Apply B&W, Sepia, and more.', descAr: 'تطبيق فلاتر (أبيض وأسود، سيبيا، إلخ).'
  },

  // Health (New)
  {
    id: 'health-bmi', cat: 'health', icon: 'activity', status: 'new',
    title: 'BMI Calculator', titleAr: 'كتلة الجسم (BMI)',
    desc: 'Check if weight is healthy.', descAr: 'حساب مؤشر كتلة الجسم.'
  },
  {
    id: 'health-bmr', cat: 'health', icon: 'fire', status: 'new',
    title: 'Calories (BMR)', titleAr: 'حاسبة السعرات',
    desc: 'Calculate daily calorie needs.', descAr: 'حساب احتياج الجسم من السعرات.'
  },
  {
    id: 'health-water', cat: 'health', icon: 'droplet', status: 'new',
    title: 'Water Intake', titleAr: 'احتياج الماء',
    desc: 'Daily water tracking.', descAr: 'حساب كمية الماء المطلوبة يومياً.'
  },

  // Developer
  {
    id: 'dev-json', cat: 'developer', icon: 'braces', status: 'added',
    title: 'JSON Formatter', titleAr: 'منسق JSON',
    desc: 'Format, validate, and minify JSON.', descAr: 'تنسيق والتحقق من أكواد JSON.'
  },
  {
    id: 'dev-base64', cat: 'developer', icon: 'binary', status: 'added',
    title: 'Base64 Encoder', titleAr: 'ترميز Base64',
    desc: 'Encode and Decode Base64 strings.', descAr: 'ترميز وفك ترميز نصوص Base64.'
  },
  {
    id: 'dev-hash', cat: 'developer', icon: 'fingerprint', status: 'added',
    title: 'Hash Generator', titleAr: 'مولد الهاش',
    desc: 'SHA-256, SHA-1, MD5 generator.', descAr: 'توليد رموز التشفير (Hash).'
  },
  {
    id: 'dev-url', cat: 'developer', icon: 'link', status: 'added',
    title: 'URL Encoder', titleAr: 'ترميز الروابط',
    desc: 'Encode/Decode URL parameters.', descAr: 'ترميز وتصحيح الروابط.'
  },
  {
    id: 'dev-regex', cat: 'developer', icon: 'regex', status: 'added',
    title: 'Regex Tester', titleAr: 'فاحص Regex',
    desc: 'Test regular expressions.', descAr: 'اختبار التعابير المنطقية.'
  },
  {
    id: 'dev-diff', cat: 'developer', icon: 'git-compare', status: 'added',
    desc: 'Compare two texts for differences.', descAr: 'مقارنة الاختلافات بين نصين.'
  },
  {
    id: 'dev-jwt', cat: 'developer', icon: 'key', status: 'new',
    title: 'JWT Debugger', titleAr: 'فاحص JWT',
    desc: 'Decode and debug JWT tokens.', descAr: 'فك تشفير وفحص رموز JWT.'
  },
  {
    id: 'dev-sql', cat: 'developer', icon: 'database', status: 'new',
    title: 'SQL Formatter', titleAr: 'تنسيق SQL',
    desc: 'Format and beautify SQL queries.', descAr: 'تنسيق وترتيب استعلامات SQL.'
  },
  {
    id: 'dev-chmod', cat: 'developer', icon: 'shield', status: 'new',
    title: 'Chmod Calculator', titleAr: 'حاسبة Chmod',
    desc: 'Calculate Linux file permissions.', descAr: 'حساب صلاحيات الملفات في لينكس.'
  },
  {
    id: 'dev-cron', cat: 'developer', icon: 'clock', status: 'new',
    title: 'Cron Generator', titleAr: 'مجدول Cron',
    desc: 'Create Cron job schedules.', descAr: 'إنشاء جداول المهام المجدولة (Cron).'
  },
  {
    id: 'dev-curl', cat: 'developer', icon: 'terminal', status: 'new',
    title: 'Curl to Fetch', titleAr: 'تحويل Curl',
    desc: 'Convert Curl commands to JS Fetch.', descAr: 'تحويل أوامر Curl إلى كود Fetch.'
  },
  {
    id: 'dev-ua', cat: 'developer', icon: 'monitor', status: 'new',
    title: 'User Agent', titleAr: 'تحليل المتصفح',
    desc: 'Parse User Agent string.', descAr: 'تحليل ومعرفة نوع المتصفح والنظام.'
  },
  {
    id: 'dev-meta', cat: 'developer', icon: 'code', status: 'new',
    title: 'Meta Tags', titleAr: 'ميتا تاج',
    desc: 'Generate SEO meta tags.', descAr: 'توليد وسوم الميتا لمحركات البحث.'
  },
  {
    id: 'dev-fav', cat: 'developer', icon: 'image', status: 'new',
    title: 'Favicon Gen', titleAr: 'أيقونة الموقع',
    desc: 'Create valid 32x32 Favicon.', descAr: 'إنشاء أيقونة مفضلة للموقع.'
  },
  {
    id: 'dev-svg', cat: 'developer', icon: 'pen-tool', status: 'new',
    title: 'SVG Optimizer', titleAr: 'تحسين SVG',
    desc: 'Minify SVG code.', descAr: 'ضغط وتحسين أكواد SVG.'
  },
  {
    id: 'dev-md', cat: 'developer', icon: 'file-text', status: 'new',
    title: 'Markdown View', titleAr: 'عارد Markdown',
    desc: 'Preview Markdown text.', descAr: 'معاينة نصوص مارك داون.'
  },

  // Saudi Tools
  {
    id: 'saudi-eos', cat: 'saudi', icon: 'coins', status: 'added',
    title: 'End of Service', titleAr: 'مكافأة نهاية الخدمة',
    desc: 'Calculate KSA End of Service reward.', descAr: 'حساب مكافأة نهاية الخدمة حسب القانون السعودي.'
  },
  {
    id: 'saudi-leave', cat: 'saudi', icon: 'plane', status: 'added',
    title: 'Leave Calculator', titleAr: 'حاسبة الإجازات',
    desc: 'Calculate return date from leave.', descAr: 'حساب تاريخ العودة من الإجازة.'
  },

  // New Text/Prod
  {
    id: 'text-link', cat: 'text', icon: 'link', status: 'added',
    title: 'Link Extractor', titleAr: 'استخراج الروابط',
    desc: 'Extract URLs from text.', descAr: 'استخراج الروابط من النصوص.'
  },
  {
    id: 'text-punc', cat: 'text', icon: 'quote', status: 'added',
    title: 'Arabic Punctuation', titleAr: 'ترقيم عربي',
    desc: 'Fix Arabic commas and quotes.', descAr: 'تصحيح الفواصل وعلامات التنصيص العربية.'
  },
  {
    id: 'text-dia', cat: 'text', icon: 'type', status: 'added',
    title: 'Remove Tashkeel', titleAr: 'إزالة التشكيل',
    desc: 'Remove diacritics from Arabic text.', descAr: 'حذف الحركات والتشكيل من النص.'
  },
  {
    id: 'prod-iban', cat: 'productivity', icon: 'credit-card', status: 'added',
    title: 'IBAN Validator', titleAr: 'فاحص الآيبان',
    desc: 'Validate Saudi IBAN format.', descAr: 'التحقق من صحة رقم الآيبان السعودي.'
  },
  {
    id: 'prod-inv', cat: 'productivity', icon: 'receipt', status: 'added',
    title: 'Invoice Generator', titleAr: 'صانع الفواتير',
    desc: 'Simple invoice for printing.', descAr: 'فاتورة بسيطة جاهزة للطباعة.'
  },
  {
    id: 'pdf-extract-text', cat: 'pdf', icon: 'file-text', status: 'added',
    title: 'Extract Text', titleAr: 'استخراج النصوص',
    desc: 'Extract all text from PDF.', descAr: 'استخراج جميع النصوص من ملف PDF.'
  },
  {
    id: 'pdf-extract-imgs', cat: 'pdf', icon: 'image-plus', status: 'added',
    title: 'Extract Images', titleAr: 'استخراج الصور',
    desc: 'Extract all images from PDF.', descAr: 'استخراج جميع الصور من ملف PDF.'
  },

  // Saudi / Arabic Expansion
  {
    id: 'text-tafqeet', cat: 'saudi', icon: 'banknote', status: 'new',
    title: 'Number to Text', titleAr: 'تفقيط الأرقام',
    desc: 'Convert numbers to Arabic text (financial).', descAr: 'تحويل الأرقام إلى نص عربي (للفواتير والشيكات).'
  },
  {
    id: 'saudi-events', cat: 'saudi', icon: 'calendar-heart', status: 'new',
    title: 'Saudi Events', titleAr: 'المناسبات السعودية',
    desc: 'Countdown to Founding Day, National Day, etc.', descAr: 'عد تنازلي للمناسبات الوطنية والأعياد.'
  },
  {
    id: 'text-lorem', cat: 'text', icon: 'align-left', status: 'new',
    title: 'Arabic Lorem Ipsum', titleAr: 'مولد نص عشوائي',
    desc: 'Generate placeholder Arabic text.', descAr: 'توليد نصوص عربية عشوائية للتطوير والتصميم.'
  },

  // Education (New)
  {
    id: 'edu-gpa', cat: 'education', icon: 'graduation-cap', status: 'new',
    title: 'GPA Calculator', titleAr: 'حاسبة المعدل',
    desc: 'Calculate GPA (5.0 or 4.0 scale).', descAr: 'حساب المعدل التراكمي (من 5 أو 4).'
  },
  {
    id: 'edu-grade', cat: 'education', icon: 'calculator', status: 'new',
    title: 'Grade Calculator', titleAr: 'حاسبة الدرجات',
    desc: 'Calculate totals from assessments.', descAr: 'حساب مجموع الدرجات من التقييمات المختلفة.'
  },

  // Health Data (New Category)
  {
    id: 'health-bmi', cat: 'health', icon: 'activity', status: 'new',
    title: 'BMI Calculator', titleAr: 'حاسبة كتلة الجسم',
    desc: 'Calculate Body Mass Index & weight status.', descAr: 'حساب مؤشر كتلة الجسم والوزن المثالي.'
  },
  {
    id: 'health-water', cat: 'health', icon: 'droplet', status: 'new',
    title: 'Water Intake', titleAr: 'احتياج الماء',
    desc: 'Daily water intake calculator.', descAr: 'حساب كمية الماء اليومية الموصى بها.'
  },
  {
    id: 'health-sleep', cat: 'health', icon: 'moon-star', status: 'new',
    title: 'Sleep Calculator', titleAr: 'حاسبة النوم',
    desc: 'Calculate best times to wake up.', descAr: 'حساب أفضل أوقات الاستيقاظ وآلتي النوم.'
  },
  {
    id: 'health-bmr', cat: 'health', icon: 'fire', status: 'new',
    title: 'Calories (BMR)', titleAr: 'حاسبة السعرات',
    desc: 'Calculate daily calorie needs.', descAr: 'حساب احتياج الجسم من السعرات.'
  },

  // Productivity & Design Expansion
  {
    id: 'prod-pomodoro', cat: 'productivity', icon: 'timer-reset', status: 'new',
    title: 'Pomodoro Timer', titleAr: 'مؤقت بومودورو',
    desc: 'Focus timer (25min work / 5min break).', descAr: 'تقنية بومودورو للتركيز وزيادة الإنتاجية.'
  },
  {
    id: 'image-palette', cat: 'image', icon: 'palette', status: 'new',
    title: 'Color Extractor', titleAr: 'مستخرج الألوان',
    desc: 'Extract color palette from any image.', descAr: 'استخراج باليت الألوان من أي صورة.'
  },

  // Life Utils (New)
  {
    id: 'life-bill', cat: 'productivity', icon: 'calculator', status: 'new',
    title: 'Bill Splitter', titleAr: 'قاطة / تقسيم الفاتورة',
    desc: 'Split bills and calculate tips easily.', descAr: 'تقسيم الفاتورة وحساب الإكرامية بين الأصدقاء.'
  },
  {
    id: 'life-decision', cat: 'productivity', icon: 'shuffle', status: 'new',
    title: 'Decision Maker', titleAr: 'عجلة الحظ',
    desc: 'Randomly pick an option from a list.', descAr: 'اختيار عشوائي من قائمة خيارات (قرعة).'
  },
  {
    id: 'life-tip', cat: 'productivity', icon: 'percent', status: 'new',
    title: 'Tip Calculator', titleAr: 'حاسبة الإكرامية',
    desc: 'Calculate tip percentage and total.', descAr: 'حساب نسبة الإكرامية ومبلغها.'
  },

  // Design Tools (New)
  {
    id: 'des-grad', cat: 'developer', icon: 'palette', status: 'new',
    title: 'CSS Gradient', titleAr: 'منشئ التدرج اللوني',
    desc: 'Generate CSS for linear gradients.', descAr: 'توليد كود CSS للتدرجات اللونية.'
  },
  {
    id: 'des-shadow', cat: 'developer', icon: 'layers', status: 'new',
    title: 'Box Shadow Gen', titleAr: 'منشئ الظلال',
    desc: 'Create smooth CSS box shadows.', descAr: 'توليد كود CSS للظلال الناعمة.'
  },
  {
    id: 'des-contrast', cat: 'developer', icon: 'sun', status: 'new',
    title: 'Contrast Checker', titleAr: 'تباين الألوان',
    desc: 'Check text readability (WCAG).', descAr: 'فحص تباين الألوان للقراءة (WCAG).'
  },

  // Media (New)
  {
    id: 'media-gif', cat: 'media', icon: 'film', status: 'new',
    title: 'Video to GIF', titleAr: 'فيديو إلى GIF',
    desc: 'Convert clips to animated GIFs.', descAr: 'تحويل مقاطع الفيديو إلى صور متحركة.'
  },
  {
    id: 'media-mp3', cat: 'media', icon: 'music', status: 'new',
    title: 'Video to Audio', titleAr: 'فيديو إلى صوت',
    desc: 'Extract MP3/Audio from video.', descAr: 'استخراج الصوت من ملفات الفيديو.'
  },
  {
    id: 'media-rec', cat: 'content', icon: 'mic', status: 'new',
    title: 'Audio Recorder', titleAr: 'مسجل الصوت',
    desc: 'Record and download audio clips.', descAr: 'تسجيل المقاطع الصوتية وتحميلها.'
  },

  // Meme (New Image)
  {
    id: 'img-meme', cat: 'image', icon: 'smile', status: 'new',
    title: 'Meme Generator', titleAr: 'صانع الميمز',
    desc: 'Add text to images for memes.', descAr: 'إضافة نصوص مضحكة للصور.'
  },
  // New Suggested Tools
  {
    id: 'health-breath', cat: 'health', icon: 'wind', status: 'new',
    title: 'Breathing Exercise', titleAr: 'تمرين التنفس',
    desc: 'Relax and focus with guided breathing.', descAr: 'استرخِ وركز مع تمرين التنفس الموجه.'
  },
  {
    id: 'life-reaction', cat: 'productivity', icon: 'zap', status: 'new',
    title: 'Reaction Time', titleAr: 'سرعة رد الفعل',
    desc: 'Test how fast you can click.', descAr: 'اختبر سرعة استجابتك.'
  },
  {
    id: 'fin-discount', cat: 'finance', icon: 'tag', status: 'new',
    title: 'Discount Calc', titleAr: 'حاسبة الخصم',
    desc: 'Calculate price after discount.', descAr: 'حساب السعر بعد الخصم.'
  },
  {
    id: 'time-add', cat: 'time', icon: 'calendar-plus', status: 'new',
    title: 'Date Adder', titleAr: 'ضيف التاريخ',
    desc: 'Add days/months to a date.', descAr: 'إضافة أيام أو شهور لتاريخ معين.'
  },
  {
    id: 'dev-screen', cat: 'developer', icon: 'monitor', status: 'new',
    title: 'Screen Info', titleAr: 'معلومات الشاشة',
    desc: 'View screen resolution and specs.', descAr: 'عرض دقة الشاشة والمواصفات.'
  },
];


// Translations
const translations = {
  en: {
    nav_tools: "Tools",
    nav_home: "Home",
    nav_categories: "Categories",
    nav_about: "About",
    hero_title: "Smart tools for<br><span style='color:var(--accent-pink);'>everyday use</span>",
    hero_sub: "A premium collection of essential utilities for finance, productivity, and content creation. Free for everyone.",
    hero_cta: "Explore Tools",
    cat_title: "Explore by Category",
    cat_finance: "Finance",
    cat_time: "Time",
    cat_text: "Text",
    cat_prod: "Productivity",
    cat_content: "Content",
    cat_education: "Education",
    cat_pdf: "PDF Tools",
    cat_image: "Image Tools",
    cat_health: "Health",
    cat_developer: "Developer",
    cat_saudi: "Saudi Utils",
    cat_favorites: "Favorites",
    filter_all: "All",
    filter_fav: "⭐ Favorites",
    all_tools: "All Tools",
    search_placeholder: "Search for tools...",
    about_title: "About Ri88 Portal",
    about_desc: "A premium suite of essential utilities designed for Saudi users.<br>We aim to provide fast, secure, and free tools for everyone.",
    about_mission_title: "Our Mission",
    about_mission_desc: "Ri88 was built to simplify everyday digital tasks. From calculating VAT and loans to converting files and editing images, we bring everything into one unified, beautiful interface.",
    about_version: "Version 2.0",
    about_tech: "Built with Vanilla HTML/CSS/JS",
    footer_copy: "© 2026 Ri88 Portal. Made for Saudi Users."
  },
  ar: {
    nav_tools: "الأدوات",
    nav_home: "الرئيسية",
    nav_categories: "الفئات",
    nav_about: "عن الموقع",
    hero_title: "أدوات ذكية<br><span style='color:var(--accent-pink);'>لاستخدامك اليومي</span>",
    hero_sub: "مجموعة متميزة من الأدوات الأساسية للمالية والإنتاجية وصناعة المحتوى. مجانية للجميع.",
    hero_cta: "تصفح الأدوات",
    cat_title: "تصفح حسب الفئة",
    cat_finance: "المالية",
    cat_time: "الوقت",
    cat_text: "نصوص",
    cat_prod: "الإنتاجية",
    cat_content: "محتوى",
    cat_education: "التعليم",
    cat_pdf: "أدوات PDF",
    cat_image: "صور",
    cat_health: "صحة",
    cat_developer: "للمبرمجين",
    cat_saudi: "خدمات سعودية",
    cat_favorites: "المفضلة",
    filter_all: "الكل",
    filter_fav: "⭐ المفضلة",
    all_tools: "جميع الأدوات",
    search_placeholder: "ابحث عن أداة...",
    about_title: "عن بوابة ريان",
    about_desc: "مجموعة متميزة من الأدوات الأساسية المصممة للمستخدمين في السعودية.<br>نسعى لتوفير أدوات سريعة، آمنة، ومجانية للجميع.",
    about_mission_title: "رسالتنا",
    about_mission_desc: "تم بناء Ri88 لتبسيط المهام الرقمية اليومية. من حساب الضريبة والقروض إلى تحويل الملفات وتعديل الصور، نجمع كل شيء في واجهة موحدة وجميلة.",
    about_version: "الإصدار 2.0",
    about_tech: "تم البناء باستخدام HTML/CSS/JS المطور",
    footer_copy: "© 2026 بوابة ريان. صُنع بفخر للمستخدمين في السعودية."
  }
};

// State
let displayTools = [...tools];
let favorites = JSON.parse(localStorage.getItem('rayyan_favs')) || [];

window.toggleFavorite = function (e, toolId) {
  e.stopPropagation();
  if (favorites.includes(toolId)) {
    favorites = favorites.filter(id => id !== toolId);
  } else {
    favorites.push(toolId);
  }
  localStorage.setItem('rayyan_favs', JSON.stringify(favorites));
  renderTools();

  // Simple animation feedback
  const btn = e.currentTarget;
  if (btn) {
    btn.style.transform = "scale(1.2)";
    setTimeout(() => btn.style.transform = "scale(1)", 200);
  }
};


// DOM Elements
const grid = document.getElementById('toolsGrid');
const searchInput = document.getElementById('searchInput');
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const langToggle = document.getElementById('langToggle');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Only render tools if the grid exists (tools.html)
  if (grid) {
    // Check for URL query params (e.g. ?cat=finance)
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('cat');
    if (catParam) {
      filterTools(catParam);
    } else {
      renderTools();
    }
  }

  // Search Listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      displayTools = tools.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.desc.toLowerCase().includes(query)
      );
      renderTools();
    });
  }

  // Language Toggle
  if (langToggle) {
    langToggle.addEventListener('click', () => toggleLanguage());
    // Init from local storage
    if (localStorage.getItem('rayyan_lang') === 'ar') {
      toggleLanguage(true);
    }
  }
});

// RTL Logic
function toggleLanguage(forceAr = false) {
  const html = document.documentElement;
  const isRTL = html.getAttribute('dir') === 'rtl';

  if (forceAr === true || !isRTL) {
    html.setAttribute('dir', 'rtl');
    html.setAttribute('lang', 'ar');
    langToggle.innerText = 'EN';
    localStorage.setItem('rayyan_lang', 'ar');
    updateTextContent('ar');
  } else {
    html.setAttribute('dir', 'ltr');
    html.setAttribute('lang', 'en');
    langToggle.innerText = 'عربي';
    localStorage.setItem('rayyan_lang', 'en');
    updateTextContent('en');
  }
}

function updateTextContent(lang) {
  // Update UI Elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      // Use innerHTML for keys that might have HTML (like hero_title)
      // Use innerHTML for keys that might have HTML (like hero_title)
      if (key === 'hero_title' || key === 'about_desc') el.innerHTML = translations[lang][key];
      else el.innerText = translations[lang][key];
    }
  });

  // Update Search Placeholder
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.placeholder = translations[lang]['search_placeholder'];
  }

  // Re-render tools to update titles/descs
  renderTools();
}

// Render Grid
function renderTools() {
  grid.innerHTML = '';

  if (displayTools.length === 0) {
    grid.innerHTML = '<p style="color:#aaa; text-align:center; grid-column:1/-1;">No tools found.</p>';
    return;
  }

  const isAr = document.documentElement.getAttribute('lang') === 'ar';

  grid.innerHTML = displayTools.map(tool => {
    const title = isAr && tool.titleAr ? tool.titleAr : tool.title;
    const desc = isAr && tool.descAr ? tool.descAr : tool.desc;
    const actionText = isAr ? 'فتح الأداة' : 'Open Tool';
    const isFav = favorites.includes(tool.id);
    const heartStyle = isFav ? "fill:var(--accent-pink); color:var(--accent-pink);" : "color:rgba(255,255,255,0.3);";

    return `
      <div class="glass-panel tool-card" onclick="openModal('${tool.id}')" style="position:relative;">
        <button onclick="toggleFavorite(event, '${tool.id}')" 
                style="position:absolute; top:15px; right:15px; background:none; border:none; cursor:pointer; z-index:5;">
            <i data-lucide="heart" style="width:20px; height:20px; ${heartStyle}"></i>
        </button>
        <div class="tool-icon"><i data-lucide="${tool.icon}"></i></div>
        <div>
          <div class="tool-title">${title}</div>
          <div class="tool-desc">${desc}</div>
        </div>
        <button class="tool-action">${actionText}</button>
      </div>
    `;
  }).join('');

  // Update Total Count
  updateTotalToolsCount(displayTools.length);

  // Initialize Icons
  if (window.lucide) {
    window.lucide.createIcons();
  } else if (window.Lucide) {
    window.Lucide.createIcons();
  } else {
    // Retry if script loaded late
    setTimeout(() => {
      if (window.lucide) window.lucide.createIcons();
      else if (window.Lucide) window.Lucide.createIcons();
    }, 500);
    setTimeout(() => {
      if (window.lucide) window.lucide.createIcons();
      else if (window.Lucide) window.Lucide.createIcons();
    }, 2000);
  }

  // Debug/Inventory Console Log
  console.log(`Rendered ${displayTools.length} tools.`);
}

function updateTotalToolsCount(count) {
  const totalCountEl = document.getElementById('totalToolsCount');
  if (totalCountEl) {
    const isAr = document.documentElement.getAttribute('lang') === 'ar';
    totalCountEl.innerText = isAr ? `${count} أداة` : `${count} Tools`;
  } else {
    // If totalToolsCount element doesn't exist, try to inject it near the "All Tools" category button
    const allToolsButton = document.querySelector('.category-filter-btn[data-category="all"]');
    if (allToolsButton && !document.getElementById('dynTotalToolsCount')) {
      const countSpan = document.createElement('span');
      countSpan.id = 'dynTotalToolsCount';
      countSpan.style.marginLeft = '8px';
      countSpan.style.padding = '2px 8px';
      countSpan.style.backgroundColor = 'var(--accent-pink)';
      countSpan.style.borderRadius = '12px';
      countSpan.style.fontSize = '0.8em';
      countSpan.style.color = 'white';
      countSpan.style.fontWeight = 'bold';
      allToolsButton.appendChild(countSpan);
      updateTotalToolsCount(count); // Call again to set text on the newly created element
    }
  }
}


// Category Filter
function filterTools(category) {
  if (category === 'all') {
    displayTools = [...tools];
  } else {
    displayTools = tools.filter(t => t.cat === category);
  }
  const toolsSection = document.getElementById('tools');
  if (toolsSection) toolsSection.scrollIntoView({ behavior: 'smooth' });
  renderTools();
}

// Modal Logic
function openModal(toolId) {
  const tool = tools.find(t => t.id === toolId);
  if (!tool) return;

  const isAr = document.documentElement.getAttribute('lang') === 'ar';
  if (modalTitle) modalTitle.textContent = isAr && tool.titleAr ? tool.titleAr : tool.title;
  // Routing to specific modules based on ID prefix or cat
  const category = tool.cat; // Get category from the found tool
  if (toolId.startsWith('loan') || toolId.startsWith('vat') || toolId.startsWith('net') || toolId.startsWith('curr') || toolId.startsWith('sav') || toolId === 'zakat' || toolId.startsWith('fin-')) {
    if (toolId === 'loan-calc') FinanceTools.renderLoanCalc(modalBody);
    else if (toolId === 'vat-calc') FinanceTools.renderVAT(modalBody);
    else if (toolId === 'net-salary') FinanceTools.renderSalary(modalBody);
    else if (toolId === 'currency') FinanceTools.renderCurrency(modalBody);
    else if (toolId === 'savings') FinanceTools.renderSavings(modalBody);
    else if (toolId === 'zakat') FinanceTools.renderZakat(modalBody);
    else if (toolId === 'fin-discount') FinanceTools.renderDiscount(modalBody);
  }
  else if (category === 'time') {
    if (toolId === 'hijri') TimeTools.renderHijri(modalBody);
    else if (toolId === 'diff') TimeTools.renderDiff(modalBody);
    else if (toolId === 'timer') TimeTools.renderTimer(modalBody);
    else if (toolId === 'timezone') TimeTools.renderZone(modalBody);
    else if (toolId === 'time-add') TimeTools.renderDateAdd(modalBody);
  }
  else if (category === 'text') {
    if (toolId === 'adobe-fix') TextTools.renderAdobe(modalBody);
    else if (toolId === 'cleaner') TextTools.renderCleaner(modalBody);
    else if (toolId === 'case') TextTools.renderCase(modalBody);
    else if (toolId === 'hashtag') TextTools.renderHashtag(modalBody);
    else if (toolId === 'utm') TextTools.renderUTM(modalBody);
    else if (toolId === 'text-link') TextTools.renderLinks(modalBody);
    else if (toolId === 'text-punc') TextTools.renderPunc(modalBody);
    else if (toolId === 'text-dia') TextTools.renderTashkeel(modalBody);
    else if (toolId === 'text-lorem') TextTools.renderLorem(modalBody);
  }
  else if (category === 'productivity') {
    if (toolId === 'qr') ProdTools.renderQR(modalBody);
    else if (toolId === 'unit') ProdTools.renderUnit(modalBody);
    else if (toolId === 'password') ProdTools.renderPass(modalBody);
    else if (toolId === 'speed') ProdTools.renderSpeed(modalBody);
    else if (toolId === 'prod-iban') ProdTools.renderIBAN(modalBody);
    else if (toolId === 'prod-inv') ProdTools.renderInvoice(modalBody);
    else if (toolId === 'prod-pomodoro') ProdTools.renderPomodoro(modalBody);
    else if (toolId === 'life-bill') LifeTools.renderBill(modalBody);
    else if (toolId === 'life-decision') LifeTools.renderDecision(modalBody);
    else if (toolId === 'life-tip') LifeTools.renderTip(modalBody);
    else if (toolId === 'life-reaction') LifeTools.renderReaction(modalBody);
  }
  else if (category === 'content') {
    if (toolId === 'social-sizes') ContentTools.renderSocial(modalBody);
    else if (toolId === 'caption') ContentTools.renderCaption(modalBody);
    else if (toolId === 'ideas') ContentTools.renderIdeas(modalBody);
    else if (toolId === 'proof') ContentTools.renderProof(modalBody);
    else if (toolId === 'media-rec') MediaTools.renderRecorder(modalBody);
  }
  else if (category === 'pdf') {
    if (toolId === 'pdf-merge') PDFTools.renderMerge(modalBody);
    else if (toolId === 'pdf-split') PDFTools.renderSplit(modalBody);
    else if (toolId === 'pdf-compress') PDFTools.renderCompress(modalBody);
    else if (toolId === 'pdf-to-img') PDFTools.renderToImages(modalBody);
    else if (toolId === 'img-to-pdf') PDFTools.renderToPDF(modalBody);
    else if (toolId === 'pdf-page-num') PDFTools.renderPageNum(modalBody);
    else if (toolId === 'pdf-rotate') PDFTools.renderRotate(modalBody);
    else if (toolId === 'pdf-watermark') PDFTools.renderWatermark(modalBody);
    else if (toolId === 'pdf-protect') PDFTools.renderProtect(modalBody);
    else if (toolId === 'pdf-unlock') PDFTools.renderUnlock(modalBody);
    else if (toolId === 'pdf-rem') PDFTools.renderRemPage(modalBody);
    else if (toolId === 'pdf-ord') PDFTools.renderOrder(modalBody);
    else if (toolId === 'pdf-crop') PDFTools.renderCrop(modalBody);
    else if (toolId === 'pdf-extract-text') PDFTools.renderExt(modalBody);
    else if (toolId === 'pdf-extract-imgs') PDFTools.renderExt(modalBody);
  }
  else if (category === 'image') {
    if (toolId === 'img-compress') ImageTools.renderCompress(modalBody);
    else if (toolId === 'img-resize') ImageTools.renderResize(modalBody);
    else if (toolId === 'img-webp') ImageTools.renderWebP(modalBody);
    else if (toolId === 'img-bg') ImageTools.renderRemoveBG(modalBody);
    else if (toolId === 'img-heic') ImageTools.renderHEIC(modalBody);
    else if (toolId === 'img-social') ImageTools.renderSocialImg(modalBody);
    else if (toolId === 'img-border') ImageTools.renderBorder(modalBody);
    else if (toolId === 'img-meta') ImageTools.renderMeta(modalBody);
    else if (toolId === 'image-palette') ImageTools.renderPalette(modalBody);
    else if (toolId === 'img-meme') ImageTools.renderMeme(modalBody);
    else if (toolId === 'img-crop') ImageTools.renderCropper(modalBody);
    else if (toolId === 'img-filter') ImageTools.renderFilters(modalBody);
  }
  else if (category === 'developer') {
    if (toolId === 'dev-json') DevTools.renderJson(modalBody);
    else if (toolId === 'dev-base64') DevTools.renderBase64(modalBody);
    else if (toolId === 'dev-hash') DevTools.renderHash(modalBody);
    else if (toolId === 'dev-url') DevTools.renderUrlEnc(modalBody);
    else if (toolId === 'dev-regex') DevTools.renderRegex(modalBody);
    else if (toolId === 'dev-diff') DevTools.renderDiff(modalBody);
    else if (toolId === 'dev-screen') DevTools.renderScreenInfo(modalBody);
    else if (toolId === 'dev-jwt') DevTools.renderJWT(modalBody);
    else if (toolId === 'dev-sql') DevTools.renderSQL(modalBody);
    else if (toolId === 'dev-chmod') DevTools.renderChmod(modalBody);
    else if (toolId === 'dev-cron') DevTools.renderCron(modalBody);
    else if (toolId === 'dev-curl') DevTools.renderCurl(modalBody);
    else if (toolId === 'dev-ua') DevTools.renderUA(modalBody);
    else if (toolId === 'dev-meta') DevTools.renderMeta(modalBody);
    else if (toolId === 'dev-fav') DevTools.renderFavicon(modalBody);
    else if (toolId === 'dev-svg') DevTools.renderSVG(modalBody);
    else if (toolId === 'dev-md') DevTools.renderMarkdown(modalBody);

    // Design Tools routed here
    else if (toolId === 'des-grad') DesignTools.renderGradient(modalBody);
    else if (toolId === 'des-shadow') DesignTools.renderShadow(modalBody);
    else if (toolId === 'des-contrast') DesignTools.renderContrast(modalBody);
  }
  else if (category === 'saudi') {
    if (toolId === 'saudi-eos') SaudiTools.renderEOS(modalBody);
    else if (toolId === 'saudi-leave') SaudiTools.renderLeave(modalBody);
    else if (toolId === 'text-tafqeet') SaudiTools.renderTafqeet(modalBody);
    else if (toolId === 'saudi-events') SaudiTools.renderEvents(modalBody);
    else if (toolId === 'saudi-holiday') SaudiTools.renderHijri(modalBody);
    else if (toolId === 'saudi-vacation') SaudiTools.renderVacationSal(modalBody);
  }
  else if (category === 'media') {
    if (toolId === 'media-rec') MediaTools.renderRecorder(modalBody);
    else if (toolId === 'media-gif') MediaTools.renderGif(modalBody);
    else if (toolId === 'media-mp3') MediaTools.renderVid2Mp3(modalBody);
  }
  else if (category === 'health') {
    if (toolId === 'health-bmi') HealthTools.renderBMI(modalBody);
    else if (toolId === 'health-bmr') HealthTools.renderBMR(modalBody);
    else if (toolId === 'health-water') HealthTools.renderWater(modalBody);
  }
  else if (category === 'education') {
    if (toolId === 'edu-gpa') EducationTools.renderGPA(modalBody);
    else if (toolId === 'edu-grade') EducationTools.renderGrade(modalBody);
  }

  else {
    // Fallback
    modalBody.innerHTML = `<div style="text-align:center; padding:40px; color:#aaa;">Feature coming soon: ${tool.title} module logic.</div>`;
  }

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent scroll
}

function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Close on outside click
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// About Modal
window.openAbout = function () {
  modalTitle.innerText = "About Rayyan Portal";

  const isAr = document.documentElement.dir === 'rtl';
  const content = isAr ?
    `
    <div style="text-align:center; padding:20px;">
      <h2 style="margin-bottom:16px;">مرحباً بك في بوابة ريان</h2>
      <p style="color:var(--text-secondary); margin-bottom:24px;">
        منصة أدوات متميزة مصممة خصيصاً للمستخدمين في المملكة العربية السعودية.
        <br>مجانية بالكامل ومفتوحة المصدر.
      </p>
      <div style="background:rgba(255,255,255,0.05); padding:16px; border-radius:12px;">
        <strong>الإصدار 2.0</strong>
        <br><span style="font-size:12px; opacity:0.7;">تم التطوير باستخدام HTML/CSS/JS النقي</span>
      </div>
    </div>
    `
    :
    `
    <div style="text-align:center; padding:20px;">
      <h2 style="margin-bottom:16px;">Welcome to Rayyan Portal</h2>
      <p style="color:var(--text-secondary); margin-bottom:24px;">
        A premium suite of essential utilities designed for Saudi users.
        <br>Completely free and open source.
      </p>
      <div style="background:rgba(255,255,255,0.05); padding:16px; border-radius:12px;">
        <strong>Version 2.0</strong>
        <br><span style="font-size:12px; opacity:0.7;">Built with Vanilla HTML/CSS/JS</span>
      </div>
    </div>
    `;

  modalBody.innerHTML = content;
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
};

// Expose filterTools 
window.filterTools = function (category) {
  // If we are on index.html (no tools grid), clicking a category should redirect to tools.html
  if (!grid) {
    window.location.href = `tools.html?cat=${category}`;
    return;
  }

  if (category === 'all') {
    displayTools = [...tools];
  } else if (category === 'favorites') {
    displayTools = tools.filter(t => favorites.includes(t.id));
  } else {
    displayTools = tools.filter(t => t.cat === category);
  }

  const toolsSection = document.getElementById('tools');
  if (toolsSection) toolsSection.scrollIntoView({ behavior: 'smooth' });
  renderTools();
};

// Mobile Menu Logic
window.toggleMobileMenu = function () {
  const nav = document.getElementById('mobileNav');
  if (nav) {
    nav.classList.toggle('active');
    if (nav.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
};
