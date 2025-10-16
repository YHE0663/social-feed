/**
 *
 * - elapsed: 현재 시각과의 차이 (밀리초)
 * - sec: 경과 초 (예: 3.9초 → 3초)
 * - min: 경과 분 (예: 119초 → 1분)
 * - hr: 경과 시간 (예: 179분 → 2시간)
 * - day: 경과 일수 (예: 47시간 → 1일)
 *
 * @param date
 * @returns 상대적 시간 문자열
 */
export const formatRelativeTime = (date: string) => {
  const elapsed = Date.now() - new Date(date).getTime();
  const sec = Math.floor(elapsed / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);

  if (sec < 5) return "방금 전";
  if (sec < 60) return `${sec}초 전`;
  if (min < 60) return `${min}분 전`;
  if (hr < 24) return `${hr}시간 전`;
  if (day < 7) return `${day}일 전`;
  return new Date(date).toLocaleDateString();
};
