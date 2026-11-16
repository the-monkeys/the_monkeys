import type { ReadinessReport } from './types';

/** Describes the existing scored SEO checks; no new scoring or network work. */
export function ScoreExplanation({
  report,
}: {
  report: ReadinessReport | null;
}) {
  return (
    <div className='flex flex-col gap-3 text-sm leading-relaxed'>
      <p>
        Each automated SEO check that we can evaluate counts equally. We divide
        passed checks by all counted checks, multiply by 100 and round to a
        whole number.
      </p>
      <p className='font-medium'>
        Passed checks ÷ counted checks × 100, rounded to a whole number.
      </p>
      {report && report.applicableKnownCount > 0 && report.seoScore !== null ? (
        <p>
          This report: {report.passedCount} ÷ {report.applicableKnownCount} ×
          100 = {report.seoScore}/100 after rounding.
        </p>
      ) : (
        <p>
          If no checks can be counted, no estimate is shown. This is not a zero
          score.
        </p>
      )}
      <p>For example, 4 passed checks out of 6 gives 67/100 after rounding.</p>
      <ul className='flex list-disc flex-col gap-2 pl-5'>
        <li>
          Passed checks add points. Improve checks count but do not add points.
        </li>
        <li>Unknown, Human review and Not applicable items are excluded.</li>
        <li>
          Post checks cover title, description, topics, image references,
          heading order and link destinations when applicable. Events also have
          their own schedule and location checks.
        </li>
      </ul>
      <p>
        Answer readiness and Source clarity are separate observations. They do
        not change this number and may still need your review when the score is
        100.
      </p>
      <p>
        This checklist estimate does not predict search rankings, indexing,
        traffic, registrations or AI citations. It does not verify the accuracy
        of your content or whether a linked file loads.
      </p>
      <p>
        Review suggestions, return to your draft and check again after changes.
      </p>
    </div>
  );
}
