/**
`d2l-outcome-hierarchy-item`

@demo demo/index.html
*/

import '@brightspace-ui/core/components/expand-collapse/expand-collapse-content.js';
import 'd2l-inputs/d2l-input-checkbox.js';
import 'd2l-icons/tier1-icons.js';
import 'd2l-loading-spinner/d2l-loading-spinner.js';
import 'd2l-typography/d2l-typography-shared-styles.js';
import 'd2l-button/d2l-button.js';
import '@polymer/iron-collapse/iron-collapse.js'; //TODO: find Lit equivalent as needed
import 's-html/s-html.js';
import './d2l-bold-text-wrapper.js';
import { LocalizeMixin } from './LocalizeMixin';
import { OutcomeParserMixin } from './OutcomeParserMixin.js';
import { css, html } from 'lit-element';

class D2lOutcomeHierarchyItem extends LocalizeMixin(OutcomeParserMixin(LitElement)) {

	static get is() { return 'd2l-outcome-hierarchy-item'; }

	static get properties() {
		return {
			item: {
				type: Object
			},
			alignments: {
				type: Set
			},
			partialAlignments: {
				type: Set
			},
			_children: {
				type: Array
			},
			_collapsed: {
				type: Boolean
			},
			_iconStyle: {
				type: String
			},
			_collapseIcon: {
				type: String
			},
			_nextLevel: {
				type: Number
			},
			_isSelected: {
				type: Boolean
			},
			parentNode: {
				type: Object
			},
			index: {
				type: Number
			},
			isLast: {
				type: Number,
			},
			currentLevel: {
				type: Number
			},
			_ariaSelected: {
				type: String,
			},
			_ariaExpanded: {
				type: String,
			},
			_headerAriaLabel: {
				type: String
			},
			_leafAriaLabel: {
				type: String
			}
		}
	}

	static get styles() {
		return css`
			:host {
				display: block;
				width: 100%;
				--sublevel-cell-margin: 6px;
			}

			* {
				outline: none;
			}

			.d2l-outcome-wrap {
				display: flex;
				flex-direction: column-reverse;
				margin-left: 10px;
				width: 100%;
			}

			.d2l-outcome-heading {
				margin-top: 10px;
				margin-right: 24px;
				line-height: 32px;
			}

			.d2l-outcome-heading > * {
				margin: -6px 0px 0px 5px !important;
				font-size: var(--d2l-heading-4_-_font-size);
				font-weight: var(--d2l-heading-4_-_font-weight);
			}

			.d2l-collapsible-node {
				display: flex;
				background-color: var(--non-leaf-background);
				border: var(--leaf-border);
			}

			.node-header-content {
				display: -webkit-inline-box;
				margin-left: var(--sublevel-cell-margin);
				line-height: 28px;
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
				margin-top: 6px;
				margin-right: 8px;
			}

			ul {
				list-style-type:none;
				padding: 0px;
				flex: 1;
				word-break: break-word;
				margin-bottom: 0px;
				margin-block-start: 0em;
				transition:visibility 0.3s linear,opacity 0.3s linear;
			}

			li {
				list-style-type: none;
				border: 2px solid transparent;
				border-top-color: var(--d2l-color-gypsum);
				color: var(--d2l-color-ferrite);
			}

			d2l-input-checkbox {
				padding-left: var(--sublevel-cell-margin);
				padding-right: var(--sublevel-cell-margin);
				padding-top: 12px;
				padding-bottom: 12px;
				margin: 0;
			}

			.d2l-select-outcomes-leaf:hover {
				z-index: 1;
				background-color: var(--d2l-color-celestine-plus-2);
				border-top: 2px solid var(--d2l-color-celestine-plus-1);
				border-bottom: 2px solid var(--d2l-color-celestine-plus-1);
				color: var(--d2l-color-celestine);
			}

			.d2l-hierarchy-tree {
                border: 1px solid transparent;
                border-bottom-color: var(--d2l-color-gypsum);
			}

			.leaf-node-container {
				background-color: var(--leaf-background-colour);
				border: var(--leaf-border);
				margin: -2px;
			}

			#children-collapse {
				--iron-collapse-transition-duration: 200ms;
			}
		`;
	}

	set alignments(alignments) {
		this._setIsSelectedState(this._entity, alignments);
	}

