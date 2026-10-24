// Apply the saved appearance before the styles load to avoid a light flash.
(() => {
  const key = 'analytical-engine-theme';
  const normalize = value => value === 'parchment' ? 'parchment' : 'midnight';
  const apply = value => {
    const theme = normalize(value);
    document.documentElement.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'midnight' ? '#070f21' : '#f4f1e9';
    const select = document.getElementById('theme-select');
    if (select) select.value = theme;
    return theme;
  };
  let saved = 'midnight';
  try { saved = localStorage.getItem(key); } catch { /* Storage may be unavailable. */ }
  apply(saved);
  document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('theme-select');
    select.value = document.documentElement.dataset.theme;
    select.addEventListener('change', () => {
      const theme = apply(select.value);
      try { localStorage.setItem(key, theme); } catch { /* Selection still works for this visit. */ }
    });
  });
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) apply(event.newValue);
  });
})();
