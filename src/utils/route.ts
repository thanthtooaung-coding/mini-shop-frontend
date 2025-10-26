import router from '@/router'

export function getRoutePath(): string[] {
  const path = router.currentRoute.value.path
  return path.split('/').filter((segment) => segment.length > 0)
}
