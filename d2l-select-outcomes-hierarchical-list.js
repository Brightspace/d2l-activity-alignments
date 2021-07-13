/**
`d2l-select-outcomes-hierarchical-list`
*/

import 'd2l-colors/d2l-colors.js';
import 'd2l-button/d2l-button.js';
import 'd2l-inputs/d2l-input-checkbox.js';
import 'd2l-alert/d2l-alert.js';
import 'd2l-typography/d2l-typography.js';
import 'd2l-loading-spinner/d2l-loading-spinner.js';
import 'd2l-polymer-siren-behaviors/siren-entity-loading.js';
import './d2l-alignment-intent.js';
import './d2l-outcome-hierarchy-item.js';
import { IronA11yAnnouncer } from '@polymer/iron-a11y-announcer/iron-a11y-announcer.js'; //TODO: find Lit equivalent
import { LocalizeMixin } from './LocalizeMixin';
import { OutcomeParserMixin } from './OutcomeParserMixin.js';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { css, html } from 'lit-element';

class D2lSelectOutcomesHierarchicalList extends LocalizeMixin(OutcomeParserMixin(EntityMixinLit(LitElement))) {

	static get is() { return 'd2l-select-outcomes-hierarchical-list'; }

	static get properties() {
		return {
			alignments: Set,

			partialAlignments: Set,

			level: Number,

			searchText: {
				type: String,
				attribute: 'search-text'
			},

			_hierarchyItems: Object,

			_displayedHierarchyItems: Array,

			_isEmptySearchResult: Boolean
		}
	}

	static get styles() {
		return css`
			:host {
				display: block;
				overflow: hidden;
				height: 100%;
			}

			.d2l-alignment-update-content {
				width: 100%;
				display: flex;
				flex-direction: column;
				margin-top: -2px;
			}

			.d2l-hierarchy-tree {
				width: 100%;
				list-style-type: none;
				padding-inline-start: 0px;
				z-index: 2;
			}

			d2l-alert {
				margin-top: 0.5rem;
			}

			.no-result-container {
				margin-top: 24px;
				text-align: center;
				@apply --d2l-body-standard;
			}
		`;
	}

	constructor() {
		super();

		this.alignments = {};
		this.level = 0;
		this.partialAlignments = {};
		this.searchText = null;
		this._displayedHierarchyItems = {};
		this._hierarchyItems = {};
		this._isEmptySearchResult = false;

		//this._setEntityType(xyz) //Need to define entity item first

	}
	connectedCallback() {
		IronA11yAnnouncer.requestAvailability();
		IronA11yAnnouncer.mode = 'assertive';
	}

	render() {
		return html`
			${this._isEmptySearchResult ? this._renderNoSearchResult() : this._renderHasSearchResult()}
		`;
	}

	set searchText(text) {
		this._displayedHierarchyItems = this._getDisplayedHierarchyItems(this._hierarchyItems, text);
	}

	set _displayedHierarchyItems(items) {
		this._isEmptySearchResult = this._getIsEmptySearchResult(items);
	}

	set _entity(entity) {
		if (this._entityHasChanged(entity)) {
			this._onEntityChanged(entity);
			super._entity = entity;
		}
	}

	set _hierarchyItems(items) {
		this._displayedHierarchyItems = this._getDisplayedHierarchyItems(items, this.searchText);
	}

	_getHierarchyStart(entity) {
		if (!entity || !entity.hasSubEntityByClass('hierarchical-outcome')) {
			return undefined;
		}

		var hierarchyRoot = {
			entities: entity.getSubEntitiesByClass('hierarchical-outcome'),
			class: ['hierarchical-outcome', 'hierarchy-start']
		};

		return hierarchyRoot;
	}

