/**
`d2l-alignment-update`

@demo demo/index.html
*/

//NOTE (Lit): there's still lots of work to be done on this file. Make sure to test it properly when you're finished

import { Actions, Classes, Rels } from 'd2l-hypermedia-constants';
import 'd2l-colors/d2l-colors.js';
import 'd2l-button/d2l-button.js';
import 'd2l-inputs/d2l-input-checkbox.js';
import 'd2l-alert/d2l-alert.js';
import 'd2l-loading-spinner/d2l-loading-spinner.js';
import 'd2l-polymer-siren-behaviors/siren-entity-loading.js';
import './d2l-alignment-intent.js';
import { performSirenAction } from 'siren-sdk/src/es6/SirenAction.js';
import { LocalizeMixin } from './LocalizeMixin';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { css, html } from 'lit-element';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

static const KEYCODES = {
	DOWN: 40,
	UP: 38,
	SPACE: 32
},

class D2lAlignmentsUpdate extends EntityMixinLit(LocalizeMixin(LitElement)) {

	static get is() {return 'd2l-alignment-update'; }

	static get properties() {
		return {
			candidates: Object,
			candidateEntities: Array,
			//TODO (Lit): empty had notify: true - set up event instead
			empty: {
				type: Boolean
			},
			_candidatesSelfHref: {
				type: String
			},
			_buttonsDisabled: {
				type: Boolean
			},
			__promises: {
				type: Number,
				value: 0,
			},
			_loading: {
				type: Boolean
			},
			deferredSave: {
				type: Boolean
			}
		}
	}

	static get styles() {
		return css`
			:host {
				display: block;
				overflow: hidden;
				width: 100%;
				height: 100%;
			}

			.d2l-alignment-update-content {
				display: flex;
				flex-direction: column;
				flex: 1;
			}

			d2l-loading-spinner {
				width: 100%;
			}

			siren-entity-loading {
				overflow: hidden;
				width: 100%;
				height: 100%;

				--siren-entity-loading-min-height: 10rem;
			}

			siren-entity-loading d2l-loading-spinner {
				--d2l-loading-spinner-size: 10rem;
			}

			ul {
				padding: 0;
				flex: 1;
				overflow: auto;
				word-break: break-word;
				border: 1px solid transparent;
				border-top-color: var(--d2l-color-gypsum);
				border-bottom-color: var(--d2l-color-gypsum);
			}

			li {
				position: relative;
				list-style-type: none;
				margin-top: -1px;
				border: 1px solid transparent;
				border-top-color: var(--d2l-color-gypsum);
				color: var(--d2l-color-ferrite);
				padding: 0.75rem 1.25rem;
			}

			d2l-input-checkbox {
				margin: 0;
			}

			li.d2l-select-outcomes-first {
				border-top-color: transparent;
				margin-top: 0;
			}

			li:focus,
			li:hover,
			li.d2l-select-outcomes-first:focus,
			li.d2l-select-outcomes-first:hover {
				z-index: 1;
				background-color: var(--d2l-color-celestine-plus-2);
				border-top: 1px solid var(--d2l-color-celestine-plus-1);
				border-bottom: 1px solid var(--d2l-color-celestine-plus-1);
				color: var(--d2l-color-celestine);
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
				display: flex;
				flex: 0 0 auto;
				padding: 4px;
				align-items: center;
				margin: auto 1rem 1rem 1rem;
			}

			d2l-alert {
				margin-top: 0.5rem;
			}		
		`;
	}

	constructor() {
		super();
		this.candidates = {};
		this.candidateEntities = [];
		this.deferredSave = false;
		this.empty = true;
		this._buttonsDisabled = true;
		this._candidatesSelfHref = null;
		this._loading = false;
		this.__promise = null;
		this.__promises = 0;
		
		this._handleSirenEntityLoadingFetched = this._handleSirenEntityLoadingFetched.bind(this);

		//this._setEntityType(xyz) //Need to make entity object first
	}

	connectedCallback() {
		this.shadowRoot.querySelector('siren-entity-loading').addEventListener('siren-entity-loading-fetched', this._handleSirenEntityLoadingFetched);
	}

	disconnectedCallback() {
		this.shadowRoot.querySelector('siren-entity-loading').removeEventListener('siren-entity-loading-fetched', this._handleSirenEntityLoadingFetched);
	}

