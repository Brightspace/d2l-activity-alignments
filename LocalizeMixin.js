import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { LocalizeDynamicMixin } from '@brightspace-ui/core/mixins/localize-dynamic-mixin.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';

const LocalizeMixinInternal = (superclass) => class extends LocalizeDynamicMixin(RtlMixin(superclass)) {

	static get localizeConfig() {
		return {
			importFunc: async lang => (await import(`../lang/${lang}.js`)).default
		};
	}

};

export const LocalizeMixin = dedupeMixin(LocalizeMixinInternal);