import '@polymer/polymer/polymer-legacy.js';
window.D2L = window.D2L || {};
window.D2L.PolymerBehaviors = window.D2L.PolymerBehaviors || {};
window.D2L.PolymerBehaviors.SelectOutcomes = window.D2L.PolymerBehaviors.SelectOutcomes || {};
window.D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior = window.D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior || {};
window.D2L.SelectOutcomes = window.D2L.SelectOutcomes || {};
window.D2L.SelectOutcomes.Language = window.D2L.SelectOutcomes.Language || {};
window.D2L.SelectOutcomes.Language.Pt = {
	'a11yHeaderAriaLabel': 'Nível de árvore {level} – {status} – {name}',
	'a11yLeafAriaLabel': 'Folha de árvore {shortCode} – {status} – {description}',
	'add': 'Adicionar',
	'addLabel': 'Adicionar seleção',
	'alignmentRemoved': 'Alinhamento removido',
	'cancel': 'Cancelar',
	'cancelLabel': 'Cancelar seleção',
	'collapsed': 'recolhido',
	'defaultTagType': 'Marcas',
	'directAlignments': '{headerTitle} Alinhado diretamente a esta atividade',
	'error': 'Ocorreu um erro',
	'expanded': 'expandido',
	'indirectAlignments': '{headerTitle} Alinhado aos critérios de rubrica',
	'navigationDescription': '{title}: use as teclas de seta para navegar em {typeName} e use a tecla Delete ou Backspace para remover {typeName}.',
	'navigationDescriptionNoActions': '{title}: use as teclas de seta para navegar em {typeName}.',
	'noSearchResultFor': 'Nenhum resultado encontrado para "{searchText}"',
	'notSelected': 'não selecionados',
	'outcomesHierarchicalTree': 'Árvore Hierárquica de Resultados',
	'removeAlignment': 'Remover alinhamento',
	'searchCleared': 'Pesquisa apagada',
	'searchOutcomes': 'Resultados de Pesquisa',
	'searchPlaceholder': 'Pesquisar…',
	'searchResultFor': '{numOfResults} resultados de pesquisa para "{searchText}"',
	'searchResultsNumber': '{numOfResults} resultados de pesquisa',
	'selected': 'selecionados'
};

/*
 * Pt lang terms
 * @polymerBehavior D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangPtBehavior
 */
D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangPtBehavior = {
	pt: window.D2L.SelectOutcomes.Language.Pt
};
