import m from 'mithril';
import classNames from 'classnames';

import { Component, ComponentAttributes } from '../common/Component';

import './box.style.css';
import { Toolbar } from '../toolbar/Toolbar';
import { FlexDirection, IdType, SizeType } from '../common/Types';
import { ValidEventTypes } from '../event-emitter/EventEmitter';
import { Button } from '../controls/button/Button';
import { Datagrid } from '..';
import { Tree } from '../tree/Tree';
import { Container, ContainerAttributes } from '../common/Container';
import { Control, ControlAttributes, ControlEventTypes } from '../controls/common/Control';
import { Text } from '../controls/text/Text';
import { Space } from '../controls/space/Space';

declare type GapStyle = 'none' | 'line' | 'small' | 'large';

export declare type BoxAttributes = {
	/**
	 * Name of CSS class or array of classes to apply to the box.
	 */
	classnames?: string | string[],
	/**
	 * Direction to order content into - "row" to organize them horizontally or "column" to organize them vertically
	 */

	direction?: FlexDirection;
	/**
	 * Text to display as header of the box
	 */	
	header?: string;
	/**
	 * Style of gap between content cells
	 */
	gap?: GapStyle;
	/**
	 * Sizes of the box like minimal, maximal and default width and height
	 */
	sizes?: SizeType;
	/**
	 * Specifies wheather there is available button on the header line, that allows user to expand/collapse box's content
	 */		
	collapsable?: boolean;
	/**
	 * Default value of box content visibility
	 */
	collapsed?: boolean;
	/**
	 * CSS flex value of the box
	 */
	flex?: number | string;
	/**
	 * Specifies wheather box is hidden as whole within its header. When true, no part of box could be rendered on the page.
	 */
	hidden?: boolean;
	/**
	 * Specifies wheather box content could wrap into multiple lines or not
	 */
	flexWrap?: boolean;
} & ContainerAttributes;

export declare type BoxExtendedContentType = {
	content?: Component<ComponentAttributes, ValidEventTypes> | Array<Component<ComponentAttributes, ValidEventTypes> | BoxExtendedContentType> | ContainerAttributes['content'];
} & Omit<BoxAttributes, 'content'>;

declare type BoxEventTypes = ValidEventTypes & {
	onCreate: (dom: HTMLElement) => void;
	onUpdate: (dom: HTMLElement) => void;
}

/**
 * The Box class represents a flexible container that uses the flexbox model in CSS.
 * It allows for the creation of a dynamic layout where each cell can have its own functionality,
 * including a title, collapsible/expandable behavior, and the ability to hide/show content.
 * Cells can contain plain text, html or other components like Box, Toolbar, Table etc.
 */
export class Box extends Container<BoxAttributes, BoxEventTypes> {
	private _parent?: Box;
	private header!: Toolbar;
	private _boxes: Box[];
	private _flex?: string | number;

	constructor(attrs?: BoxExtendedContentType, parent?: Box) {
		if (attrs && Array.isArray(attrs.content)) {
			const { content, ...rest } = attrs;
			super(rest);
			this._boxes = [];
			content.forEach(attributes => {
				this.add(attributes);
			});
		} else {
			super(attrs as ContainerAttributes);
			this._boxes = [];
		}
		this._parent = parent;
		this._createHeader();
		this._computeFlex();
	}

	/**
	 * Returns one of the nested cells by its id
	 * @param id id of the cell to get
	 * @returns Box container associated with passed id, or undefined if there is no nested box with requested id
	 */
	getContainer(id: IdType): Box | undefined {
		let container = this._boxes.find(x => x.getId() === id);
		if (container) {
			return container;
		}
		this._boxes.find(x => {
			container = x.getContainer(id);
			return container;
		});
		return container;
	}

	/**
	 * Returns array of all nested boxes on every level down until there is another box attached as content
	 */
	getAllContainers(): Box[] | undefined {
		const containers: Box[] = [];
		containers.push(...this._boxes);
		this._boxes.forEach(container => {
			containers.push(...container.getAllContainers() || []);
		});
		return containers;
	}

	/**
	 * Add new cell to the box
	 * @param attributes configuration of the new box, or component instance to add inside new box
	 * @returns Newly created box
	 */
	add(attributes: BoxExtendedContentType | Component<ComponentAttributes, ValidEventTypes>): Box {
		if (this.getContent() !== undefined) {
			throw new Error('Cannot add container because box contains component attached!');
		} else {
			let boxAttributes;
			let box;
			if (attributes instanceof Box) {
				this._boxes.push(attributes);
				box = attributes;
			} else {
				if (attributes instanceof Component) {
					boxAttributes = {
						content: attributes
					};
				} else {
					boxAttributes = attributes;
				}
				box = new Box(boxAttributes, this);
				this._boxes.push(box);
			}
			this._computeFlex();
			m.redraw();
			return box;
		}
	}

	/**
	 * Get information about children boxes direction
	 * @returns direction that box cells are organized into
	 */
	getDirection(): FlexDirection {
		return this.attrs.direction ?? 'column';
	}

	/**
	 * Change direction of the children boxes
	 * @param direction direction to organize children into
	 */
	setDirection(direction: FlexDirection): void {
		this.attrs.direction = direction;
		this._computeFlex();
		m.redraw();
	}

	/**
	 * Makes box visible/invisible on the page as whole (header and content)
	 * @param value true to hide the box
	 */
	setHidden(value: boolean): void {
		this.attrs.hidden = value;
		m.redraw();
	}

	/**
	 * Get text displays as the box header title
	 * @returns text of the box header
	 */
	getHeader(): string | undefined {
		return this.attrs.header;
	}

