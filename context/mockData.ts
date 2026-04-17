import { Lead, LeadHistory } from '../types';

const programs = ['Toddler', 'Nursery', 'Junior Kindergarten', 'Senior Kindergarten', 'Elementary'];
const origins  = ['Facebook Ads', 'Google Ads', 'Instagram Organic', 'Indicação', 'Site'];
const scores   = ['Quente', 'Morno', 'Frio'] as const;

const NAMES = [
  'Ana Lima','Bruno Faria','Carla Souza','Diego Melo','Eliana Costa',
  'Fábio Neto','Gabriela Reis','Henrique Alves','Isabela Pinto','João Mendes',
  'Karen Rocha','Lucas Dias','Mariana Teles','Nathalia Borges','Otávio Cunha',
  'Patrícia Vieira','Queila Assis','Rafael Moura','Sabrina Lopes','Thiago Gomes',
  'Ursula Paiva','Vinicius Cruz','Wanda Ferreira','Yuri Campos','Zélia Ribeiro',
  'André Macedo','Beatriz Nunes','Caio Araújo','Daniela Martins','Eduardo Freitas',
  'Fernanda Castro','Gustavo Duarte','Helena Oliveira','Igor Santana','Julia Cavalcanti',
  'Kleber Medeiros','Larissa Rodrigues','Marcelo Andrade','Natália Pereira','Oscar Lima',
  'Paula Teixeira','Renata Cardoso','Sérgio Azevedo','Talita Nascimento','Ulisses Correia',
  'Verônica Batista','Wagner Silveira','Ximena Leite','Alice Fernandes','Bernardo Ramos',
  'Camila Moreira','Davi Guimarães','Estela Monteiro','Felipe Carvalho','Giovanna Pires',
  'Hélio Rezende','Ingrid Vasconcelos','Jorge Matos','Luana Sousa','Márcio Tavares',
  'Nicole Machado','Paulo Coelho','Rita Fonseca','Samuel Vilarinho','Tatiane Queiroz',
  'Ubiratan Caldas','Valéria Nogueira','Wesley Muniz','Aline Pacheco','Breno Lacerda',
  'Clara Brito','Denis Coutinho','Ester Mendonça','Flávia Siqueira','Geraldo Peixoto',
  'Ivan Chaves','Juliane Saraiva','Karina Amorim','Leandro Evangelista','Mônica Bezerra',
  'Nilson Figueiredo','Olga Paes','Pedro Drummond','Quésia Amaral','Ricardo Braga',
  'Simone Damião','Tânia Fontes','Umberto Rego','Vitória Salles','Wilma Esteves',
  'Alex Cordeiro','Bárbara Maia','Célio Carmo','Denise Flores','Érica Souza',
  'Fausto Neves','Graça Mendonça','Hector Rojas','Iracema Costa','Janaína Torres',
];

const CHILDREN = [
  'Isa','Miguel','Clara','Theo','Alice','Gabriel','Sofia','Lucas','Laura','Davi',
  'Manuela','Heitor','Lorena','Enzo','Bia','Livia','Samuel','Julia','Benício','Maitê',
  'Gael','Cecília','Lucca','Leo','Ana','João','Pedro','Helena','Matheus','Valentina',
  'Rafa','Luna','Bento','Nina','Lara','Tiago','Maya','Nico','Liz','Tom',
  'Mel','Kauê','Isis','Caio','Pipa','Zara','Mia','Ari','Kai','Noa',
  'Ema','Ian','Lia','Guto','Fran','Lee','Rue','Bea','Dal','Gio',
  'Fee','Malu','Zé','Pati','Gui','Nat','Sol','Lua','Via','Teo',
  'Fio','Chi','Lino','Nino','Cris','Dani','Fred','Sara','Hugo','Rita',
  'Alex','Babi','Sami','Luca','Vera','Ivan','Kiki','Yuri','Jade','Léo',
  'Fafa','Mimi','Zuca','Tico','Rute','Gabi','Titi','Caco','Neca','Duda',
];

// Distribuição: 11 Novo Lead, 12 Em Atendimento, 45 Agendado, 0 Visitou, 32 Matriculado
function getStatus(i: number): any {
  if (i < 11)  return 'Novo Lead';
  if (i < 23)  return 'Em Atendimento';
  if (i < 68)  return 'Agendado';
  if (i < 68)  return 'Visitou';
  return 'Matriculado';
}

const s = (i: number, arr: readonly any[]) => arr[i % arr.length];

export const mockLeads: Lead[] = Array.from({ length: 100 }, (_, i) => {
  const id     = `lead-${i + 1}`;
  const status = getStatus(i);
  const score  = status === 'Agendado' || status === 'Matriculado'
    ? 'Quente'
    : i % 3 === 0 ? 'Morno' : 'Frio';

  const createdDate = new Date();
  createdDate.setDate(createdDate.getDate() - (i * 3));

  return {
    id,
    responsibleName: NAMES[i] ?? `Responsável ${i + 1}`,
    whatsapp:        `+55 (87) 9${String((i+1)*7321+10000).slice(-5)}-${String((i+1)*1234+1000).slice(-4)}`,
    email:           `${(NAMES[i] ?? 'responsavel').toLowerCase().replace(/ /g,'.')}@email.com`,
    childName:       CHILDREN[i] ?? `Criança ${i + 1}`,
    program:         s(i, programs),
    status,
    score,
    createdAt:       createdDate.toISOString(),
    lastInteraction: new Date().toISOString(),
    interactionsCount: 2 + (i % 14),
    probability:     status === 'Matriculado' ? 100 : 30 + (i * 17 % 60),
    engagement:      score === 'Quente' ? 3 : score === 'Morno' ? 2 : 1,
    internalNotes:   '',
    aiSummary:       `Responsável demonstrou interesse no programa ${s(i, programs)}. Questionou sobre valores e horários. O agente IA forneceu as informações iniciais e sugeriu agendamento.`,
    history: [
      {
        id:        `h-${i}-1`,
        leadId:    id,
        type:      'ai' as const,
        content:   'Primeiro contato realizado via IA. Lead qualificado automaticamente.',
        createdAt: new Date(Date.now() - 5000000).toISOString()
      },
      {
        id:        `h-${i}-2`,
        leadId:    id,
        type:      'lead' as const,
        content:   'Olá, gostaria de saber mais sobre a escola.',
        createdAt: new Date(Date.now() - 8000000).toISOString()
      }
    ],
    origin:         s(i, origins),
    gender:         i % 3 === 0 ? 'Masculino' : 'Feminino',
    parentAgeRange: i % 2 === 0 ? '25-34' : '35-44',
    childAge:       (i % 5) + 1,
    unitId:         'maple-bear-petrolina',
    nextAction:     s(i, ['Ligar para confirmar visita','Enviar apresentação','Follow-up WhatsApp','Agendar visita'])
  };
});