	set currentLevel(currentLevel) {
		this._nextLevel = this._getNextLevel(currentLevel);
		this._headerAriaLabel = this._computeHeaderAriaLabel(this._entity, this.collapsed, currentLevel);
	}

	set item(item) {
		this._setIsSelectedState(item, this.alignments);
		this._setAriaSelected(item, this._isSelected);
		this._ariaExpanded = this._getAriaExpanded(item, this._collapsed);
		this._headerAriaLabel = this._computeHeaderAriaLabel(item, this.collapsed, this.currentLevel);
		this._children = this._getHierarchy(item);	

	} 

	set _collapsed(collapsed) {
		this._collapseIcon = this._redrawIcon(collapsed);
		this._ariaExpanded = this._getAriaExpanded(this.item, collapsed);
		this._headerAriaLabel = this._computeHeaderAriaLabel(this.item, collapsed, this.currentLevel);
	}

	set _entity(entity) {
		if (this._entityHasChanged(entity)) {
			this._onEntityChanged(entity);
			super._entity = entity;
		}
	}

	set _isSelected(isSelected) {
		this.this._setAriaSelected(this.item, isSelected);
	}

	constructor() {
		super();
		
		this.index = -1;
		this.isLast = false;
		this._collapsed = false;
		this._iconStyle = null;

		const userAgent = window.navigator.userAgent;
		if (userAgent.indexOf('Trident/') >= 0) {
			this._iconStyle = 'transform: translateY( -0.6rem );';
		} else if (
			window.navigator.userAgent.indexOf('Edge/') >= 0 ||
			window.navigator.userAgent.indexOf('WebKit') < 0
		) {
			this._iconStyle = 'transform: translateY( -2px );';
		}

		this._onFocus = this._onFocus.bind(this);
		this._onBlur = this._onBlur.bind(this);
		this._expandCollapse = this._expandCollapse.bind(this);

		const marginLeft = 12 * this.currentLevel;
		this.updateStyles({
			'--leaf-border': '2px solid transparent',
			'--non-leaf-background': '#F9FBFF',
		});
		if (this._isSelected) {
			this.updateStyles({
				'--sublevel-cell-margin': `${marginLeft}px`,
				'--leaf-background-colour': 'var(--d2l-color-celestine-plus-2)'
			});
		} else {
			this.updateStyles({
				'--sublevel-cell-margin': `${marginLeft}px`,
				'--leaf-background-colour': 'transparent',
			});
		}
	}

	connectedCallback() {
		this.addEventListener('focus', this._onFocus);
		this.addEventListener('blur', this._onBlur);
		this.addEventListener('click', this._expandCollapse);
	}

	disconnectedCallback() {
		this.removeEventListener('focus', this._onFocus);
		this.removeEventListener('blur', this._onBlur);
		this.removeEventListener('click', this._expandCollapse);
	}

	render() {
		return html`
			<div
				id="container"
				tabindex="-1"
				role="treeitem"
				aria-selected="${this._ariaSelected}"
				aria-expanded="${this._ariaExpanded}"
			>
				${this._isLeafNode(this.item) ? this._renderLeafNode() : this._renderNonLeafNode()}
				${this._isHierarchyStart(this.item) ? this._renderHierarchySubtree() : html``}
			</div>
		`;
	}

	_onFocus(e) {
		e.stopPropagation();
		if (this._isHierarchyStart(this.item)) {
			return this._selectFirstNode();
		} else {
			const elem = this.shadowRoot.getElementById('container');
			if (elem) {
				elem.focus({
					preventScroll: true
				});
			}
		}
		const event = new CustomEvent('focus-child');
		event.node = this;
		this.dispatchEvent(event);

		this.updateStyles({
			'--leaf-border': '2px solid var(--d2l-color-celestine-plus-1)',
			'--non-leaf-background': 'var(--d2l-color-celestine-plus-2)',
		});

		this._focus = true;
		this.keydownEventListener = this._handleKeyDown.bind(this);
		window.addEventListener('keydown', this.keydownEventListener);
	}

	_onBlur() {
		this.updateStyles({
			'--leaf-border': '2px solid transparent',
			'--non-leaf-background': '#F9FBFF',
		});
		this._blurContainer();
		this._focus = false;
		window.removeEventListener('keydown', this.keydownEventListener);
	}

