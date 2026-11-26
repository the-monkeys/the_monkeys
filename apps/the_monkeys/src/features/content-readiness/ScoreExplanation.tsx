import type { ReadinessReport } from './types';

/** Explains checklist evidence without presenting an overall SEO score. */
export function ScoreExplanation({
  report,
}: {
  report: ReadinessReport | null;
}) {
  return (
    <div className='flex flex-col gap-3 text-sm leading-relaxed'>
      <p>
        The counted checks are automated checks we could evaluate. Each counts
        equally: Passed means the supplied information met the listed rule;
        Improve means something needs your attention. These are publishing
        basics, not an overall SEO rating.
      </p>
      {report && report.applicableKnownCount > 0 ? (
        <p>
          This report: {report.passedCount} of {report.applicableKnownCount}{' '}
          automated checks passed.
        </p>
      ) : (
        <p>
          If no checks can be counted, no result is shown. This is not a zero
          score.
        </p>
      )}
      <p>For example, 4 of 6 means four passed and two are marked Improve.</p>
      {report?.kind === 'post' && (
        <p>
          Homepage placement checks are unscored. Their 250 readable body-word
          minimum applies only to homepage articles; saving and publishing
          remain available below it.
        </p>
      )}
      <ul className='flex list-disc flex-col gap-2 pl-5'>
        <li>
          Unknown, Human review and Not applicable items are excluded from the
          counted total.
        </li>
        <li>
          Article checks inspect non-placeholder titles and descriptions, topic
          labels, heading order and image/link URL structure. A description
          should add information beyond the title.
        </li>
        <li>
          Event checks also inspect the schedule and timezone, a readable
          in-person venue, cover reference and description links. Past events
          and optional images are not penalised for being past or absent.
        </li>
      </ul>
      <p>
        Reader clarity and Source clarity are separate observations. They may
        still need human review when all counted checks pass. Captions do not
        establish that rendered image alt text is correct.
      </p>
      <p>
        Link and image checks inspect structure only; no destinations are
        opened. Published-page accessibility, crawlability, indexing, factual
        accuracy, keyword relevance and real search performance have not been
        verified by this local draft review.
      </p>
      <p>
        The checklist does not predict search rankings, traffic, registrations
        or AI citations. There is no required word count, keyword density or
        FAQ. Review suggestions, return to your draft and check again after
        changes.
      </p>
    </div>
  );
}