	render() {
		return html`
			<siren-entity-loading href="${this._candidatesSelfHref}" token="${this.token}">
				<div class="d2l-alignment-update-content">
					<ul role="listbox" aria-multiselectable="true" aria-busy="${this._loading}" tabindex="0" @focus="${this._handleListFocus}">
						${this.candidateEntities.map((item, index) => this._renderListItem(item, index))}
						</template>
					</ul>
					<div class="d2l-alignment-update-buttons">
						<d2l-button primary="" disabled="[[_buttonsDisabled]]" on-tap="_add" aria-label="[[localize('addLabel')]]">[[localize('add')]]</d2l-button>
						<d2l-button on-tap="_cancel" aria-label="[[localize('cancelLabel')]]">[[localize('cancel')]]</d2l-button>
						<d2l-loading-spinner hidden$="[[!_loading]]"></d2l-loading-spinner>
					</div>
					<template is="dom-if" if="[[_promiseError]]">
						<d2l-alert type="error">[[localize('error')]]</d2l-alert>
					</template>
				</div>
				<d2l-loading-spinner slot="loading"></d2l-loading-spinner>
			</siren-entity-loading>
		`;
	}

	set _entity(entity) {
		if (this._entityHasChanged(entity)) {
			this._onEntityChanged(entity);
			super._entity = entity;
		}
	}

	set __promises(promises) {
		this._updateLoading(promises);
	}

	_handleSirenEntityLoadingFetched(e) {
		if (e.target === this.shadowRoot.querySelector('siren-entity-loading')) {
			this.dispatchEvent(new CustomEvent('d2l-alignment-list-loaded', {
				bubbles: true,
				composed: true
			}));
		}
	}

	_onKeyDown(e) {
		var target = e.target;
		if (e.keyCode === this._keyCodes.DOWN || e.keyCode === this._keyCodes.UP || e.keyCode === this._keyCodes.SPACE) {
			// prevent scrolling when up/down arrows pressed
			e.preventDefault();
			e.stopPropagation();
			if (e.keyCode === this._keyCodes.DOWN) {
				var nextOption = target.nextSibling;
				if (nextOption) {
					nextOption.focus();
				}
				//this._focusNext(target);
			} else if (e.keyCode === this._keyCodes.UP) {
				var prevOption = target.previousSibling;
				if (prevOption) {
					prevOption.focus();
				}
				//this._focusPrevious(target);
			} else if (e.keyCode === this._keyCodes.SPACE) {
				var childCheckbox = target.firstChild;
				var isChecked = childCheckbox.getAttribute('checked');
				if (isChecked === '') {
					childCheckbox.removeAttribute('checked', '');
				} else {
					childCheckbox.setAttribute('checked', '');
				}
				this.onOutcomeSelectChangeOnKeydown(childCheckbox);
			}
			return;
		}
	}

	_handleListFocus() {
		var elem = dom(this.root).querySelector('.d2l-select-outcomes-first');
		if (elem) {
			elem.focus();
		}
	}

	_handleOptionFocus(e) {
		var list = e.target.parentNode;
		list.setAttribute('tabindex', '-1');
	}

	_handleOptionBlur(e) {
		var list = e.target.parentNode;
		list.setAttribute('tabindex', '0');
	}

	_focusNext(target) {
		var index = +target.dataset.index;
		var list = this.$$('ul');
		var item;
		var children = Polymer.dom(list).children.filter(function(child) {
			return child.tagName && child.tagName.toUpperCase() === 'LI';
		});
		if (children[index + 1]) {
			item = children[index + 1];
		} else {
			item = children[0];
		}
		item && item.firstChild && item.firstChild.focus();
	}

	_focusPrevious(target) {
		var index = +target.dataset.index;
		var list = this.$$('ul');
		var item;
		var children = Polymer.dom(list).children.filter(function(child) {
			return child.tagName && child.tagName.toUpperCase() === 'LI';
		});
		if (children[index - 1]) {
			item = children[index - 1];
		} else {
			item = children[children.length - 1];
		}
		item && item.firstChild && item.firstChild.focus();
	}

	_getClass(index, candidates) {
		var className = '';
		if (index === 0) {
			className += 'd2l-select-outcomes-first';
		}
		if (index === candidates.length - 1) {
			className += ' d2l-select-outcomes-last';
		}
		return className;
	}

	_onEntityChanged(entity) {
		if (!entity) {
			return;
		}

		this.candidates = this._getCandidates(entity);
		this.empty = this._isEmpty(this.candidates);
		this._candidatesSelfHref = this._getSelfLink(this.candidates);
		
	}

	//TODO (Lit): verify that actions perform correctly (unsure about arguments 3 and 4 for performSirenAction)
	_performActionAndUpdate(getAction) {
		var self = this;
		this._promiseError = false;
		this.__promises++;
		this.__promise = Promise.resolve(this.__promise)
			.then(function() {
				var action = getAction.call(self);
				if (action) {
					return performSirenAction(this.token, action, null, true)
						.then(function(candidates) {
							self.__promises--;
							self.candidates = candidates;
							if (self.__promises <= 0) {
								self.__promises = 0;
								self.__promise = null;
								self.candidateEntities = candidates.entities;
							}
						});
				}
			})
			.catch(function(err) {
				console.error(err); // eslint-disable-line no-console
				self._buttonsDisabled = false;
				self._promiseError = true;
				self.__promises--;
			});
		return this.__promise;
	}

