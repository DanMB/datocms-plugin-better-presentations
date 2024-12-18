import { type BuildItemPresentationInfoCtx, connect, Field, type Item, ItemPresentationInfo } from 'datocms-plugin-sdk';

const getFieldValueFromId = (id: string | undefined, item: Item, ctx: BuildItemPresentationInfoCtx) => {
	if (!id) return;
	const key = ctx.fields[id]?.attributes.api_key;
	if (!key) return;

	return item.attributes[key];
};

const getPluginField = (id: string, pluginFields: Field[]) => {
	return pluginFields.find(f => f.attributes.appearance.addons.some(a => a.field_extension === id));
};

connect({
	manualFieldExtensions() {
		return [
			// Set a custom URL for preview image
			{
				id: 'BetterPresentation__Image',
				name: 'Better presentation - image',
				type: 'addon',
				fieldTypes: ['string'],
			},
			// Will make HTML text blocks have an actual title
			{
				id: 'BetterPresentation__BlockText',
				name: 'Better presentation - text block',
				type: 'addon',
				fieldTypes: ['text'],
			},
			// Allow for completely custom presentation object
			{
				id: 'BetterPresentation__Custom',
				name: 'Better presentation - custom',
				type: 'addon',
				fieldTypes: ['json'],
			},
		];
	},

	async buildItemPresentationInfo(item: Item, ctx: BuildItemPresentationInfoCtx) {
		// Get all the fields on the current item that are hooked up the plugin
		const pluginFields = await ctx
			.loadFieldsUsingPlugin()
			.then(r => r.filter(p => p.relationships.item_type.data.id === item.relationships.item_type.data.id));

		// if there is a custom field, return that and ignore everything else
		const customField = getPluginField('BetterPresentation__Custom', pluginFields);
		if (customField) {
			const customValue = item.attributes[customField.attributes.api_key];
			if (customValue) return customValue as ItemPresentationInfo;
		}

		let title: string | undefined;
		let imageUrl: string | undefined;

		// if there is a text block field, use that as the title
		const textField = getPluginField('BetterPresentation__BlockText', pluginFields);
		if (textField) {
			const textValue = (item.attributes[textField.attributes.api_key] as string)?.replaceAll(/<\/?[^>]+>/g, '');
			if (textValue) title = textValue;
		}

		// if there is an image field, use that as the image
		const imageField = getPluginField('BetterPresentation__Image', pluginFields);
		console.log(imageField);
		if (imageField) {
			const imageValue = item.attributes[imageField.attributes.api_key] as string;
			console.log(imageValue);
			if (imageField) imageUrl = imageValue;
		}

		// const title = getFieldValueFromId(fields?.title_field?.data?.id, item, ctx);
		// const image = getFieldValueFromId(fields?.image_preview_field?.data?.id, item, ctx);
		// const excerpt = getFieldValueFromId(fields?.excerpt_field?.data?.id, item, ctx);

		// if there is no title or image, return undefined, which will make DatoCMS use the default presentation
		if (!title && !imageUrl) {
			return undefined;
		}

		// We need a title, but we've only gotten an image, so we'll try some fields
		const fields = ctx.itemTypes[item.relationships.item_type.data.id]?.relationships;
		if (!title) {
			// get the hooked up title field, if this is set it will always be correct, but it's not always set
			// so we'll try some other fields if it's not
			title = (getFieldValueFromId(fields?.title_field?.data?.id, item, ctx) ??
				item.attributes.title ??
				item.attributes.name ??
				item.id) as string;
		}
		console.log(imageUrl);

		return {
			title,
			imageUrl,
		};
	},
});
