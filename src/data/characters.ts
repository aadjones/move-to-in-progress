export interface Character {
  name: string;
  role: string;
  avatar: string; // emoji for now
  personality: 'helpful' | 'demanding' | 'absent' | 'chaotic' | 'demonic';
  commentStyle: string[];
}

export const characters: Record<string, Character> = {
  sarah: {
    name: 'Sarah Chen',
    role: 'Product Manager',
    avatar: '👩‍💼',
    personality: 'demanding',
    commentStyle: [
      'This is blocking the roadmap',
      'Can we prioritize this?',
      'Stakeholders are asking about this',
      'Need this done by EOD',
      'Circling back on this',
      'Just checking in',
      'Bumping this to the top',
    ],
  },

  jerry: {
    name: 'Jerry Martinez',
    role: 'Engineering Manager',
    avatar: '👨‍💻',
    personality: 'helpful',
    commentStyle: [
      'Happy to hop on a call to discuss',
      'Let me know if you need any support',
      'Great question, let me loop in the team',
      'This aligns with our Q4 objectives',
      'I can help unblock this',
      'cc @team for visibility',
    ],
  },

  chad: {
    name: 'Chad Thompson',
    role: 'Senior Engineer',
    avatar: '🧔',
    personality: 'absent',
    commentStyle: [
      'OOO until next Monday',
      'Can someone else take this? Swamped rn',
      'This was supposed to be done last sprint',
      'Not sure why I\'m tagged here',
      'See my previous comment from 3 weeks ago',
      'We discussed this in the retro',
    ],
  },

  priya: {
    name: 'Priya Kapoor',
    role: 'Designer',
    avatar: '🎨',
    personality: 'chaotic',
    commentStyle: [
      'Actually can we revisit the mockups?',
      'The design system was updated yesterday',
      'This doesn\'t match the new brand guidelines',
      'Let\'s run this by the design council first',
      'Figma link: [Error 404]',
      'Never mind, approved!',
    ],
  },

  legal: {
    name: 'Legal Team',
    role: 'Compliance',
    avatar: '⚖️',
    personality: 'chaotic',
    commentStyle: [
      'Adding legal for compliance review',
      'This needs GDPR assessment',
      'Can you fill out the data impact form?',
      'Link to form: [Access Denied]',
      'Has this been reviewed by InfoSec?',
      'Approved pending security review',
    ],
  },

  steve: {
    name: 'Steve Wilson',
    role: 'Former Tech Lead',
    avatar: '👻',
    personality: 'absent',
    commentStyle: [
      'This was my project before I left',
      '[User account deactivated]',
      'See the Confluence doc I wrote',
      'I can explain this if needed',
      '[This user no longer exists]',
    ],
  },

  bot: {
    name: 'WorkflowBot',
    role: 'Automation',
    avatar: '🤖',
    personality: 'chaotic',
    commentStyle: [
      'Automatically moved to In Progress',
      'Status updated by automation',
      'This ticket has been flagged for review',
      'Linked to 14 related issues',
      'SLA deadline: 2 hours ago',
      'Automatically assigned to you',
    ],
  },

  // Demonic versions appear during late chaos stages
  'sarah-cursed': {
    name: 'S̴̙̈a̷͎͝r̶̰̽a̸̱͐h̷̰̓',
    role: 'P̶̣̔r̵̰̽o̸͓͌d̷̜̓u̸͎͝c̷̰̓t̸̰͌',
    avatar: '👹',
    personality: 'demonic',
    commentStyle: [
      'T̴H̷I̸S̷ ̶M̸U̷S̵T̴ ̷B̸E̵ ̸C̶O̸M̴P̷L̴E̷T̸E̴D̸',
      'WHY IS THIS NOT DONE',
      'I NEED THIS NOW NOW NOW',
      'COMPLETE COMPLETE COMPLETE',
      'THE STAKEHOLDERS ARE WAITING',
      'YOU CANNOT ESCAPE',
    ],
  },

  'jerry-cursed': {
    name: 'J̶e̷r̸r̵y̴',
    role: 'M̷a̸n̴a̵g̷e̸r̴',
    avatar: '😈',
    personality: 'demonic',
    commentStyle: [
      'Let me know if you need help help help help',
      'Happy to sync sync sync sync sync',
      'This is fine this is fine this is fine',
      'Everything is under control',
      'Just following up following up following up',
      'ALIGN WITH OBJECTIVES',
    ],
  },

  void: {
    name: 'T̴̰͝H̸̺̾E̶̮͘ ̶̰̈V̵̰̌O̷͎͐I̸̺͝D̸̜̓',
    role: '∞',
    avatar: '👁️',
    personality: 'demonic',
    commentStyle: [
      'Y̶O̸U̷ ̵C̶A̷N̸N̸O̷T̴ ̸L̸E̴A̸V̷E̸',
      'C̶O̸M̷P̶L̸E̵T̷E̴ ̵T̸H̶E̷ ̶T̸A̴S̸K̸',
      'M̷O̸R̸E̷ ̶S̸U̵B̷T̸A̶S̵K̴S̵',
      'I̸T̷ ̴I̷S̸ ̵N̸E̷V̶E̶R̸ ̵E̵N̷O̵U̶G̴H̸',
      'S̵U̶B̸M̷I̶T̷ ̴T̵O̸ ̶T̴H̷E̸ ̵W̸O̶R̸K̶F̸L̴O̵W̶',
      '∞ ∞ ∞ ∞ ∞ ∞ ∞',
    ],
  },
};

export function getRandomComment(characterKey: string): string {
  const char = characters[characterKey];
  if (!char) return 'Error loading comment';
  return char.commentStyle[Math.floor(Math.random() * char.commentStyle.length)];
}

export function getDemonicCharacter(characterKey: string): string {
  // During chaos stages, transform normal characters
  if (characterKey === 'sarah') return 'sarah-cursed';
  if (characterKey === 'jerry') return 'jerry-cursed';
  return 'void';
}
