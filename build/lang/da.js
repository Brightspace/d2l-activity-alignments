import '@polymer/polymer/polymer-legacy.js';
window.D2L = window.D2L || {};
window.D2L.PolymerBehaviors = window.D2L.PolymerBehaviors || {};
window.D2L.PolymerBehaviors.SelectOutcomes = window.D2L.PolymerBehaviors.SelectOutcomes || {};
window.D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior = window.D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior || {};
window.D2L.SelectOutcomes = window.D2L.SelectOutcomes || {};
window.D2L.SelectOutcomes.Language = window.D2L.SelectOutcomes.Language || {};
window.D2L.SelectOutcomes.Language.Da = {
	'a11yHeaderAriaLabel': 'Træniveau {level} - {status} - {name}',
	'a11yLeafAriaLabel': 'Træstruktur {shortCode} - {status} - {description}',
	'add': 'Tilføj',
	'addLabel': 'Tilføj valg',
	'alignmentRemoved': 'Justering fjernet',
	'cancel': 'Annuller',
	'cancelLabel': 'Annuller valg',
	'collapsed': 'skjult',
	'defaultTagType': 'Tags',
	'directAlignments': '{headerTitle} justeret direkte til denne aktivitet',
	'error': 'Der opstod en fejl',
	'expanded': 'udvidet',
	'indirectAlignments': '{headerTitle} justeret til rubrikkriterier',
	'navigationDescription': '{title}: Use arrow keys to navigate {typeName}, use delete or backspace key to remove {typeName}.',
	'navigationDescriptionNoActions': '{title}: Use arrow keys to navigate {typeName}.',
	'noSearchResultFor': 'Ingen resultater fundet for "{searchText}"',
	'notSelected': 'ikke valgt',
	'outcomesHierarchicalTree': 'Hierarkisk træ for resultater',
	'removeAlignment': 'Fjern justering',
	'searchCleared': 'Søgning ryddet',
	'searchOutcomes': 'Søg efter resultater',
	'searchPlaceholder': 'Søg ...',
	'searchResultFor': '{numOfResults} søgeresultater for "{searchText}"',
	'searchResultsNumber': '{numOfResults} søgeresultater',
	'selected': 'valgt'
};

/*
 * Da lang terms
 * @polymerBehavior D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangDaBehavior
 */
D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangDaBehavior = {
	da: window.D2L.SelectOutcomes.Language.Da
};
