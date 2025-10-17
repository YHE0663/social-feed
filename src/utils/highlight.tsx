import type { ReactNode } from "react";

/**
 * 문자열을 쪼개서 JSX로 변환
 */
export function highlightText(input: string): ReactNode[] {
  if (!input) return [""];

  // 간단 url 패턴
  const urlRe = /\b((https?:\/\/|www\.)[^\s]+)\b/gi;
  //한글/영문/숫자/밑줄까지 허용
  const hashRe = /(^|\s)#([ㄱ-ㅎ가-힣\w]{1,30})/g;

  // 1) URL 링크로 치환 -> 텍스트/링크 조각 배열
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  input.replace(urlRe, (match, url, _scheme, offset) => {
    if (lastIndex < offset) {
      parts.push(input.slice(lastIndex, offset));
    }
    const href = url.startsWith("http") ? url : `https://${url}`;
    parts.push(
      <a
        key={`url-${offset}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {url}
      </a>
    );
    lastIndex = offset + url.length;
    return match;
  });
  if (lastIndex < input.length) parts.push(input.slice(lastIndex));

  // 2) URL로 나뉜 조각 중 문자열에 대해서만 해스태그 변환
  const withHashtags = parts.flatMap((part, i) => {
    if (typeof part !== "string") return [part];
    const nodes: ReactNode[] = [];
    let m: RegExpExecArray | null;
    let idx = 0;
    hashRe.lastIndex = 0;
    while ((m = hashRe.exec(part))) {
      const [full, space, tagText] = m;
      const start = m.index;
      if (idx < start) nodes.push(part.slice(idx, start));
      nodes.push(space);
      // 클릭 시 /?tag=... 로 이동하도록
      nodes.push(
        <a
          key={`hash-${i}-${start}`}
          href={`/?tag=${encodeURIComponent(tagText)}`}
          style={{ color: "#1d4ed8", fontWeight: 600, textDecoration: "none" }}
        >
          #{tagText}
        </a>
      );
      idx = start + full.length;
    }
    if (idx < part.length) nodes.push(part.slice(idx));
    return nodes;
  });

  return withHashtags;
}
