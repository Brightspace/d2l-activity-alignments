import '@polymer/polymer/polymer-legacy.js';
window.D2L = window.D2L || {};
window.D2L.PolymerBehaviors = window.D2L.PolymerBehaviors || {};
window.D2L.PolymerBehaviors.SelectOutcomes = window.D2L.PolymerBehaviors.SelectOutcomes || {};
window.D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior = window.D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior || {};
window.D2L.SelectOutcomes = window.D2L.SelectOutcomes || {};
window.D2L.SelectOutcomes.Language = window.D2L.SelectOutcomes.Language || {};
window.D2L.SelectOutcomes.Language.EsEs = {
	'a11yHeaderAriaLabel': 'Nivel de árbol {level} - {status} - {name}',
	'a11yLeafAriaLabel': 'Hoja de árbol {shortCode} - {status} - {description}',
	'add': 'Añadir',
	'addLabel': 'Agregar selección',
	'alignmentRemoved': 'Alineación eliminada',
	'cancel': 'Cancelar',
	'cancelLabel': 'Cancelar selección',
	'collapsed': 'contraída',
	'defaultTagType': 'Etiquetas',
	'directAlignments': '{headerTitle} alineado directamente con esta actividad',
	'error': 'Se ha producido un error',
	'expanded': 'expandida',
	'indirectAlignments': '{headerTitle} alineado con los criterios de la rúbrica',
	'navigationDescription': '{title}: utilice las teclas de flecha para desplazarse por {typeName}, utilice la tecla Supr o la de retroceso para eliminar {typeName}.',
	'navigationDescriptionNoActions': '{title}: utilice las teclas de flecha para desplazarse por {typeName}.',
	'noSearchResultFor': 'No se han encontrado resultados para "{searchText}"',
	'notSelected': 'no seleccionado',
	'outcomesHierarchicalTree': 'Árbol jerárquico de resultados',
	'removeAlignment': 'Quitar la alineación',
	'searchCleared': 'Búsqueda borrada',
	'searchOutcomes': 'Resultados de la búsqueda',
	'searchPlaceholder': 'Buscar…',
	'searchResultFor': '{numOfResults} resultados de búsqueda de "{searchText}"',
	'searchResultsNumber': '{numOfResults} resultados de búsqueda',
	'selected': 'seleccionado(s)'
};

/*
 * EsEs lang terms
 * @polymerBehavior D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangEsEsBehavior
 */
D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangEsEsBehavior = {
	esEs: window.D2L.SelectOutcomes.Language.EsEs
};
