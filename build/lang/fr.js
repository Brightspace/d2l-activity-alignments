import '@polymer/polymer/polymer-legacy.js';
window.D2L = window.D2L || {};
window.D2L.PolymerBehaviors = window.D2L.PolymerBehaviors || {};
window.D2L.PolymerBehaviors.SelectOutcomes = window.D2L.PolymerBehaviors.SelectOutcomes || {};
window.D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior = window.D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior || {};
window.D2L.SelectOutcomes = window.D2L.SelectOutcomes || {};
window.D2L.SelectOutcomes.Language = window.D2L.SelectOutcomes.Language || {};
window.D2L.SelectOutcomes.Language.Fr = {
	'a11yHeaderAriaLabel': 'Niveau de l’arborescence {level} – {status} – {name}',
	'a11yLeafAriaLabel': 'Élément de l’arbre {shortCode} – {status} – {description}',
	'add': 'Ajouter',
	'addLabel': 'Ajouter la sélection',
	'alignmentRemoved': 'Alignement supprimé',
	'cancel': 'Annuler',
	'cancelLabel': 'Annuler la sélection',
	'collapsed': 'réduit(e)',
	'defaultTagType': 'Balises',
	'directAlignments': '{headerTitle} aligné directement avec cette activité',
	'error': 'Une erreur est survenue',
	'expanded': 'développé(e)',
	'indirectAlignments': '{headerTitle} aligné avec les critères de la grille d’évaluation',
	'navigationDescription': '{title} : utilisez les flèches pour naviguer dans {typeName}, utilisez les touches Supprimer et Retour arrière pour supprimer {typeName}.',
	'navigationDescriptionNoActions': '{title} : utilisez les flèches pour naviguer dans {typeName}.',
	'noSearchResultFor': 'Aucun résultat trouvé pour "{searchText}".',
	'notSelected': 'non sélectionné(e)',
	'outcomesHierarchicalTree': 'Résultats de l’arborescence hiérarchique',
	'removeAlignment': 'Supprimer l’alignement',
	'searchCleared': 'Recherche effacée',
	'searchOutcomes': 'Résultats de la recherche',
	'searchPlaceholder': 'Recherche…',
	'searchResultFor': '{numOfResults} résultat(s) de la recherche pour "{searchText}"',
	'searchResultsNumber': '{numOfResults} résultat(s) de la recherche',
	'selected': 'sélectionné(s)'
};

/*
 * Fr lang terms
 * @polymerBehavior D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangFrBehavior
 */
D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangFrBehavior = {
	fr: window.D2L.SelectOutcomes.Language.Fr
};
