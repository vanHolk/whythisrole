export type CueMode = 'bullets' | 'script'

export type GenerateRequest = {
  jobDescription: string
  companyBlurb: string
}

export type GenerateResponse = {
  bullets: string
  script: string
}

export type CueSelection = {
  mode: CueMode
  text: string
}

export type RecordedClip = {
  blob: Blob
  durationMs: number
  extension: string
  objectUrl: string
}
