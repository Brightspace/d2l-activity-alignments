import { LocalizeMixin } from './LocalizeMixin';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { css, html } from 'lit-element';
import { Rels } from 'd2l-hypermedia-constants';
import 'd2l-alert/d2l-alert.js';
import './d2l-activity-alignment-tag-list.js';
import './localize-behavior.js';

class ActivityAlignmentTags extends LocalizeMixin(EntityMixinLit(LitElement)) {

	static get is() {
		return 'd2l-activity-alignment-tags';
	}

	static get styles() {
		return css`
			:host {
				display: flex;
				flex-direction: column;
				align-items: stretch;
			}
		`;
	}
	static get properties() {
		return {
			readOnly: {
				type: Boolean,
				attribute: 'read-only'
			},
			empty: {
				type: Boolean
			},
			_showError: {
				type: Boolean
			},			
			//TODO: create event to notify parent of value change
			_tagListIsEmpty: {
				type: Boolean,
			},
			browseOutcomesText: {
				type: String,
				attribute: 'browse-outcomes-text',
				reflect: true
			},
			deferredSave: {
				type: Boolean
			},
			hideIndirectAlignments: {
				type: Boolean
			},
			typeName: {
				type: String,
				reflect: true
			},
			title: {
				type: String,
				reflect: true
			}
		};
	}

	constructor() {
		super();

		this.browseOutcomesText = null;
		this.deferredSave = false;
		this.empty = false;
		this.hideIndirectAlignments = false;
		this.title = null;
		this.typeName = null;
		this._showError = false;
		this._tagListIsEmpty = true;

		//this._setEntityType() //Need to make entity object first

		this._boundHandleError = this._handleError.bind(this);
	}

	render() {
		return html`
			${this._alignmentsHref ? this._renderTagList() : html`` }
			${this._showError ? this._renderErrorAlert() : html``}
		`;
	}

	connectedCallback() {
		this._showError = false;
		this.addEventListener('d2l-siren-entity-error', this._boundHandleError);
		super.connectedCallback();
	}

	disconnectedCallback() {
		this.removeEventListener('d2l-siren-entity-error', this._boundHandleError);
		this.detached();
		super.disconnectedCallback();
	}

	set _entity(entity) {
		if (this._entityHasChanged(entity)) {
			this._onEntityChanged(entity);
			super._entity = entity;
		}
	}

	//TODO: can probably add to entity object once complete for reusability
	_getAlignmentsHref(entity) {
		return entity
			&& entity.hasLinkByRel(Rels.Alignments.alignments)
			&& entity.getLinkByRel(Rels.Alignments.alignments).href;
	}

	_handleError() {
		this._showError = true;
	}

	_isEmpty(alignmentsHref, tagListIsEmpty) {
		return !alignmentsHref || tagListIsEmpty;
	}

	_onEntityChanged(entity) {
		if (!entity) {
			return;
		}

		this._alignmentsHref = this._getAlignmentsHref(entity);
		this.empty = this._isEmpty(this.alignmentsHref, this._tagListIsEmpty);
	}

	_renderErrorAlert() {
		return html`
			<d2l-alert type="error">${this.localize('error')}</d2l-alert>
		`;
	}

	_renderTagList() {
		return html`
			<d2l-activity-alignment-tag-list
				href="${this._alignmentsHref}"
				token=${this.token}"
				read-only="${this.readOnly}"
				empty="${this._tagListIsEmpty /*TODO: create event to notify parent of value change*/}"
				browse-outcomes-text="[[browseOutcomesText]]"
				deferred-save="[[deferredSave]]"
				hide-indirect-alignments="[[hideIndirectAlignments]]"
				title="[[title]]"
				type-name="[[typeName]]"
			></d2l-activity-alignment-tag-list>
		`;
	}
}

customElements.define(ActivityAlignmentTags.is, ActivityAlignmentTags);