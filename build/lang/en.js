import '@polymer/polymer/polymer-legacy.js';
window.D2L = window.D2L || {};
window.D2L.PolymerBehaviors = window.D2L.PolymerBehaviors || {};
window.D2L.PolymerBehaviors.SelectOutcomes = window.D2L.PolymerBehaviors.SelectOutcomes || {};
window.D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior = window.D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior || {};
window.D2L.SelectOutcomes = window.D2L.SelectOutcomes || {};
window.D2L.SelectOutcomes.Language = window.D2L.SelectOutcomes.Language || {};
window.D2L.SelectOutcomes.Language.En = {
	'add': 'Add',
	'addLabel': 'Add selection',
	'cancel': 'Cancel',
	'cancelLabel': 'Cancel selection',
	'error': 'An error has occured',
	'removeAlignment': 'Remove alignment',
	'alignmentRemoved': 'Alignment removed',
	'directAlignments': '{headerTitle} Aligned Directly to This Activity',
	'indirectAlignments': '{headerTitle} Aligned to Rubric Criteria',
	'searchOutcomes': 'Search Outcomes',
	'searchPlaceholder': 'Search...',
	'searchCleared': 'Search cleared',
	'searchResultsNumber': '{numOfResults} search results',
	'searchResultFor': '{numOfResults} search results for "{searchText}"',
	'noSearchResultFor': 'No results found for "{searchText}"',
	'selected': 'selected',
	'outcomesHierarchicalTree': 'Outcomes Hierarchical Tree',
	'collapsed': 'collapsed',
	'expanded': 'expanded',
	'notSelected': 'not selected',
	'a11yHeaderAriaLabel': 'Tree level {level} - {status} - {name}',
	'a11yLeafAriaLabel': 'Tree leaf {shortCode} - {status} - {description}'
};

/*
 * En lang terms
 * @polymerBehavior D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangEnBehavior
 */
D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangEnBehavior = {
	en: window.D2L.SelectOutcomes.Language.En
};
