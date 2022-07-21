import { ChangeDirectionMessage } from "../../common/commands/ChangeDirectionMessage";
import { ChangePositionMessage } from "../../common/commands/ChangePositionMessage";

export type ClientOutcomeMessageType = ChangePositionMessage | ChangeDirectionMessage;
