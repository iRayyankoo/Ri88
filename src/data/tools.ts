export interface Tool {
    id: string;
    cat: string;
    icon: string;
    status: 'existing' | 'added' | 'new' | string;
    title: string;
    titleAr: string;
    desc: string;
    descAr: string;
    hidden?: boolean;
}

export const tools: Tool[] = [
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
        id: 'pdf-to-img', cat: 'pdf', icon: 'image', status: 'existing',
        title: 'PDF to Images', titleAr: 'تحويل PDF لصور',
        desc: 'Convert PDF pages to PNG or JPG images.', descAr: 'تحويل صفحات PDF إلى صور PNG أو JPG.'
    },
    {
        id: 'img-to-pdf', cat: 'pdf', icon: 'file-text', status: 'existing',
        title: 'Images to PDF', titleAr: 'صور إلى PDF',
        desc: 'Convert multiple images into a single PDF.', descAr: 'تحويل مجموعة صور إلى ملف PDF واحد.'
    },
    {
        id: 'pdf-page-num', cat: 'pdf', icon: 'list-ordered', status: 'existing',
        title: 'Add Page Numbers', titleAr: 'أرقام الصفحات',
        desc: 'Add page numbers to your document.', descAr: 'إضافة أرقام الصفحات إلى ملفك.'
    },
    {
        id: 'pdf-rotate', cat: 'pdf', icon: 'rotate-cw', status: 'existing',
        title: 'Rotate Pages', titleAr: 'تدوير الصفحات',
        desc: 'Rotate PDF pages permanently.', descAr: 'تدوير صفحات PDF بشكل دائم.'
    },
    {
        id: 'pdf-watermark', cat: 'pdf', icon: 'stamp', status: 'existing',
        title: 'Add Watermark', titleAr: 'إضافة علامة مائية',
        desc: 'Stamp text or image on PDF pages.', descAr: 'إضافة نص أو صورة كعلامة مائية.'
    },
    {
        id: 'pdf-protect', cat: 'pdf', icon: 'lock', status: 'existing',
        title: 'Protect PDF', titleAr: 'حماية PDF',
        desc: 'Encrypt PDF with a password.', descAr: 'تشفير ملف PDF بكلمة مرور.'
    },
    {
        id: 'pdf-unlock', cat: 'pdf', icon: 'unlock', status: 'existing',
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
    {
        id: 'health-sleep', cat: 'health', icon: 'moon', status: 'new',
        title: 'Sleep Calculator', titleAr: 'حاسبة النوم',
        desc: 'Best times to wake up refreshed.', descAr: 'أفضل أوقات الاستيقاظ لتكون نشيطاً.'
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
        title: 'Text Diff', titleAr: 'مقارنة النصوص',
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

    // Languages (New)
    {
        id: 'lang-trans', cat: 'languages', icon: 'languages', status: 'new',
        title: 'Quick Translator', titleAr: 'مترجم سريع',
        desc: 'Open Google Translate quickly.', descAr: 'فتح ترجمة جوجل بسرعة مع النص.'
    },
    {
        id: 'lang-ar-corr', cat: 'languages', icon: 'check-circle-2', status: 'new',
        title: 'Arabic Corrector', titleAr: 'مصحح عربي',
        desc: 'Fix common Arabic typos.', descAr: 'تصحيح الأخطاء الإملائية العربية الشائعة.'
    },
    {
        id: 'lang-en-corr', cat: 'languages', icon: 'check-circle-2', status: 'new',
        title: 'English Corrector', titleAr: 'مصحح إنجليزي',
        desc: 'Fix capitalization and spacing.', descAr: 'تنسيق وتصحيح النصوص الإنجليزية.'
    },
    {
        id: 'lang-editor', cat: 'languages', icon: 'pen-tool', status: 'new',
        title: 'Smart Editor', titleAr: 'محرر ذكي',
        desc: 'Write and format text.', descAr: 'محرر نصوص بسيط مع عداد كلمات.'
    },

    // Sports (New Phase 7)
    {
        id: 'sport-football', cat: 'sports', icon: 'trophy', status: 'new',
        title: 'Football Hub', titleAr: 'كرة القدم',
        desc: 'Live scores, leagues & standings.', descAr: 'نتائج مباشرة، دوريات، وترتيب الفرق.'
    },
    {
        id: 'sport-basket', cat: 'sports', icon: 'dribbble', status: 'new',
        title: 'Basketball Hub', titleAr: 'كرة السلة',
        desc: 'NBA, KSA League & Global.', descAr: 'NBA، الدوري السعودي، والبطولات العالمية.'
    },
    {
        id: 'sport-motor', cat: 'sports', icon: 'flag', status: 'new',
        title: 'Motorsports', titleAr: 'رياضة المحركات',
        desc: 'F1, MotoGP, Rally schedules.', descAr: 'فورمولا 1، موتو جي بي، والراليات.'
    },
    {
        id: 'sport-combat', cat: 'sports', icon: 'swords', status: 'new',
        title: 'Combat Sports', titleAr: 'فنون قتالية',
        desc: 'UFC, Boxing, WWE events.', descAr: 'UFC، ملاكمة، ومصارعة حرة.'
    },
    {
        id: 'sport-world', cat: 'sports', icon: 'globe', status: 'new',
        title: 'World Sports', titleAr: 'رياضات عالمية',
        desc: 'Tennis, Cricket, Golf & more.', descAr: 'تنس، كريكت، غولف والمزيد.'
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

export const categories = [
    { id: 'all', name: 'All Tools', nameAr: 'الكل', icon: 'grid' },
    { id: 'favorites', name: 'Favorites', nameAr: 'المفضلة', icon: 'star' },
    { id: 'finance', name: 'Finance', nameAr: 'المالية', icon: 'wallet' },
    { id: 'pdf', name: 'PDF', nameAr: 'أدوات PDF', icon: 'file-text' },
    { id: 'image', name: 'Image', nameAr: 'صور', icon: 'image' },
    { id: 'text', name: 'Text', nameAr: 'نصوص', icon: 'align-left' },
    { id: 'time', name: 'Time', nameAr: 'الوقت', icon: 'clock' },
    { id: 'health', name: 'Health', nameAr: 'صحة', icon: 'activity' },
    { id: 'productivity', name: 'Productivity', nameAr: 'الإنتاجية', icon: 'zap' },
    { id: 'content', name: 'Content', nameAr: 'محتوى', icon: 'smartphone' },
    { id: 'developer', name: 'Developer', nameAr: 'للمبرمجين', icon: 'code' },
    { id: 'saudi', name: 'Saudi Utils', nameAr: 'خدمات سعودية', icon: 'flag' },
    { id: 'education', name: 'Education', nameAr: 'التعليم', icon: 'graduation-cap' },
    { id: 'languages', name: 'Languages', nameAr: 'لغات', icon: 'languages' },
    { id: 'sports', name: 'Sports', nameAr: 'رياضة', icon: 'trophy' },
];
