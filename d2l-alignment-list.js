/**
`d2l-alignment-list`

@demo demo/index.html
*/

import { Actions } from 'd2l-hypermedia-constants';
import 'd2l-colors/d2l-colors.js';
import 'd2l-alert/d2l-alert.js';
import 'd2l-loading-spinner/d2l-loading-spinner.js';
import 'd2l-offscreen/d2l-offscreen.js';
import './d2l-alignment.js';
import './localize-behavior.js';
import './d2l-siren-map-helper.js';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { css, html } from 'lit-element';
import { LocalizeMixin } from './LocalizeMixin';
import 'd2l-typography/d2l-typography.js';

class D2lAlignmentList extends LocalizeMixin(EntityMixinLit(LitElement)) {

	static get is() { return 'd2l-alignment-list'; }

	static get properties() {
		return {
			readOnly: {
				type: Boolean
			},
			_isEditable: {
				type: Boolean
			},
			_directAlignmentHrefs: {
				type: Array
			},
			_indirectAlignmentHrefs: {
				type: Array
			},
			_alignmentHrefs: {
				type: Array
			},
			_alignmentMap: {
				type: Object
			},
			headerTitle: {
				type: String
			}
		}
	}

	static get styles() {
		return css`
			:host {
				display: flex;
				width: 100%;
				max-width: 922px;

				/* The standard button box-shadow width */
				--d2l-alignment-list-overflow-margin: 4px;
			}

			.d2l-alignment-list-content {
				display: flex;
				flex-direction: column;
				flex: 1;
				margin: var(--d2l-alignment-list-overflow-margin);
			}

			d2l-loading-spinner {
				width: 100%;
				margin: var(--d2l-alignment-list-overflow-margin);
			}

			siren-entity-loading {
				display: flex;
				flex-direction: column;
				overflow: hidden;
				width: 100%;
				margin: var(--d2l-alignment-list-overflow-margin);

				--siren-entity-loading-min-height: 10rem;
			}

			siren-entity-loading d2l-loading-spinner {
				--d2l-loading-spinner-size: 10rem;
			}

			ul {
				padding: 0;
				overflow: auto;
				margin: 0;
				margin-top: -1.3rem;
			}

			li {
				position: relative;
				list-style-type: none;
				color: var(--d2l-color-ferrite);

				margin-bottom: 0.9rem;
			}

			li:last-of-type {
				margin-bottom: 0;
			}

			.d2l-alignment-list-editable li {
				padding: 0 0 0.6rem 0.6rem;
				border-top: 1px solid var(--d2l-color-gypsum);
				margin-bottom: 0;
			}

			:host-context([dir="rtl"]) .d2l-alignment-list-editable li {
				padding-right 0.6rem;
				padding-left: 0;
			}

			.d2l-alignment-list-editable li:last-of-type {
				border-bottom: 1px solid var(--d2l-color-gypsum);
			}

			d2l-alert {
				margin-top: 0.5rem;
			}

			.alignment-list-header {
				@apply --d2l-heading-3;
				margin-bottom: 0;
			}

			.direction-correction { /* The slot of siren-entity-loading has felx-direction: row and needs to be corrected */
				display: flex;
				flex-direction: column;
			}
		`;
	}

	constructor() {
		super();
		this.headerTitle = null;
		this.readOnly = false;

		this._isEditable = false;
		this._alignmentHrefs = [];
		this._directAlignmentHrefs = [];
		this._indirectAlignmentHrefs = [];

		//this._setEntityType(xyz) //Need to make entity object first
	}

