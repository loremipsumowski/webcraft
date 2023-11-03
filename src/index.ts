import './assets/fontello/css/fontello.css';
import './style.css';
import { Box } from './box/Box';
import { Button } from './controls/button/Button';
import { Datagrid } from './datagrid/Datagrid';
import { Tabs } from './tabs/Tabs';
import { Toolbar } from './toolbar/Toolbar';
import { Tree } from './tree/Tree';
import { Tooltip } from './messages/Tooltip';
import { Toast, ToastMessageAttributes } from './messages/Toast';
import { Message } from './messages/Message';
import { Window } from './window/Window';
import { InputTime } from './editors/input/InputTime';
import { InputDate } from './editors/input/InputDate';
import { InputNumber } from './editors/input/InputNumber';
import { InputText } from './editors/input/InputText';
import { Form } from './form/Form';
import { Textarea } from './editors/textarea/Textarea';
import { MultiCombobox } from './editors/combobox/MultiCombobox';
import { Combobox } from './editors/combobox/Combobox';
import { Timepicker } from './timepicker/Timepicker';
import { Toggle } from './editors/toggle/Toggle';
import { RadioGroup } from './editors/radio-group/RadioGroup';
import { Space } from './controls/space/Space';

const tooltip = Tooltip.show;
const toastInstance = new Toast();
const toast = (config: ToastMessageAttributes) => toastInstance.show(config);

export { 
	Combobox,
	MultiCombobox,
	Box,
	Button,
	Datagrid,
	Form,
	InputTime,
	InputDate,
	InputText,
	InputNumber,
	Message,
	Tabs,
	Textarea,
	Toolbar,
	Tree,
	Timepicker,
	Window,
	Toggle,
	RadioGroup,
	Space,
	tooltip,
	toast,
};
