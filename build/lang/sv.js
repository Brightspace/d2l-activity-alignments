import '@polymer/polymer/polymer-legacy.js';
window.D2L = window.D2L || {};
window.D2L.PolymerBehaviors = window.D2L.PolymerBehaviors || {};
window.D2L.PolymerBehaviors.SelectOutcomes = window.D2L.PolymerBehaviors.SelectOutcomes || {};
window.D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior = window.D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior || {};
window.D2L.SelectOutcomes = window.D2L.SelectOutcomes || {};
window.D2L.SelectOutcomes.Language = window.D2L.SelectOutcomes.Language || {};
window.D2L.SelectOutcomes.Language.Sv = {
	'a11yHeaderAriaLabel': 'Trädnivå: {level} - {status} - {name}',
	'a11yLeafAriaLabel': 'Trädlöv: {shortCode} - {status} - {description}',
	'add': 'Lägg till',
	'addLabel': 'Lägg till markering',
	'alignmentRemoved': 'Justeringen har tagits bort',
	'cancel': 'Avbryt',
	'cancelLabel': 'Avbryt val',
	'collapsed': 'komprimerat',
	'defaultTagType': 'Tags',
	'directAlignments': '{headerTitle} är direkt justerad efter den här aktiviteten',
	'error': 'Ett fel har inträffat',
	'expanded': 'expanderat',
	'indirectAlignments': '{headerTitle} är justerad efter rubriceringskriterier',
	'navigationDescription': '{title}: Use arrow keys to navigate {typeName}, use delete or backspace key to remove {typeName}.',
	'navigationDescriptionNoActions': '{title}: Use arrow keys to navigate {typeName}.',
	'noSearchResultFor': 'Det gick inte att hitta några resultat för "{searchText}"',
	'notSelected': 'inte markerade',
	'outcomesHierarchicalTree': 'Resultathierarkiträd',
	'removeAlignment': 'Ta bort justering',
	'searchCleared': 'Sökningen rensades',
	'searchOutcomes': 'Sökresultat',
	'searchPlaceholder': 'Sök ...',
	'searchResultFor': '{numOfResults} sökresultat för "{searchText}"',
	'searchResultsNumber': '{numOfResults} sökresultat',
	'selected': 'vald'
};

/*
 * Sv lang terms
 * @polymerBehavior D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangSvBehavior
 */
D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangSvBehavior = {
	sv: window.D2L.SelectOutcomes.Language.Sv
};
