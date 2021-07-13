import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { css, html } from 'lit-element';

class SirenMapHelper extends EntityMixinLit(LitElement) {

	static get properties() {
		return {
			entityTypeString: {
				type: String,
				attribute: 'entity-type'
			},
			map: {
				type: Object
			}
		};
	}

	static get styles() {
		return css`
			:host {
				display: none;
			}
		`;
	}

	constructor() {
		super();
		this.entityTypeString = null;
		this.map = {};
	}

	set entityTypeString(typeString) {
		//Set the entity type of this object
		switch(typeString) {
			case 'alignment': this._setEntityType(ActivityAlignmentEntity); break;
			case 'intent': this._setEntityType(OutcomeIntentEntity); break;
			case 'outcome': this._setEntityType(OutcomeEntity); break;
		}
	}

	set map(map) {
		this.dispatchEvent(
			new CustomEvent(
				'd2l-siren-map-updated', {
					composed: true,
					bubbles: true,
					detail: map
				}
			)
		);
	}

	set _entity(entity) {
		if (this._entityHasChanged(entity)) {
			this._onEntityChanged(entity);
			super._entity = entity;
		}
	}

	render() {
		return html``;
	}

	_onEntityChanged(entity) {
		if (entity && entity.links) {
			this.map[this.href] = entity;
		} else if (this.map[this.href]) {
			delete this.map[this.href];
		}

		// notify object changed
		const mapping = this.map;
		this.set('map', {});
		this.set('map', mapping);
	}

}

customElements.define('d2l-siren-map-helper', SirenMapHelper);
