# Vela de Luz - prototipo inicial

Landing page estatica, mobile-first, para validar a experiencia antes de integrar pagamentos reais.

## Ja funciona

- direcao visual old money catolica, com vitrais, pedra, vinho e dourado envelhecido;
- duas imagens verticais realistas usadas como previas animadas;
- formulario de intencao e escolha de preco;
- modal de Pix com codigo ficticio e botao Copiar;
- responsividade para celular;
- aviso discreto de conteudo gerado por IA no rodape;
- configuracao basica para deploy na Vercel.

## Antes de publicar

- trocar o CNPJ e o codigo Pix ficticio;
- definir ONG, percentual/valor exato e politica de repasse;
- trocar o Pix manual por checkout/API com webhook de confirmacao;
- substituir as previas por videos finais, se desejar video fotorealista real;
- adicionar a pagina real de prestacao de contas;
- revisar textos com contador/advogado e politica de privacidade.

## Deploy

Importe esta pasta em um repositorio GitHub e, na Vercel, escolha esse repositorio como projeto. Nao ha build command nem framework obrigatorio: a raiz e servida como site estatico.

Abra `index.html` no navegador para testar.

