import type { PluginAPI, ThreadID } from '@ampcode/plugin'

type Usage = {
	maxInputTokens: number
	totalInputTokens: number
}

type ThreadExport = {
	messages?: Array<{
		role?: string
		usage?: Partial<Usage>
	}>
}

function isUsage(value: Partial<Usage> | undefined): value is Usage {
	return (
		typeof value?.maxInputTokens === 'number' &&
		value.maxInputTokens > 0 &&
		typeof value.totalInputTokens === 'number' &&
		value.totalInputTokens >= 0
	)
}

function formatPercentage(usage: Usage) {
	const percentage = Math.min(100, Math.max(0, (usage.totalInputTokens / usage.maxInputTokens) * 100))
	return percentage < 10 ? percentage.toFixed(1) : String(Math.round(percentage))
}

export default function (amp: PluginAPI) {
	if (!amp.experimental) {
		amp.logger.log('Experimental plugin API is not available.')
		return
	}

	const experimental = amp.experimental
	let status: ReturnType<typeof experimental.createStatusItem> | undefined

	let latestUsage: Usage | undefined
	let refreshSequence = 0

	const updateStatus = (text: string) => {
		status ??= experimental.createStatusItem({
			text,
			url: 'command:show-context-details',
		})
		status.update({ text, url: 'command:show-context-details' })
	}

	const readUsage = async (threadID: ThreadID) => {
		const result = await amp.$`amp threads export ${threadID}`
		if (result.exitCode !== 0) {
			throw new Error(result.stderr.trim() || `amp threads export exited with ${result.exitCode}`)
		}

		const exported = JSON.parse(result.stdout) as ThreadExport
		const messages = exported.messages ?? []

		for (let index = messages.length - 1; index >= 0; index -= 1) {
			const message = messages[index]
			if (message?.role === 'assistant' && isUsage(message.usage)) {
				return message.usage
			}
		}

		return undefined
	}

	const refresh = async (threadID = amp.experimental?.activeThread.current?.id) => {
		const sequence = ++refreshSequence

		if (!threadID) {
			latestUsage = undefined
			status?.update({ text: 'ctx --', url: 'command:show-context-details' })
			return
		}

		try {
			const usage = await readUsage(threadID)
			if (
				sequence !== refreshSequence ||
				amp.experimental?.activeThread.current?.id !== threadID
			) {
				return
			}

			latestUsage = usage
			updateStatus(usage ? `ctx ${formatPercentage(usage)}%` : 'ctx 0%')
		} catch (error) {
			if (sequence !== refreshSequence) {
				return
			}

			latestUsage = undefined
			updateStatus('ctx ?')
			amp.logger.log('Failed to refresh context usage.', error)
		}
	}

	amp.experimental.activeThread.subscribe((thread) => {
		void refresh(thread?.id)
	})

	amp.on('session.start', (event) => {
		void refresh(event.thread.id)
	})

	amp.on('agent.end', (event) => {
		void refresh(event.thread.id)
	})

	amp.registerCommand(
		'refresh-context-percentage',
		{
			title: 'Refresh context percentage',
			category: 'context',
			description: 'Refresh the active thread context percentage.',
		},
		async (ctx) => {
			await refresh(ctx.thread?.id)
		},
	)

	amp.registerCommand(
		'show-context-details',
		{
			title: 'Show context details',
			category: 'context',
			description: 'Show exact active thread input-token usage.',
		},
		async (ctx) => {
			await refresh(ctx.thread?.id)

			if (!ctx.thread) {
				await ctx.ui.notify('No active thread.')
				return
			}

			if (!latestUsage) {
				await ctx.ui.notify('No context usage is available yet. Send a message first.')
				return
			}

			await ctx.ui.notify(
				[
					`Context: ${formatPercentage(latestUsage)}%`,
					`Input: ${latestUsage.totalInputTokens.toLocaleString()} tokens`,
					`Maximum: ${latestUsage.maxInputTokens.toLocaleString()} tokens`,
				].join('\n'),
			)
		},
	)

}
