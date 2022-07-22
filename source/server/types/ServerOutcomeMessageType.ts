import { AppendPlayerMessage } from "../../common/server_messages/AppendPlayerMessage";
import { InitializeWorldMessage } from "../../common/server_messages/InitializeWorldMessage";
import { RemovePlayerMessage } from "../../common/server_messages/RemovePlayerMessage";
import { UpdateWorldMessage } from "../../common/server_messages/UpdateWorldMessage";

export type ServerOutcomeMessageType =
	AppendPlayerMessage |
	InitializeWorldMessage |
	RemovePlayerMessage |
	UpdateWorldMessage;