	_getAriaExpanded(item, _collapsed) {
		if (!item || !item.entities || !this._isNonLeafNode(item)) {
			return undefined;
		} else if (_collapsed) {
			return 'false';
		} else {
			return 'true';
		}
	}

	_setAriaSelected(item, _isSelected) {
		if (!item || !item.class) {
			this._ariaSelected = undefined;
		} else if (_isSelected || !this._isLeafNode(item)) {
			this._ariaSelected = 'true';
		} else {
			this._ariaSelected = 'false';
		}
	}

	_getHierarchyfunction(item) {
		if (!item || !item.entities) {
			return [];
		}
		return item.entities.filter(function(e) {return e.class.includes('hierarchical-outcome'); });
	}

	_hasChildren() {
		return this._children && this._children.length;
	}

	_isLeafNode(item) {
		return item.class.includes('leaf-outcome');
	}

	_isNonLeafNode(item) {
		return item.class.includes('collection');
	}

	_isHierarchyStart(item) {
		return item.class.includes('hierarchy-start');
	}

	_setIsSelectedState(item, alignments) {
		const canSelect = alignments && item && item.properties && item.properties.objectiveId;
		this._isSelected = canSelect ? alignments.has(item.properties.objectiveId) : false;

		this.updateStyles({
			'--leaf-background-colour': this._isSelected ? 'var(--d2l-color-celestine-plus-2)' : 'transparent',
		});
	}

	_hasOutcomeIdentifier(entity) {
		return !!this.getOutcomeIdentifier(entity);
	}

	_hasOutcomeDescription(entity) {
		return !!this.getOutcomeDescriptionPlainText(entity);
	}

	_expandCollapse(event) {
		this._collapsed = !this._collapsed;
		this.blur();
		this._focusSelf();
		if (event) {
			event.stopPropagation();
		}
	}

	_expandCollapseIfLeaf() {
		if (this._isLeafNode(this.item)) {
			const elem = this.shadowRoot.getElementById('checkbox');
			if (elem) {
				elem.simulateClick();
			}
		}
	}

	_getIndeterminate(item) {
		return this.partialAlignments.has(item.properties.objectiveId);
	}

	_redrawIcon(_collapsed) {
		return _collapsed ? 'd2l-tier1:arrow-expand' : 'd2l-tier1:arrow-collapse';
	}

	_onEntityChanged(entity) {
		if(!entity) {
			return;
		}

		entity.subEntitiesLoaded().then(() => {
			//Refrain from setting item until the entity and its children have fully loaded
			this.item = entity;
		})
	}

	_onOutcomeSelectChange(e) {
		var target = e.target;
		if (target.checked) {
			this._isSelected = true;
			this.updateStyles({
				'--leaf-background-colour': 'var(--d2l-color-celestine-plus-2)',
			});
			this.alignments.add(this.item.properties.objectiveId);
			this.partialAlignments.delete(this.item.properties.objectiveId);
		} else {
			this._isSelected = false;
			this.updateStyles({
				'--leaf-background-colour': 'transparent',
			});
			this.alignments.delete(this.item.properties.objectiveId);
			this.partialAlignments.delete(this.item.properties.objectiveId);
		}

		this.dispatchEvent(new CustomEvent('d2l-alignment-list-changed', {
			bubbles: true,
			composed: true
		}));
	}

	_getCellClass(item) {
		return this._isLeafNode(item) ? 'd2l-select-outcomes-leaf' : ' d2l-select-outcomes-collection';
	}

	_getNextLevel(currentLevel) {
		return currentLevel ? currentLevel + 1 : 1;
	}

	_getOutcomeIsLast(outcomeIndex) {
		return outcomeIndex === this._children.length - 1;
	}

