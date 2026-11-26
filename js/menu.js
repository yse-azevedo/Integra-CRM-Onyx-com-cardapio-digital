// ---------- INTEGRAÇÃO COM CRM ONYX ----------
const CHAVE_BANCO_ONYX = 'onyx_lojas_db_v2';
const ID_LOJA_PADRAO = 1; // ID da Família Dog no CRM

function obterLojaDoCRM() {
  const params = new URLSearchParams(window.location.search);
  const lojaIdParam = Number(params.get('loja')) || ID_LOJA_PADRAO;
  try {
    const raw = localStorage.getItem(CHAVE_BANCO_ONYX);
    if (!raw) return null;
    const lojas = JSON.parse(raw);
    return lojas.find(l => l.id === lojaIdParam) || null;
  } catch (e) {
    return null;
  }
}

const LOJA_CRM = obterLojaDoCRM();
const EH_FAMILIA_DOG = !LOJA_CRM || LOJA_CRM.id === ID_LOJA_PADRAO;

const NOME_LOJA = (LOJA_CRM && LOJA_CRM.nomeLoja) ? LOJA_CRM.nomeLoja : "Família Dog";
const TELEFONE_EXIBICAO = (LOJA_CRM && LOJA_CRM.whatsapp) ? LOJA_CRM.whatsapp : "(11) 91640-0439";
const TELEFONE_LINK = TELEFONE_EXIBICAO.replace(/\D/g, '')
  ? `tel:+55${TELEFONE_EXIBICAO.replace(/\D/g, '')}`
  : "tel:+5511916400439";

const formatarPrecoCardapio = (valor) =>
  Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const MAPA_CATEGORIA_ROTA = {
  "Pizzas": "pizzas/salgadas",
  "Esfirras": "esfihas",
  "Esfihas": "esfihas",
  "Pastéis": "pasteis",
  "Pasteis": "pasteis",
  "Lanches": "lanches",
  "Dogs no prato": "dogs-no-prato",
  "Bebidas": "bebidas"
};

// ---------- Dados Base (Catálogo Original) ----------
const SETORES_BASE = [
  { chave: "pizzas",  rota: "pizzas/salgadas", nome: "Pizzas",        bolinha: "img/pizzas.jpg",  desc: "Salgadas e doces, com bordas recheadas." },
  { chave: "esfihas", rota: "esfihas",         nome: "Esfihas",       bolinha: "img/esfiha.jpg",  desc: "Salgadas ou doces, do clássico ao especial." },
  { chave: "pasteis", rota: "pasteis",         nome: "Pastéis",       bolinha: null,              desc: "Crocantes e recheados, feitos na hora." },
  { chave: "lanches", rota: "lanches",         nome: "Lanches",       bolinha: "img/lanches.jpg", desc: "Beirutes bem servidos e dogs da família." },
  { chave: "dogs",    rota: "dogs-no-prato",   nome: "Dogs no prato", bolinha: "img/dog.jpg",     desc: "Quatro salsichas e combinações que valem por uma refeição." },
  { chave: "bebidas", rota: "bebidas",         nome: "Bebidas",       bolinha: "img/coca.jpg",    desc: "Refrigerantes, cervejas e sucos." }
];

const SUB_PIZZAS = [
  { rota: "pizzas/salgadas", nome: "Salgadas" },
  { rota: "pizzas/doces",    nome: "Doces" }
];

const FOTOS = {
  "pizzas/salgadas|Calabresa com Cebolas":  "img/calabresa.jpg",
  "pizzas/salgadas|Mussarela":              "img/queijo.jpg",
  "pizzas/salgadas|Frango com Catupiry":    "img/frango.jpg",
  "esfihas|Carne":                          "img/esfiha.jpg",
  "dogs-no-prato|Dog Bacon":                "img/dog.jpg",
  "bebidas|Coca-Cola - lata":               "img/coca.jpg"
};

// Guarda imagens customizadas definidas no CRM (por nome do produto)
const FOTOS_CRM = {};

const DESTAQUES = [
  "pizzas/salgadas|Calabresa com Cebolas",
  "pizzas/salgadas|Mussarela",
  "pizzas/salgadas|Frango com Catupiry",
  "esfihas|Carne",
  "dogs-no-prato|Dog Bacon",
  "bebidas|Coca-Cola - lata"
];

