import '@polymer/polymer/polymer-legacy.js';
window.D2L = window.D2L || {};
window.D2L.PolymerBehaviors = window.D2L.PolymerBehaviors || {};
window.D2L.PolymerBehaviors.SelectOutcomes = window.D2L.PolymerBehaviors.SelectOutcomes || {};
window.D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior = window.D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior || {};
window.D2L.language = window.D2L.language || {};
window.D2L.language.tr = {
	'a11yHeaderAriaLabel': 'Ağaç seviyesi {level} - {status} - {name}',
	'a11yLeafAriaLabel': 'Ağaç yaprağı {shortCode} - {status} - {description}',
	'add': 'Ekle',
	'addLabel': 'Seçimi ekle',
	'alignmentRemoved': 'Hizalama kaldırıldı',
	'cancel': 'İptal',
	'cancelLabel': 'Seçimi iptal et',
	'collapsed': 'daraltılmış',
	'directAlignments': '{headerTitle} Doğrudan Bu Etkinliğe Hizalandı',
	'error': 'Bir hata oluştu',
	'expanded': 'genişletilmiş',
	'indirectAlignments': '{headerTitle} Rubrik Kriterlerine Hizalandı',
	'noSearchResultFor': '"{searchText}" için hiçbir sonuç bulunamadı',
	'notSelected': 'seçili değil',
	'outcomesHierarchicalTree': 'Kazanımlar Hiyerarşik Ağacı',
	'removeAlignment': 'Hizalamayı kaldır',
	'searchCleared': 'Arama temizlendi',
	'searchOutcomes': 'Kazanımları Ara',
	'searchPlaceholder': 'Ara...',
	'searchResultFor': '"{searchText}" için {numOfResults} arama sonucu',
	'searchResultsNumber': '{numOfResults} arama sonucu',
	'selected': 'seçildi'
};

/*
 * Tr lang terms
 * @polymerBehavior D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangTrBehavior
 */
D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangTrBehavior = {
	tr: window.D2L.language.tr
};
