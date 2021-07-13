/**
`d2l-select-outcomes-hierarchical`

@demo demo/index.html
*/
import './d2l-select-outcomes-hierarchical-list.js';
import 'd2l-inputs/d2l-input-search.js';
import 'd2l-alert/d2l-alert.js';
import { performSirenAction } from 'siren-sdk/src/es6/SirenAction.js';
import { LocalizeMixin } from './LocalizeMixin';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { css, html } from 'lit-element';

class D2lSelectOutcomesHierarchical extends LocalizeMixin(EntityMixinLit(LitElement)) {

	static get is() {return 'd2l-select-outcomes-hierarchical'; }

	static get properties() {
		return {
			alignButtonText: String,
			_showError: Boolean,
			_alignments: Map,
			_hierarchyHref: String,
			_partialAlignments: Map,
			_loading: Boolean,
			_alignmentsSize: Number,
			_searchText: String,
			_showSearchResultsNumber: Boolean,
			_searchResultsNumber: Number
		}
	}

	static get styles() {
		return css`
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
		`;
	}

	set maxHeight(maxHeight) {
		this._updateHierarchicalListHeight(maxHeight);
	}

	set _searchResultsNumber(number) {
		this._showSearchResultsNumber = this._computeShowSearchResultsNumber(this._searchText, number);
	}

	set _searchText(text) {
		this._showSearchResultsNumber = this._computeShowSearchResultsNumber(text, this._searchResultsNumber);
	}

	constructor() {
		super();

		this.alignButtonText = null;
		this._alignments = {};
		this._alignmentsSize = 0;
		this._hierarchyHref = null;
		this._loading = false;
		this._partialAlignments = {};
		this._searchResultsNumber = 0;
		this._searchText = null;
		this._showError = false;
		this._showSearchResultsNumber = false;

		this._handleSirenEntityLoadingFetched = this._handleSirenEntityLoadingFetched.bind(this);
		this._boundHandleError = this._handleError.bind(this);
		this._alignmentsListChanged = this._alignmentsListChanged.bind(this);

		//this._setEntityType() //Need to define entity item first
		
	}

	connectedCallback() {
		this._showError = false;
		this.shadowRoot.querySelector('siren-entity-loading').addEventListener('siren-entity-loading-fetched', this._handleSirenEntityLoadingFetched);
		this.addEventListener('d2l-siren-entity-error', this._boundHandleError);
		this.addEventListener('d2l-alignment-list-changed', this._alignmentsListChanged);
	}

	disconnectedCallback() {
		this.shadowRoot.querySelector('siren-entity-loading').removeEventListener('siren-entity-loading-fetched', this._handleSirenEntityLoadingFetched);
		this.removeEventListener('d2l-alignment-list-changed', this._alignmentsListChanged);
		this.removeEventListener('d2l-siren-entity-error', this._boundHandleError);
	}

	render() {
		//TODO (Lit): verify events
		return html`
			<siren-entity-loading href="${this.href}" token="${this.token}" style="width:100%;">
				<div class="d2l-select-outcomes-hierarchical-main">
					<d2l-input-search
						label="${this.localize('searchOutcomes')}"
						placeholder="${this.localize('searchPlaceholder')}"
						@d2l-input-search-searched="${this._onSearch}"
					>
					</d2l-input-search>
					<div class="search-result-number" ?hidden="${!this._showSearchResultsNumber}">
						${this.localize('searchResultFor', 'numOfResults', _searchResultsNumber, 'searchText', _searchText)}
					</div>
					<d2l-select-outcomes-hierarchical-list
						aria-busy="${this._loading}"
						class="d2l-hierarchical-list"
						href="${this._hierarchyHref}"
						token="${this.token}"
						alignments="${this._alignments}"
						partial-alignments="${this._partialAlignments}"
						search-text="${this._searchText}"
						@search-results-changed="${this._onSearchResultsChanged}"
					>
					</d2l-select-outcomes-hierarchical-list>
					<div class="d2l-alignment-update-buttons">
						<d2l-button primary="" ?disabled="${this._buttonsDisabled}" @tap="${this._add}" aria-label="${this.alignButtonText}">${this.alignButtonText}</d2l-button>
						<d2l-button on-tap="${this._cancel}" aria-label="${this.localize('cancelLabel')}">${this.localize('cancel')}</d2l-button>
						<d2l-loading-spinner hidden$="${!this._loading}"></d2l-loading-spinner>
						<div class="d2l-selected-outcomes">${this._alignmentsSize} ${this.localize('selected')}</div>
					</div>
					${this._showError ? html`
						<d2l-alert type="error">${this.localize('error')}</d2l-alert>
					` : html``}
				</div>
			</siren-entity-loading>
		`;
	}

