# Chá de Casa Nova - Katariny & Ryanne

Site de registro de presentes para o Chá de Casa Nova de Katariny e Ryanne.

## Funcionalidades

- **Confirmação de Presença (RSVP)**: Os convidados podem confirmar presença ou ausência no evento
- **Lista de Presentes**: Exibição de presentes com imagens e preços
- **Pagamento via PIX**: Geração de QR Code para pagamento direto
- **Painel Administrativo**: Visualização de confirmações e presentes adquiridos

## Tecnologias

- **Next.js 16** com React 19
- **Tailwind CSS** para estilização
- **Supabase** para banco de dados e autenticação
- **QRCode** para geração de códigos PIX

## Estrutura do Banco de Dados

### Tabela: gifts
- `id`: UUID (chave primária)
- `name`: Nome do presente
- `price`: Preço
- `image_url`: URL da imagem
- `purchased_by`: Nome de quem presenteou
- `purchased_at`: Data da compra

### Tabela: rsvps
- `id`: UUID (chave primária)
- `guest_name`: Nome do convidado
- `status`: "attending" ou "not_attending"
- `created_at`: Data da confirmação

## Páginas

- `/` - Página principal com lista de presentes e RSVP
- `/informacoes` - Painel administrativo (URL protegida)

## Evento

**Data**: 07 de Março de 2026, Sábado às 13h  
**Local**: Rua Pedro Boêmio, 911a - Próximo Mercantil Santo

## Chave PIX

`katariny_fernandes@hotmail.com`

## Desenvolvimento

```bash
# Instalar dependências
pnpm install

# Executar em desenvolvimento
pnpm dev

# Build para produção
pnpm build
```

## Variáveis de Ambiente

Configure as seguintes variáveis no arquivo `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```
