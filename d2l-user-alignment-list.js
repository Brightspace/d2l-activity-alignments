/**
`d2l-user-alignment-list`

@demo demo/index.html
*/

import { Actions } from 'd2l-hypermedia-constants';
import 'd2l-colors/d2l-colors.js';
import 'd2l-alert/d2l-alert.js';
import 'd2l-loading-spinner/d2l-loading-spinner.js';
import 'd2l-polymer-siren-behaviors/siren-entity-loading.js';
import 'd2l-offscreen/d2l-offscreen.js';
import './d2l-alignment.js';
import './d2l-siren-map-helper.js';
import { LocalizeMixin } from './LocalizeMixin';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { css, html } from 'lit-element';
import 'd2l-typography/d2l-typography.js';

class D2lUserAlignmentList extends LocalizeMixin(EntityMixinLit(LitElement)) {

	static get is() {return 'd2l-user-alignment-list'; }

	static get properties() {
		return{
			readOnly: Boolean,
			_alignmentHrefs: Array,
			_alignmentMap: Object,
			_hasUpdateAlignmentsAction: Boolean
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
		`;
	}

	constructor() {
		super();

		this.readOnly = false;
		this._hasUpdateAlignmentsAction = false;
		this._alignmentHrefs = [];

		//this._setEntityType(xyz) //Need to define entity item first
	}

	render() {
		return html`
			<siren-entity-loading href="${this.href}" token="${this.token}">
				<div class="d2l-alignment-list-content">
					${this._hasAlignmentsOrEditable() ? html`
						<div>
							<slot name="outcomes-title"></slot>
						</div>
					` : html``}
					${this._hasAlignmentsAndNotEditable() ? html`
						<div>
							<slot name="describe-aligned-outcomes"></slot>
						</div>
					` : html``}
					${this._hasAlignments(this._alignmentHrefs) ? html`
						<ul aria-busy="${this._loading}" class="${this._getClass()}">
							${this._alignmentHrefs.map((item, index) => html`
								<li>
									<d2l-alignment
										id="${this.is}-alignment-intent-${index}"
										href="${item}"
										token="${this.token}"
										read-only="${this.readOnly}"
									></d2l-alignment>
								</li>
							`)}
						</ul>
					` : html``}
					${this._promiseError ? html`
						<d2l-alert type="error">${this.localize('error')}</d2l-alert>
					` : html``}
					${this._isEditable() ? html`
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

	_getClass() {
		if (this._isEditable()) {
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

	_onAlignmentRemove(e) {
		var index = +e.target.dataset.index;
		this.splice('_alignmentHrefs', index, 1);

		// Notify screen readers that an alignment has been removed
		var screenReaderAlert = this.create('d2l-offscreen');
		screenReaderAlert.textContent = this.localize('alignmentRemoved');
		Polymer.dom(this.root).appendChild(screenReaderAlert);
		screenReaderAlert.setAttribute('role', 'alert');
		this.async(function() {
			Polymer.dom(this.root).removeChild(screenReaderAlert);
		}.bind(this), 3000);
	}

	_onEntityChanged(entity) {
		if (!entity) {
			return;
		}

		this._alignmentHrefs = this._getAlignmentHrefs(entity);
		this._hasUpdateAlignmentsAction = entity.hasActionByName(Actions.alignments.startUpdateAlignments);
	}

	_isEditable() {
		return !this.readOnly && this._hasUpdateAlignmentsAction;
	}

	_hasAlignments() {
		return this._alignmentHrefs && this._alignmentHrefs.length;
	}

	_hasAlignmentsAndNotEditable() {
		return !this._isEditable() && this._hasAlignments();
	}

	_hasAlignmentsOrEditable() {
		return this._hasAlignments() || this._isEditable();
	}
}

customElements.define(D2lUserAlignmentList.is, D2lUserAlignmentList);