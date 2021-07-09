/**
`d2l-activity-alignments`

@demo demo/index.html
*/
import { Rels } from 'd2l-hypermedia-constants';
import 'd2l-alert/d2l-alert.js';
import './d2l-alignment-list.js';
import './d2l-user-alignment-list.js';
import './localize-behavior.js';
import { LocalizeMixin } from './LocalizeMixin';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { css, html } from 'lit-element';

class D2lActivityAlignments extends LocalizeMixin(EntityMixinLit(LitElement)) {

	static get is() { return 'd2l-activity-alignments'; }

	static get properties() {
		return {
			headerTitle: {
				type: String,
				attribute: 'header-title'
			},
			readOnly: {
				type: Boolean,
				attribute: 'read-only'
			},
			_alignmentsHref: {
				type: String
			},
			_isUserOrActorActivityUsage: {
				type: Boolean
			},
			_showError: {
				type: Boolean
			}
		}
	}

	static get styles() {
		return css`
			:host {
				display: flex;
			}

			.d2l-activity-alignments-main {
				flex: 1;
				display: flex;
				flex-direction: column;
				height: 100%;
				z-index: 0;
			}
		`;
	}

	constructor() {
		super();
		
		this.headerTitle = '';
		this.readOnly = false;
		this._alignmentsHref = '';
		this._isUserOrActorActivityUsage = false;
		this._showError = false;

		//this._setEntityType() //Need to make entity object first

		this._boundHandleError = this._handleError.bind(this);
	}

	connectedCallback() {
		this._showError = false;
		this.addEventListener('d2l-siren-entity-error', this._boundHandleError);
	}

	disconnectedCallback() {
		this.removeEventListener('d2l-siren-entity-error', this._boundHandleError);
	}

	render() {
		return html`
		<div class="d2l-activity-alignments-main">
			${this._isUserOrActorActivityUsage ? this._renderUserAlignmentList() : this._renderAlignmentList() }
			${this._showError ? this._renderErrorAlert() : html`` }
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

	//TODO: can probably move this to the entity object once defined for reusability
	_getAlignmentsHref(entity) {
		return entity && entity.hasLinkByRel(Rels.Alignments.alignments) && entity.getLinkByRel(Rels.Alignments.alignments).href;
	}

	_onEntityChanged(entity) {
		if (!entity) {
			return;
		}

		const selfLink = entity.getLinkByRel('self');
		if (selfLink) {
			this._isUserOrActorActivityUsage = selfLink.rel.some(rel => (
				rel === Rels.Activities.userActivityUsage ||
				rel === Rels.Activities.actorActivityUsage
			));
		}

		this._alignmentsHref = this._getAlignmentsHref(entity);
	}

	_renderAlignmentList() {
		return html`
			<d2l-alignment-list href="${this._alignmentsHref}" token="${this.token}" read-only="${this.readOnly}" header-title="${this.headerTitle}">
				<slot name="outcomes-title" slot="outcomes-title"></slot>
				<slot name="show-select-outcomes" slot="show-select-outcomes"></slot>
				<slot name="describe-aligned-outcomes" slot="describe-aligned-outcomes"></slot>
			</d2l-alignment-list>
		`;
	}

	_renderErrorAlert() {
		return html`
			<d2l-alert type="error">${this.localize('error')}</d2l-alert>
		`;
	}

	_renderUserAlignmentList() {
		return html`
			<d2l-user-alignment-list href="${this._alignmentsHref}" token="${this.token}" read-only="${this.readOnly}">
				<slot name="outcomes-title" slot="outcomes-title"></slot>
				<slot name="show-select-outcomes" slot="show-select-outcomes"></slot>
				<slot name="describe-aligned-outcomes" slot="describe-aligned-outcomes"></slot>
			</d2l-user-alignment-list>
		`;
	}
}

customElements.define(D2lActivityAlignments.is, D2lActivityAlignments);