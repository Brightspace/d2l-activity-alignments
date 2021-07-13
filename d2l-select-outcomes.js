/**
`d2l-select-outcomes`

@demo demo/index.html
*/

import { Rels } from 'd2l-hypermedia-constants';
import 'd2l-alert/d2l-alert.js';
import './d2l-alignment-update.js';
import { LocalizeMixin } from './LocalizeMixin';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { css, html } from 'lit-element';

class D2lSelectOutcomes extends LocalizeMixin(EntityMixinLit(LitElement)) {

	static get is() { return 'd2l-select-outcomes'; }

	static get properties() {
		return {
			_showError: Boolean,
			_alignmentHrefs: Array,
			//TODO (Lit): use events to replace notify: true for "empty"
			empty: Boolean,
			deferredSave: Boolean
		};
	}

	static get styles() {
		return css`
			:host {
				display: flex;
				overflow: auto;
			}

			.d2l-select-outcomes-main {
				display: block;
				position: relative;
			}
		`;
	}

	constructor() {
		super();

		this.deferredSave = false;
		this._showError = false;
		this._boundHandleError = this._handleError.bind(this);

		//this._setEntityType(xyz) //Need to define entity item first
	}

	connectedCallback() {
		this._showError = false;
		this.addEventListener('d2l-siren-entity-error', this._boundHandleError);
	}

	disconnectedCallback() {
		this.removeEventListener('d2l-siren-entity-error', this._boundHandleError);
	}

	render() {
		//TODO (Lit): setup event to replace empty attribute's 2-way binding
		return html`
			<div class="d2l-select-outcomes-main">
				<d2l-alignment-update ?deferred-save="${this.deferredSave}" ?empty="${this.empty}" href="${this._alignmentsHrefs}" token="${this.token}"></d2l-alignment-update>
				${this._showError ? html`
					<d2l-alert type="error">${this.localize('error')}</d2l-alert>
				` : html``}
			</div>
		`;
	}
	
	set _entity(entity) {
		if (this._entityHasChanged(entity)) {
			this._onEntityChanged(entity);
			super._entity = entity;
		}
	}

	_handleError() {
		this._showError = true;
	}

	_onEntityChanged(entity) {
		if (!entity) {
			return;
		}

		if (entity.hasLinkByRel(Rels.Alignments.alignments)) {
			this._alignmentsHrefs = entity.getLinkByRel(Rels.Alignments.alignments).href;
		}
	}


}

customElements.define(D2lSelectOutcomes.is, D2lSelectOutcomes);