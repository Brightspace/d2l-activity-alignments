import '@polymer/polymer/polymer-legacy.js';
window.D2L = window.D2L || {};
window.D2L.PolymerBehaviors = window.D2L.PolymerBehaviors || {};
window.D2L.PolymerBehaviors.SelectOutcomes = window.D2L.PolymerBehaviors.SelectOutcomes || {};
window.D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior = window.D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior || {};
window.D2L.SelectOutcomes = window.D2L.SelectOutcomes || {};
window.D2L.SelectOutcomes.Language = window.D2L.SelectOutcomes.Language || {};
window.D2L.SelectOutcomes.Language.Nl = {
	'a11yHeaderAriaLabel': 'Structuurniveau {level} - {status} - {name}',
	'a11yLeafAriaLabel': 'Structuurblad {shortCode} - {status} - {description}',
	'add': 'Toevoegen',
	'addLabel': 'Selectie toevoegen',
	'alignmentRemoved': 'Afstemming verwijderd',
	'cancel': 'Annuleren',
	'cancelLabel': 'Selectie annuleren',
	'collapsed': 'samengevouwen',
	'defaultTagType': 'Tags',
	'directAlignments': '{headerTitle} rechtstreeks afgestemd op deze activiteit',
	'error': 'Er is een fout opgetreden',
	'expanded': 'uitgevouwen',
	'indirectAlignments': '{headerTitle} afgestemd op rubriccriteria',
	'navigationDescription': '{title}: Use arrow keys to navigate {typeName}, use delete or backspace key to remove {typeName}.',
	'navigationDescriptionNoActions': '{title}: Use arrow keys to navigate {typeName}.',
	'noSearchResultFor': 'Geen resultaten gevonden voor \'{searchText}\'',
	'notSelected': 'niet geselecteerd',
	'outcomesHierarchicalTree': 'Hiërarchische structuur voor uitkomsten',
	'removeAlignment': 'Afstemming verwijderen',
	'searchCleared': 'Zoekopdracht gewist',
	'searchOutcomes': 'Resultaten zoekopdracht',
	'searchPlaceholder': 'Zoeken...',
	'searchResultFor': '{numOfResults} zoekresultaten voor \'{searchText}\'',
	'searchResultsNumber': '{numOfResults} zoekresultaten',
	'selected': 'geselecteerd'
};

/*
 * Nl lang terms
 * @polymerBehavior D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangNlBehavior
 */
D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangNlBehavior = {
	nl: window.D2L.SelectOutcomes.Language.Nl
};
