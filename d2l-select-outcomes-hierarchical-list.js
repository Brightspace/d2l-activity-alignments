/**
`d2l-select-outcomes-hierchical-list`
*/

import '@polymer/polymer/polymer-legacy.js';

import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import 'd2l-polymer-siren-behaviors/store/siren-action-behavior.js';
import { Actions, Classes, Rels } from 'd2l-hypermedia-constants';
import 'd2l-colors/d2l-colors.js';
import 'd2l-button/d2l-button.js';
import 'd2l-inputs/d2l-input-checkbox.js';
import 'd2l-alert/d2l-alert.js';
import 'd2l-loading-spinner/d2l-loading-spinner.js';
import 'd2l-polymer-siren-behaviors/siren-entity-loading.js';
import './d2l-alignment-intent.js';
import './d2l-outcome-hierarchy-item.js';
import './localize-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import {dom} from '@polymer/polymer/lib/legacy/polymer.dom.js';
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
				z-index:2;
			}

			d2l-alert {
				margin-top: 0.5rem;
			}
		</style>
		<template is="dom-if" if="[[_isEmptySearchResult]]">
			<div class="center">
				<h3>No results found for '[[_searchText]]'</h3>
			</div>
		</template>
		<siren-entity-loading href="[[href]]" token="[[token]]">
			<div class="d2l-alignment-update-content">
				<d2l-outcome-hierarchy-item item="[[displayedHierarchyItems]]" alignments="[[alignments]]" current-level="[[level]]"></d2l-outcome-hierarchy-item>
			</div>
		</siren-entity-loading>
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
	},

	attached() {
		IronA11yAnnouncer.requestAvailability();
	},

	_getHierarchyStart: function(entity) {
		if (!entity || !entity.hasSubEntityByClass('hierarchical-outcome')) {
			return undefined;
		}

		var hierarchyRoot = {
			entities: entity.getSubEntitiesByClass('hierarchical-outcome'),
			class: ['hierarchical-outcome', 'outcomes-root']
		};

		return hierarchyRoot;
	},

	_getDisplayedHierarchyItems: function(items, searchText) {
		if (!items) return [];
		if (!searchText === undefined) return items;
		if (searchText === '') {
			IronA11yAnnouncer.instance.fire('iron-announce',
				{ text: 'Search cleared' },
				{ bubbles: true }
			);
			return items;
		}

		const copy = JSON.parse(JSON.stringify(items)); // we don't want to contaminate the source data
		const filtered = this._filterHierachy(copy, searchText);
		const numOfLeaves = this._getNumOfLeaves(filtered);

		IronA11yAnnouncer.instance.fire('iron-announce',
			{ text: `${numOfLeaves} search results.` },
			{ bubbles: true }
		);
		return filtered;
	},

	_filterHierachy: function(item, searchText) {
		const isLeaf = (entity) => entity && entity.class.includes('leaf-outcome');
		const isRoot = (entity) => entity.class.includes('outcomes-root');

		if (isRoot(item)) {
			const topLevels = [];
			for (const i of item.entities) {
				const filtered = this._filterHierachy(i, searchText);
				if (filtered) {
					topLevels.push(filtered);
				}
			}
			return { ...item, entities: topLevels };
		} else if (isLeaf(item)) {
			const search = (item, searchText = '') => {
				const searchTarget = (item && item.properties && item.properties.description)
					? item.properties.description.toLowerCase().normalize()
					: '';
				const searchTextLower = searchText.trim().toLowerCase().normalize();
				return searchTarget.indexOf(searchTextLower) > -1;
			};
			return search(item, searchText) ? item : null;
		} else {
			const filteredSublevels = [];
			for (const i of item.entities) {
				if (this._filterHierachy(i, searchText)) {
					filteredSublevels.push(i);
				}
			}
			item.entities = filteredSublevels;
			return filteredSublevels.length !== 0 ? item : null;
		}
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
	}
});