	render() {
		return html`
			<siren-entity-loading href="${this.href}" token="${this.token}">
				<div class="direction-correction">
					<div class="d2l-alignment-list-content">
						${this._renderListContentHeader()}
						${this._renderAlignmentsList(true)}
						${this._renderAlignmentsList(false)}
						${this._alignmentHrefs.map(href => html`
							<!-- TODO: map was using 2-way binding -- add event system for Lit version -->
							<d2l-siren-map-helper href="${href}" token="${this.token}" map="${this._alignmentMap}"></d2l-siren-map-helper>
						`)}
						${this._promiseError ? html`
							<d2l-alert type="error">${this.localize('error')}</d2l-alert>
						` : html``}
					</div>
					${this._isEditable ? html`
						<div>
							<slot name="show-select-outcomes"></slot>
						</div>
					` : html``}
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

	_getClass(isEditable) {
		if (isEditable) {
			return 'd2l-alignment-list-editable';
		}

		return '';
	}

	_getAlignmentHrefs(entity) {
		if (!entity || !entity.entities || !entity.entities.length) {
			return [];
		}

		return entity.entities.map(subentity => subentity.href);
	}

	_getDirectAlignmentHrefs(alignmentMap) {
		if (!alignmentMap) {
			return [];
		}
		return Object.keys(alignmentMap).filter(
			href => alignmentMap[href].properties.relationshipType !== 'referenced'
		);
	}

	_getIndirectAlignmentHrefs(alignmentMap) {
		if (!alignmentMap) {
			return [];
		}
		return Object.keys(alignmentMap).filter(
			href => alignmentMap[href].properties.relationshipType !== 'owned'
		);
	}

	_isEmpty(object) {
		for (var x in object) {
			return false;
		}
		return true;
	}

	//TODO (Lit conversion): verify if we need to add a handler to delete the removed alignment's entires in the href lists
	_onAlignmentRemove(e) {
		const newMap = this._alignmentMap;
		delete newMap[e.detail.entity.getLinkByRel('self').href];
		if (this._isEmpty(newMap)) {
			this.set('_alignmentMap', {});
		}
		this.set('_alignmentMap', newMap);

		// Notify screen readers that an alignment has been removed
		var screenReaderAlert = this.create('d2l-offscreen');
		screenReaderAlert.textContent = this.localize('alignmentRemoved');
		this.shadowRoot.appendChild(screenReaderAlert);
		screenReaderAlert.setAttribute('role', 'alert');
		this.async(function() {
			this.shadowRoot.removeChild(screenReaderAlert);
		}.bind(this), 3000);
	}

	_onEntityChanged(entity) {
		if(!entity) {
			return;
		}
		
		this._isEditable = !this.readOnly && entity.hasActionByName(Actions.alignments.startUpdateAlignments);

		this._alignmentHrefs = this._getAlignmentHrefs(entity);
		this._directAlignmentHrefs = this._getDirectAlignmentHrefs(this._alignmentMap);
		this._indirectAlignmentHrefs = this._getIndirectAlignmentHrefs(this._alignmentMap);

	}

	_hasAlignments(alignmentList1, alignmentList2) {
		return (
			(alignmentList1 && alignmentList1.length) ||
			(alignmentList2 && alignmentList2.length)
		);
	}

	_hasAlignmentsAndNotEditable() {
		return !this._isEditable && this._hasAlignments(this._directAlignmentHrefs, this._indirectAlignmentHrefs);
	}

	_hasAlignmentsOrEditable() {
		return this._hasAlignments(this._directAlignmentHrefs, this._indirectAlignmentHrefs) || this._isEditable;
	}

	_renderAlignment(href, index, isIndirect) {

		let id = this.is();
		id += '-';
		id += isIndirect ? 'indirect' : 'direct';
		id += '-alignment-intent-';
		id += index.toString();

		return html`
			<li>
				<d2l-alignment
					id$="${id}"
					href="${href}"
					token="${this.token}"
					read-only
				></d2l-alignment>
			</li>
		`;
	}

	_renderAlignmentsList(isIndirectAlignments) {
		const alignmentHrefs = isIndirectAlignments ? this._indirectAlignmentHrefs : this._directAlignmentHrefs;
		if(!this._hasAlignments(alignmentHrefs)) {
			return html``;
		}
		
		const headerLangterm = isIndirectAlignments ? 'indirectAlignments' : 'directAlignments';

		return html`
			<div class="alignment-list-header">${this.localize(headerLangterm, 'headerTitle', headerTitle)}</div>
			<ul aria-busy="${this._loading}" class="${this._getClass(this._isEditable)}">
				${alignmentHrefs.map((item, index) => this._renderAlignment(item, index, isIndirectAlignments))}
			</ul>
		`
	}

	_renderListContentHeader() {
		let markup = html``;
		if (this._hasAlignmentsOrEditable()) {
			markup += html`
				<div>
					<slot name="outcomes-title"></slot>
				</div>
			`;
		}
		if(this._hasAlignmentsAndNotEditable()) {
			markup += html`
				<div>
					<slot name="describe-aligned-outcomes"></slot>
				</div>						
			`;
		}
		return markup;
	}
}

customElements.define(D2lAlignmentList.is, D2lAlignmentList);
