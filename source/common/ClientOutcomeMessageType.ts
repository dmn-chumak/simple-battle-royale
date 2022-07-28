import { AttackMessage } from "./client_messages/AttackMessage";
import { CraftItemMessage } from "./client_messages/CraftItemMessage";
import { PlayerMovementMessage } from "./client_messages/PlayerMovementMessage";

export type ClientOutcomeMessageType =
	PlayerMovementMessage |
	AttackMessage |
	CraftItemMessage;
