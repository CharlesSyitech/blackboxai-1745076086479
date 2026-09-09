export function ProcessFlow({ steps }: { steps: { key: string; label: string; hint?: string }[] }) {
  return (
    <ol className="grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-5">
      {steps.map((step, index) => (
        <li key={step.key} className="flex flex-col gap-2 bg-raised p-5">
          <span className="type-overline text-accent-ink">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="type-h4">{step.label}</span>
          {step.hint ? <span className="text-sm text-muted">{step.hint}</span> : null}
        </li>
      ))}
    </ol>
  )
}

export function StageFlow({
  stages,
}: {
  stages: { key: string; label: string; available: boolean }[]
}) {
  return (
    <ol className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-stretch">
      {stages.map((stage, index) => (
        <li key={stage.key} className="flex flex-1 items-stretch gap-3">
          <div
            className={
              "flex w-full flex-col gap-2 rounded-md border px-4 py-3.5 " +
              (stage.available ? "border-line-strong" : "border-dashed border-line")
            }
          >
            <span className="type-overline text-faint">{String(index + 1).padStart(2, "0")}</span>
            <span className={stage.available ? "text-[0.92rem] font-medium" : "text-[0.92rem] text-muted"}>
              {stage.label}
            </span>
          </div>
        </li>
      ))}
    </ol>
  )
}