const PAGINAS_BASE = {
  "pizzas/salgadas": {
    chave: "pizzas", titulo: "Pizzas salgadas", bajada: "Sabores para todos os momentos",
    fundo: "img/pizza-escura.jpg", rodape: "Consulte disponibilidade • Imagens ilustrativas",
    grupos: [
      { titulo: "Clássicas", itens: [
        ["À Moda da Casa", "55,00", "Palmito, mussarela, presunto e milho."],
        ["À Moda do Pizzaiolo", "55,00", "Milho, tomate, mussarela e catupiry."],
        ["Bauru", "50,00", "Presunto, mussarela e tomate."],
        ["Champignon", "55,90", "Catupiry, mussarela, bacon e champignon."],
        ["Jardineira", "55,00", "Frango, mussarela, catupiry e bacon."],
        ["Napolitana", "50,00", "Mussarela, tomate e parmesão."],
        ["Palmito", "55,00", "Palmito, mussarela, catupiry e tomate."],
        ["Paulista", "55,00", "Calabresa com cobertura de mussarela."],
        ["Portuguesa", "55,00", "Presunto, milho, ervilha, ovo, cebola e mussarela."],
        ["À Moda do Cliente", "65,00", "Escolha até 4 ingredientes."],
        ["Alho e Óleo", "50,00", "Alho, tomate e mussarela."]
      ]},
      { titulo: "Favoritas", itens: [
        ["Bacon", "55,00", "Bacon, mussarela, milho e catupiry."],
        ["Brócolis Especial", "60,00", "Brócolis, mussarela, bacon, catupiry e cheddar."],
        ["Baiana", "55,00", "Calabresa moída, catupiry, pimenta, cebola, tomate e ovo."],
        ["Calabresa com Cebolas", "39,90", "Molho de tomate, calabresa, cebola, orégano e azeitona."],
        ["Calabresa Especial", "55,00", "Calabresa, mussarela e catupiry."],
        ["Atum Especial", "60,00", "Atum, cheddar, catupiry e mussarela."],
        ["Grega", "55,00", "Calabresa moída coberta com mussarela e bacon."],
        ["Atum com Cebolas", "50,00", "Molho de tomate, atum, cebola, orégano e azeitona."],
        ["Atum com Mussarela", "60,00", "Molho de tomate, mussarela, atum, orégano e azeitona."],
        ["Bauru Especial", "60,00", "Mussarela, presunto, cebola, cheddar e catupiry."],
        ["Brócolis", "55,00", "Brócolis, mussarela, bacon e alho frito."]
      ]},
      { titulo: "Especiais", itens: [
        ["Caipira", "50,00", "Frango, catupiry e milho."],
        ["Costela", "65,00", "Costela, cebola, cream cheese e mussarela."],
        ["Salame", "60,00", "Mussarela e salame."],
        ["Lombo", "55,00", "Lombo, cebola, bacon e catupiry."],
        ["Milho Verde", "50,00", "Milho verde e mussarela."],
        ["Mussarela", "48,90", "Mussarela e tomate."],
        ["Nordestina", "65,00", "Carne-seca, mussarela, tomate, cebola e catupiry."],
        ["Portuguesa Especial", "60,00", "Presunto, milho, ervilha, ovos, tomate, cheddar e catupiry."],
        ["Toscana", "55,00", "Calabresa moída, cebola e catupiry."],
        ["Escarola", "55,00", "Escarola, mussarela, bacon, milho e catupiry."],
        ["Frango com Catupiry", "50,00", "Molho de tomate, frango, catupiry, mussarela, orégano e azeitona."]
      ]},
      { titulo: "Mais sabores", itens: [
        ["Imperador", "60,00", "Calabresa, frango, mussarela, catupiry e champignon."],
        ["Três Queijos", "53,00", "Mussarela, catupiry e cheddar."],
        ["Tropical Bolonhesa", "60,00", "Carne moída, parmesão, mussarela, cheddar e catupiry."],
        ["Vegetariana", "55,00", "Mussarela, brócolis, champignon e ervilha."],
        ["Batata Frita", "65,00", "Molho, queijo, batata frita, cheddar, bacon, orégano e azeitona."],
        ["Frango Cremoso", "55,00", "Molho de tomate, frango, requeijão, mussarela, orégano e azeitona."],
        ["Portuga", "60,00", "Molho, presunto, mussarela, bacon, ovo, milho, ervilha e cebola."],
        ["Frango Especial", "55,00", "Frango desfiado, mussarela, milho e batata palha."],
        ["Quatro Queijos", "55,00", "Mussarela, catupiry, cheddar e parmesão."],
        ["Siciliana", "55,00", "Mussarela, bacon, parmesão e champignon."],
        ["Tropical", "55,00", "Mussarela, catupiry, ovo e parmesão."]
      ]},
      { titulo: "Bordas recheadas", itens: [
        ["Catupiry ou cheddar", "10,00", "Borda recheada para a sua pizza."]
      ]}
    ]
  },
  "pizzas/doces": {
    chave: "pizzas", titulo: "Pizzas doces", bajada: "Para fechar o pedido do melhor jeito",
    fundo: "img/doces.jpg", rodape: "Consulte disponibilidade • Imagens ilustrativas",
    grupos: [
      { titulo: "Pizzas doces", itens: [
        ["Banana", "55,00", "Doce de leite, banana e canela."],
        ["Brigadeiro", "55,00", "Chocolate coberto com granulado."],
        ["Explosão de Chocolate", "55,00", "Chocolate preto e chocolate branco."],
        ["Banana Caramelizada", "60,00", "Pitada de mussarela, banana, chocolate branco caramelizado e canela."],
        ["Romeu e Julieta", "55,00", "Goiabada com queijo."],
        ["KitKat", "70,00", "Chocolate preto e KitKat."],
        ["Pistache", "70,00", "Creme de pistache."],
        ["Ovomaltine", "70,00", "Creme de Ovomaltine."]
      ]},
      { titulo: "Mais doces", itens: [
        ["Nutella", "80,00", "Nutella original."],
        ["M&M's", "55,00", "Chocolate com M&M's."],
        ["Abacaxi Caramelizado", "60,00", "Pitada de mussarela, abacaxi, chocolate branco caramelizado e canela."],
        ["Uva e Chocolate", "60,00", "Chocolate preto com uva."],
        ["Doce de Leite", "50,00", "Doce de leite e canela."],
        ["Chocolate", "55,00", "Chocolate ao leite cremoso."],
        ["Morango", "65,00", "Chocolate preto com morango e leite condensado."]
      ]},
      { titulo: "Bordas recheadas", itens: [
        ["Chocolate branco ou preto", "7,00", "Borda recheada para a sua pizza."]
      ]}
    ]
  },
  "esfihas": {
    chave: "esfihas", titulo: "Esfihas que todo mundo ama", bajada: "Salgadas ou doces: escolha a sua favorita",
    fundo: "img/esfiha.jpg", rodape: "Massa leve, recheio caprichado e sabor de verdade • Consulte disponibilidade",
    grupos: [
      { titulo: "Salgadas", itens: [
        ["Alho e Óleo", "3,50", "Alho e óleo."],
        ["Atum", "3,50", "Atum."],
        ["Atum com Mussarela", "6,00", "Atum e mussarela."],
        ["Atum, Cebola e Catupiry", "6,00", "Atum, cebola e catupiry."],
        ["Bacon com Mussarela e Milho", "6,00", "Bacon, mussarela e milho."],
        ["Brócolis, Mussarela e Bacon", "6,00", "Brócolis, mussarela e bacon."],
        ["Brócolis Especial", "6,00", "Brócolis, queijo, bacon, cheddar e catupiry."],
        ["Calabresa", "3,50", "Calabresa."],
        ["Calabresa com Catupiry", "5,00", "Calabresa e catupiry."],
        ["Calabresa com Cheddar", "5,00", "Calabresa e cheddar."],
        ["Calabresa com Mussarela", "5,00", "Calabresa e mussarela."],
        ["Carne", "3,50", "Carne."]
      ]},
      { titulo: "Mais salgadas", itens: [
        ["Carne com Mussarela", "5,00", "Carne e mussarela."],
        ["Carne-seca com Mussarela", "7,00", "Carne-seca e mussarela."],
        ["Costela", "7,00", "Costela e cream cheese."],
        ["Dois Queijos", "5,00", "Mussarela e catupiry."],
        ["Escarola, Mussarela e Bacon", "6,00", "Escarola, mussarela e bacon."],
        ["Frango", "3,50", "Frango."],
        ["Frango com Catupiry", "4,50", "Frango e catupiry."],
        ["Frango com Cheddar", "4,50", "Frango e cheddar."],
        ["Frango com Mussarela", "5,00", "Frango e mussarela."],
        ["Napolitana", "4,50", "Queijo, tomate e parmesão."],
        ["Palmito com Mussarela", "4,50", "Palmito e mussarela."],
        ["Presunto, Ovo e Mussarela", "5,00", "Presunto, ovo e mussarela."]
      ]},
      { titulo: "Favoritas", itens: [
        ["Quatro Queijos", "6,00", "Mussarela, catupiry, cheddar e parmesão."],
        ["Queijo e Presunto", "5,00", "Queijo e presunto."],
        ["Queijo Mussarela", "3,50", "Queijo mussarela."],
        ["Três Queijos", "5,00", "Mussarela, catupiry e cheddar."],
        ["Pepperoni", "6,00", "Pepperoni."],
        ["Chocolate", "5,00", "Chocolate."],
        ["Chocolate e Morango", "10,00", "Chocolate e morango."],
        ["Romeu e Julieta", "7,00", "Mussarela e goiabada."],
        ["M&M's", "6,00", "Chocolate e M&M's."],
        ["Abacaxi", "10,00", "Abacaxi e creme."],
        ["Banana", "7,00", "Banana, doce de leite, leite condensado e canela."],
        ["Banana Especial", "10,00", "Banana, mussarela, chocolate branco e canela."]
      ]},
      { titulo: "Doces irresistíveis", itens: [
        ["Chocolate e Granulado", "6,00", "Brigadeiro."],
        ["Paçoca", "6,00", "Chocolate e paçoca."],
        ["Prestígio", "6,00", "Chocolate e coco ralado."],
        ["Bis - Novidade", "7,00", "Chocolate, Bis e leite condensado."],
        ["KitKat", "10,00", "KitKat e chocolate."],
        ["Pistache", "7,00", "Creme de pistache."],
        ["Nutella", "10,00", "Nutella."],
        ["Ovomaltine", "10,00", "Chocolate e Ovomaltine."],
        ["Nutella com Ovomaltine", "12,00", "Nutella e Ovomaltine."],
        ["Churros", "6,00", "Doce de leite, leite condensado e canela."],
        ["Pistache com Uva", "8,00", "Pistache e uva."],
        ["Chocolate com Uva", "10,00", "Chocolate, uva e leite condensado."]
      ]}
    ]
  },
  "pasteis": {
    chave: "pasteis", titulo: "Pastéis crocantes e recheados", bajada: "Do clássico ao especial, sempre feito para matar a fome",
    fundo: null, rodape: "Pastéis preparados na hora • Consulte disponibilidade",
    grupos: [
      { titulo: "Os clássicos", itens: [
        ["Brócolis, Mussarela e Bacon", "17,00", "Brócolis, mussarela e bacon."],
        ["Calabresa", "12,00", "Calabresa."],
        ["Bauru", "15,00", "Mussarela, presunto e tomate."],
        ["Carne", "12,00", "Carne."],
        ["Costela", "17,00", "Cream cheese, queijo e costela."],
        ["Costela com Cheddar", "17,00", "Cheddar e costela."],
        ["Costela com Requeijão", "17,00", "Requeijão, queijo e costela."],
        ["Carne com Mussarela", "15,00", "Carne e mussarela."]
      ]},
      { titulo: "Bem recheados", itens: [
        ["Frango com Catupiry", "15,00", "Frango e catupiry."],
        ["Frango com Requeijão", "15,00", "Frango e requeijão."],
        ["Frango", "12,00", "Frango."],
        ["Frango com Cheddar", "15,00", "Frango e cheddar."],
        ["Queijo", "12,00", "Queijo."],
        ["Carne Dois", "17,00", "Carne, queijo e catupiry."],
        ["Palmito, Mussarela e Azeitona", "15,00", "Palmito, mussarela e azeitona."],
        ["Dois Queijos", "14,00", "Queijo e catupiry."]
      ]},
      { titulo: "Sabores especiais", itens: [
        ["Três Queijos", "15,00", "Mussarela, cheddar e catupiry."],
        ["Pizza", "12,00", "Queijo, orégano e tomate."],
        ["Carne-seca com Mussarela", "17,00", "Carne-seca e mussarela."],
        ["Calabresa com Mussarela", "15,00", "Calabresa e mussarela."],
        ["Escarola, Mussarela e Bacon", "14,00", "Escarola, mussarela e bacon."],
        ["Especial", "18,00", "Carne, frango, queijo, calabresa, catupiry e milho."],
        ["Banana", "15,00", "Banana, doce de leite e canela."],
        ["Brigadeiro", "15,00", "Chocolate e granulado."]
      ]},
      { titulo: "Pastéis doces", itens: [
        ["Chocolate com Abacaxi", "15,00", "Abacaxi e chocolate preto."],
        ["M&M's", "15,00", "Chocolate e M&M's."],
        ["Chocolate com Morango", "17,00", "Chocolate e morango."],
        ["Romeu e Julieta", "15,00", "Queijo e goiabada."],
        ["Chocolate Preto e Branco", "15,00", "Chocolate preto e chocolate branco."],
        ["Nutella", "15,00", "Recheado com Nutella."],
        ["Chocolate", "15,00", "Chocolate."]
      ]}
    ]
  },
  "lanches": {
    chave: "lanches", titulo: "Lanches de respeito", bajada: "Beirutes e dogs para quem não brinca com a fome",
    fundo: "img/lanches.jpg", rodape: "Capricho em cada recheio",
    grupos: [
      { titulo: "Beirutes bem servidos", itens: [
        ["Bauru", "35,00", "Presunto, queijo e orégano."],
        ["Calabresa", "35,00", "Calabresa e cebola."],
        ["Calabresa Especial", "45,00", "Calabresa, cebola, catupiry e bacon."],
        ["Carne-seca", "45,00", "Carne-seca, catupiry e cebola."],
        ["Frango com Catupiry", "35,00", "Frango e catupiry."],
        ["Frango Especial", "40,00", "Frango desfiado, milho e batata palha."],
        ["Lombo", "40,00", "Lombo, catupiry e cebola."],
        ["Costela", "45,00", "Costela, cebola, mussarela e cream cheese."]
      ]},
      { titulo: "Dogs da família", itens: [
        ["Dog Simples", "10,00", "Pão, salsicha, batata palha, purê, tomate, milho e molhos."],
        ["Dog Duplo", "12,00", "Duas salsichas, purê, batata palha, tomate, milho e molhos."],
        ["Dog Prensado", "12,00", "Salsicha, batata palha, milho, cheddar e catupiry."],
        ["Duplo Prensado", "14,00", "Duas salsichas, batata palha, purê, milho, cheddar e catupiry."],
        ["Dog da Casa", "18,00", "Duas salsichas, presunto, queijo, milho, tomate, purê e batata palha."],
        ["Dog Bacon", "20,00", "Duas salsichas, bacon, purê, batata palha, milho, queijo, tomate, catupiry e cheddar."]
      ]},
      { titulo: "Dogs doces", itens: [
        ["Dog Sensação", "15,00", "Pão de dog, chocolate, morango e leite condensado."],
        ["Dog de Banana", "15,00", "Pão de dog, doce de leite, banana e canela."],
        ["Dog de Chocolate", "10,00", "Pão de dog e chocolate branco ou preto."],
        ["Dog Prestígio", "12,00", "Pão de dog, chocolate, leite condensado e coco ralado."],
        ["Dog de Pistache com Uva", "13,00", "Pão de dog, pistache e uva."],
        ["Dog de Chocolate com Uva", "13,00", "Pão de dog, chocolate e uva."],
        ["Dog de Abacaxi", "15,00", "Pão de dog, leite condensado, chocolate e abacaxi."],
        ["Dog de M&M's", "15,00", "Pão de dog, chocolate e M&M's."]
      ]}
    ]
  },
  "dogs-no-prato": {
    chave: "dogs", titulo: "Dog no prato: fome de verdade", bajada: "Quatro salsichas e combinações que valem por uma refeição",
    fundo: "img/dog.jpg", rodape: "Todos os dogs no prato são preparados com ingredientes selecionados • Consulte disponibilidade",
    grupos: [
      { titulo: "Os queridinhos", itens: [
        ["À Moda da Casa", "25,00", "4 salsichas, presunto, mussarela e milho."],
        ["Dog Bacon", "27,00", "4 salsichas, purê, mussarela, milho, catupiry, cheddar e bacon."],
        ["Baiana", "27,00", "4 salsichas, calabresa moída, mussarela, catupiry, bacon, cebola, tomate, purê e batata palha."],
        ["Bauru Especial", "27,00", "4 salsichas, purê, batata palha, mussarela, presunto, catupiry e cheddar."],
        ["Brócolis", "25,00", "4 salsichas, purê, batata palha, brócolis, queijo, bacon e alho frito."],
        ["Brócolis Especial", "27,00", "4 salsichas, purê, batata palha, mussarela, brócolis, bacon, alho frito, cheddar e catupiry."]
      ]},
      { titulo: "Sabores especiais", itens: [
        ["Calabresa", "23,00", "4 salsichas, purê, batata palha, calabresa e cebola."],
        ["Calabresa Especial", "27,00", "4 salsichas, purê, batata palha, molhos, calabresa, cebola e catupiry."],
        ["Costela", "30,00", "4 salsichas, purê, batata palha, molhos, costela, cream cheese, cebola e queijo."],
        ["Carne-seca", "30,00", "4 salsichas, purê, batata palha, molhos, carne-seca, cebola, tomate, catupiry e queijo."],
        ["Frango com Catupiry", "25,00", "4 salsichas, purê, batata palha, molhos, frango e catupiry."],
        ["Frango Especial", "27,00", "4 salsichas, purê, batata palha, molhos, frango, milho, catupiry e queijo."]
      ]},
      { titulo: "Mais pedidos", itens: [
        ["Atum", "25,00", "4 salsichas, purê, batata palha, molhos, atum, cebola e queijo."],
        ["Jardineiro", "27,00", "4 salsichas, purê, batata palha, molhos, frango, catupiry, bacon e queijo."],
        ["Mussarela", "23,00", "4 salsichas, purê, batata palha, molhos, mussarela e tomate."],
        ["Dois Queijos", "23,00", "4 salsichas, purê, batata palha, molhos, mussarela e catupiry."],
        ["Três Queijos", "25,00", "4 salsichas, purê, batata palha, molhos, mussarela, catupiry e cheddar."],
        ["Quatro Queijos", "27,00", "4 salsichas, purê, batata palha, molhos, mussarela, catupiry, cheddar e parmesão."]
      ]},
      { titulo: "Para variar", itens: [
        ["Grego", "27,00", "4 salsichas, purê, batata palha, molhos, queijo, calabresa e bacon."],
        ["Lombo", "27,00", "4 salsichas, purê, batata palha, molhos, lombo, cebola, bacon, queijo e catupiry."],
        ["Português", "27,00", "4 salsichas, purê, batata palha, molhos, queijo, presunto, milho, ervilha, cebola e ovo."],
        ["Caipira", "27,00", "4 salsichas, purê, batata palha, molhos, frango, milho e catupiry."]
      ]}
    ]
  },
  "bebidas": {
    chave: "bebidas", titulo: "Bebidas", bajada: "Para fechar o pedido do melhor jeito",
    fundo: "img/coca.jpg", rodape: "Consulte disponibilidade",
    grupos: [
      { titulo: "Refrigerantes", itens: [
        ["Coca-Cola 2 L", "17,00"],
        ["Fanta Laranja 2 L", "17,00"],
        ["Guaraná Antarctica 1,5 L", "15,00"],
        ["Fanta Uva 2 L", "17,00"],
        ["Fanta Laranja - lata", "6,00"],
        ["Fanta Uva - lata", "6,00"],
        ["Coca-Cola - lata", "6,00"],
        ["Convenção", "8,00"]
      ]},
      { titulo: "Cervejas", itens: [
        ["Original", "5,00"],
        ["Skol", "5,00"],
        ["Heineken - lata", "7,00"]
      ]},
      { titulo: "Sucos", itens: [
        ["Suco com água", "10,00", "Escolha um dos sabores abaixo."],
        ["Suco com leite", "12,00", "Escolha um dos sabores abaixo."]
      ],
        sabores: [
          "Abacaxi", "Abacaxi com Hortelã", "Acerola", "Açaí", "Acerola com Laranja",
          "Amora", "Cajá", "Caju", "Coco", "Cupuaçu", "Frutas Vermelhas", "Goiaba",
          "Graviola", "Limão", "Manga", "Maracujá", "Melancia", "Morango", "Pêssego", "Uva"
        ]
      }
    ]
  }
};

