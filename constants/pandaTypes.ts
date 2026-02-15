export interface PandaType {
  id: string;
  name: string;
  price: number;
  description: string;
  tint?: string;
  unlocked?: boolean;
}

export const PANDA_TYPES: PandaType[] = [
  {
    id: 'classic',
    name: 'Classic Panda',
    price: 0,
    description: 'Your trusty black & white companion',
    unlocked: true,
  },
  {
    id: 'golden',
    name: 'Golden Panda',
    price: 100,
    description: 'A rare golden panda that shimmers in the sun',
    tint: '#FFD700',
  },
  {
    id: 'red',
    name: 'Red Panda',
    price: 75,
    description: 'Fiery spirit with a warm heart',
    tint: '#FF6B6B',
  },
  {
    id: 'blue',
    name: 'Ice Panda',
    price: 75,
    description: 'Cool as a glacier, strong as a mountain',
    tint: '#64B5F6',
  },
  {
    id: 'pink',
    name: 'Sakura Panda',
    price: 50,
    description: 'Blooms with cherry blossom energy',
    tint: '#F48FB1',
  },
  {
    id: 'green',
    name: 'Bamboo Panda',
    price: 50,
    description: 'One with nature, fueled by bamboo',
    tint: '#81C784',
  },
  {
    id: 'purple',
    name: 'Mystic Panda',
    price: 150,
    description: 'A legendary panda shrouded in mystery',
    tint: '#CE93D8',
  },
  {
    id: 'rainbow',
    name: 'Rainbow Panda',
    price: 200,
    description: 'The ultimate panda, radiating all colors',
    tint: '#FF9800',
  },
];
