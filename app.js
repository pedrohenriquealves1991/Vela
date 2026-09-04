const modal = document.querySelector('#modal');
const pixModal = document.querySelector('#pixModal');
let selectedPrice = '9.90';
const open = () => modal.classList.remove('hidden');
const close = () => modal.classList.add('hidden');
document.querySelector('#startBtn').addEventListener('click', open);
document.querySelector('#closeBtn').addEventListener('click', close);
document.querySelector('#pixClose').addEventListener('click', () => pixModal.classList.add('hidden'));
document.querySelectorAll('.prices button').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.prices button').forEach((b) => b.classList.remove('selected'));
  button.classList.add('selected');
  selectedPrice = button.dataset.price;
}));
document.querySelector('#payBtn').addEventListener('click', () => {
  document.querySelector('#pixTitle').textContent = `Finalize o Pix de R$ ${selectedPrice.replace('.', ',')}`;
  const pixCode = document.querySelector('#pixCode');
  pixCode.textContent = pixCode.textContent.replace(/9\.90/g, selectedPrice);
  close();
  pixModal.classList.remove('hidden');
});
document.querySelector('#copyBtn').addEventListener('click', async () => {
  const code = document.querySelector('#pixCode');
  try {
    await navigator.clipboard.writeText(code.textContent);
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(code);
    selection.removeAllRanges();
    selection.addRange(range);
  }
  document.querySelector('#success').classList.remove('hidden');
  document.querySelector('#whatsBtn').classList.remove('hidden');
});
document.querySelector('#whatsBtn').addEventListener('click', () => {
  const name = document.querySelector('#name').value.trim() || 'alguém especial';
  const intention = document.querySelector('#intention').value.toLowerCase();
  const shareUrl = `${window.location.origin}${window.location.pathname}?nome=${encodeURIComponent(name)}&intencao=${encodeURIComponent(intention)}&video=${reelImages[0]?.classList.contains('second') ? '2' : '1'}`;
  const message = `Acendi uma vela por ${name}, com uma intenção de ${intention}. Que esta luz leve carinho e esperança. 🕯️\n\nVeja a mensagem: ${shareUrl}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});
window.addEventListener('click', (event) => { if (event.target === modal) close(); if (event.target === pixModal) pixModal.classList.add('hidden'); });

// Alterna a prévia de forma espontânea a cada visita, sem criar cadastros ou rastreamento.
const reelImages = document.querySelectorAll('.reel-img');
if (window.crypto?.getRandomValues) {
  const pick = new Uint32Array(1);
  window.crypto.getRandomValues(pick);
  if (pick[0] % 2 === 1) reelImages.forEach((image) => image.classList.toggle('second'));
}

