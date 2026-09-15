import type { GameImage } from '../types/game';
import img001 from '../assets/game-images/ai/img-001.webp';
import img002 from '../assets/game-images/ai/img-002.webp';
import img003 from '../assets/game-images/ai/img-003.webp';
import img004 from '../assets/game-images/ai/img-004.webp';
import img005 from '../assets/game-images/ai/img-005.webp';
import img006 from '../assets/game-images/ai/img-006.webp';
import img007 from '../assets/game-images/ai/img-007.webp';
import img008 from '../assets/game-images/ai/img-008.webp';
import img009 from '../assets/game-images/ai/img-009.webp';
import img010 from '../assets/game-images/ai/img-010.webp';
import img011 from '../assets/game-images/ai/img-011.webp';
import img012 from '../assets/game-images/ai/img-012.webp';
import img013 from '../assets/game-images/real/img-013.webp';
import img014 from '../assets/game-images/real/img-014.webp';
import img015 from '../assets/game-images/real/img-015.webp';
import img016 from '../assets/game-images/real/img-016.webp';
import img017 from '../assets/game-images/real/img-017.webp';
import img018 from '../assets/game-images/real/img-018.webp';
import img019 from '../assets/game-images/real/img-019.webp';
import img020 from '../assets/game-images/real/img-020.webp';
import img021 from '../assets/game-images/real/img-021.webp';
import img022 from '../assets/game-images/real/img-022.webp';
import img023 from '../assets/game-images/real/img-023.webp';
import img024 from '../assets/game-images/real/img-024.webp';

export const imageCatalog: GameImage[] = [
  { id: 'img-001', src: img001, answer: 'ai', alt: 'A roadside fruit and tea stall after rainfall', clue: 'Look closely at the tiny packaging, bottle labels, and repeating shelf details—their structure becomes inconsistent at fine scale.', category: 'street scene', difficulty: 'hard', active: true },
  { id: 'img-002', src: img002, answer: 'ai', alt: 'An older mechanic repairing a bicycle in a workshop', clue: 'The bicycle spokes and mechanical parts around the hands merge into unusually tangled geometry.', category: 'people', difficulty: 'medium', active: true },
  { id: 'img-003', src: img003, answer: 'ai', alt: 'A suburban home and parked car beneath a cloudy sky', clue: 'This image was generated using an AI model, although it contains very few obvious visual artifacts.', category: 'architecture', difficulty: 'hard', active: true },
  { id: 'img-004', src: img004, answer: 'ai', alt: 'A lived-in kitchen on a cloudy morning', clue: 'Some small countertop objects and edges lose consistent structure when viewed closely.', category: 'interior', difficulty: 'hard', active: true },
  { id: 'img-005', src: img005, answer: 'ai', alt: 'A cup of coffee on a sunlit wooden table', clue: 'The reflected highlights and fine curves around the cup and saucer do not all agree with the surrounding light.', category: 'still life', difficulty: 'hard', active: true },
  { id: 'img-006', src: img006, answer: 'ai', alt: 'A colourful bowl overflowing with fresh fruit', clue: 'Several fruit stems, leaves, and overlapping edges blend together in ways that are physically unusual.', category: 'still life', difficulty: 'medium', active: true },
  { id: 'img-007', src: img007, answer: 'ai', alt: 'A farmer standing beside a muddy tractor after rain', clue: 'The tractor’s small mechanical components and muddy edges become incoherent around points where objects overlap.', category: 'people', difficulty: 'medium', active: true },
  { id: 'img-008', src: img008, answer: 'ai', alt: 'A golden retriever running out of the sea', clue: 'This image was generated using an AI model, although its motion, fur, and water contain few obvious artifacts.', category: 'animals', difficulty: 'hard', active: true },
  { id: 'img-009', src: img009, answer: 'ai', alt: 'Three hikers walking along a misty mountain trail', clue: 'The distant hikers and trail-side textures lose natural detail and definition in subtly inconsistent ways.', category: 'landscape', difficulty: 'hard', active: true },
  { id: 'img-010', src: img010, answer: 'ai', alt: 'Cars beside a quiet lakeside parking area at dusk', clue: 'Small distant structures—especially bicycle wheels and thin railings—do not maintain consistent geometry.', category: 'urban landscape', difficulty: 'hard', active: true },
  { id: 'img-011', src: img011, answer: 'ai', alt: 'A pair of white trainers on a wooden floor', clue: 'Compare the two shoes: lace paths, eyelets, and panel seams do not follow the same plausible construction.', category: 'objects', difficulty: 'medium', active: true },
  { id: 'img-012', src: img012, answer: 'ai', alt: 'A tea worker walking through misty green rows', clue: 'The dense leaves repeat with unusually uniform texture, while fine details around the worker soften into the background.', category: 'people', difficulty: 'hard', active: true },
  { id: 'img-013', src: img013, answer: 'real', alt: 'A colourful café and shopfront on a city street', category: 'architecture', difficulty: 'medium', active: true },
  { id: 'img-014', src: img014, answer: 'real', alt: 'A close-up portrait with glasses and hoop earrings', category: 'portrait', difficulty: 'medium', active: true },
  { id: 'img-015', src: img015, answer: 'real', alt: 'A group of people eating together at a long table', category: 'people', difficulty: 'hard', active: true },
  { id: 'img-016', src: img016, answer: 'real', alt: 'A calm lake bordered by trees and distant hills', category: 'landscape', difficulty: 'medium', active: true },
  { id: 'img-017', src: img017, answer: 'real', alt: 'Two hands breaking open a filled pastry over a plate', category: 'food', difficulty: 'hard', active: true },
  { id: 'img-018', src: img018, answer: 'real', alt: 'Classic cars displayed inside a modern building', category: 'interior', difficulty: 'medium', active: true },
  { id: 'img-019', src: img019, answer: 'real', alt: 'Bright terraced fields beneath a mountain range', category: 'landscape', difficulty: 'medium', active: true },
  { id: 'img-020', src: img020, answer: 'real', alt: 'A person sketching beside a cup of coffee', category: 'people', difficulty: 'medium', active: true },
  { id: 'img-021', src: img021, answer: 'real', alt: 'A small cat standing on rocks beside water', category: 'animals', difficulty: 'hard', active: true },
  { id: 'img-022', src: img022, answer: 'real', alt: 'A vivid sunset reflected across still water', category: 'landscape', difficulty: 'medium', active: true },
  { id: 'img-023', src: img023, answer: 'real', alt: 'Two elephants walking through shallow water', category: 'animals', difficulty: 'easy', active: true },
  { id: 'img-024', src: img024, answer: 'real', alt: 'A dark wooden cabin among windswept coastal grass', category: 'landscape', difficulty: 'medium', active: true },
];