	/**
	 * Changes text displays as box header title
	 * @param header text to display as header title
	 */
	setHeader(header: string | undefined): void {
		this.attrs.header = header;
		this._computeFlex();
		m.redraw();
	}

	/**
	 * Get style of gaps between each container inside the box
	 * @returns name of gap style currently used
	 */
	getGap(): GapStyle {
		return this.attrs.gap || this._parent?.getGap() ||  'small';
	}

	/**
	 * Changes style of gap spaces between each container inside the box
	 * @param gap name of gap style to use
	 */
	setGap(gap?: GapStyle): void {
		this.attrs.gap = gap;
		m.redraw();
	}

	/**
	 * Hide box content. Remains only header line to display
	 */
	collapse(): void {
		this.attrs.collapsed = true;
		(this.header.getItem('toggle') as Button).setIcon(this._getCollapsingIcon());
		this._computeFlex();
		m.redraw();
	}

	/**
	 * Show box content.
	 */
	expand(): void {
		this.attrs.collapsed = false;
		(this.header.getItem('toggle') as Button).setIcon(this._getCollapsingIcon());
		this._computeFlex();
		m.redraw();
	}

	/**
	 * Hide/show box content.
	 */
	toggle(): void {
		if (this.isCollapsed()) {
			this.expand();
		} else {
			this.collapse();
		}
	}

	/**
	 * Get information that box content is visible or not
	 * @returns true when box content is visibled
	 */
	isCollapsed(): boolean {
		return Boolean(this.attrs.collapsed);
	}

	view(): m.Children | m.Vnode<unknown, unknown> {
		if (this.attrs.hidden) {
			return m.fragment({ key: this.getId() }, []);
		}

		return m('div', {
			key: this.getId(),
			className: classNames([
				'webcraft_box',
				`webcraft_box--${this._parent?.getGap() || this.getGap()}`,
				this.isCollapsed() ? 'webcraft_box--collapsed' : null,
				this._boxes.length === 0 ? 'webcraft_box--container' : null,
				this._getOverflowCss(),
				this.attrs.classnames,
				this._getBoxCss(),
				this.content instanceof Box || this._boxes.length ? null : 'webcraft_box--ui',
			]),
			style: {
				...this._getSizes(),
				flex: this._flex,
			},
			oncreate: (vnode: m.VnodeDOM) => {
				this.events.emit('onCreate', vnode.dom as HTMLElement);
			},
			onupdate: (vnode: m.VnodeDOM) => {
				this.events.emit('onUpdate', vnode.dom as HTMLElement);				
			},
		}, [
			this.header.getItems().length ? this.header.view() : null,
			!this.isCollapsed() && this._getView({ 
				className: classNames([
					'webcraft_box_content',
					`webcraft_flex--${this.getDirection()}`,
					this._getContentCss(),
				]),
				style: {
					flexWrap: this.attrs.flexWrap === false ? 'nowrap' : undefined,
				}
			}),
		]);
	}

	private _getBoxCss(): string[] {
		const css: string[] = [];

		if (this.header.getItems().length && this._boxes.length) {
			css.push('webcraft_box--space');
		}

		return css;
	}

	private _getContentCss(): string[] {
		const css: string[] = [];

		if (this.header.getItems().length && this._boxes.length) {
			css.push('webcraft_box--border-x');
			css.push('webcraft_box--border-bottom');
		}

		return css;
	}

	private _getOverflowCss(): string | undefined {
		const content = this.getContent();
		if (content instanceof Datagrid || content instanceof Tree) {
			return 'webcraft_overflow--hidden';
		}
	}

	private _computeFlex(): void {
		const getFlex = () => {
			if (this.isCollapsed()) {
				return '0 0 content';
			}
			if (this.attrs.flex) {
				return this.attrs.flex;
			}
			const contentStyle = this._getSizes();
			
			if (this.content instanceof Component && this.content.fitContainer) {
				return '0 0 content';
			}
			if (contentStyle.width) {
				return '0 0 content';
			}
			if (contentStyle.maxWidth) {
				return '1 1 content';
			}
			if (this._boxes.map(item => item.content).every(Boolean)) {
				return '1 0 content';
			}
			return '1 1 0%';
		};
		this._flex = getFlex();		
	}

	protected _getChildren(): m.Children {
		if (this._boxes.length > 0) {
			return this._boxes.map(item => item.view());
		}
		return super._getChildren();
	}

	private _createHeader(): void {
		const toolbarItems: Control<ControlAttributes, ControlEventTypes>[] = [];
		if (this.attrs.header) {
			toolbarItems.push(new Text({
				value: this.attrs.header,
				classNames: 'webcraft_header_title',
			}));
		}

		if (this.attrs.collapsable) {
			toolbarItems.push(new Space());
			toolbarItems.push(new Button({
				id: 'toggle',
				round: true,
				size: 'small',
				color: 'secondary',
				style: 'plain',
				icon: this._getCollapsingIcon(),
				events: {
					click: () => {
						this.toggle();
					}
				}
			}));
		}
		this.header = new Toolbar({
			classNames: 'webcraft_box_header',
			items: toolbarItems,
		});
	}

	private _getSizes(): Record<string, string |  number> {
		if (this.isCollapsed()) {
			return {};
		}
		const style: Record<string, string | number> = {
			...(this.attrs.sizes || {})
		};
		['width', 'height', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight'].forEach(type => {
			if (typeof style[type] === 'number') {
				style[type] += 'px';
			}
		});

		return style;
	}

	private _getCollapsingIcon(): string {
		return {
			'row': {
				'true': 'icon-right-open',
				'false': 'icon-left-open',
			},
			'column': {
				'true': 'icon-down-open',
				'false': 'icon-up-open',
			},
		}[this._parent?.getDirection() || 'column'][String(this.isCollapsed()) as 'true' | 'false'];
	}
}