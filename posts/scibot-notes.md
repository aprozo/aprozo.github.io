A short brain-dump from working on **SciBot**, an AI assistant for long-term access to RHIC knowledge
([arXiv:2509.09688](https://arxiv.org/abs/2509.09688)). I'll skip the formal stuff — the paper has that —
and write down the practical things that surprised me.

## The hard part wasn't the model

We spend a lot of time thinking about which LLM to use. In practice the model was the easy choice:
take whichever frontier model is best this month, plug it in, swap when something better appears.
What actually matters:

- **Document quality.** Twenty years of conference notes, talk PDFs, and wiki pages are noisy.
  De-duplication, OCR cleanup, and section splitting take 80% of the effort.
- **Chunking strategy.** A single token-length-based chunking pass is a really bad default for
  physics docs. We use section-aware splits with title/heading context attached to every chunk.
- **Eval set.** Hundred-question gold set, hand-written by domain experts, replayed every change.
  Without this you're shipping vibes.

## A retrieval gotcha

Cosine similarity over embeddings gives you **topical** matches, not **answer-bearing** matches. The
question "what is the BBC trigger threshold in Run 14?" pulls in dozens of paragraphs *about* the BBC,
but the actual number lives in one specific table. We had to add a re-ranker and a structured-extraction
pass on top to keep the answers from being plausible-but-wrong.

## MCP makes it tractable

The Model Context Protocol (MCP) ended up being a much bigger deal than I expected. Instead of one
monolithic agent, SciBot is more like a small mesh: a retrieval service, a citation service, a
"physics-units sanity check" tool, all exposed as MCP servers. The orchestrator just calls them.

> The boring infrastructure win: anyone in the collaboration can write a new MCP tool in Python and
> plug it into the assistant without touching the model code.

## What's next

- Domain-aware reranker trained on our own click data.
- Citation grounding that points to **page/figure**, not just document.
- Better refusal: when the corpus genuinely doesn't know, say so.

If anyone is doing something similar in an experiment and wants to compare notes — please email me.
