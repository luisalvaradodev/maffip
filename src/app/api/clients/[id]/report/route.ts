import { NextResponse } from 'next/server';
import { executeQuery } from '@/features/data/actions/db';

// Função para sanitizar nomes de arquivos
const sanitizeFileName = (name: string) => {
  return name
    .replace(/[^\w\s.-]/g, '_') // Substitui caracteres não alfanuméricos por "_"
    .replace(/\s+/g, '_') // Substitui espaços por "_"
    .replace(/_{2,}/g, '_') // Substitui múltiplos "_" por um único
    .trim(); // Remove espaços no início e no final
};

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const clientId = params.id;

    if (!clientId) {
      return NextResponse.json({ error: 'ID do cliente é obrigatório' }, { status: 400 });
    }

    // Obter dados do cliente
    const query = `
      SELECT 
        s.id,
        s.numero,
        s.nome,
        s.data as validade,
        s.valor,
        s.texto as produto
      FROM store s
      WHERE s.id = ?
    `;
    const client = await executeQuery(query, [clientId]);

    if (!client || client.length === 0) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });
    }

    const clientData = client[0];

    // Criar conteúdo do arquivo .txt
    const txtContent = `
📄 Relatório do Cliente

👤 Nome: ${clientData.nome}
🔢 Número: ${clientData.numero}
💰 Valor: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(clientData.valor)}
📅 Validade: ${new Date(clientData.validade).toLocaleDateString('pt-BR')}

📦 Detalhes do Produto:
${clientData.produto}
    `;

    // Responder com o arquivo .txt gerado
    const response = new Response(txtContent, {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="relatorio-cliente-${sanitizeFileName(clientData.nome)}.txt"`,
      },
    });

    return response;
  } catch (error) {
    console.error('Erro ao gerar relatório TXT:', error);
    return NextResponse.json(
      { error: 'Falha ao gerar relatório', details: error.message },
      { status: 500 }
    );
  }
}