// ---------- MESCLAGEM DOS DADOS DO CRM COM O CARDÁPIO ----------
function construirCatalogoIntegrado() {
  const paginas = JSON.parse(JSON.stringify(PAGINAS_BASE));

  if (!EH_FAMILIA_DOG) {
    Object.keys(paginas).forEach(rota => {
      paginas[rota].grupos = [];
    });
  }

  if (LOJA_CRM && Array.isArray(LOJA_CRM.produtos)) {
    LOJA_CRM.produtos.forEach(prodCRM => {
      const precoFormatado = formatarPrecoCardapio(prodCRM.preco);
      const nomeNorm = prodCRM.nome.trim().toLowerCase();
      if (prodCRM.imagem) FOTOS_CRM[nomeNorm] = prodCRM.imagem;
      let encontrado = false;

      // 1. Atualiza preço ou pausa item existente
      Object.keys(paginas).forEach(rota => {
        paginas[rota].grupos.forEach(grupo => {
          if (!grupo.itens) return;
          const idx = grupo.itens.findIndex(item => item[0].trim().toLowerCase() === nomeNorm);
          if (idx !== -1) {
            encontrado = true;
            if (prodCRM.ativo === false) {
              grupo.itens.splice(idx, 1);
            } else {
              grupo.itens[idx][1] = precoFormatado;
            }
          }
        });
      });

      // 2. Adiciona item novo na categoria escolhida
      if (!encontrado && prodCRM.ativo !== false) {
        const rotaDestino = MAPA_CATEGORIA_ROTA[prodCRM.categoria] || "lanches";
        const paginaAlvo = paginas[rotaDestino];
        if (paginaAlvo) {
          let grupoAlvo = paginaAlvo.grupos.find(g => g.titulo === "Cardápio" || g.titulo === "Novidades");
          if (!grupoAlvo) {
            grupoAlvo = { titulo: EH_FAMILIA_DOG ? "Novidades" : "Cardápio", itens: [] };
            paginaAlvo.grupos.unshift(grupoAlvo);
          }
          grupoAlvo.itens.push([prodCRM.nome, precoFormatado, ""]);
        }
      }
    });
  }

  Object.keys(paginas).forEach(rota => {
    paginas[rota].grupos = paginas[rota].grupos.filter(g => (g.itens && g.itens.length > 0) || (g.sabores && g.sabores.length > 0));
  });

  const setoresAtivos = EH_FAMILIA_DOG
    ? SETORES_BASE
    : SETORES_BASE.filter(s => paginas[s.rota] && paginas[s.rota].grupos.length > 0);

  return { paginas, setores: setoresAtivos };
}

