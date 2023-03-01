// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { ipcRenderer } from 'electron';

window.addEventListener('DOMContentLoaded', () => {

    const img = document.getElementById('img');
    const switchCat = number => img.src = `imgs/cat_0${number}.gif`;

    ipcRenderer.on('switch-cat', (event, args) => switchCat(args));
});