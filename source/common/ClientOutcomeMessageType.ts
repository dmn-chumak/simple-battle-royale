import { AttackClientMessage } from "./client_messages/AttackClientMessage";
import { CraftItemMessage } from "./client_messages/CraftItemMessage";
import { PlayerMovementMessage } from "./client_messages/PlayerMovementMessage";

export type ClientOutcomeMessageType =
	PlayerMovementMessage |
	AttackClientMessage |
	CraftItemMessage;
