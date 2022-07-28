import { AttackMessage } from "../../common/client_messages/AttackMessage";
import { ChangeDirectionMessage } from "../../common/client_messages/ChangeDirectionMessage";

export type ClientOutcomeMessageType =
	ChangeDirectionMessage |
	AttackMessage;
