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
import { Actions, Classes, Rels } from 'd2l-hypermedia-constants';
import 'd2l-colors/d2l-colors.js';
import 'd2l-button/d2l-button.js';
import 'd2l-inputs/d2l-input-checkbox.js';
import 'd2l-alert/d2l-alert.js';
import 'd2l-loading-spinner/d2l-loading-spinner.js';
import 'd2l-polymer-siren-behaviors/siren-entity-loading.js';
import './d2l-alignment-intent.js';
import './localize-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-alignment-update">
	<template strip-whitespace="">
		<style>
			:host {
				display: flex;
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

				--siren-entity-loading-min-height: 10rem;
			}

			siren-entity-loading d2l-loading-spinner {
				--d2l-loading-spinner-size: 10rem;
			}

			ul {
				padding: 0;
				overflow: auto;
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
		</style>
		<siren-entity-loading href="[[_candidatesSelfHref]]" token="[[token]]">
			<div class="d2l-alignment-update-content">
				<ul role="listbox" aria-multiselectable="true" aria-busy="[[_loading]]">
					<template is="dom-repeat" items="[[candidateEntities]]">
						<li class$="[[_getClass(index, candidateEntities)]]" role="option" aria-checked$="[[_getChecked(item)]]">
							<d2l-input-checkbox checked="[[_getChecked(item)]]" on-change="_onOutcomeSelectChange" on-keydown="_onKeyDown" data-index$="[[index]]" aria-labelledby="[[id]]alignment-intent-[[index]]">
								<d2l-alignment-intent id$="[[id]]alignment-intent-[[index]]" href="[[_getIntent(item)]]" token="[[token]]"></d2l-alignment-intent>
							</d2l-input-checkbox>
						</li>
					</template>
				</ul>
				<div class="d2l-alignment-update-buttons">
					<d2l-button primary="" disabled="[[_buttonsDisabled]]" on-click="_add" aria-label="[[localize('addLabel')]]">[[localize('add')]]</d2l-button>
					<d2l-button on-click="_cancel" aria-label="[[localize('cancelLabel')]]">[[localize('cancel')]]</d2l-button>
					<d2l-loading-spinner hidden$="[[!_loading]]"></d2l-loading-spinner>
				</div>
				<template is="dom-if" if="[[_error]]">
					<d2l-alert type="error">[[localize('error')]]</d2l-alert>
				</template>
			</div>
			<d2l-loading-spinner slot="loading"></d2l-loading-spinner>
		</siren-entity-loading>
	</template>


</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({

	is: 'd2l-alignment-update',

	behaviors: [
		D2L.PolymerBehaviors.Siren.EntityBehavior,
		D2L.PolymerBehaviors.Siren.SirenActionBehavior,
		window.D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior,
	],

	properties: {
		candidates: Object,
		_candidatesSelfHref: {
			type: String,
			computed: '_getSelfLink(candidates)'
		},
		_buttonsDisabled: {
			type: Boolean,
			value: true
		},
		__promises: {
			type: Number,
			value: 0
		},
		_loading: {
			type: Boolean,
			value: false
		}
	},

	observers: [
		'_getCandidates(entity)',
		'_updateLoading(__promises)'
	],

	_keyCodes: {
		DOWN: 40,
		UP: 38
	},

	ready: function() {
		this.__promise = null;
		this.__promises = 0;
	},

	_onKeyDown: function(e) {
		var target = e.target;
		if (e.keyCode === this._keyCodes.DOWN || e.keyCode === this._keyCodes.UP) {
			// prevent scrolling when up/down arrows pressed
			e.preventDefault();
			e.stopPropagation();
			if (e.keyCode === this._keyCodes.DOWN) {
				this._focusNext(target);
			} else if (e.keyCode === this._keyCodes.UP) {
				this._focusPrevious(target);
			}
			return;
		}
	},

	_focusNext: function(target) {
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
	},

	_focusPrevious: function(target) {
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
	},

	_getClass: function(index, candidates) {
		var className = '';
		if (index === 0) {
			className += 'd2l-select-outcomes-first';
		}
		if (index === candidates.length - 1) {
			className += ' d2l-select-outcomes-last';
		}
		return className;
	},

	_performActionAndUpdate: function(getAction) {
		var self = this;
		this._error = false;
		this.__promises++;
		this.__promise = Promise.resolve(this.__promise)
			.then(function() {
				var action = getAction.call(self);
				if (action) {
					return self.performSirenAction(action)
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
				self._error = true;
				self.__promises--;
			});
		return this.__promise;
	},

	_getCandidates: function(entity) {
		if (!entity) {
			return;
		}
		this._performActionAndUpdate(function() {
			return entity.getActionByName(Actions.alignments.startUpdateAlignments);
		});
	},

	_getChecked: function(candidate) {
		return candidate.hasClass(Classes.alignments.selected);
	},

	_getIntent: function(entity) {
		return entity && entity.hasLinkByRel(Rels.Outcomes.intent) && entity.getLinkByRel(Rels.Outcomes.intent).href;
	},

	_onOutcomeSelectChange: function(e) {
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
	},

	_add: function() {
		this._buttonsDisabled = true;
		this._performActionAndUpdate(/* @this */ function() {
			return this.candidates.getActionByName(Actions.alignments.submit);
		})
			.then(function() {
				window.D2L.Siren.EntityStore.fetch(this.href, this.token, true);
				this.dispatchEvent(new CustomEvent('d2l-alignment-list-added', {
					bubbles: true,
					composed: true
				}));
			}.bind(this));
	},

	_cancel: function() {
		if (!this._buttonsDisabled) {
			this._buttonsDisabled = true;
			this._getCandidates(this.entity);
		}
		this.dispatchEvent(new CustomEvent('d2l-alignment-list-cancelled', {
			bubbles: true,
			composed: true
		}));
	},

	_updateLoading: function(promises) {
		if (promises > 0) {
			this.debounce('loading', /* @this */ function() {
				this._loading = this.__promises > 0;
			}, 1000);
		} else {
			this.cancelDebouncer('loading');
			this._loading = false;
		}
	}

});