const { paginas: PAGINAS, setores: SETORES } = construirCatalogoIntegrado();
const ORDEM = Object.keys(PAGINAS).filter(r => PAGINAS[r].grupos.length > 0);

// ---------- Utilidades ----------
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const slug = s => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const semAcento = s => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const setorDe = chave => SETORES.find(s => s.chave === chave) || SETORES_BASE.find(s => s.chave === chave);

function imagemDoItem(rota, nome) {
  const nomeNorm = nome.trim().toLowerCase();
  const caminho = FOTOS_CRM[nomeNorm] || FOTOS[`${rota}|${nome}`] || `img/itens/${rota.replace("/", "-")}__${slug(nome)}.jpg`;
  return `<img src="${esc(caminho)}" alt="${esc(nome)}" loading="lazy" width="400" height="300" onerror="this.onerror=null;this.src='img/logo.png';this.width=200;this.height=200;this.closest('.card-foto').classList.add('vazio')">`;
}

function produtosDe(rota) {
  if (!PAGINAS[rota]) return [];
  return PAGINAS[rota].grupos.flatMap(g => (g.itens || []).map(i => ({ rota, grupo: g.titulo, item: i })));
}

function contarSetor(chave) {
  return ORDEM.filter(r => PAGINAS[r].chave === chave)
    .reduce((t, r) => t + produtosDe(r).length, 0);
}

