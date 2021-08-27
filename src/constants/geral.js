export const estados = [ "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RO", "RS", "RR", "SC", "SE", "SP", "TO" ]

export const PERMISSIONS = [
  { name: 'Professor', id: '1', message:'Poderá ser instrutor dos cursos',per:['pr']},
  { name: 'Administrador', id: '2', message:'Terá acesso a todas as funcionalidades da plataforma',per:['ea']},
  { name: 'Faturamento Mensal', id: 'fm', message:'Terá permissões para efetuar compras utilizando o faturamento mensal como forma de pagamento',per:['fm']},
  { name: 'Empresa', id: '4', message:'Terá permissões para criar e gerenciar membros',per:['co']},
  { name: 'Administrador', id: '5', message:'Terá permissões para criar e gerenciar membros', per:['co','coea']},
];

export const COMBOS = [
  {quantity:0, price:20},
  {quantity:1, price:25},
  {quantity:2, price:30},
  {quantity:3, price:30},
  {quantity:4, price:45},
  {quantity:5, price:45},
  {quantity:6, price:45},
  {quantity:7, price:60},
]

export const EPIs = [
  { name: 'Luva', id: 1},
  { name: 'Bota', id: 2 },
  { name: 'Capacete', id: 3 },
  { name: 'Cinto de segunraça', id: 4 },
  { name: 'Luva Quimica', id: 5 },
  { name: 'Luva aprova de fogo', id: 6 },
  { name: 'Luva de plastico', id: 7 },
  { name: 'Óculos protetor', id: 8 },
  { name: 'Óculos UV', id: 9 },
  { name: 'Capacete de chumbo', id: 0 },
  { name: 'Luva 2', id: 10 },
  { name: 'Bota 2', id: 20 },
  { name: 'Capacete 2', id: 30 },
  { name: 'Cinto de segunraça 2', id: 40 },
  { name: 'Luva Quimica 2', id: 50 },
  { name: 'Luva aprova de fogo 2', id: 60 },
  { name: 'Luva de plastico 2', id: 70 },
  { name: 'Óculos protetor 2', id: 80 },
  { name: 'Óculos UV 2', id: 90 },
  { name: 'Capacete de chumbo 2', id: 11 },
];
