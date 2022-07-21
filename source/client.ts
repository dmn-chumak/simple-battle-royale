import { Application } from "pixi.js";
import { LoaderScene } from "./client/LoaderScene";
import { SceneManager } from "./client/SceneManager";

window.onload = () =>
{
	const application = new Application({ width: 800, height: 500 });

	const manager = new SceneManager(application);
	manager.changeScene(new LoaderScene());

	document.body.appendChild(application.view);
};