function rotaAtual() {
  const h = decodeURIComponent(location.hash.replace(/^#\/?/, "")).replace(/\/$/, "");
  if (h === "pizzas") return "pizzas/salgadas";
  if (PAGINAS[h] && PAGINAS[h].grupos.length > 0) return h;
  return "";
}

// ---------- Componentes ----------
function topo() {
  return `
  <header class="topo">
    <div class="topo-in">
      <a class="marca" href="#/" aria-label="Início do cardápio">
        <img src="img/logo.png" alt="" width="40" height="40">
        <span>${esc(NOME_LOJA)}</span>
      </a>
      <span class="espaco"></span>
      <a class="ligar" href="${TELEFONE_LINK}"><span class="ligar-texto-curto">Ligar</span><span class="ligar-texto-longo">Ligar ${esc(TELEFONE_EXIBICAO)}</span></a>
    </div>
  </header>`;
}

function pilulas(chaveAtiva) {
  return `
  <nav class="pilulas" aria-label="Setores do cardápio">
    <ul>
      ${SETORES.map(s => `<li><a href="#/${s.rota}"${s.chave === chaveAtiva ? ' aria-current="page"' : ""}>${esc(s.nome)}</a></li>`).join("")}
    </ul>
  </nav>`;
}

function card(rota, [nome, preco, desc]) {
  const busca = semAcento(`${nome} ${desc || ""}`);
  return `
    <li class="item-grade" data-busca="${esc(busca)}">
      <article class="card">
        <div class="card-foto">
          ${imagemDoItem(rota, nome)}
        </div>
        <div class="card-corpo">
          <h3>${esc(nome)}</h3>
          ${desc ? `<p class="desc">${esc(desc)}</p>` : ""}
          <p class="preco"><small>R$</small>${esc(preco)}</p>
        </div>
      </article>
    </li>`;
}

function cardCompacto(rota, [nome, preco]) {
  return `
    <li class="item-grade" data-busca="${esc(semAcento(nome))}">
      <article class="card compacto">
        <div class="card-foto">
          ${imagemDoItem(rota, nome)}
        </div>
        <div class="card-corpo">
          <h3>${esc(nome)}</h3>
          <p class="preco"><small>R$</small>${esc(preco)}</p>
        </div>
      </article>
    </li>`;
}

function grupo(rota, g) {
  const id = slug(`${rota}-${g.titulo}`);
  const itens = g.itens || [];
  const corpo = itens.length
    ? `<ul class="grade">${itens.map(i => (g.sabores ? cardCompacto(rota, i) : card(rota, i))).join("")}</ul>`
    : "";
  const sabores = g.sabores
    ? `<div class="flavors"><h3>Sabores</h3><p>Escolha um dos sabores para o seu suco.</p><ul>${g.sabores.map(s => `<li>${esc(s)}</li>`).join("")}</ul></div>`
    : "";
  return `
    <section class="grupo" id="${id}" data-grupo="${esc(g.titulo)}">
      <div class="grupo-titulo">
        <h2>${esc(g.titulo)}</h2>
        <span>${itens.length || (g.sabores || []).length} ${(itens.length || (g.sabores || []).length) === 1 ? "opção" : "opções"}</span>
      </div>
      ${corpo}
      ${sabores}
    </section>`;
}

function proximaTela(rota) {
  if (ORDEM.length <= 1) return "";
  const i = ORDEM.indexOf(rota);
  const ant = ORDEM[(i - 1 + ORDEM.length) % ORDEM.length];
  const prox = ORDEM[(i + 1) % ORDEM.length];
  const nomeDe = r => PAGINAS[r].chave === "pizzas" ? PAGINAS[r].titulo : setorDe(PAGINAS[r].chave).nome;
  return `
  <nav class="proxima-tela" aria-label="Outras seções">
    <a href="#/${ant}"><span class="rotulo">Anterior</span><span class="nome">${esc(nomeDe(ant))}</span></a>
    <a href="#/${prox}"><span class="rotulo">Próxima</span><span class="nome">${esc(nomeDe(prox))}</span></a>
  </nav>`;
}

function rodape(texto) {
  return `<footer class="rodape"><p>${esc(texto)}</p><p style="margin-top:.35rem">${esc(NOME_LOJA)} • Pedidos: <a href="${TELEFONE_LINK}">${esc(TELEFONE_EXIBICAO)}</a></p></footer>`;
}

function barraPedido() {
  return `<div class="pedir"><a href="${TELEFONE_LINK}">Pedir pelo ${esc(TELEFONE_EXIBICAO)}</a></div>`;
}

// ---------- Páginas ----------
function paginaInicial() {
  let destaques = [];
  if (EH_FAMILIA_DOG) {
    destaques = DESTAQUES.map(k => {
      const [rota, nome] = k.split("|");
      const prod = produtosDe(rota).find(p => p.item[0] === nome);
      return prod ? { rota, prod: prod.item } : null;
    }).filter(Boolean);
  } else {
    destaques = ORDEM.flatMap(r => produtosDe(r).map(p => ({ rota: r, prod: p.item }))).slice(0, 6);
  }

  return `
  ${topo()}
  <main id="conteudo" tabindex="-1">
    <section class="hero" aria-label="Apresentação">
      <img class="hero-foto" src="img/hero.jpg" alt="" aria-hidden="true">
      <div class="hero-in">
        <img class="hero-logo" src="img/logo.png" alt="Logo ${esc(NOME_LOJA)}" width="170" height="170">
        <h1 id="titulo">Qualidade que reúne <em>a família</em></h1>
        <p class="lead">Escolha uma categoria ou busque pelo sabor que você quer.</p>
        <form class="busca" role="search" id="form-busca">
          <label class="oculto" for="campo-busca-inicio">Buscar no cardápio</label>
          <input id="campo-busca-inicio" name="q" type="search" placeholder="Buscar no cardápio..." autocomplete="off">
          <button type="submit">Buscar</button>
        </form>
      </div>
    </section>

    ${SETORES.length ? `
    <section class="categorias" aria-label="Categorias">
      <ul>
        ${SETORES.map(s => `
        <li>
          <a href="#/${s.rota}">
            <span class="circulo${s.bolinha ? "" : " vazio"}">
              ${s.bolinha ? `<img src="${s.bolinha}" alt="" width="96" height="96">` : `<img src="img/logo.png" alt="" width="96" height="96">`}
            </span>
            <span class="nome-cat">${esc(s.nome)}</span>
          </a>
        </li>`).join("")}
      </ul>
    </section>` : ""}

    ${destaques.length ? `
    <section class="bloco" aria-labelledby="destaques-titulo">
      <div class="bloco-topo">
        <h2 id="destaques-titulo">Destaques da casa</h2>
      </div>
      <ul class="trilho">
        ${destaques.map(d => card(d.rota, d.prod)).join("")}
      </ul>
    </section>` : ""}

    <section class="bloco" aria-label="Todas as seções">
      <div class="bloco-topo"><h2>Todo o cardápio</h2></div>
      ${SETORES.length ? `
      <ul class="grade-setores" style="list-style:none;margin:0;padding:0;display:grid;gap:12px;grid-template-columns:1fr 1fr">
        ${SETORES.map(s => `
          <li><a href="#/${s.rota}" style="display:block;text-decoration:none;background:var(--card);border:1px solid var(--linha);border-radius:var(--raio);padding:1rem;color:var(--creme);height:100%">
            <span style="display:block;font-family:var(--display);font-size:1.35rem;color:var(--ouro);line-height:1.1">${esc(s.nome)}</span>
            <span style="display:block;color:var(--muted);font-size:.9rem;margin-top:.35rem">${esc(s.desc)}</span>
            <span style="display:block;margin-top:.6rem;font-weight:700;font-size:.9rem">${contarSetor(s.chave)} opções</span>
          </a></li>`).join("")}
      </ul>` : `<p class="sem-resultado">Nenhum produto ativo cadastrado para esta loja no momento.</p>`}
    </section>
  </main>
  ${rodape(`${NOME_LOJA} • Imagens ilustrativas`)}
  ${barraPedido()}`;
}

function paginaSetor(rota) {
  const p = PAGINAS[rota];
  const temDoces = PAGINAS["pizzas/doces"] && PAGINAS["pizzas/doces"].grupos.length > 0;
  const sub = (p.chave === "pizzas" && temDoces)
    ? `<nav class="subabas" aria-label="Tipo de pizza"><div class="segmento">${SUB_PIZZAS.map(s => `<a href="#/${s.rota}"${s.rota === rota ? ' aria-current="page"' : ""}>${esc(s.nome)}</a>`).join("")}</div></nav>`
    : "";
  const total = produtosDe(rota).length;
  const fundoCss = p.fundo ? `<img class="cabeca-foto" src="${p.fundo}" alt="" aria-hidden="true">` : "";
  return `
  ${topo()}
  ${pilulas(p.chave)}
  <main id="conteudo" tabindex="-1">
    <section class="cabeca" aria-label="Apresentação da seção">
      ${fundoCss}
      <div class="cabeca-in">
        <h1 id="titulo" tabindex="-1">${esc(p.titulo)}</h1>
        <p class="bajada">${esc(p.bajada)}</p>
        <p class="contagem">${total} opções nesta página</p>
      </div>
    </section>
    ${sub}
    <div class="ferramentas">
      <div class="busca" role="search">
        <label class="oculto" for="campo-busca">Buscar nesta página</label>
        <input id="campo-busca" type="search" placeholder="Buscar nesta página" autocomplete="off">
      </div>
      <ul class="chips" aria-label="Ir para um grupo">
        ${p.grupos.map(g => `<li><a href="#${slug(`${rota}-${g.titulo}`)}">${esc(g.titulo)}</a></li>`).join("")}
      </ul>
    </div>
    <div class="vitrine" id="vitrine">
      ${p.grupos.map(g => grupo(rota, g)).join("")}
      <p class="sem-resultado oculto" id="sem-resultado">Nenhum sabor encontrado com essa busca.</p>
    </div>
    ${proximaTela(rota)}
  </main>
  ${rodape(p.rodape)}
  ${barraPedido()}`;
}

function paginaBusca(termo) {
  const t = semAcento(termo).trim();
  const achados = ORDEM.flatMap(r => produtosDe(r).map(p => ({ ...p, sec: r }))).filter(p => {
    const texto = semAcento(`${p.item[0]} ${p.item[2] || ""}`);
    return texto.includes(t);
  });
  return `
  ${topo()}
  <main id="conteudo" tabindex="-1">
    <section class="cabeca" aria-label="Resultado da busca">
      <div class="cabeca-in">
        <p class="voltar"><a href="#/" style="color:var(--ouro);font-weight:700">Voltar ao início</a></p>
        <h1 id="titulo" tabindex="-1">Resultados</h1>
        <p class="bajada">${achados.length} ${achados.length === 1 ? "opção encontrada" : "opções encontradas"} para “${esc(termo)}”</p>
      </div>
    </section>
    <div class="vitrine">
      ${achados.length
        ? `<ul class="grade">${achados.map(p => card(p.sec, p.item)).join("")}</ul>`
        : `<p class="sem-resultado">Nenhum sabor encontrado. Tente outro nome ou veja as <a href="#/" style="color:var(--ouro)">categorias</a>.</p>`}
    </div>
  </main>
  ${rodape("Consulte disponibilidade")}
  ${barraPedido()}`;
}

// ---------- Interações ----------
function ligarBuscaDaPagina() {
  const campo = document.getElementById("campo-busca");
  if (!campo) return;
  const sem = document.getElementById("sem-resultado");
  const grupos = [...document.querySelectorAll(".grupo")];
  campo.addEventListener("input", () => {
    const termo = semAcento(campo.value).trim();
    let visiveis = 0;
    grupos.forEach(g => {
      let n = 0;
      g.querySelectorAll(".item-grade").forEach(li => {
        const ok = !termo || li.dataset.busca.includes(termo);
        li.classList.toggle("oculto", !ok);
        if (ok) n++;
      });
      g.classList.toggle("oculto", n === 0);
      visiveis += n;
    });
    sem.classList.toggle("oculto", visiveis > 0);
  });
}

function ligarBuscaInicio() {
  const form = document.getElementById("form-busca");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const q = form.q.value.trim();
    if (q) location.hash = `#/busca/${encodeURIComponent(q)}`;
  });
}

// ---------- Roteador ----------
function render() {
  const h = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
  const app = document.getElementById("app");
  let html;
  if (h.startsWith("busca/")) html = paginaBusca(h.slice(6));
  else {
    const rota = rotaAtual();
    html = rota ? paginaSetor(rota) : paginaInicial();
  }
  app.innerHTML = html;
  const rota = rotaAtual();
  document.title = h.startsWith("busca/")
    ? `Busca • Cardápio ${NOME_LOJA}`
    : rota ? `${PAGINAS[rota].titulo} • Cardápio ${NOME_LOJA}` : `Cardápio ${NOME_LOJA}`;
  window.scrollTo({ top: 0, behavior: "auto" });
  ligarBuscaDaPagina();
  ligarBuscaInicio();
}

window.addEventListener("hashchange", render);
window.addEventListener("storage", (e) => {
  if (e.key === CHAVE_BANCO_ONYX) location.reload();
});
if (!location.hash) history.replaceState(null, "", "#/");
render();
