const modal = document.querySelector('#modal');
const pixModal = document.querySelector('#pixModal');
const video = document.querySelector('#introVideo');
let selectedPrice = '9.90';
let videoNumber = Math.random() > 0.5 ? '2' : '1';

const open = () => modal.classList.remove('hidden');
const close = () => modal.classList.add('hidden');
const loadVideo = (number) => {
  videoNumber = number;
  if (!video) return;
  video.innerHTML = `<source src="videos/${number === '2' ? 'beata' : 'freira'}.mp4" type="video/mp4" />`;
  video.load();
  video.play().catch(() => {});
};

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
  document.querySelector('#pixCode').textContent = document.querySelector('#pixCode').textContent.replace(/9\.90/g, selectedPrice);
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

const drawCover = (context, source, width, height) => {
  const scale = Math.max(width / source.videoWidth, height / source.videoHeight);
  const cropWidth = width / scale;
  const cropHeight = height / scale;
  const x = (source.videoWidth - cropWidth) / 2;
  const y = (source.videoHeight - cropHeight) / 2;
  context.drawImage(source, x, y, cropWidth, cropHeight, 0, 0, width, height);
};

const wrapText = (context, text, maxWidth) => {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = candidate;
  });
  if (line) lines.push(line);
  return lines;
};

const createPersonalizedVideo = async (name, intention) => {
  if (!video || !video.videoWidth || !window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) return null;
  const canvas = document.createElement('canvas');
  canvas.width = 540;
  canvas.height = 960;
  const context = canvas.getContext('2d');
  const stream = canvas.captureStream(30);
  const mimeType = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find((type) => MediaRecorder.isTypeSupported(type));
  if (!mimeType) return null;
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 3500000 });
  const chunks = [];
  recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
  const finished = new Promise((resolve) => { recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType })); });
  video.currentTime = 0;
  await video.play();
  recorder.start();
  const started = performance.now();
  const duration = 6500;
  const draw = (now) => {
    const elapsed = now - started;
    drawCover(context, video, canvas.width, canvas.height);
    const fade = Math.min(1, Math.max(0, (duration - elapsed) / 650));
    context.fillStyle = `rgba(15, 10, 14, ${0.25 + (1 - fade) * 0.5})`;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.textAlign = 'center';
    context.fillStyle = `rgba(239, 212, 154, ${fade})`;
    context.font = '600 25px Georgia';
    context.fillText('UMA VELA POR VOCÃŠ', canvas.width / 2, 95);
    context.fillStyle = `rgba(255, 248, 231, ${fade})`;
    context.font = '500 33px Georgia';
    const lines = wrapText(context, name, 420);
    lines.slice(0, 2).forEach((line, index) => context.fillText(line, canvas.width / 2, 780 + index * 42));
    context.fillStyle = `rgba(239, 212, 154, ${fade})`;
    context.font = '22px Georgia';
    context.fillText(`por ${intention}`, canvas.width / 2, 875);
    if (elapsed < duration) requestAnimationFrame(draw);
    else recorder.stop();
  };
  requestAnimationFrame(draw);
  return finished;
};

document.querySelector('#whatsBtn').addEventListener('click', async () => {
  const name = document.querySelector('#name').value.trim() || 'alguÃ©m especial';
  const intention = document.querySelector('#intention').value.toLowerCase();
  const button = document.querySelector('#whatsBtn');
  button.disabled = true;
  button.innerHTML = 'Preparando seu vÃ­deoâ€¦';
  try {
    const fileBlob = await createPersonalizedVideo(name, intention);
    const shareText = `Acendi uma vela por ${name}. Que esta luz leve carinho e esperanÃ§a. ðŸ•¯ï¸\n\n${window.location.origin}/`;
    if (fileBlob) {
      const file = new File([fileBlob], 'vela-de-luz.webm', { type: fileBlob.type });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: shareText, title: 'Vela de Luz' });
        return;
      }
      const download = document.createElement('a');
      download.href = URL.createObjectURL(fileBlob);
      download.download = file.name;
      download.click();
      setTimeout(() => URL.revokeObjectURL(download.href), 1000);
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener');
  } catch (error) {
    if (error.name !== 'AbortError') window.open(`https://wa.me/?text=${encodeURIComponent(`Acendi uma vela por ${name}. ðŸ•¯ï¸ ${window.location.origin}/`)}`, '_blank', 'noopener');
  } finally {
    button.disabled = false;
    button.innerHTML = 'Gerar vÃ­deo e compartilhar <span>â†’</span>';
  }
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
}
loadVideo(shared.get('video') === '2' ? '2' : videoNumber);

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) observer.unobserve(entry.target);
  entry.target.classList.toggle('is-visible', entry.isIntersecting);
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

