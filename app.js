const modal = document.querySelector('#modal');
const pixModal = document.querySelector('#pixModal');
const open = () => modal.classList.remove('hidden');
const close = () => modal.classList.add('hidden');
document.querySelector('#startBtn').addEventListener('click', open);
document.querySelector('#closeBtn').addEventListener('click', close);
document.querySelector('#pixClose').addEventListener('click', () => pixModal.classList.add('hidden'));
document.querySelectorAll('.prices button').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.prices button').forEach((b) => b.classList.remove('selected'));
  button.classList.add('selected');
}));
document.querySelector('#payBtn').addEventListener('click', () => { close(); pixModal.classList.remove('hidden'); });
document.querySelector('#copyBtn').addEventListener('click', async () => {
  await navigator.clipboard.writeText(document.querySelector('#pixCode').textContent);
  document.querySelector('#success').classList.remove('hidden');
  document.querySelector('#whatsBtn').classList.remove('hidden');
});
document.querySelector('#whatsBtn').addEventListener('click', () => {
  const name = document.querySelector('#name').value.trim() || 'alguém especial';
  const intention = document.querySelector('#intention').value.toLowerCase();
  const message = `Acendi uma vela por ${name}, com uma intenção de ${intention}. Que esta luz leve carinho e esperança. 🕯️\n\nVeja a sua mensagem: ${window.location.href}`;
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

