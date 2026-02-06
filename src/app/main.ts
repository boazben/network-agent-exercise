import '../style.css';
import { renderLayout } from '../ui/layout';
import { registerSW } from '../utils/sw-register';
import { initEventListeners } from '../app/events';

renderLayout(document.querySelector('#app')!);

registerSW();

initEventListeners();