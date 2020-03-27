/**
`d2l-select-outcomes`

@demo demo/index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import 'd2l-polymer-siren-behaviors/store/siren-action-behavior.js';
import './d2l-select-outcomes-hierarchical-list.js';
import 'd2l-inputs/d2l-input-search.js';
import 'd2l-alert/d2l-alert.js';
import './localize-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = /*html*/`<dom-module id="d2l-select-outcomes-hierarchical">
	<template strip-whitespace="">
		<style>
			:host {
				display: flex;
				--hierarchical-list-height: 520px;
			}

			* {
				outline: none;
			}

			.d2l-select-outcomes-hierarchical-main {
				width: 100%;
				display: block;
				position: relative;
			}
			d2l-button,
			.d2l-alignment-update-buttons d2l-loading-spinner {
				margin-right: 0.5rem;
				width: auto;
			}
			:host-context([dir="rtl"]) d2l-button,
			:host-context([dir="rtl"]) .d2l-alignment-update-buttons d2l-loading-spinner {
				margin-right: 0;
				margin-left: 0.5rem;
			}
			:host(:dir(rtl)) d2l-button,
			:host(:dir(rtl)) .d2l-alignment-update-buttons d2l-loading-spinner {
				margin-right: 0;
				margin-left: 0.5rem;
			}

			.d2l-alignment-update-buttons d2l-loading-spinner {
				--d2l-loading-spinner-size: 34px;
			}

			.d2l-alignment-update-buttons {
				position: relative;
				display: flex;
				flex: 0 0 auto;
				padding: 4px;
				align-items: center;
				margin: 1rem;
			}
			.d2l-hierarchical-list {
				overflow: auto;
				overflow-x: hidden;
				height: var(--hierarchical-list-height);
				border: 1px solid var(--d2l-color-gypsum);
			}
			.d2l-selected-outcomes {
				@apply --d2l-body-small-text;
				text-align: right;
				width: 100%
			}

			d2l-input-search {
				margin-bottom: 24px;
			}

			.search-result-number {
				margin-bottom: 12px;
				margin-top: -12px;
				@apply --d2l-body-standard;
			}
			
		</style>
		
		<siren-entity-loading href="[[href]]" token="[[token]]" style="width:100%;">
			<div class="d2l-select-outcomes-hierarchical-main">
				<d2l-input-search
					label="[[localize('searchOutcomes')]]"
					placeholder="[[localize('searchPlaceholder')]]"
					on-d2l-input-search-searched="_onSearch"
				>
				</d2l-input-search>
				<div class="search-result-number" hidden="[[!_showSearchResultsNumber]]">
					[[localize('searchResultFor', 'numOfResults', _searchResultsNumber, 'searchText', _searchText)]]
				</div>
				<d2l-select-outcomes-hierarchical-list
					aria-busy="[[_loading]]"
					class="d2l-hierarchical-list"
					href="[[_getHierarchy(entity)]]"
					token="[[token]]"
					alignments="[[_alignments]]"
					search-text="[[_searchText]]"
					on-search-results-changed="_onSearchResultsChanged"
					
				>
				</d2l-select-outcomes-hierarchical-list>
				<div class="d2l-alignment-update-buttons">
					<d2l-button primary="" disabled="[[_buttonsDisabled]]" on-tap="_add" aria-label="[[alignButtonText]]">[[alignButtonText]]</d2l-button>
					<d2l-button on-tap="_cancel" aria-label="[[localize('cancelLabel')]]">[[localize('cancel')]]</d2l-button>
					<d2l-loading-spinner hidden$="[[!_loading]]"></d2l-loading-spinner>
					<div class="d2l-selected-outcomes">[[_alignmentsSize]] [[localize('selected')]]</div>
				</div>
				<template is="dom-if" if="[[_showError]]">
					<d2l-alert type="error">[[localize('error')]]</d2l-alert>
				</template>
			</div>
		</siren-entity-loading>
	</template>


</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({

	is: 'd2l-select-outcomes-hierarchical',

	properties: {
		alignButtonText: {
			type: String,
			value: null
		},
		_showError: {
			type: Boolean,
			value: false
		},
		_alignments: {
			type: Map,
			computed: '_getAlignments(entity)'
		},
		_loading: {
			type: Boolean,
			value: false
		},
		_alignmentsSize: {
			type: Number,
			value: 0
		},
		_searchText: {
			type: String
		},
		_showSearchResultsNumber: {
			type: Boolean,
			value: false,
			computed: '_computeShowSearchResultsNumber(_searchText, _searchResultsNumber)'
		},
		_searchResultsNumber: {
			type: Number,
			value: 0
		}
	},

	observers: [
		'_updateHierarchicalListHeight(maxHeight)',
	],

	behaviors: [
		D2L.PolymerBehaviors.Siren.EntityBehavior,
		D2L.PolymerBehaviors.Siren.SirenActionBehavior,
		window.D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior,
	],

	ready: function() {
		this._handleSirenEntityLoadingFetched = this._handleSirenEntityLoadingFetched.bind(this);
		this._boundHandleError = this._handleError.bind(this);
		this._alignmentsListChanged = this._alignmentsListChanged.bind(this);
	},

	attached: function() {
		this._showError = false;
		this.shadowRoot.querySelector('siren-entity-loading').addEventListener('siren-entity-loading-fetched', this._handleSirenEntityLoadingFetched);
		this.addEventListener('d2l-siren-entity-error', this._boundHandleError);
		this.addEventListener('d2l-alignment-list-changed', this._alignmentsListChanged);
	},

	detached: function() {
		this.shadowRoot.querySelector('siren-entity-loading').removeEventListener('siren-entity-loading-fetched', this._handleSirenEntityLoadingFetched);
		this.removeEventListener('d2l-alignment-list-changed', this._alignmentsListChanged);
		this.removeEventListener('d2l-siren-entity-error', this._boundHandleError);
	},

	_handleSirenEntityLoadingFetched: function(e) {
		if (e.target === this.shadowRoot.querySelector('siren-entity-loading')) {
			this.dispatchEvent(new CustomEvent('d2l-alignment-list-loaded', {
				bubbles: true,
				composed: true
			}));
		}
	},

	_handleError: function() {
		this._showError = true;
	},

	_getHierarchy: function(entity) {
		return entity && entity.hasLinkByRel('https://outcomes.api.brightspace.com/rels/outcomes-hierarchy') && entity.getLinkByRel('https://outcomes.api.brightspace.com/rels/outcomes-hierarchy').href;
	},

	_getAlignments: function(entity) {
		if (entity && entity.properties.directAlignments) {
			this._alignmentsSize = entity.properties.directAlignments.length;
			return new Set(entity.properties.directAlignments);
		} else {
			this._alignmentsSize = 0;
			return new Set();
		}
	},

	_getAlignmentsSize: function(alignments) {
		this._alignmentsSize = alignments.size;
	},

	_cancel: function() {
		this.dispatchEvent(new CustomEvent('d2l-alignment-list-cancelled', {
			bubbles: true,
			composed: true
		}));
	},

	_add: function() {
		this._buttonsDisabled = true;
		var action = this.entity.getActionByName('save-alignments');
		var actionParam = action.getFieldByName('alignments');
		actionParam.value = Array.from(this._alignments);

		this.performSirenAction(action)
			.then(function() {
				window.D2L.Siren.EntityStore.fetch(this.href, this.token, true);
				this.dispatchEvent(new CustomEvent('d2l-alignment-list-added', {
					bubbles: true,
					composed: true
				}));
				this._buttonsDisabled = false;
			}.bind(this));
	},

	_alignmentsListChanged: function() {
		this._alignmentsSize = this._alignments.size;
	},

	_onSearch: function(e) {
		this.set('_searchText', e.detail.value);
	},

	_computeShowSearchResultsNumber: function(searchText, resultsNumber) {
		return searchText && searchText.length > 0 && resultsNumber > 0;
	},

	_onSearchResultsChanged(e) {
		this._searchResultsNumber = e.detail.value || 0;
	},

	_updateHierarchicalListHeight: function(maxHeight) {
		if (maxHeight) {
			this.updateStyles({
				'--hierarchical-list-height': maxHeight,
			});
		}
	},
});
