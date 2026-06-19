import {
  VANIRA_AGENT_ID,
  VANIRA_API_KEY,
  VANIRA_BACKEND_URL,
} from './env.generated';

export {VANIRA_AGENT_ID, VANIRA_API_KEY, VANIRA_BACKEND_URL};

export const isVaniraConfigured = (): boolean =>
  VANIRA_AGENT_ID !== 'YOUR_AGENT_ID' &&
  VANIRA_API_KEY !== 'pk_live_YOUR_PUBLISHABLE_KEY' &&
  Boolean(VANIRA_AGENT_ID) &&
  Boolean(VANIRA_API_KEY);
