import '@polymer/polymer/polymer-legacy.js';
window.D2L = window.D2L || {};
window.D2L.PolymerBehaviors = window.D2L.PolymerBehaviors || {};
window.D2L.PolymerBehaviors.SelectOutcomes = window.D2L.PolymerBehaviors.SelectOutcomes || {};
window.D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior = window.D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior || {};
window.D2L.SelectOutcomes = window.D2L.SelectOutcomes || {};
window.D2L.SelectOutcomes.Language = window.D2L.SelectOutcomes.Language || {};
window.D2L.SelectOutcomes.Language.Ar = {
	'a11yHeaderAriaLabel': 'مستوى الشجرة {level} - {status} - {name}',
	'a11yLeafAriaLabel': 'ورقة الشجرة {shortCode} - {status} - {description}',
	'add': 'إضافة',
	'addLabel': 'إضافة تحديد',
	'alignmentRemoved': 'تمت إزالة المحاذاة',
	'cancel': 'إلغاء',
	'cancelLabel': 'إلغاء التحديد',
	'collapsed': 'مطوي',
	'defaultTagType': 'العلامات',
	'directAlignments': 'تمت محاذاة {headerTitle} مباشرة مع هذا النشاط',
	'error': 'حدث خطأ',
	'expanded': 'موسّع',
	'indirectAlignments': 'تمت محاذاة {headerTitle} مع معيار آلية التقييم',
	'navigationDescription': '{title}: استخدم مفاتيح الأسهم للانتقال إلى {typeName}، واستخدم مفتاح الحذف أو مفتاح المسافة للخلف لإزالة {typeName}.',
	'navigationDescriptionNoActions': '{title}: استخدم مفاتيح الأسهم للانتقال إلى {typeName}.',
	'noSearchResultFor': 'لم يتم العثور على أي نتائج لـ "{searchText}"',
	'notSelected': 'لم يتم التحديد',
	'outcomesHierarchicalTree': 'نتائج الشجرة الهرمية',
	'removeAlignment': 'إزالة المحاذاة',
	'searchCleared': 'تم مسح البحث',
	'searchOutcomes': 'نتائج البحث',
	'searchPlaceholder': 'البحث...',
	'searchResultFor': '{numOfResults} من نتائج البحث لـ "{searchText}"',
	'searchResultsNumber': '{numOfResults} من نتائج البحث',
	'selected': 'تم التحديد'
};

/*
 * Ar lang terms
 * @polymerBehavior D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangArBehavior
 */
D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangArBehavior = {
	ar: window.D2L.SelectOutcomes.Language.Ar
};
