export const convertTimestampToFormattedDate = (timestampSeconds) => {
  const d = new Date(timestampSeconds * 1000);
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
  return `${mo} ${da}, ${ye}`;
};


export const formatDate = (d) => {
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
  return `${mo} ${da}, ${ye}`;
};

export const formatJapaneseDate = (d) => {
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
  return ` ${ye}年 ${d.getMonth() + 1}月 ${da}`;
};