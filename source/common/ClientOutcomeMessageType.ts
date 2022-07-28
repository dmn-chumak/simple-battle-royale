import { AttackMessage } from "./client_messages/AttackMessage";
import { ChangeDirectionMessage } from "./client_messages/ChangeDirectionMessage";
import { CraftItemMessage } from "./client_messages/CraftItemMessage";

export type ClientOutcomeMessageType =
	ChangeDirectionMessage |
	AttackMessage |
	CraftItemMessage;
