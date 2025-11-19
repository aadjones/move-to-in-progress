/**
 * Blocked Reasons Generator
 *
 * Generates satirical bureaucratic reasons why tasks are blocked
 */

import type { Task } from '../taskGraph/types';

/**
 * Generate absurd blocking reason based on task archetype
 */
export const getBlockedReason = (task: Task): string => {
  // Archetype-specific reasons for more variety
  const reasonsByArchetype: Record<string, string[]> = {
    training: [
      "The training video was recorded in 2015 and references a product we no longer sell.",
      "This course requires completion of Training Module XR-7, which was never created.",
      "The LMS system is undergoing maintenance scheduled to complete 'sometime in Q2'.",
      "Your training account was deactivated when you changed teams. Reactivation takes 2-3 weeks.",
    ],
    'approval-request': [
      "Your manager's manager's manager needs to sign off, but they're on a 6-month sabbatical.",
      "This requires VP approval. The VP position has been vacant since March.",
      "The approval workflow references a role that was eliminated in the last reorganization.",
      "Sarah from Finance needs to approve this, but Sarah left 8 months ago.",
    ],
    'form-submission': [
      "The form submission button has been disabled pending a security review.",
      "This form requires your employee ID from the old HR system we migrated from in 2019.",
      "The form must be reviewed by the Compliance Committee, which meets bi-annually.",
      "Required field 'Department Code' accepts values that no longer exist in the company.",
    ],
    documentation: [
      "The documentation is locked in Confluence. The space admin left the company.",
      "This links to the wiki page, which was deprecated and archived without replacement.",
      "The relevant documentation was deleted during a 'cleanup initiative' last year.",
      "These docs reference the old process. New process documentation is 'coming soon'.",
    ],
    'system-access': [
      "Access requests must be approved by the Security team, currently understaffed.",
      "The VPN certificate expired. IT says they'll get to it 'when resources allow'.",
      "This system uses SSO with a provider we stopped paying for 6 months ago.",
      "Your access was revoked when you changed roles. Re-provisioning takes 4-6 weeks.",
    ],
    meeting: [
      "The only available time slot conflicts with a company all-hands that hasn't been scheduled yet.",
      "All three required attendees are in different time zones and have no overlap.",
      "The conference room booking system has been down since the last server update.",
      "This meeting requires presence from a team that was dissolved in the reorganization.",
    ],
    attestation: [
      "You must attest that you've read the policy, but the policy link returns a 404.",
      "Attestation requires your digital signature, which expired in 2022.",
      "This attestation was already completed, but the system lost the record in a migration.",
      "The attestation form references compliance standards that were superseded.",
    ],
    compliance: [
      "This compliance check references regulations that were replaced 18 months ago.",
      "Required audit trail documents are stored in a system we no longer have access to.",
      "Compliance verification requires a certificate from a vendor we no longer use.",
      "The compliance officer who created this workflow left, and nobody knows what it does.",
    ],
  };

  // Generic reasons as fallback
  const genericReasons = [
    `This task requires sign-off from ${task.blockedBy.length} people who are all out this week.`,
    "The workflow is awaiting approval from a committee that meets quarterly. Next meeting: TBD.",
    "This depends on a system that's been 'sunset' but not yet replaced.",
    "The person responsible for this left the company. Their replacement starts next month.",
    "This task is blocked pending resolution of a ticket filed 3 years ago.",
    "Required credentials expired and the renewal process is 'being redesigned'.",
    "The project this relates to was cancelled, but the task wasn't removed from the workflow.",
    "This requires coordination with a partner team that was outsourced last quarter.",
  ];

  const archetype = task.archetype || 'unknown';
  const reasons = reasonsByArchetype[archetype] || genericReasons;

  return reasons[Math.floor(Math.random() * reasons.length)];
};
