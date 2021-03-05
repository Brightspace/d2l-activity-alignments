import '@polymer/polymer/polymer-legacy.js';
window.D2L = window.D2L || {};
window.D2L.PolymerBehaviors = window.D2L.PolymerBehaviors || {};
window.D2L.PolymerBehaviors.SelectOutcomes = window.D2L.PolymerBehaviors.SelectOutcomes || {};
window.D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior = window.D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior || {};
window.D2L.SelectOutcomes = window.D2L.SelectOutcomes || {};
window.D2L.SelectOutcomes.Language = window.D2L.SelectOutcomes.Language || {};
window.D2L.SelectOutcomes.Language.En = {
	'a11yHeaderAriaLabel': 'Tree level {level} - {status} - {name}',
	'a11yLeafAriaLabel': 'Tree leaf {shortCode} - {status} - {description}',
	'add': 'Add',
	'addLabel': 'Add selection',
	'alignmentRemoved': 'Alignment removed',
	'cancel': 'Cancel',
	'cancelLabel': 'Cancel selection',
	'collapsed': 'collapsed',
	'directAlignments': '{headerTitle} Aligned Directly to This Activity',
	'error': 'An error has occured',
	'expanded': 'expanded',
	'indirectAlignments': '{headerTitle} Aligned to Rubric Criteria',
	'noSearchResultFor': 'No results found for "{searchText}"',
	'notSelected': 'not selected',
	'outcomesHierarchicalTree': 'Outcomes Hierarchical Tree',
	'removeAlignment': 'Remove alignment',
	'searchCleared': 'Search cleared',
	'searchOutcomes': 'Search Outcomes',
	'searchPlaceholder': 'Search...',
	'searchResultFor': '{numOfResults} search results for "{searchText}"',
	'searchResultsNumber': '{numOfResults} search results',
	'selected': 'selected',
	'defaultTagType': 'Tags',
	'navigationDescription': '{title}: Use arrow keys to navigate {typeName}, use delete or backspace key to remove {typeName}.',
	'navigationDescriptionNoActions': '{title}: Use arrow keys to navigate {typeName}.'
};

/*
 * En lang terms
 * @polymerBehavior D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangEnBehavior
 */
D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangEnBehavior = {
	en: window.D2L.SelectOutcomes.Language.En
};
