const modal = document.querySelector('#modal');
const pixModal = document.querySelector('#pixModal');
let selectedPrice = '9.90';

const open = () => modal.classList.remove('hidden');
const close = () => modal.classList.add('hidden');
document.querySelector('#startBtn').addEventListener('click', open);
document.querySelector('#closeBtn').addEventListener('click', close);
document.querySelector('#pixClose').addEventListener('click', () => pixModal.classList.add('hidden'));

document.querySelectorAll('.prices button').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.prices button').forEach((item) => item.classList.remove('selected'));
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

const video = document.querySelector('#introVideo');
const videoNumber = Math.random() > 0.5 ? '2' : '1';
if (video && videoNumber === '2') {
  video.innerHTML = '<source src="videos/beata.mp4" type="video/mp4" />';
  video.load();
  video.play().catch(() => {});
}

document.querySelector('#whatsBtn').addEventListener('click', () => {
  const name = document.querySelector('#name').value.trim() || 'alguÃ©m especial';
  const intention = document.querySelector('#intention').value.toLowerCase();
  const shareUrl = `${window.location.origin}${window.location.pathname}?nome=${encodeURIComponent(name)}&intencao=${encodeURIComponent(intention)}&video=${videoNumber}`;
  const message = `Acendi uma vela por ${name}, com uma intenÃ§Ã£o de ${intention}. Que esta luz leve carinho e esperanÃ§a. ðŸ•¯ï¸\n\nVeja a mensagem: ${shareUrl}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});

window.addEventListener('click', (event) => {
  if (event.target === modal) close();
  if (event.target === pixModal) pixModal.classList.add('hidden');
});

const shared = new URLSearchParams(window.location.search);
const sharedName = shared.get('nome');
const sharedIntention = shared.get('intencao');
if (sharedName || sharedIntention) {
  document.querySelector('#sharedCard').classList.remove('hidden');
  document.querySelector('#sharedText').textContent = `${sharedName || 'AlguÃ©m especial'} recebeu uma vela por ${sharedIntention || 'uma intenÃ§Ã£o de carinho'}.`;
  if (shared.get('video') === '2' && video) {
    video.innerHTML = '<source src="videos/beata.mp4" type="video/mp4" />';
    video.load();
    video.play().catch(() => {});
  }
}

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) observer.unobserve(entry.target);
  entry.target.classList.toggle('is-visible', entry.isIntersecting);
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