	_getCandidates(entity) {
		if (!entity) {
			return;
		}
		this._performActionAndUpdate(function() {
			return entity.getActionByName(Actions.alignments.startUpdateAlignments);
		});
	}

	_getChecked(candidate) {
		return candidate.hasClass(Classes.alignments.selected);
	}

	_getIndeterminate(candidate) {
		return candidate.hasClass(Classes.alignments.indeterminate);
	}

	_getAriaChecked(candidate) {
		if (this._getChecked(candidate)) {
			return 'true';
		}
		return 'false';
	}

	_getIntent(entity) {
		return entity && entity.hasLinkByRel(Rels.Outcomes.intent) && entity.getLinkByRel(Rels.Outcomes.intent).href;
	}

	_onOutcomeSelectChange(e) {
		var self = this;
		var target = e.target;
		var index = +target.dataset.index;
		this._performActionAndUpdate(/* @this */ function() {
			var candidate = this.candidates.entities[index];
			if (candidate) {
				if (target.checked && candidate.getActionByName(Actions.alignments.select)) {
					return candidate.getActionByName(Actions.alignments.select);
				} else if (!target.checked && candidate.getActionByName(Actions.alignments.deselect)) {
					return candidate.getActionByName(Actions.alignments.deselect);
				}
			}
		})
			.then(function() {
				self._buttonsDisabled = false;
			});
	}

	onOutcomeSelectChangeOnKeydown(target) {
		var self = this;
		var index = +target.dataset.index;
		this._performActionAndUpdate(/* @this */ function() {
			var candidate = this.candidates.entities[index];
			if (candidate) {
				if (target.checked && candidate.getActionByName(Actions.alignments.select)) {
					return candidate.getActionByName(Actions.alignments.select);
				} else if (!target.checked && candidate.getActionByName(Actions.alignments.deselect)) {
					return candidate.getActionByName(Actions.alignments.deselect);
				}
			}
		})
			.then(function() {
				self._buttonsDisabled = false;
			});
	}

	_add() {
		this._buttonsDisabled = true;
		this._performActionAndUpdate(/* @this */ function() {
			const actionName = this.deferredSave ? Actions.alignments.deferredSubmit : Actions.alignments.submit;
			return this.candidates.getActionByName(actionName);
		})
			.then(function() {
				!this.deferredSave && window.D2L.Siren.EntityStore.fetch(this.href, this.token, true); //TODO (Lit): We shouldn't directly call fetch if possible - will revisit once our entities are implemented
				this.dispatchEvent(new CustomEvent('d2l-alignment-list-added', {
					bubbles: true,
					composed: true
				}));
			}.bind(this));
	}

	_cancel() {
		if (!this._buttonsDisabled) {
			this._buttonsDisabled = true;
			this._getCandidates(super._entity); //Seems to be re-grabbing the original candidates before any updates were made
		}
		this.dispatchEvent(new CustomEvent('d2l-alignment-list-cancelled', {
			bubbles: true,
			composed: true
		}));
	}

	_renderListItem(item, index) {

		let alignmentIntentId = this.is();
		alignmentIntent += "-alignment-intent-";
		alignmentIntent += index.toString();

		//TODO: verify all the events here - might need to add the @change event (renamed to something more descriptive)
		return html`
			<li class="${this._getClass(index, this.candidateEntities)}" tabindex="-1" role="option" aria-selected$="${this._getAriaChecked(item)}" aria-checked$="${this._getAriaChecked(item)}" aria-labelledby="${alignmentIntentId}" @keydown="${this._onKeyDown}" @focus="${this._handleOptionFocus}" @blur="${this._handleOptionBlur}">
				<d2l-input-checkbox tabindex="-1"  not-tabbable="true" ?checked="${this._getChecked(item)}" ?indeterminate="${this._getIndeterminate(item)}" @change="${this._onOutcomeSelectChange}"  data-index="${index}" >
					<d2l-alignment-intent id="${alignmentIntentId}" href="${this._getIntent(item)}" token="${this.token}"></d2l-alignment-intent>
				</d2l-input-checkbox>
			</li>
		`;
	}
	_updateLoading(promises) {
		if (promises > 0) {
			this.debounce('loading', /* @this */ function() {
				this._loading = this.__promises > 0;
			}, 1000);
		} else {
			this.cancelDebouncer('loading');
			this._loading = false;
		}
	}

	_isEmpty(candidates) {
		if (candidates.entities && candidates.entities.length > 0) {
			return false;
		} else {
			return true;
		}
	}
}