	_handleKeyDown(e) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			e.stopPropagation();
			this._focusNext();
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			e.stopPropagation();
			this._moveUpTree();
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			e.stopPropagation();
			if (this._hasChildren() && !this._collapsed) {
				this._expandCollapse();
			} else if (this.currentLevel > 1) {
				this._focusParent();
			}
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			e.stopPropagation();
			if (this._hasChildren() && this._collapsed) {
				this._expandCollapse();
			} else {
				this._focusChild();
			}
		} else if (e.key === 'Enter') {
			e.preventDefault();
			e.stopPropagation();
			if (this._isLeafNode(this.item)) {
				const elem = this.shadowRoot.getElementById('checkbox');
				if (elem) {
					elem.simulateClick();
				}
			} else if (this._isNonLeafNode(this.item)) {
				this._expandCollapse();
			}
		} else if (e.keyCode === 32) {
			e.preventDefault();
			e.stopPropagation();
			if (this._isLeafNode(this.item)) {
				const elem = this.shadowRoot.getElementById('checkbox');
				if (elem) {
					elem.simulateClick();
				}
			}
		} else if (e.key === 'Home') {
			e.preventDefault();
			e.stopPropagation();
			this._onFocusTreeStart();
		} else if (e.key === 'End') {
			e.preventDefault();
			e.stopPropagation();
			this._onFocusTreeEnd();
		}
	}

	_focusChild() {
		if (this._hasChildren() && !this._collapsed) {
			this._blurContainer();
			const elem = this.shadowRoot.getElementById('0');
			if (elem) {
				elem.focus();
			}
		}
	}

	_focusNext() {
		if (this._hasChildren() && !this._collapsed) {
			this._focusChild();
		} else {
			this._blurContainer();
			const event = new CustomEvent('focus-next');
			event.index = this.index;
			this.dispatchEvent(event);
		}
	}

	_moveUpTree() {
		if (this.index === 0) {
			this._focusParent();
		} else {
			this._blurContainer();
			const event = new CustomEvent('focus-previous');
			event.index = this.index;
			this.dispatchEvent(event);
		}
	}

	_focusNextSibling(e) {
		if (e.index < this._children.length - 1) {
			const element = this.shadowRoot.getElementById((e.index + 1).toString());
			if (element) {
				element.focus();
			}
		} else if (this._isHierarchyStart(this.item)) {
			this.focusLastVisibleNode();
		} else {
			const event = new CustomEvent('focus-next');
			event.index = this.index;
			this.dispatchEvent(event);
		}
	}

	_focusPreviousSibling(e) {
		if (e.index > 0) {
			const elem = this.shadowRoot.getElementById((e.index - 1).toString());
			if (elem) {
				elem.focusLastVisibleNode();
			}
		}
	}

	_focusParent() {
		if (!this.parentNode) return;
		this._blurContainer();
		const event = new CustomEvent('focus-parent');
		this.dispatchEvent(event);
	}

	_focusSelf(e) {
		this._blurContainer();
		if (this._isHierarchyStart(this.item)) {
			return this._selectFirstNode();
		}
		e ? this.focus() : this.focus({
			preventScroll: true
		});
	}

	_onFocusChild(e) {
		if (this._focus) this.onBlur();
		const event = new CustomEvent('focus-child');
		event.node = e.node;
		this.dispatchEvent(event);
	}

	_selectFirstNode() {
		const element = this.shadowRoot.getElementById('0');
		if (element) {
			element.focus();
		}
	}

	_onFocusTreeStart() {
		if (this._isHierarchyStart(this.item)) {
			this._selectFirstNode();
		} else {
			this._blurContainer();
			const event = new CustomEvent('focus-tree-start');
			this.dispatchEvent(event);
		}
	}

	_onFocusTreeEnd() {
		if (this._isHierarchyStart(this.item)) {
			this.focusLastVisibleNode();
		} else {
			this._blurContainer();
			const event = new CustomEvent('focus-tree-end');
			this.dispatchEvent(event);
		}
	}

	_selectLastNode() {
		const element = this.shadowRoot.getElementById((this._children.length - 1).toString());
		if (element) {
			element.focus();
		}
	}

	_blurContainer() {
		const elem = this.shadowRoot.getElementById('container');
		if (elem) {
			elem.blur();
		}
	}

	focusLastVisibleNode() {
		if (this._isHierarchyStart(this.item) || (this._hasChildren() && !this._collapsed)) {
			const elem = this.shadowRoot.getElementById((this._children.length - 1).toString());
			elem.focusLastVisibleNode();
		} else {
			this.focus();
		}
	}

	_computeHeaderAriaLabel(item, collapsed, level) {
		if (!item || !item.properties || collapsed === undefined) return undefined;
		const name = this.getOutcomeDescriptionPlainText(item);
		const status = collapsed ? 'collapsed' : 'expanded';

		return this.localize('a11yHeaderAriaLabel',
			'level', level,
			'status', this.localize(status),
			'name', name
		);
	}

	_computeLeafAriaLabel(item, selected) {
		if (!item || !item.properties || selected === undefined) return undefined;

		const shortCode = this.getOutcomeIdentifier(item) || '';
		const description = this.getOutcomeDescriptionPlainText(item) || '';
		const status = selected ? 'selected' : 'notSelected';

		return this.localize('a11yLeafAriaLabel',
			'shortCode', shortCode,
			'status', this.localize(status),
			'description', description
		);
	}

	_getOutcomeIdentifier(entity, searchText) {
		let content = this.getOutcomeIdentifier(entity);
		if (!content || !searchText) return content;

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
			content = content.replace(searchRegex, '<b>$&</b>');
		}
		return content;
	}


	//TODO (Lit): lots of new @events to verify
	_renderChildNode(item, index) {
		return html`
			<li class="${this._getCellClass(item)}" tabindex="-1">
				<d2l-outcome-hierarchy-item
					id="${index}"
					item="${item}"
					index="${outcomesIndex}"
					tabindex="-1"
					alignments="${this.alignments}"
					partial-alignments="${this.partialAlignments}"
					current-level="${this._nextLevel}"
					parentNode="${this.root}"
					?is-last="${this._getOutcomeIsLast(index)}"
					search-text="${this.searchText}"
					@focus-next="${this._focusNextSibling}"
					@focus-previous="${this._focusPreviousSibling}"
					@focus-parent="${this._focusSelf}"
					@focus-child="${this._onFocusChild}"
					@focus-last-child="${this._onFocusLastChild}" <!-- Unused function? -->
					@focus-tree-start="${this._onFocusTreeStart}"
					@focus-tree-end="${this._onFocusTreeEnd}">
				</d2l-outcome-hierarchy-item>
			</li>
		`;
	}

	_renderHierarchySubtree() {
		return html`
			<div
				class="d2l-hierarchy-tree"
				role="application tree"
				aria-multiselectable="true"
				aria-label="${this.localize('outcomesHierarchicalTree')}"
			>
				<ul>
					${this._children.map((item, index) => this._renderChildNode(item, index))}
				</ul>
			</div>
		`;
	}
	//TODO: verify @change event
	_renderLeafNode() {
		return html`
			<div class="leaf-node-container">
				<d2l-input-checkbox id="checkbox" tabindex="-1" not-tabbable="true" ?checked="${this._isSelected}" ?indeterminate="${this._getIndeterminate(item)}" @change="${this._onOutcomeSelectChange}" data-index="${index}" >
					<div class="d2l-outcome-wrap" aria-label="${this._leafAriaLabel}">
						${this._hasOutcomeIdentifier(this.item) ? html`
							<div class="d2l-outcome-identifier">
								<d2l-bold-text-wrapper content="${this._getOutcomeIdentifier(this.item, this.searchText)}"></d2l-bold-text-wrapper>
							</div>
						` : html``}
						<div class="d2l-outcome-text">
							<s-html ?hidden="${!this._fromTrustedSource(this.item)}" html="${this.getOutcomeDescriptionHtml(this.item)}"></s-html>
							<div ?hidden="${this._fromTrustedSource(this.item)}">
								<d2l-bold-text-wrapper content="${this.getOutcomeDescriptionPlainText(item)}"></d2l-bold-text-wrapper>
							</div>
						</div>
					</div>
				</d2l-input-checkbox>
			</div>
		`;
	}

	_renderNonLeafNode() {
		return html`
			<div>
				<div class="d2l-collapsible-node" aria-label="${this._headerAriaLabel}">
					<div class="node-header-content">
						<d2l-icon icon="${this._collapseIcon}"></d2l-icon>
						<div class="d2l-outcome-heading">
							${this._hasOutcomeDescription(this.item) ? html`
								<h4>${this.getOutcomeDescriptionPlainText(this.item)}</h4>
							` : html``}
							</template>
						</div>
					</div>
				</div>
				<iron-collapse ?expanded=${!this._collapsed} id="children-collapse">
					<ul>
						${this._children.map((item, index) => this._renderChildNode(item, index))}
					</ul>
				</iron-collapse>
			</div>
		`;
	}
}

customElements.define(D2lOutcomeHierarchyItem.is, D2lOutcomeHierarchyItem);