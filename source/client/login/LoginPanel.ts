export class LoginPanel
{
	protected _container: HTMLDivElement;
	protected _loginInput: HTMLInputElement;
	protected _passInput: HTMLInputElement;
	protected _loginBtn: HTMLButtonElement;

	protected _errorLabel: HTMLHeadingElement;

	protected _onLogin: Function;

	constructor(onLogin: Function)
	{
		this._onLogin = onLogin;
		this.init();
	}

	public show(): void
	{
		document.body.appendChild(this._container);
		this._container.style.top = window.innerHeight / 2 - (this._container.offsetHeight / 2) + "px";
		this._container.style.left = window.innerWidth / 2 - (this._container.offsetWidth / 2) + "px";
	}

	public hide(): void
	{
		document.body.removeChild(this._container);
	}

	public enable(value: boolean): void
	{
		this._loginInput.disabled = !value;
		this._passInput.disabled = !value;
		this._loginBtn.disabled = !value;
	}

	public loginError(text: string): void
	{
		if (!this._errorLabel)
		{
			this._errorLabel = document.createElement("h5");
			this._errorLabel.style.color = "#BB3030";
			this._container.appendChild(this._errorLabel);
		}
		this._errorLabel.innerText = text;
	}

	protected init(): void
	{
		this._container = document.createElement("div");
		this._container.style.position = "absolute";

		const loginLabel = document.createElement("h3");
		loginLabel.style.color = "#FFFFFF"
		loginLabel.innerText = "LOGIN:";

		this._loginInput = document.createElement("input") as HTMLInputElement;

		const passLabel = document.createElement("h3");
		passLabel.style.color = "#FFFFFF"
		passLabel.innerText = "PASSWORD:";

		this._passInput = document.createElement("input");
		this._passInput.setAttribute("type", "password");

		const buttonContainer = document.createElement("p");
		this._loginBtn = document.createElement("button") as HTMLButtonElement;
		this._loginBtn.innerText = "SIGN IN";
		this._loginBtn.onclick = this.onClick.bind(this);
		buttonContainer.appendChild(this._loginBtn);

		this._container.appendChild(loginLabel);
		this._container.appendChild(this._loginInput);
		this._container.appendChild(passLabel);
		this._container.appendChild(this._passInput);
		this._container.appendChild(buttonContainer);
	}

	protected onClick(): void
	{
		if (this._onLogin)
		{
			this._onLogin(this._loginInput.value, this._passInput.value);
		}
	}
}