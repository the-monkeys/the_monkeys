import { eventChecks, postChecks, visibilityCheck } from './rules';
import type {
  ReadinessCheck,
  ReadinessReport,
  ReadinessSnapshot,
} from './types';

export function scoreSeoChecks(
  checks: ReadinessCheck[]
): Pick<ReadinessReport, 'seoScore' | 'passedCount' | 'applicableKnownCount'> {
  const known = checks.filter(
    (check) =>
      check.section === 'seo' &&
      check.scored &&
      (check.status === 'pass' || check.status === 'improve')
  );
  const passedCount = known.filter((check) => check.status === 'pass').length;
  return {
    seoScore: known.length
      ? Math.round((100 * passedCount) / known.length)
      : null,
    passedCount,
    applicableKnownCount: known.length,
  };
}

export function analyseReadiness(snapshot: ReadinessSnapshot): ReadinessReport {
  const checks = [
    ...(snapshot.kind === 'post'
      ? postChecks(snapshot)
      : eventChecks(snapshot)),
    visibilityCheck(snapshot),
  ];
  const coverageReasons = [...snapshot.extraction.reasons];
  if (snapshot.visibility === 'unknown')
    coverageReasons.push('Public search visibility could not be established.');
  const unknown = checks.some((check) => check.status === 'unknown');
  if (unknown && !coverageReasons.length)
    coverageReasons.push('Some information could not be checked.');
  return {
    rulesVersion: 'creator-event-v1',
    kind: snapshot.kind,
    publicationState: snapshot.publicationState,
    resourceKey: snapshot.resourceKey,
    accountKey: snapshot.accountKey,
    revision: snapshot.revision,
    ...scoreSeoChecks(checks),
    coverage: snapshot.extraction.partial || unknown ? 'partial' : 'complete',
    visibility: snapshot.visibility,
    checks,
    preview: snapshot.extraction.partial
      ? null
      : snapshot.preview
        ? { ...snapshot.preview }
        : null,
    coverageReasons,
    ...(snapshot.schedule ? { schedule: { ...snapshot.schedule } } : {}),
  };
}
