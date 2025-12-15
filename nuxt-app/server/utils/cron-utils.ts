export function timeToCron(time: string): string {
  const [hour, minute] = time.split(':')
  return `${minute} ${hour} * * *`
}

export function shouldRunCronNow(
  cronSchedule: string,
  lastPostedAt: Date | null | undefined,
  now: Date
): boolean {
  try {
    if (!lastPostedAt) {
      return isCronMatchingNow(cronSchedule, now)
    }

    const lastPosted = new Date(lastPostedAt)
    const timeDiff = now.getTime() - lastPosted.getTime()

    if (timeDiff < 60000) return false

    return isCronMatchingNow(cronSchedule, now)
  } catch {
    return false
  }
}

export function isCronMatchingNow(cronSchedule: string, now: Date): boolean {
  try {
    const parts = cronSchedule.trim().split(/\s+/)
    if (parts.length !== 5) return false

    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts

    const checks = [
      { part: minute, value: now.getMinutes(), min: 0, max: 59 },
      { part: hour, value: now.getHours(), min: 0, max: 23 },
      { part: dayOfMonth, value: now.getDate(), min: 1, max: 31 },
      { part: month, value: now.getMonth() + 1, min: 1, max: 12 },
      { part: dayOfWeek, value: now.getDay(), min: 0, max: 6 },
    ]

    return checks.every(({ part, value }) =>
      part === '*' ? true : matchesCronPart(part, value)
    )
  } catch {
    return false
  }
}

export function matchesCronPart(cronPart: string, currentValue: number): boolean {
  if (cronPart === '*') return true

  if (cronPart.includes('/')) {
    const [range, step] = cronPart.split('/')
    const stepNum = parseInt(step)
    if (range === '*') return currentValue % stepNum === 0
  }

  if (cronPart.includes('-')) {
    const [start, end] = cronPart.split('-').map(Number)
    return currentValue >= start && currentValue <= end
  }

  if (cronPart.includes(',')) {
    return cronPart.split(',').map(Number).includes(currentValue)
  }

  return parseInt(cronPart) === currentValue
}
