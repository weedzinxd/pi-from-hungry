export interface ParsedContractEvent {
  id: string;
  ledger: number;
  txHash: string;
  topicLabel: string;
  rawTopic: string;
  successful: boolean;
  closedAt?: string;
}

function tryDecodeBase64(value: string): string | null {
  try {
    const decoded = Buffer.from(value, 'base64').toString('utf8').replace(/\x00/g, '').trim();
    return decoded || null;
  } catch {
    return null;
  }
}

export function parseContractEvent(event: Record<string, unknown>): ParsedContractEvent {
  const rawTopic = Array.isArray(event.topic) && event.topic.length > 0 ? String(event.topic[0]) : 'unknown';
  const decoded = tryDecodeBase64(rawTopic);
  const topicLabel = decoded && /[a-zA-Z_]/.test(decoded) ? decoded : rawTopic;

  return {
    id: String(event.id ?? ''),
    ledger: Number(event.ledger ?? 0),
    txHash: String(event.txHash ?? 'tx n/a'),
    topicLabel,
    rawTopic,
    successful: Boolean(event.inSuccessfulContractCall ?? false),
    closedAt: event.ledgerClosedAt ? String(event.ledgerClosedAt) : undefined,
  };
}
