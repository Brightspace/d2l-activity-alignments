/**
`d2l-select-outcomes-hierarchical-list`
*/

import '@polymer/polymer/polymer-legacy.js';

import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import 'd2l-polymer-siren-behaviors/store/siren-action-behavior.js';
import 'd2l-colors/d2l-colors.js';
import 'd2l-button/d2l-button.js';
import 'd2l-inputs/d2l-input-checkbox.js';
import 'd2l-alert/d2l-alert.js';
import 'd2l-typography/d2l-typography.js';
import 'd2l-loading-spinner/d2l-loading-spinner.js';
import 'd2l-polymer-siren-behaviors/siren-entity-loading.js';
import './d2l-alignment-intent.js';
import './d2l-outcome-hierarchy-item.js';
import './localize-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { IronA11yAnnouncer } from '@polymer/iron-a11y-announcer/iron-a11y-announcer.js';

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = /*html*/`<dom-module id="d2l-select-outcomes-hierarchical-list">
	<template strip-whitespace="">
		<style>
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
		</style>
		<template is="dom-if" if="[[_isEmptySearchResult]]">
			<div class="no-result-container">
				[[localize('noSearchResultFor', 'searchText', searchText)]]
			</div>
		</template>
		<template is="dom-if" if="[[!_isEmptySearchResult]]">
			<siren-entity-loading href="[[href]]" token="[[token]]">
				<div class="d2l-alignment-update-content">
					<d2l-outcome-hierarchy-item
						tabindex="0"
						item="[[_getHierarchyStart(entity)]]"
						alignments="[[alignments]]"
						current-level="[[level]]"
					></d2l-outcome-hierarchy-item>
				</div>
			</siren-entity-loading>
		</template>
	</template>


</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({

	is: 'd2l-select-outcomes-hierarchical-list',

	behaviors: [
		D2L.PolymerBehaviors.Siren.EntityBehavior,
		D2L.PolymerBehaviors.Siren.SirenActionBehavior,
		window.D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior
	],

	properties: {
		alignments: {
			type: Set
		},

		level: {
			type: Number,
			value: 0,
		},

		hierarchyItems: {
			type: Object,
			computed: '_getHierarchyStart(entity)'
		},

		displayedHierarchyItems: {
			type: Array,
			computed: '_getDisplayedHierarchyItems(hierarchyItems, searchText)'
		},

		_isEmptySearchResult: {
			type: Boolean,
			value: false,
			computed: '_getIsEmptySearchResult(displayedHierarchyItems)'
		},
	},

	attached: function() {
		IronA11yAnnouncer.requestAvailability();
		IronA11yAnnouncer.mode = 'assertive';
	},

	_getHierarchyStart: function(entity) {
		if (!entity || !entity.hasSubEntityByClass('hierarchical-outcome')) {
			return undefined;
		}

		var hierarchyRoot = {
			entities: entity.getSubEntitiesByClass('hierarchical-outcome'),
			class: ['hierarchical-outcome', 'hierarchy-start']
		};

		return hierarchyRoot;
	},

	_getDisplayedHierarchyItems: function(entity, searchText) {
		if (!entity) return [];
		if (!searchText === undefined) return entity;
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
	},

	_search: function(entity, searchText = '') {
		const description = (entity && entity.properties && entity.properties.description)
			? entity.properties.description.toLowerCase().normalize()
			: '';
		const notation = (entity && entity.properties && entity.properties.notation)
			? entity.properties.notation.toLowerCase().normalize()
			: '';
		const searchTextLower = searchText.trim().toLowerCase().normalize();
		const splitText = searchTextLower.split(' ').filter(i => i);

		const containsText = (i) => description.indexOf(i) > -1 || notation.indexOf(i) > -1;
		return splitText.every(containsText);
	},

	_filterHierachy: function(entity, searchText) {
		const isLeaf = (entity) => entity && entity.class.includes('leaf-outcome');
		const isRoot = (entity) => entity.class.includes('outcomes-root');

		if (isRoot(entity)) {
			const topLevels = [];
			for (const i of entity.entities) {
				const filtered = this._filterHierachy(i, searchText);
				if (filtered) {
					topLevels.push(filtered);
				}
			}
			return { ...entity, entities: topLevels };
		} else if (isLeaf(entity)) {
			return this._search(entity, searchText) ? this._applyBoldText(entity, searchText) : null;
		} else {
			const filteredSublevels = [];
			for (const i of entity.entities) {
				if (this._filterHierachy(i, searchText)) {
					filteredSublevels.push(i);
				}
			}
			entity.entities = filteredSublevels;
			return filteredSublevels.length !== 0 ? entity : null;
		}
	},

	_applyBoldText: function(entity, searchText) {
		if (!entity || !searchText) return entity;

		for (const i of searchText.split(' ').filter(i => i)) {
			const searchRegex = new RegExp(i, 'ig');
			entity.properties.description = entity.properties.description.replace(searchRegex, '<b>$&</b>');
			entity.properties.notation = entity.properties.notation.replace(searchRegex, '<b>$&</b>');
		}
		return entity;
	},

	_getNumOfLeaves: function(tree) {
		const isLeaf = (entity) => entity && entity.class.includes('leaf-outcome');
		if (isLeaf(tree)) {
			return 1;
		} else {
			let subtotal = 0;
			for (const i of tree.entities) {
				subtotal += this._getNumOfLeaves(i);
			}
			return subtotal;
		}
	},

	_getIsEmptySearchResult: function(items) {
		return items && items.entities && items.entities.length === 0;
	},
});
