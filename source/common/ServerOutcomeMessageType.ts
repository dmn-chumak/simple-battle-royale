import { AddItemsMessage } from "./server_messages/AddItemsMessage";
import { AppendPlayerMessage } from "./server_messages/AppendPlayerMessage";
import { InitializeWorldMessage } from "./server_messages/InitializeWorldMessage";
import { PlayerActionMessage } from "./server_messages/PlayerActionMessage";
import { RemovePlayerMessage } from "./server_messages/RemovePlayerMessage";
import { UpdateWorldMessage } from "./server_messages/UpdateWorldMessage";

export type ServerOutcomeMessageType =
	AppendPlayerMessage |
	InitializeWorldMessage |
	RemovePlayerMessage |
	UpdateWorldMessage |
	AddItemsMessage |
	PlayerActionMessage;
