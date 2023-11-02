import m from 'mithril';

export declare type TemplateResultType = string | { html?: string };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare type TemplateCallbackType = (...args: any[]) => TemplateResultType

export function getTemplateFunction<T extends TemplateCallbackType>(template?: T, attributes?: m.Attributes): (...args: unknown[]) => m.Children {
	return (...args: unknown[]): m.Children => getTemplate(args, template, attributes);
}

export function getTemplate<T>(item: T, template?: TemplateCallbackType, attributes?: m.Attributes): m.Children {
	let content: m.Children;
	if (template) {
		const result = template(item);
		if (typeof result === 'string') {
			content = result;
		} else if (result?.html !== undefined) {
			content = m.trust(result.html);
		} else {
			content = JSON.stringify(item);
		}
	} else {
		content = JSON.stringify(item);
	}
	return m('div.webcraft_template', attributes || {}, content);
}