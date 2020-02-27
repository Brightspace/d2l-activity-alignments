/**
`d2l-outcome-hierarchy-item`

@demo demo/index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';
import 'd2l-inputs/d2l-input-checkbox.js';
import 'd2l-icons/tier1-icons.js';
import 'd2l-loading-spinner/d2l-loading-spinner.js';
import 'd2l-polymer-siren-behaviors/siren-entity-loading.js';
import 'd2l-typography/d2l-typography-shared-styles.js';
import 'd2l-button/d2l-button.js';
import 's-html/s-html.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import OutcomeParserBehavior from './d2l-outcome-parser-behavior.js';
const $_documentContainer = document.createElement('template');
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status';

$_documentContainer.innerHTML = /*html*/`<dom-module id="d2l-outcome-hierarchy-item">
	<template strip-whitespace="">
		<style>
			:host {
				display: block;
				width: 100%;
				--sublevel-cell-margin: 6px;
			}

			.d2l-outcome-wrap {
				display: flex;
				flex-direction: column-reverse;
				margin-left: 10px;
			}

			.d2l-outcome-heading > * {
				margin: 0px;
				font-family: Lato; 
				font-size: 16px; 
				font-weight: bold;
				line-height: 100%;
			}

			.d2l-collapsible-node {
				height: 36px;
				display: flex;
				background-color: #F9FBFF;
			}

			.node-header-content {
				display: flex;
				margin-top: 10px;
				margin-left: var(--sublevel-cell-margin);
			}

			.d2l-outcome-identifier {
				@apply --d2l-body-small-text;
				margin: 0.3rem 0 0 0;
			}

			.d2l-outcome-text {
				@apply --d2l-body-compact-text;
			}

			siren-entity-loading {
				--siren-entity-loading-min-height: 1.2rem;
			}

			d2l-loading-spinner {
				--d2l-loading-spinner-size: 1.2rem;
			}

			d2l-icon {
				margin-right: 8px;
			}

			ul {
				padding: 0px 0px;
				flex: 1;
				overflow: auto;
				word-break: break-word;
				margin-bottom: 0px;
				margin-block-start: 0em;
			}

			li {
				list-style-type: none;
				border: 1px solid transparent;
				border-top-color: var(--d2l-color-gypsum);
				color: var(--d2l-color-ferrite);
			}

			d2l-input-checkbox {
				background-color: var(--leaf-background-colour);
				padding-left: var(--sublevel-cell-margin);
				padding-right: var(--sublevel-cell-margin);
				padding-top: 12px;
				padding-bottom: 12px;
				margin: 0;
			}

			.d2l-select-outcomes-leaf:hover {
				z-index: 1;
				background-color: var(--d2l-color-celestine-plus-2);
				border-top: 1px solid var(--d2l-color-celestine-plus-1);
				border-bottom: 1px solid var(--d2l-color-celestine-plus-1);
				color: var(--d2l-color-celestine);
			}

			.leaf-node-selected {
				background-color: var(--d2l-color-celestine-plus-2);
			}
		</style>

		<template is="dom-if" if="[[_isLeafNode(item)]]">
			<d2l-input-checkbox class="[[_leafClass]]" tabindex="-1" not-tabbable="true" checked="[[_isSelected]]" on-change="_onOutcomeSelectChange" data-index$="[[index]]" >
				<div class="d2l-outcome-wrap">
					<template is="dom-if" if="[[_hasOutcomeIdentifier(item)]]">
						<div class="d2l-outcome-identifier">[[getOutcomeIdentifier(item)]]</div>
					</template>
					<div class="d2l-outcome-text">
						<s-html hidden="[[!_fromTrustedSource(item)]]" html="[[getOutcomeDescriptionHtml(item)]]"></s-html>
						<span hidden="[[_fromTrustedSource(item)]]">[[getOutcomeDescriptionPlainText(item)]]</span>
					</div>
				</div>
			</d2l-input-checkbox>
		</template>
		<template is="dom-if" if="[[_isNonLeafNode(item)]]">
			<div class="d2l-collapsible-node">
				<div class="node-header-content">
					<d2l-icon icon="[[_collapseIcon]]"></d2l-icon>
					<div class="d2l-outcome-heading">
						<template is="dom-if" if="[[_hasOutcomeIdentifier(item)]]">
							<h4>[[getOutcomeIdentifier(item)]]</h4>
						</template>
						<template is="dom-if" if="[[!_hasOutcomeIdentifier(item)]]">
							<h4>[[getOutcomeDescriptionPlainText(item)]]</h4>
						</template>
					</div>
				</div>
			</div>
			<template is="dom-if" if="[[!_collapsed]]">
				<ul tabindex="0" style="list-style-type:none">
					<template is="dom-repeat" items="[[_children]]" index-as="outcomesIndex">
						<li class$="[[_getCellClass(item)]]" tabindex="-1">
							<d2l-outcome-hierarchy-item
								id="[[outcomesIndex]]"
								item="[[item]]" 
								index="[[outcomesIndex]]"
								tabindex="-1"
								alignments="[[alignments]]" 
								current-level="[[_nextLevel]]"
								parentNode="[[root]]"
								is-last="[[_getOutcomeIsLast(outcomesIndex)]]"
								on-focus-next="_focusNextSibling"
								on-focus-previous="_focusPreviousSibling"
								on-focus-parent="_focusSelf"
								on-focus-child="_onFocusChild"
							</d2l-outcome-hierarchy-item>
						</li>
					</template>
				</ul>
			</template>
		</template>
		<template is="dom-if" if="[[_isRootNode(item)]]">
			<ul tabindex="0" style="list-style-type:none; border: 1px solid transparent; border-bottom-color: var(--d2l-color-gypsum);" >
				<template is="dom-repeat" items="[[_children]]" index-as="outcomesIndex">
					<li class$="[[_getCellClass(item)]]" tabindex="-1">
						<d2l-outcome-hierarchy-item
							id$="[[outcomesIndex]]"
							item="[[item]]" 
							index="[[outcomesIndex]]" 
							tabindex="-1" 
							alignments="[[alignments]]" 
							current-level="[[_nextLevel]]"
							parentNode="[[root]]"
							is-last="[[_getOutcomeIsLast(outcomesIndex)]]"
							on-focus-next="_focusNextSibling"
							on-focus-previous="_focusPreviousSibling"
							on-focus-parent="_focusSelf"
							on-focus-child="_onFocusChild"
						</d2l-outcome-hierarchy-item>
					</li>
				</template>
			</ul>
		</template>
	</template>

</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({

	is: 'd2l-outcome-hierarchy-item',

	behaviors: [
		OutcomeParserBehavior
	],

	properties: {
		item: {
			type: Object
		},
		alignments: {
			type: Set
		},
		_children: {
			type: Array,
			computed: '_getHierarchy(item)'
		},
		_collapsed: {
			type: Boolean,
			value: true
		},
		_iconStyle: {
			type: String,
			value: null
		},
		_collapseIcon: {
			type: String,
			computed: '_redrawIcon(_collapsed)'
		},
		_nextLevel: {
			type: Number,
			computed: '_getNextLevel(currentLevel)'
		},
		_isSelected: {
			type: Boolean,
			computed: '_getIsSelected(alignments, item)'
		},
		_leafClass: {
			type: String,
			computed: '_getLeafClass(_isSelected)'
		},
		parentNode: {
			type: Object
		},
		index: {
			type: Number,
			value: -1
		},
		isLast: {
			type: Number,
			value: false
		}
	},

	created: function() {
		const userAgent = window.navigator.userAgent;
		if (userAgent.indexOf('Trident/') >= 0) {
			this._iconStyle = 'transform: translateY( -0.6rem );';
		} else if (
			window.navigator.userAgent.indexOf('Edge/') >= 0 ||
			window.navigator.userAgent.indexOf('WebKit') < 0
		) {
			this._iconStyle = 'transform: translateY( -2px );';
		}
	},

	ready: function() {
		afterNextRender(this, function() {
			this.addEventListener('focus', this.onFocus);
			this.addEventListener('blur', this.onBlur);
			this.addEventListener('click', this._expandCollapse);
		}.bind(this));

		const marginLeft = 12 * this.currentLevel;

		if (this._isSelected) {
			this.updateStyles({
				'--sublevel-cell-margin': `${marginLeft}px`,
				'--leaf-background-colour': `var(--d2l-color-celestine-plus-2)`
			});
		} else {
			this.updateStyles({
				'--sublevel-cell-margin': `${marginLeft}px`,
				'--leaf-background-colour': `transparent`,
			});
		}
	},

	onFocus: function(e) {
		e.stopPropagation();
		const event = new CustomEvent('focus-child');
		event.node = this;
		this.dispatchEvent(event);

		this._focus = true;
		this.keydownEventListener = this._handleKeyDown.bind(this);
		window.addEventListener('keydown', this.keydownEventListener);
	},

	onBlur: function() {
		this._focus = false;
		window.removeEventListener('keydown', this.keydownEventListener);
	},

	_getThis: function() {
		return this;
	},

	_getHierarchy: function(item) {
		if (!item || !item.entities) {
			return [];
		}
		return item.entities.filter(function(e) {return e.class.includes('hierarchical-outcome'); });
	},

	_isEmpty(array) {
		return !array || !array.length;
	},

	_isLeafNode: function(item) {
		return item.class.includes('leaf-outcome');
	},

	_isNonLeafNode: function(item) {
		return item.class.includes('collection');
	},

	_isRootNode: function(item) {
		return item.class.includes('outcomes-root');
	},

	_getIsSelected: function(alignments, item) {
		return alignments && item && item.properties && item.properties.objectiveId && alignments.has(item.properties.objectiveId);
	},

	_getLeafClass: function(isSelected) {
		return isSelected ? 'leaf-node-selected' : '';
	},

	_hasOutcomeIdentifier: function(entity) {
		return !!this.getOutcomeIdentifier(entity);
	},

	_expandCollapse: function(event) {
		this._collapsed = !this._collapsed;
		if (!this._focus) this._focusSelf();
		event.stopPropagation();
	},

	_redrawIcon: function(_collapsed) {
		return _collapsed ? 'd2l-tier1:arrow-expand' : 'd2l-tier1:arrow-collapse';
	},

	_onOutcomeSelectChange: function(e) {
		var target = e.target;
		if (target.checked) {
			this.updateStyles({
				'--leaf-background-colour': `var(--d2l-color-celestine-plus-2)`,
			});
			this.alignments.add(this.item.properties.objectiveId);
		} else {
			this.updateStyles({
				'--leaf-background-colour': `transparent`,
			});
			this.alignments.delete(this.item.properties.objectiveId);
		}

		this.dispatchEvent(new CustomEvent('d2l-alignment-list-changed', {
			bubbles: true,
			composed: true
		}));
	},

	_getCellClass: function(item) {
		return this._isLeafNode(item) ? 'd2l-select-outcomes-leaf' : ' d2l-select-outcomes-collection';
	},

	_getNextLevel: function(currentLevel) {
		return currentLevel ? currentLevel + 1 : 1;
	},

	_getOutcomeIsLast: function(outcomeIndex) {
		return outcomeIndex === this._children.length - 1;
	},

	_handleKeyDown: function(e) {
		console.log('handling');
		if (this._hasOutcomeIdentifier(this.item)) {
			console.log(this.getOutcomeIdentifier(this.item));
		} else {
			console.log(this.getOutcomeDescriptionPlainText(this.item));
		}
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			e.stopPropagation();
			this._focusNext();
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			e.stopPropagation();
			this._focusPrevious();
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			e.stopPropagation();
			if (!this._isEmpty(this._children) && !this._collapsed) {
				this._toggleCollapse();
			} else {
				this._focusParent();
			}
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			e.stopPropagation();
			if (!this._isEmpty(this._children) && this._collapsed) {
				this._toggleCollapse();
			} else {
				this._focusChild();
			}
		} else if (e.key === 'Enter') {
			e.preventDefault();
			e.stopPropagation();
			this._selectHandler();
		} else if (e.key === 'Home') {
			e.preventDefault();
			e.stopPropagation();
			this._focusFirst();
		} else if (e.key === 'End') {
			e.preventDefault();
			e.stopPropagation();
			this._focusLast();
		}
	},

	_focusChild: function() {
		if (!this._isEmpty(this._children) && !this._collapsed) {
			const elem = this.root.querySelector('d2l-outcomes-hierarchy-item');
			if (elem) {
				elem.focus();
			}
		}
	},

	_focusNext: function() {
		console.log('focusing next: ' + this.index);
		if (!this._isEmpty(this._children) && !this._collapsed) {
			this._focusChild();
		} else if (!this.isLast) {
			this.onBlur();
			const event = new CustomEvent('focus-next');
			event.index = this.index;
			this.dispatchEvent(event);
		}
	},

	_focusPrevious: function() {
		console.log('focusing previous: ' + this.index);
		if (this.index > 0) {
			this.onBlur();
			const event = new CustomEvent('focus-previous');
			event.index = this.index;
			this.dispatchEvent(event);
		} else {
			this._focusParent();
		}
	},

	_focusNextSibling: function(e) {
		if (e.index < this._children.length - 1) {
			const element = this.shadowRoot.getElementById((e.index + 1).toString());
			if (element) {
				element.focus();
			}
		} else {
			const event = new CustomEvent('focus-next');
			event.index = this.index;
			this.dispatchEvent(event);
		}
	},

	_focusPreviousSibling: function(e) {
		if (e.index > 0) {
			const element = this.shadowRoot.getElementById((e.index - 1).toString());
			if (element) {
				element.focus();
			}
		} else {
			const event = new CustomEvent('focus-previous');
			event.index = this.index;
			this.dispatchEvent(event);
		}
	},

	_focusParent: function() {
		if (!this.parentNode) return;
		this.onBlur();
		const event = new CustomEvent('focus-parent');
		this.dispatchEvent(event);
	},

	_focusSelf: function() {
		this.blur();
		this.focus();
	},

	_onFocusChild: function(e) {
		if (this._focus) this.onBlur();
		const event = new CustomEvent('focus-child');
		event.node = e.node;
		this.dispatchEvent(event);
	}
});