	_getDisplayedHierarchyItems(entity, searchText) {
		if (!entity) return [];
		if (searchText === null) return entity;
		if (searchText === '') {
			IronA11yAnnouncer.instance.fire('iron-announce',
				{ text: this.localize('searchCleared') },
				{ bubbles: true }
			);
			return entity;
		}

		const copy = JSON.parse(JSON.stringify(entity)); // we don't want to contaminate the source data
		const filtered = this._filterHierachy(copy, searchText);
		const numOfLeaves = this._getNumOfLeaves(filtered);

		IronA11yAnnouncer.instance.fire('iron-announce',
			{ text: this.localize('searchResultsNumber', 'numOfResults', numOfLeaves) },
			{ bubbles: true }
		);
		this.dispatchEvent(new CustomEvent(
			'search-results-changed',
			{ bubbles: true, composed: false, detail: { value: numOfLeaves } }
		));

		return filtered;
	}

	
	_onEntityChanged(entity) {
		if (!entity) {
			return;
		}

		this._hierarchyItems = this._getHierarchyStart(entity);

	}

	_search(entity, searchText = '') {
		const description = this.getOutcomeDescriptionPlainText(entity).toLowerCase().normalize();
		const notation = this.getOutcomeIdentifier(entity).toLowerCase().normalize();
		const searchTextLower = searchText.trim().toLowerCase().normalize();
		const searchWords = [...new Set(searchTextLower.split(' ').filter(i => i))];

		const containsText = (i) => description.indexOf(i) > -1 || notation.indexOf(i) > -1;
		return searchWords.every(containsText);
	}

	_filterHierachy(entity, searchText) {
		const isLeaf = (entity) => entity && entity.class.includes('leaf-outcome');
		const isRoot = (entity) => entity.class.includes('hierarchy-start');

		if (isRoot(entity)) {
			const topLevels = entity.entities.filter(i => this._filterHierachy(i, searchText));
			return { ...entity, entities: topLevels };
		} else if (isLeaf(entity)) {
			return this._search(entity, searchText) ? this._applyBoldText(entity, searchText) : null;
		} else {
			const filteredSublevels = entity.entities.filter(i => this._filterHierachy(i, searchText));
			entity.entities = filteredSublevels;
			return filteredSublevels.length !== 0 ? entity : null;
		}
	}

	_applyBoldText(entity, searchText) {
		if (!entity || !searchText) return entity;

		const escapeRegExp = (s) => s.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
		const searchWords = [...new Set(searchText.split(' ').filter(i => i))];
		if (searchWords.indexOf('b') > 0) { // 'b' has to be the first item, otherwise all <b> tag will be messed up
			searchWords.splice(searchWords.indexOf('b'), 1);
			searchWords.unshift('b');
		}
		const dedupWords = searchWords.filter(item => {
			for (const i of searchWords) {
				if (i !== item && i.indexOf(item) > -1) {
					return false;
				}
			}
			return true;
		});

		for (const i of dedupWords) {
			const searchRegex = new RegExp(escapeRegExp(i), 'ig');
			entity.properties.description = entity.properties.description.replace(searchRegex, '<b>$&</b>');
		}
		return entity;
	}

	_getNumOfLeaves(tree) {
		const isLeaf = (entity) => entity && entity.class.includes('leaf-outcome');
		return isLeaf(tree) ? 1 : tree.entities.reduce((acc, curr) => acc + this._getNumOfLeaves(curr), 0);
	}

	_getIsEmptySearchResult(items) {
		return items && items.entities && items.entities.length === 0;
	}

	_renderHasSearchResult() {
		return html`
			<siren-entity-loading href="${this.href}" token="${this.token}">
				<div class="d2l-alignment-update-content">
					<d2l-outcome-hierarchy-item
						tabindex="0"
						item="${this.displayedHierarchyItems}"
						alignments="${this.alignments}"
						partial-alignments="${this.partialAlignments}"
						current-level="${this.level}"
						search-text="${this.searchText}"
					></d2l-outcome-hierarchy-item>
				</div>
			</siren-entity-loading>
		`;
	}

	_renderNoSearchResult() {
		return html`
			<div class="no-result-container">
				${this.localize('noSearchResultFor', 'searchText', searchText)}
			</div>
		`;
	}
}

customElements.define(D2lSelectOutcomesHierarchicalList.is, D2lSelectOutcomesHierarchicalList);