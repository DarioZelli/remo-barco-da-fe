<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Pedido de Oração — REMO</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Lato:ital,wght@0,300;0,400;0,700;1,300&display=swap" rel="stylesheet"/>
  <style>
    :root {
      --vinho:#2C0F0F; --vinho-md:#3D1515; --vinho-lt:#5A2020;
      --ouro:#C9952A; --ouro-lt:#E8B84B; --ouro-pale:#F5D98B;
      --creme:#F5ECD7; --creme-lt:#FAF4E8;
    }
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{font-family:'Lato',sans-serif;background:var(--vinho);color:var(--creme);min-height:100vh}

    /* NAVBAR */
    nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0.9rem 3rem;background:rgba(44,15,15,0.95);backdrop-filter:blur(12px);border-bottom:1px solid rgba(201,149,42,0.2)}
    .nav-logo{display:flex;align-items:center;gap:0.75rem;text-decoration:none}
    .nav-logo img{height:40px;width:40px;object-fit:contain;border-radius:50%}
    .nav-logo-text{font-family:'Cinzel',serif;font-size:0.95rem;font-weight:700;color:var(--ouro-lt);line-height:1.2}
    .nav-logo-text span{display:block;font-size:0.58rem;font-weight:400;letter-spacing:0.2em;color:var(--ouro-pale);text-transform:uppercase}
    .nav-back{font-size:0.78rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--creme);text-decoration:none;display:flex;align-items:center;gap:0.4rem;opacity:0.7;transition:opacity 0.2s}
    .nav-back:hover{opacity:1;color:var(--ouro-lt)}

    /* HERO */
    .page-hero{padding:7rem 2rem 3rem;text-align:center;position:relative;overflow:hidden}
    .page-hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 80% at 50% 0%,rgba(90,32,32,0.5) 0%,transparent 70%)}
    .hero-img{width:100%;max-height:280px;object-fit:cover;position:absolute;inset:0;opacity:0.12;z-index:0}
    .page-hero-content{position:relative;z-index:1}
    .page-eyebrow{font-size:0.68rem;font-weight:700;letter-spacing:0.35em;text-transform:uppercase;color:var(--ouro);margin-bottom:0.8rem;display:block}
    .page-title{font-family:'Cinzel',serif;font-size:clamp(1.8rem,4vw,3.2rem);font-weight:900;color:var(--creme-lt);margin-bottom:1rem;line-height:1.1}
    .page-title em{font-style:normal;color:var(--ouro-lt)}
    .page-desc{font-size:1rem;font-weight:300;line-height:1.8;color:rgba(245,236,215,0.72);max-width:580px;margin:0 auto}
    .page-divider{width:60px;height:1px;background:linear-gradient(to right,transparent,var(--ouro),transparent);margin:1.5rem auto 0}

    /* FORMULÁRIO */
    .form-section{padding:3rem 2rem 5rem}
    .form-container{max-width:700px;margin:0 auto}
    .form-card{background:linear-gradient(135deg,rgba(61,21,21,0.9),rgba(44,15,15,0.95));border:1px solid rgba(201,149,42,0.2);border-radius:6px;padding:2.5rem;position:relative;overflow:hidden}
    .form-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(to right,transparent,var(--ouro),transparent)}

    .form-group{margin-bottom:1.4rem}
    .form-row{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;margin-bottom:1.4rem}
    label{display:block;font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--ouro);margin-bottom:0.5rem}
    input,textarea,select{
      width:100%;background:rgba(44,15,15,0.6);border:1px solid rgba(201,149,42,0.25);
      border-radius:3px;padding:0.75rem 1rem;
      font-family:'Lato',sans-serif;font-size:0.95rem;font-weight:300;color:var(--creme);
      transition:border-color 0.2s,box-shadow 0.2s;outline:none;
    }
    input::placeholder,textarea::placeholder{color:rgba(245,236,215,0.35)}
    input:focus,textarea:focus,select:focus{border-color:var(--ouro);box-shadow:0 0 0 3px rgba(201,149,42,0.1)}
    select option{background:#3D1515;color:var(--creme)}
    textarea{resize:vertical;min-height:110px}

    .form-group-checks{margin-bottom:1.4rem}
    .checks-label{font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--ouro);margin-bottom:0.8rem;display:block}
    .check-item{display:flex;align-items:center;gap:0.7rem;margin-bottom:0.6rem;cursor:pointer}
    .check-item input[type=checkbox]{width:18px;height:18px;flex-shrink:0;accent-color:var(--ouro);cursor:pointer}
    .check-item span{font-size:0.93rem;font-weight:300;color:rgba(245,236,215,0.8);line-height:1.4}

    .form-divider{height:1px;background:rgba(201,149,42,0.12);margin:1.8rem 0}

    .btn-submit{
      width:100%;background:var(--ouro);color:var(--vinho);
      font-family:'Lato',sans-serif;font-size:0.85rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;
      border:none;padding:1rem 2rem;border-radius:3px;cursor:pointer;
      box-shadow:0 4px 20px rgba(201,149,42,0.3);
      transition:background 0.2s,transform 0.2s,box-shadow 0.2s;
      display:flex;align-items:center;justify-content:center;gap:0.6rem;
    }
    .btn-submit:hover{background:var(--ouro-lt);transform:translateY(-1px);box-shadow:0 6px 28px rgba(201,149,42,0.45)}
    .btn-submit:disabled{opacity:0.6;cursor:not-allowed;transform:none}

    /* SUCESSO / ERRO */
    .msg{display:none;padding:1rem 1.4rem;border-radius:3px;font-size:0.92rem;font-weight:400;margin-top:1.2rem;text-align:center}
    .msg.sucesso{background:rgba(60,120,60,0.25);border:1px solid rgba(100,200,100,0.3);color:#a0e0a0}
    .msg.erro{background:rgba(120,40,40,0.25);border:1px solid rgba(200,80,80,0.3);color:#e0a0a0}

    /* RODAPÉ */
    .page-footer{text-align:center;padding:2rem;border-top:1px solid rgba(201,149,42,0.1);font-size:0.78rem;color:rgba(245,236,215,0.3)}
    .page-footer a{color:rgba(245,236,215,0.3);text-decoration:none}
    .page-footer a:hover{color:var(--ouro)}

    @media(max-width:600px){
      nav{padding:0.9rem 1.2rem}
      .form-row{grid-template-columns:1fr}
      .form-card{padding:1.5rem}
    }
  </style>
</head>
<body>

  <nav>
    <a href="index.html" class="nav-logo">
      <img src="logo-remo.png" alt="REMO"/>
      <div class="nav-logo-text">Remo<span>Rede Mundial de Orações</span></div>
    </a>
    <a href="index.html" class="nav-back">← Voltar</a>
  </nav>

  <section class="page-hero">
    <div class="page-hero-content">
      <span class="page-eyebrow">REMO — Rede Mundial de Orações</span>
      <h1 class="page-title">Peça sua <em>Oração</em></h1>
      <p class="page-desc">Envie seu pedido e nossa equipe de intercessores estará apresentando sua causa diante de Deus com fé, zelo e perseverança. Cremos no poder da oração e na resposta do Senhor.</p>
      <div class="page-divider"></div>
    </div>
  </section>

  <section class="form-section">
    <div class="form-container">
      <div class="form-card">
        <form id="formPedido" novalidate>

          <div class="form-row">
            <div class="form-group">
              <label for="nomeSolicitante">Nome do Solicitante *</label>
              <input type="text" id="nomeSolicitante" name="nomeSolicitante" placeholder="Seu nome completo" required/>
            </div>
            <div class="form-group">
              <label for="telefone">Telefone / WhatsApp *</label>
              <input type="tel" id="telefone" name="telefone" placeholder="(00) 00000-0000" required/>
            </div>
          </div>

          <div class="form-group">
            <label for="paraQuem">Para quem é a oração? *</label>
            <input type="text" id="paraQuem" name="paraQuem" placeholder="Nome da pessoa ou 'Para mim mesmo'" required/>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="tema">Tema *</label>
              <select id="tema" name="tema" required>
                <option value="">Selecione</option>
              </select>
            </div>
            <div class="form-group">
              <label for="causa">Causa específica *</label>
              <select id="causa" name="causa" required>
                <option value="">Selecione primeiro o tema</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="descricao">Descrição do Pedido *</label>
            <textarea id="descricao" name="descricao" placeholder="Descreva o pedido com detalhes que julgar necessários..." required></textarea>
          </div>

          <div class="form-divider"></div>

          <div class="form-group-checks">
            <span class="checks-label">Opções de Intercessão</span>
            <label class="check-item">
              <input type="checkbox" name="compartilhar" value="sim"/>
              <span>Compartilhar com intercessores (pedido visível na rede)</span>
            </label>
            <label class="check-item">
              <input type="checkbox" name="oracaoContinua" value="sim"/>
              <span>Solicitar oração contínua (acompanhamento prolongado)</span>
            </label>
            <label class="check-item">
              <input type="checkbox" name="campanhaColetiva" value="sim"/>
              <span>Incluir em campanha coletiva de oração</span>
            </label>
          </div>

          <div class="form-divider"></div>

          <div class="form-group-checks">
            <label class="check-item">
              <input type="checkbox" id="aceiteTermos" name="aceiteTermos" required/>
              <span>Autorizo o uso dos meus dados (nome, telefone) para contato e comunicações da REMO, exclusivamente para fins relacionados à intercessão.</span>
            </label>
          </div>

          <button type="submit" class="btn-submit" id="btnEnviar">
            🙏 Enviar Pedido de Oração
          </button>
          <div class="msg sucesso" id="msgSucesso">✅ Pedido recebido com sucesso! Nossa equipe já está orando por você.</div>
          <div class="msg erro" id="msgErro">❌ Erro ao enviar. Verifique os campos e tente novamente.</div>

        </form>
      </div>
    </div>
  </section>

  <footer class="page-footer">
    <p>© 2025 REMO — Rede Mundial de Orações &nbsp;·&nbsp; <a href="index.html">Página inicial</a> &nbsp;·&nbsp; contato@globalremo.com</p>
  </footer>

  <script>
    // ===== CARREGAR CSV E MONTAR TEMA / CAUSA =====
    async function carregarCausas() {
      const res = await fetch('/causas-csm.csv');
      const texto = await res.text();

      const linhas = texto.split('\n').slice(1);
      const mapa = {};

      linhas.forEach(linha => {
        const [tema, causa] = linha.split(',');
        if (!tema || !causa) return;

        if (!mapa[tema]) mapa[tema] = [];
        mapa[tema].push(causa);
      });

      const selectTema = document.getElementById('tema');
      const selectCausa = document.getElementById('causa');

      selectTema.innerHTML = '<option value="">Selecione</option>';

      Object.keys(mapa).forEach(tema => {
        const opt = document.createElement('option');
        opt.value = tema;
        opt.textContent = tema;
        selectTema.appendChild(opt);
      });

      selectTema.addEventListener('change', () => {
        const temaSelecionado = selectTema.value;

        selectCausa.innerHTML = '<option value="">Selecione</option>';

        if (mapa[temaSelecionado]) {
          mapa[temaSelecionado].forEach(causa => {
            const opt = document.createElement('option');
            opt.value = causa;
            opt.textContent = causa;
            selectCausa.appendChild(opt);
          });
        }
      });
    }

    carregarCausas();

    // ===== ENVIO DO FORMULÁRIO COM ERRO REAL =====
    document.getElementById('formPedido').addEventListener('submit', async function(e) {
      e.preventDefault();

      const btn = document.getElementById('btnEnviar');
      const msgOk = document.getElementById('msgSucesso');
      const msgErr = document.getElementById('msgErro');

      msgOk.style.display = 'none';
      msgErr.style.display = 'none';
      msgErr.textContent = '❌ Erro ao enviar. Verifique os campos e tente novamente.';

      if (!document.getElementById('aceiteTermos').checked) {
        msgErr.textContent = '❌ Você precisa autorizar o uso dos dados para continuar.';
        msgErr.style.display = 'block';
        return;
      }

      const dados = {
        nomeSolicitante: document.getElementById('nomeSolicitante').value,
        telefone: document.getElementById('telefone').value,
        paraQuem: document.getElementById('paraQuem').value,
        tema: document.getElementById('tema').value,
        causa: document.getElementById('causa').value,
        descricao: document.getElementById('descricao').value,
        compartilhar: document.querySelector('[name=compartilhar]').checked,
        oracaoContinua: document.querySelector('[name=oracaoContinua]').checked,
        campanhaColetiva: document.querySelector('[name=campanhaColetiva]').checked,
        dataEnvio: new Date().toISOString()
      };

      btn.disabled = true;
      btn.textContent = 'Enviando...';

      try {
        const res = await fetch('/.netlify/functions/salvar-pedido', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados)
        });

        let payload = {};
        try {
          payload = await res.json();
        } catch (_) {}

        if (!res.ok) {
          throw new Error(payload.detalhe || payload.erro || `Erro ${res.status}`);
        }

        msgOk.style.display = 'block';
        document.getElementById('formPedido').reset();
        document.getElementById('causa').innerHTML = '<option value="">Selecione primeiro o tema</option>';
        window.scrollTo({
          top: document.getElementById('formPedido').offsetTop,
          behavior: 'smooth'
        });

      } catch (err) {
        msgErr.textContent = `❌ ${err.message || 'Erro ao enviar. Verifique os campos e tente novamente.'}`;
        msgErr.style.display = 'block';
      } finally {
        btn.disabled = false;
        btn.innerHTML = '🙏 Enviar Pedido de Oração';
      }
    });
  </script>

</body>
</html>