	set _entity(entity) {
		if (this._entityHasChanged(entity)) {
			this._onEntityChanged(entity);
			super._entity = entity;
		}
	}
	
	_onEntityChanged(entity) {
		if (!entity) {
			return;
		}

		if(entity.hasLinkByRel('https://outcomes.api.brightspace.com/rels/outcomes-hierarchy')) {
			this._hierarchyHref = entity.getLinkByRel('https://outcomes.api.brightspace.com/rels/outcomes-hierarchy').href;
		}

		this._alignments = this._getAlignments(entity);
		this._partialAlignments = this._getPartialAlignments(entity);
	}

	_handleSirenEntityLoadingFetched(e) {
		if (e.target === this.shadowRoot.querySelector('siren-entity-loading')) {
			this.dispatchEvent(new CustomEvent('d2l-alignment-list-loaded', {
				bubbles: true,
				composed: true
			}));
		}
	}

	_handleError() {
		this._showError = true;
	}

	_getAlignments(entity) {
		if (entity && entity.properties.directAlignments) {
			this._alignmentsSize = entity.properties.directAlignments.length;
			return new Set(entity.properties.directAlignments);
		} else {
			this._alignmentsSize = 0;
			return new Set();
		}
	}

	_getPartialAlignments(entity) {
		if (entity && entity.properties.partialDirectAlignments) {
			return new Set(entity.properties.partialDirectAlignments);
		} else {
			return new Set();
		}
	}

	_cancel() {
		this.dispatchEvent(new CustomEvent('d2l-alignment-list-cancelled', {
			bubbles: true,
			composed: true
		}));
	}

	//TODO: consider cleaning this up a bit, if possible
	_add() {
		this._buttonsDisabled = true;
		var action = this.entity.getActionByName('save-alignments');
		var alignmentsAction = action.getFieldByName('alignments');
		alignmentsAction.value = Array.from(this._alignments);
		var partialAlignmentsAction = action.getFieldByName('partialDirectAlignments');
		partialAlignmentsAction.value = Array.from(this._partialAlignments);

		performSirenAction(action)
			.then(function() {
				window.D2L.Siren.EntityStore.fetch(this.href, this.token, true);
				this.dispatchEvent(new CustomEvent('d2l-alignment-list-added', {
					bubbles: true,
					composed: true
				}));
				this._buttonsDisabled = false;
			}.bind(this));
	}

	_alignmentsListChanged() {
		this._alignmentsSize = this._alignments.size;
	}

	_onSearch(e) {
		this.set('_searchText', e.detail.value);
	}

	_computeShowSearchResultsNumber(searchText, resultsNumber) {
		return searchText && searchText.length > 0 && resultsNumber > 0;
	}

	_onSearchResultsChanged(e) {
		this._searchResultsNumber = e.detail.value || 0;
	}

	_updateHierarchicalListHeight(maxHeight) {
		if (maxHeight) {
			this.updateStyles({
				'--hierarchical-list-height': maxHeight,
			});
		}
	}
}

customElements.define(D2lSelectOutcomesHierarchical.is, D2lSelectOutcomesHierarchical);