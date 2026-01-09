// Pré-carregamento
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.style.opacity = '0';
    setTimeout(() => preloader.style.display = 'none', 500);
  }, 800);
});

// AOS
AOS.init({
  duration: 800,
  once: true
});

// Menu mobile
function toggleMenu() {
  const nav = document.querySelector('.nav-menu');
  nav.classList.toggle('active');
}

// Modal de agendamento
function openAgendamentoModal() {
  document.getElementById('agendamento-modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeAgendamentoModal() {
  document.getElementById('agendamento-modal').style.display = 'none';
  document.body.style.overflow = 'auto';
  document.getElementById('confirmacao').style.display = 'none';
}
window.onclick = function(event) {
  const modal = document.getElementById('agendamento-modal');
  if (event.target === modal) closeAgendamentoModal();
};

// Formatação automática de telefone (opcional)
document.getElementById('telefone').addEventListener('input', function(e) {
  let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,3})/);
  e.target.value = !x[2] ? x[1] : x[1] + ' ' + x[2] + (x[3] ? ' ' + x[3] : '');
});

// Validação e envio via WhatsApp
document.getElementById('form-agendamento').addEventListener('submit', function(e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const telefone = document.getElementById('telefone').value.replace(/\D/g, '');
  const email = document.getElementById('email').value.trim();
  const especialidade = document.getElementById('especialidade').value;
  const data = document.getElementById('data').value;
  const hora = document.getElementById('hora').value;
  const mensagem = document.getElementById('mensagem').value.trim();

  // Validação simples
  if (!nome || !telefone || !especialidade || !data || !hora) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  // Formatar data para exibição
  const dataFormatada = new Date(data).toLocaleDateString('pt-AO');

  // Mensagem para WhatsApp
  const agora = new Date();
const dataHoraAgendamento = agora.toLocaleString('pt-AO', {
  dateStyle: 'full',
  timeStyle: 'short'
});

const msg = 
`🏥 *NOVO AGENDAMENTO DE CONSULTA*

👤 *Paciente:* ${nome}
📞 *Telefone:* +244 ${telefone}
📧 *E-mail:* ${email || 'Não informado'}

🩺 *Especialidade:* ${especialidade}
📅 *Data desejada:* ${dataFormatada}
⏰ *Horário desejado:* ${hora}

📝 *Observações:*
${mensagem || 'Nenhuma observação informada.'}

━━━━━━━━━━━━━━━━━━
✅ *Status:* Agendamento solicitado
🕒 *Agendado aos:* ${dataHoraAgendamento}
━━━━━━━━━━━━━━━━━━

🙏 Aguardando confirmação da clínica.`;

const whatsappUrl = `https://wa.me/244959622160?text=${encodeURIComponent(msg)}`;
  // Exibir confirmação
  const confirmDiv = document.getElementById('confirmacao');
  confirmDiv.innerHTML = '✅ Agendamento enviado! Você será redirecionado para o WhatsApp em 2 segundos.';
  confirmDiv.style.display = 'block';

  // Redirecionar após 2s
  setTimeout(() => {
    window.open(whatsappUrl, '_blank');
    closeAgendamentoModal();
    document.getElementById('form-agendamento').reset();
  }, 2000);
});

// Carrossel de depoimentos
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
}
function moveSlide(direction) {
  currentSlide += direction;
  if (currentSlide >= slides.length) currentSlide = 0;
  if (currentSlide < 0) currentSlide = slides.length - 1;
  showSlide(currentSlide);
}

// Cookies GDPR
function acceptCookies() {
  document.getElementById('cookie-banner').style.display = 'none';
  localStorage.setItem('cookiesAccepted', 'true');
}
if (!localStorage.getItem('cookiesAccepted')) {
  document.getElementById('cookie-banner').style.display = 'block';
}
  // Cores por especialidade
const coresEspecialidades = {
  "Cardiologia": "#e53935",     // vermelho suave
  "Pediatria": "#43a047",       // verde menta
  "Neurologia": "#7e57c2",      // roxo
  "Clínica Geral": "#1a56a8"    // azul padrão
};

// Aplica cor ao selecionar especialidade
document.getElementById('especialidade').addEventListener('change', function() {
  const especialidade = this.value;
  const btn = document.querySelector('.btn-primary');
  if (especialidade && coresEspecialidades[especialidade]) {
    btn.style.backgroundColor = coresEspecialidades[especialidade];
    btn.classList.add('btn-dinamico');
  } else {
    btn.style.backgroundColor = '#1a56a8';
  }
});
// Animação dos contadores
function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  const duration = 2000; // 2 segundos

  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const increment = target / (duration / 16); // 60fps approx
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.innerText = Math.ceil(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.innerText = target.toLocaleString('pt-AO');
      }
    };

    // Inicia apenas quando visível
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        updateCounter();
        observer.disconnect();
      }
    }, { threshold: 0.5 });

    observer.observe(counter);
  });
}
// Chama após carregar tudo
window.addEventListener('load', animateCounters);
// Fechar menu mobile ao clicar em um link
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.nav-menu').classList.remove('active');
  });
});
let tempoInatividade;
const TEMPO_MAX = 2 * 60 * 1000; // 2 minutos

function resetarTempo() {
  clearTimeout(tempoInatividade);
  tempoInatividade = setTimeout(() => {
    location.reload();
  }, TEMPO_MAX);
}

// Eventos que contam como atividade
['mousemove', 'mousedown', 'touchstart', 'click', 'scroll', 'keypress'].forEach(event => {
  window.addEventListener(event, resetarTempo, true);
});

// Inicia o contador ao carregar
resetarTempo();
window.addEventListener('pageshow', function (event) {
  if (event.persisted) {
    window.location.reload();
  }
});