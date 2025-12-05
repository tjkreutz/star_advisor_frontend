import {
  type FormEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

type ChatRole = 'user' | 'assistant'

interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  timestamp: string
}

interface ChatWindowProps {
  messages: ChatMessage[]
}

interface ChatComposerProps {
  onSend: (text: string) => void
  isThinking: boolean
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function createAssistantReply(userText: string): string {
  const lower = userText.toLowerCase()

  if (lower.includes('life')) {
    return "Based on what you've shared, life insurance can help protect your loved ones from financial shocks if something happens to you. I can walk you through how much cover might be appropriate and what affects the price."
  }

  if (lower.includes('home') || lower.includes('contents') || lower.includes('mortgage')) {
    return 'For home and contents cover, insurers usually look at the rebuild cost of your property, the value of your belongings and your security features. Together we can estimate sensible figures rather than guessing.'
  }

  if (lower.includes('car') || lower.includes('motor')) {
    return 'With car insurance, the main trade-off is between price and the level of protection if you need to claim. I can help you understand excesses, no-claims discounts and optional extras so you only pay for what you need.'
  }

  if (lower.includes('help') || lower.includes('where') || lower.includes('start')) {
    return "You're in the right place. Tell me what you're trying to protect – your income, your family, your home, or something else – and I’ll suggest the most relevant types of cover."
  }

  return "Got it. I'll ask a few simple questions and translate the jargon so you can see what cover actually does for you, not just the price. Share a bit more about your situation and what you’d like to protect."
}

function ChatWindow({ messages }: ChatWindowProps) {
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  return (
    <div
      className="sa-chat-window"
      role="log"
      aria-live="polite"
      aria-label="Star Advisor conversation"
    >
      {messages.map((message) => (
        <div
          key={message.id}
          className={`sa-message-row sa-message-row--${message.role}`}
        >
          <div
            className={`sa-message-bubble sa-message-bubble--${message.role}`}
          >
            <div className="sa-message-content">{message.content}</div>
            <div className="sa-message-meta">{message.timestamp}</div>
          </div>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  )
}

function ChatComposer({ onSend, isThinking }: ChatComposerProps) {
  const [draft, setDraft] = useState('')

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault()
      const text = draft.trim()
      if (!text) return
      onSend(text)
      setDraft('')
    },
    [draft, onSend],
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        const text = draft.trim()
        if (!text) return
        onSend(text)
        setDraft('')
      }
    },
    [draft, onSend],
  )

  return (
    <form className="sa-composer" onSubmit={handleSubmit}>
      <label className="sa-composer-label" htmlFor="sa-message-input">
        Ask Star Advisor about your insurance
      </label>
      <div className="sa-composer-row">
        <textarea
          id="sa-message-input"
          className="sa-composer-input"
          placeholder="For example: “Is this client eligible for RLP?”"
          rows={2}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="submit"
          className="sa-composer-send"
          disabled={!draft.trim() || isThinking}
        >
          {isThinking ? 'Thinking…' : 'Send'}
        </button>
      </div>
      <p className="sa-composer-hint">
        Press Enter to send, Shift + Enter for a new line.
      </p>
    </form>
  )
}

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const now = new Date()
    return [
      {
        id: 'welcome',
        role: 'assistant',
        content:
          "Welcome to Star Advisor. Use me as your digital paraplanner for protection and Relevant Life Policies (RLP). Share your client’s scenario and I’ll help you check eligibility, structure benefits, draft suitability wording and flag key compliance points. I can also suggest the information you should collect before quoting, and help you explain recommendations in clear, client-ready language.",
        timestamp: formatTime(now),
      },
    ]
  })

  const [isThinking, setIsThinking] = useState(false)

  const handleSend = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isThinking) return

      const now = new Date()
      const userMessage: ChatMessage = {
        id: `user-${now.getTime()}`,
        role: 'user',
        content: trimmed,
        timestamp: formatTime(now),
      }

      setMessages((current) => [...current, userMessage])
      setIsThinking(true)

      const assistantText = createAssistantReply(trimmed)

      window.setTimeout(() => {
        const replyTime = new Date()
        const assistantMessage: ChatMessage = {
          id: `assistant-${replyTime.getTime()}`,
          role: 'assistant',
          content: assistantText,
          timestamp: formatTime(replyTime),
        }

        setMessages((current) => [...current, assistantMessage])
        setIsThinking(false)
      }, 650)
    },
    [isThinking],
  )

  const suggestedPrompts = useMemo(
    () => [
      'Is this client eligible for RLP?',
      'Make a suitability report.',
      'Calculate a premium.',
    ],
    [],
  )

  return (
    <div className="sa-app">
      <main className="sa-shell" aria-labelledby="sa-title">
        <div className="sa-shell-top-bar" />

        <header className="sa-header">
          <div className="sa-header-text">
            <h1 id="sa-title" className="sa-title">
              <span className="sa-title-star" aria-hidden="true">
                ★
              </span>
              <span className="sa-title-text">Star Advisor</span>
            </h1>
            <p className="sa-subtitle">Your AI guide to clear, confident insurance decisions.</p>
          </div>
        </header>

        <nav className="sa-steps-rail" aria-label="Advice journey steps">
          <button
            type="button"
            className="sa-step sa-step--ai sa-step--active"
            aria-current="step"
          >
            <span className="sa-step-ai-icon" aria-hidden="true">
              ★
            </span>
            <span className="sa-step-ai-label">Advisor</span>
            <span className="sa-sr-only">Star Advisor AI chat</span>
          </button>

          <button
            type="button"
            className="sa-step sa-step--pill"
            aria-disabled="true"
          >
            <span className="sa-step-label">Compliance</span>
            <span className="sa-step-badge" aria-hidden="true" />
          </button>

          <button
            type="button"
            className="sa-step sa-step--pill"
            aria-disabled="true"
          >
            <span className="sa-step-label">Fact find</span>
            <span
              className="sa-step-badge sa-step-badge--active"
              aria-hidden="true"
            >
              2
            </span>
          </button>

          <button
            type="button"
            className="sa-step sa-step--pill"
            aria-disabled="true"
          >
            <span className="sa-step-label">Solution</span>
            <span className="sa-step-badge" aria-hidden="true" />
          </button>

          <button
            type="button"
            className="sa-step sa-step--pill"
            aria-disabled="true"
          >
            <span className="sa-step-label">Suitability</span>
            <span
              className="sa-step-badge sa-step-badge--active"
              aria-hidden="true"
            >
              1
            </span>
          </button>
        </nav>

        <section className="sa-body">
          <div className="sa-main-pane">
            <ChatWindow messages={messages} />

            <section className="sa-suggestions" aria-label="Example questions">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="sa-suggestion-pill"
                  onClick={() => handleSend(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </section>

            <ChatComposer onSend={handleSend} isThinking={isThinking} />
          </div>
        </section>

        <footer className="sa-footer">
          <p className="sa-footer-text">
            Star Advisor provides general guidance only and does not replace personalised financial
            advice.
          </p>
          <div className="sa-footer-links">
            <a href="#" className="sa-footer-link">
              Privacy notice
            </a>
            <span className="sa-footer-separator">•</span>
            <a href="#" className="sa-footer-link">
              Terms of use
            </a>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default App
