import m from 'mithril';
import './Progress.style.css';
import { IdType } from '../common/Types';
import { generateId } from '../common/Tools';

export type ProgressAttrs = {
	active?: boolean;
};

export class Progress {
	private readonly _runnedIds = new Array<IdType>();
	private id = generateId();

	/**
	 * Gets information, that progress is active now or not
	 * @returns
	 */
	isActive(): boolean {
		return this._runnedIds.length > 0;
	}

	/**
	 * Turn progress on. It adds next request to run progress, and returns function to stop exactly that single request.
	 *
	 * @example
	 * ```javascript
	 * // run progress and get callback to turn off that single request of progress
	 * const off = progress.on();
	 *
	 * // make another request for progress
	 * const anotherOff = progress.on();
	 *
	 * // now to turn whole progress off, invoke progress.off() method
	 *
	 * // below code turns off only single request of progress, but second one is still active, so whole progress is active also:
	 * off();
	 *
	 * // now there is one active request for progress, and still we can make progress off by progress.off function
	 * // but invoking callback of second progress request will make, then any requests are present, so whole progress is off also
	 * anotherOff();
	 * ```
	 * @returns callback to stop progress
	 */
	on(): () => void {
		const id = generateId();
		this._runnedIds.push(id);
		m.redraw();
		return () => {
			this._offSingle(id);
		};
	}

	/**
	 * Stops all running progress requests
	 */
	off(): void {
		this._runnedIds.length = 0;
		m.redraw();
	}

	/**
	 * @hidden
	 */
	view(): m.Vnode<unknown, unknown> {
		return m('div', {
			key: this.id,
			className: 'webcraft_progress'}, m('div', {className: 'webcraft_progress_spinner'}, ''));
	}

	private _offSingle(id: IdType): void {
		const index = this._runnedIds.indexOf(id);
		if (index > -1) {
			this._runnedIds.splice(index, 1);
			m.redraw();
		}
	}
}
