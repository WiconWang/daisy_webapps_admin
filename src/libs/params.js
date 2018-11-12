import params from '@/config/params'

export const getLevelCn = (level) => {
  return  level in params.levelList?params.levelList[level]:'未知';
}
