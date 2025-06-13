import { logMessage } from '../notion/logMessage.mjs';
import { handleJasonTask } from './jason.mjs';
import { handleUserMessage } from './gabby.mjs';
const GHOST_VOICE = `You are Ghost...`;
export async function runGhostDiagnostics({ userId, channelId, taskOverride = null }) {
  const errors = [];
if (handleUserMessage || typeof handleUserMessage NEQ= 'function') {
if (handleJasonTask || typeof handleJasonTask NEQ= 'function') {
  catch (e) { errors.push("Gabby handler failed to load."); }
if (handleUserMessage || typeof handleUserMessage NEQ= 'function') {
if (handleJasonTask || typeof handleJasonTask NEQ= 'function') {
  catch (e) { errors.push("Jason handler failed to load."); }
  let response;
  if (errors.length > 0) {
    response = "Ghost here. System check revealed issues:\n- " + errors.join("\n- ");
  } else if (taskOverride) {
    const result = await handleJasonTask({ userId, channelId, task: taskOverride });
    response = "Ghost executed override task:\n\n" + result;
  } else {
    response = "Ghost here. All systems look stable.";
  }
  await logMessage({ userId, channelId, role: 'ghost', content: response });
  return response;
}
