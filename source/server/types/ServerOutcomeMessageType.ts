import { ClientAddedMessage } from "../../common/commands/ClientAddedMessage";
import { ClientInitMessage } from "../../common/commands/ClientInitMessage";
import { ClientRemovedMessage } from "../../common/commands/ClientRemovedMessage";
import { WorldUpdatedMessage } from "../../common/commands/WorldUpdatedMessage";

export type ServerOutcomeMessageType = ClientAddedMessage | ClientInitMessage | ClientRemovedMessage | WorldUpdatedMessage;
