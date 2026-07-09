export function formatViews(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M views";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K views";
  return n + " views";
}

export function formatDate(dateStr) {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);

  if (days < 1) return "Today";
  if (days < 7) return days + " day" + (days > 1 ? "s" : "") + " ago";
  if (days < 30) return Math.floor(days / 7) + " week" + (Math.floor(days / 7) > 1 ? "s" : "") + " ago";
  if (days < 365) return Math.floor(days / 30) + " month" + (Math.floor(days / 30) > 1 ? "s" : "") + " ago";
  return Math.floor(days / 365) + " year" + (Math.floor(days / 365) > 1 ? "s" : "") + " ago";
}