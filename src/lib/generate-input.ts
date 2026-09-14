export const GENERATE_MIN_CHARS = 20
export const GENERATE_MAX_CHARS = 6000

export const GENERATE_TOO_SHORT =
  'Paste a bit more of the job description, at least a sentence or two.'

export function combinedGenerateLength(
  jobDescription: string,
  candidateSkills: string,
): number {
  return jobDescription.trim().length + candidateSkills.trim().length
}

export function generateTooLongMessage(combinedLength: number): string {
  return `That's too long (${combinedLength} / ${GENERATE_MAX_CHARS} characters). Shorten the job description or your skills notes.`
}

export function validateGenerateInput(
  jobDescription: string,
  candidateSkills: string,
): string | null {
  if (jobDescription.trim().length < GENERATE_MIN_CHARS) return GENERATE_TOO_SHORT
  const combined = combinedGenerateLength(jobDescription, candidateSkills)
  if (combined > GENERATE_MAX_CHARS) return generateTooLongMessage(combined)
  return null
}
