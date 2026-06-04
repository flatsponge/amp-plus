import type { PluginAPI } from '@ampcode/plugin'

const MODEL_AGENT_INSTRUCTIONS = `
You are a coding agent running inside Amp with the model explicitly selected by
the user. Inspect relevant code before editing, preserve unrelated user changes,
use tools proactively, make the smallest correct change, verify meaningful
changes, and report the outcome and verification concisely.
`


const MODEL_MODES = [
	{
		key: 'm-haiku45',
		label: 'Claude Haiku 4.5',
		model: 'anthropic/claude-haiku-4-5-20251001',
		color: '#d97757',
	},
	{
		key: 'm-opus46',
		label: 'Opus 4.6',
		model: 'anthropic/claude-opus-4-6',
		color: '#d97757',
	},
	{
		key: 'm-opus47',
		label: 'Opus 4.7',
		model: 'anthropic/claude-opus-4-7',
		color: '#d97757',
	},
	{
		key: 'm-sonnet45',
		label: 'Sonnet 4.5',
		model: 'anthropic/claude-sonnet-4-5-20250929',
		color: '#d97757',
	},
	{
		key: 'm-sonnet46',
		label: 'Sonnet 4.6',
		model: 'anthropic/claude-sonnet-4-6',
		color: '#d97757',
	},
	{ key: 'm-gpt5', label: 'GPT-5', model: 'openai/gpt-5', color: '#10a37f' },
	{
		key: 'm-gpt5mini',
		label: 'GPT-5 Mini',
		model: 'openai/gpt-5-mini',
		color: '#10a37f',
	},
	{
		key: 'm-gpt5nano',
		label: 'GPT-5 Nano',
		model: 'openai/gpt-5-nano',
		color: '#10a37f',
	},
	{ key: 'm-gpt51', label: 'GPT-5.1', model: 'openai/gpt-5.1', color: '#10a37f' },
	{ key: 'm-gpt52', label: 'GPT-5.2', model: 'openai/gpt-5.2', color: '#10a37f' },
	{
		key: 'm-gpt52codex',
		label: 'GPT-5.2 Codex',
		model: 'openai/gpt-5.2-codex',
		color: '#10a37f',
	},
	{
		key: 'm-gpt53codex',
		label: 'GPT-5.3 Codex',
		model: 'openai/gpt-5.3-codex',
		color: '#10a37f',
	},
	{ key: 'm-gpt54', label: 'GPT-5.4', model: 'openai/gpt-5.4', color: '#10a37f' },
	{ key: 'm-gpt55', label: 'GPT-5.5', model: 'openai/gpt-5.5', color: '#10a37f' },
	{ key: 'm-o3', label: 'o3', model: 'openai/o3', color: '#10a37f' },
	{
		key: 'm-gemini31pro',
		label: 'Gemini 3.1 Pro',
		model: 'vertexai/gemini-3.1-pro-preview',
		color: '#4285f4',
	},
	{
		key: 'm-gemini35flash',
		label: 'Gemini 3.5 Flash',
		model: 'vertexai/gemini-3.5-flash',
		color: '#4285f4',
	},
	{
		key: 'm-grokbuild01',
		label: 'Grok Build 0.1',
		model: 'xai/grok-build-0.1',
		color: '#111827',
	},
] as const

const PUBLIC_TOOL_NAMES = [
	'apply_patch',
	'Bash',
	'chart',
	'create_file',
	'edit_file',
	'find_thread',
	'finder',
	'librarian',
	'oracle',
	'painter',
	'Read',
	'read_mcp_resource',
	'read_thread',
	'read_web_page',
	'shell_command',
	'skill',
	'Task',
	'view_media',
	'web_search',
] as const

export default function (amp: PluginAPI) {
	if (!amp.experimental) {
		amp.logger.log('Experimental plugin API is not available.')
		return
	}

	for (const mode of MODEL_MODES) {
		const agent = amp.experimental.createAgent({
			name: mode.key,
			model: mode.model,
			instructions: MODEL_AGENT_INSTRUCTIONS,
			tools: PUBLIC_TOOL_NAMES,
			reasoningEffort: 'high',
		})

		amp.experimental.registerAgentMode({
			key: mode.key,
			label: mode.label,
			description: `Direct ${mode.model} model mode`,
			color: mode.color,
			agent: agent.definition,
		})
	}

	amp.logger.log(`Registered ${MODEL_MODES.length} direct model modes.`)
}
